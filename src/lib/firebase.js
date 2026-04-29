import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  getMultiFactorResolver,
  multiFactor,
  onAuthStateChanged,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  reauthenticateWithCredential,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

const app = firebaseReady
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
let ffmpegLoaderPromise = null;

function shouldSkipImageCompression(file) {
  return (
    !file?.type?.startsWith("image/") ||
    file.type === "image/gif" ||
    file.type === "image/svg+xml"
  );
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const dimensions = {
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      };
      URL.revokeObjectURL(imageUrl);
      resolve(dimensions);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("We could not process this image."));
    };

    image.src = imageUrl;
  });
}

async function compressImageFile(
  file,
  { maxDimension = 1600, quality = 0.82, outputMimeType = "image/webp" } = {}
) {
  if (typeof window === "undefined" || shouldSkipImageCompression(file)) {
    return {
      file,
      extension: file?.name?.split(".").pop()?.toLowerCase() || "jpg",
      mimeType: file?.type || "image/jpeg",
    };
  }

  const { width, height } = await readImageDimensions(file);
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const nextWidth = Math.max(1, Math.round(width * scale));
  const nextHeight = Math.max(1, Math.round(height * scale));

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () =>
        reject(new Error("We could not process this image."));
      nextImage.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = nextWidth;
    canvas.height = nextHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Image compression is not available right now.");
    }

    context.drawImage(image, 0, 0, nextWidth, nextHeight);

    const compressedBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("We could not compress this image."));
            return;
          }

          resolve(blob);
        },
        outputMimeType,
        quality
      );
    });

    const compressedFile = new File(
      [compressedBlob],
      `${file.name.replace(/\.[^.]+$/, "")}.webp`,
      {
        type: outputMimeType,
        lastModified: Date.now(),
      }
    );

    return {
      file: compressedFile,
      extension: "webp",
      mimeType: outputMimeType,
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

async function getBrowserFFmpeg() {
  if (typeof window === "undefined") {
    throw new Error("Video compression is only available in the browser.");
  }

  if (!ffmpegLoaderPromise) {
    ffmpegLoaderPromise = (async () => {
      const [{ FFmpeg }, { fetchFile, toBlobURL }] = await Promise.all([
        import("@ffmpeg/ffmpeg"),
        import("@ffmpeg/util"),
      ]);
      const ffmpeg = new FFmpeg();
      const baseUrl = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";
      const coreURL = await toBlobURL(
        `${baseUrl}/ffmpeg-core.js`,
        "text/javascript"
      );
      const wasmURL = await toBlobURL(
        `${baseUrl}/ffmpeg-core.wasm`,
        "application/wasm"
      );

      await ffmpeg.load({ coreURL, wasmURL });
      return { ffmpeg, fetchFile };
    })();
  }

  return ffmpegLoaderPromise;
}

async function compressVideoFile(
  file,
  {
    maxWidth = 960,
    videoBitrate = "900k",
    audioBitrate = "96k",
    crf = "32",
  } = {}
) {
  if (typeof window === "undefined" || !file?.type?.startsWith("video/")) {
    return {
      file,
      extension: file?.name?.split(".").pop()?.toLowerCase() || "mp4",
      mimeType: file?.type || "video/mp4",
    };
  }

  try {
    const { ffmpeg, fetchFile } = await getBrowserFFmpeg();
    const inputName = `input-${Date.now()}.${file.name?.split(".").pop()?.toLowerCase() || "mp4"}`;
    const outputName = `output-${Date.now()}.mp4`;

    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec([
      "-i",
      inputName,
      "-vf",
      `scale='min(${maxWidth},iw)':-2`,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      crf,
      "-b:v",
      videoBitrate,
      "-c:a",
      "aac",
      "-b:a",
      audioBitrate,
      "-movflags",
      "faststart",
      outputName,
    ]);

    const compressedData = await ffmpeg.readFile(outputName);
    const bytes =
      compressedData instanceof Uint8Array
        ? compressedData
        : new Uint8Array(compressedData);
    const compressedFile = new File([bytes], `${file.name.replace(/\.[^.]+$/, "")}.mp4`, {
      type: "video/mp4",
      lastModified: Date.now(),
    });

    try {
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch {}

    return {
      file: compressedFile,
      extension: "mp4",
      mimeType: "video/mp4",
    };
  } catch (error) {
    console.warn("Video compression fell back to the original upload.", error);
    return {
      file,
      extension: file.name?.split(".").pop()?.toLowerCase() || "mp4",
      mimeType: file.type || "video/mp4",
    };
  }
}

export async function validateVideoClipDuration(file, maxSeconds = 30) {
  if (typeof window === "undefined" || !file) {
    return 0;
  }

  if (!file.type?.startsWith("video/")) {
    throw new Error("Please choose a video file for the clip.");
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const duration = await new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => resolve(Number(video.duration) || 0);
      video.onerror = () =>
        reject(new Error("We could not read that video file. Please try another one."));
      video.src = objectUrl;
    });

    if (duration > maxSeconds) {
      throw new Error(`Please upload a clip that is ${maxSeconds} seconds or shorter.`);
    }

    return duration;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function friendlyAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "We could not find an account with those details.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "The email or password you entered is incorrect.";
    case "auth/weak-password":
      return "Your password is too weak. Please use a stronger one.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network issue detected. Please check your internet connection.";
    case "auth/invalid-verification-code":
      return "The OTP you entered is incorrect. Please try again.";
    case "auth/missing-verification-code":
      return "Enter the OTP sent to your phone to continue.";
    case "auth/code-expired":
      return "This OTP has expired. Please request a new one.";
    case "auth/invalid-phone-number":
      return "Please use a valid phone number with country code.";
    case "auth/invalid-app-credential":
      return "Phone verification could not be validated. Refresh the page and try again, preferably in an incognito window.";
    case "auth/requires-recent-login":
      return "For security, please confirm your vendor password again before finishing OTP setup.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please try again.";
    case "auth/quota-exceeded":
      return "OTP limit reached for now. Please wait a bit before trying again.";
    case "auth/second-factor-already-in-use":
      return "This phone number is already enrolled on another account.";
    default:
      return error?.message || "Something went wrong. Please try again.";
  }
}

function isFirestoreOfflineError(error) {
  return (
    error?.code === "unavailable" ||
    error?.code === "failed-precondition" ||
    error?.message?.toLowerCase().includes("offline")
  );
}

function profileDoc(uid) {
  return doc(db, "profiles", uid);
}

function customerDataDoc(uid) {
  return doc(db, "users", uid, "appData", "customer");
}

function vendorDataDoc(uid) {
  return doc(db, "users", uid, "appData", "vendor");
}

function publicProductDoc(productId) {
  return doc(db, "publicProducts", productId);
}

function productReviewsCollection() {
  return collection(db, "productReviews");
}

function protectedShopDetailsDoc(shopKey) {
  return doc(db, "protectedShopDetails", shopKey);
}

export function subscribeToAuth(handler) {
  if (!auth) {
    handler(null);
    return () => {};
  }

  return onAuthStateChanged(auth, handler);
}

export async function getUserProfile(uid) {
  if (!db || !uid) {
    return null;
  }

  try {
    const snapshot = await getDoc(profileDoc(uid));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to load user profile", error);
    }
    return null;
  }
}

async function saveUserProfile(uid, profile) {
  if (!db || !uid) {
    return;
  }

  await setDoc(profileDoc(uid), profile, { merge: true });
}

export async function beginCustomerPhoneAuth(phoneNumber, appVerifier) {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  try {
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  } catch (error) {
    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function completeCustomerPhoneAuth(
  confirmationResult,
  verificationCode,
  profileInput = {}
) {
  if (!confirmationResult) {
    throw new Error("OTP verification is not ready yet.");
  }

  try {
    const credential = await confirmationResult.confirm(verificationCode);
    const user = credential.user;
    const existingProfile = await getUserProfile(user.uid);

    if (existingProfile?.role === "vendor") {
      await signOut(auth);
      throw new Error("Use the vendor login for this account.");
    }

    if (existingProfile?.role === "admin") {
      await signOut(auth);
      throw new Error("Use the admin account access for this profile.");
    }

    const nextProfile = {
      role: "customer",
      phoneNumber: user.phoneNumber || profileInput.phoneNumber || "",
      email: profileInput.email || existingProfile?.email || "",
      name:
        profileInput.name ||
        existingProfile?.name ||
        user.displayName ||
        "RentNama Customer",
    };

    if (nextProfile.name) {
      await updateProfile(user, { displayName: nextProfile.name });
    }

    await saveUserProfile(user.uid, nextProfile);

    return user;
  } catch (error) {
    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function updateCustomerProfile(uid, profileInput = {}) {
  if (!uid) {
    throw new Error("Customer account not found.");
  }

  const existingProfile = await getUserProfile(uid);

  if (existingProfile?.role === "vendor") {
    throw new Error("Use the vendor profile flow for this account.");
  }

  if (existingProfile?.role === "admin") {
    throw new Error("Use the admin profile flow for this account.");
  }

  const nextProfile = {
    role: "customer",
    phoneNumber: existingProfile?.phoneNumber || profileInput.phoneNumber || "",
    email: profileInput.email || existingProfile?.email || "",
    name: profileInput.name || existingProfile?.name || "RentNama Customer",
  };

  if (auth?.currentUser && nextProfile.name) {
    await updateProfile(auth.currentUser, { displayName: nextProfile.name });
  }

  await saveUserProfile(uid, nextProfile);
  return nextProfile;
}

function buildVendorId(businessName) {
  const normalized = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 18);

  return `vendor-${normalized || "studio"}-${Date.now().toString().slice(-4)}`;
}

export async function createVendorAccount({
  businessName,
  ownerName,
  phoneNumber,
  email,
  businessType,
  password,
}) {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const vendorId = buildVendorId(businessName);

    await updateProfile(credential.user, { displayName: businessName });
    await saveUserProfile(credential.user.uid, {
      role: "vendor",
      businessName,
      ownerName,
      phoneNumber,
      email,
      businessType,
      vendorId,
    });

    await sendEmailVerification(credential.user);

    return {
      user: credential.user,
      vendorId,
    };
  } catch (error) {
    throw new Error(friendlyAuthErrorMessage(error));
  }
}

async function resolveVendorEmail(loginValue) {
  if (!db) {
    return loginValue;
  }

  if (loginValue.includes("@")) {
    return loginValue;
  }

  const vendorQuery = query(
    collection(db, "profiles"),
    where("vendorId", "==", loginValue),
    limit(1)
  );
  const snapshot = await getDocs(vendorQuery);

  if (snapshot.empty) {
    throw new Error("Vendor account not found.");
  }

  return snapshot.docs[0].data().email;
}

export async function signInVendor({ loginValue, password }) {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  try {
    const email = await resolveVendorEmail(loginValue);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);

    if (profile?.role !== "vendor") {
      await signOut(auth);
      throw new Error("This is not a vendor account.");
    }

    return {
      user: credential.user,
      profile,
    };
  } catch (error) {
    if (error instanceof Error && !error.message.startsWith("Firebase")) {
      throw new Error(error.message);
    }

    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function signInAdmin({ email, password }) {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);

    if (profile?.role !== "admin") {
      await signOut(auth);
      throw new Error("This is not an admin account.");
    }

    return {
      user: credential.user,
      profile,
    };
  } catch (error) {
    if (error instanceof Error && !error.message.startsWith("Firebase")) {
      throw new Error(error.message);
    }

    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export function createMfaRecaptcha(containerId, size = "normal") {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  return new RecaptchaVerifier(auth, containerId, {
    size,
  });
}

export function getEnrolledFactors(user) {
  if (!user) {
    return [];
  }

  return multiFactor(user).enrolledFactors || [];
}

export async function beginVendorMfaEnrollment(user, phoneNumber, appVerifier) {
  if (!auth || !user) {
    throw new Error("Vendor authentication is not available right now.");
  }

  try {
    const multiFactorSession = await multiFactor(user).getSession();
    const phoneInfoOptions = {
      phoneNumber,
      session: multiFactorSession,
    };
    const phoneAuthProvider = new PhoneAuthProvider(auth);

    return await phoneAuthProvider.verifyPhoneNumber(
      phoneInfoOptions,
      appVerifier
    );
  } catch (error) {
    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function completeVendorMfaEnrollment(
  user,
  verificationId,
  verificationCode,
  displayName = "Vendor phone"
) {
  if (!user) {
    throw new Error("No signed-in vendor found for MFA setup.");
  }

  try {
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

    await multiFactor(user).enroll(multiFactorAssertion, displayName);
  } catch (error) {
    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function reauthenticateVendorForMfa(user, password) {
  if (!user?.email) {
    throw new Error("Vendor email is not available for reauthentication.");
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function beginVendorMfaSignIn({
  loginValue,
  password,
  appVerifier,
}) {
  if (!auth) {
    throw new Error("Firebase is not configured yet.");
  }

  try {
    const email = await resolveVendorEmail(loginValue);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);

    if (profile?.role !== "vendor") {
      await signOut(auth);
      throw new Error("This is not a vendor account.");
    }

    if (!credential.user.emailVerified) {
      return {
        status: "needs-email-verification",
        user: credential.user,
        profile,
      };
    }

    return {
      status: "needs-enrollment",
      user: credential.user,
      profile,
    };
  } catch (error) {
    if (error?.code === "auth/multi-factor-auth-required") {
      const resolver = getMultiFactorResolver(auth, error);
      const selectedHint =
        resolver.hints.find(
          (hint) => hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID
        ) || resolver.hints[0];

      const phoneInfoOptions = {
        multiFactorHint: selectedHint,
        session: resolver.session,
      };
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        appVerifier
      );

      return {
        status: "mfa-required",
        resolver,
        verificationId,
        hint: selectedHint,
      };
    }

    if (error instanceof Error && !error.message.startsWith("Firebase")) {
      throw new Error(error.message);
    }

    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function resendVendorVerificationEmail(user) {
  if (!user) {
    throw new Error("No vendor account is signed in right now.");
  }

  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function refreshCurrentUser(user) {
  if (!user) {
    return null;
  }

  await reload(user);
  return auth?.currentUser || user;
}

export async function completeVendorMfaSignIn(
  resolver,
  verificationId,
  verificationCode
) {
  try {
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

    return await resolver.resolveSignIn(multiFactorAssertion);
  } catch (error) {
    throw new Error(friendlyAuthErrorMessage(error));
  }
}

export async function logoutUser() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}

export async function loadCustomerDataFromFirestore(uid) {
  if (!db || !uid) {
    return null;
  }

  try {
    const snapshot = await getDoc(customerDataDoc(uid));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to load customer data from Firestore", error);
    }
    return null;
  }
}

export async function saveCustomerDataToFirestore(uid, customerData) {
  if (!db || !uid) {
    return;
  }

  try {
    await setDoc(customerDataDoc(uid), customerData, { merge: true });
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to save customer data to Firestore", error);
    }
  }
}

export async function loadVendorDataFromFirestore(uid) {
  if (!db || !uid) {
    return null;
  }

  try {
    const snapshot = await getDoc(vendorDataDoc(uid));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to load vendor data from Firestore", error);
    }
    return null;
  }
}

export async function saveVendorDataToFirestore(uid, vendorData) {
  if (!db || !uid) {
    return;
  }

  try {
    await setDoc(vendorDataDoc(uid), vendorData, { merge: true });
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to save vendor data to Firestore", error);
    }
  }
}

export async function loadPublicProductsFromFirestore() {
  if (!db) {
    return [];
  }

  try {
    const snapshot = await getDocs(collection(db, "publicProducts"));
    return snapshot.docs.map((item) => item.data());
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to load public products from Firestore", error);
    }
    return [];
  }
}

export async function savePublicProductToFirestore(product) {
  if (!db || !product?.id) {
    return;
  }

  try {
    await setDoc(publicProductDoc(product.id), product, { merge: true });
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to save public product to Firestore", error);
    }
  }
}

export async function deletePublicProductFromFirestore(productId) {
  if (!db || !productId) {
    return;
  }

  try {
    await deleteDoc(publicProductDoc(productId));
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to delete public product from Firestore", error);
    }
  }
}

export async function loadProtectedShopDetails(shopKey) {
  if (!db || !shopKey) {
    return null;
  }

  try {
    const snapshot = await getDoc(protectedShopDetailsDoc(shopKey));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to load protected shop details", error);
    }
    return null;
  }
}

export async function saveProtectedShopDetails(shopKey, details) {
  if (!db || !shopKey) {
    return;
  }

  try {
    await setDoc(protectedShopDetailsDoc(shopKey), details, { merge: true });
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to save protected shop details", error);
    }
  }
}

export async function uploadVendorListingImage(uid, listingId, file) {
  if (!storage) {
    throw new Error("Firebase Storage is not configured yet.");
  }

  if (!uid || !listingId || !file) {
    throw new Error("Listing image upload needs a vendor, listing, and file.");
  }

  try {
    const preparedUpload = await compressImageFile(file, {
      maxDimension: 1900,
      quality: 0.9,
    });
    const imageRef = ref(
      storage,
      `vendor-listings/${uid}/${listingId}.${preparedUpload.extension}`
    );

    await uploadBytes(imageRef, preparedUpload.file, {
      contentType: preparedUpload.mimeType,
    });

    return await getDownloadURL(imageRef);
  } catch (error) {
    throw new Error(
      error?.message || "We could not upload the listing image right now."
    );
  }
}

export async function uploadVendorListingClip(uid, listingId, file) {
  if (!storage) {
    throw new Error("Firebase Storage is not configured yet.");
  }

  if (!uid || !listingId || !file) {
    throw new Error("Listing clip upload needs a vendor, listing, and file.");
  }

  try {
    await validateVideoClipDuration(file, 30);
    const preparedUpload = await compressVideoFile(file, {
      maxWidth: 1280,
      videoBitrate: "1200k",
      audioBitrate: "96k",
      crf: "29",
    });
    const clipRef = ref(
      storage,
      `vendor-listings/${uid}/clips/${listingId}.${preparedUpload.extension}`
    );

    await uploadBytes(clipRef, preparedUpload.file, {
      contentType: preparedUpload.mimeType,
    });

    return await getDownloadURL(clipRef);
  } catch (error) {
    throw new Error(
      error?.message || "We could not upload the listing clip right now."
    );
  }
}

export async function uploadReviewMedia(productId, uid, file, mediaType = "image") {
  if (!storage) {
    throw new Error("Firebase Storage is not configured yet.");
  }

  if (!productId || !uid || !file) {
    throw new Error("Review media upload needs a product, user, and file.");
  }

  try {
    const safeType = mediaType === "video" ? "video" : "image";
    if (safeType === "video") {
      await validateVideoClipDuration(file, 30);
    }
    const preparedUpload =
      safeType === "image"
        ? await compressImageFile(file, {
            maxDimension: 1280,
            quality: 0.68,
          })
        : await compressVideoFile(file);
    const fileRef = ref(
      storage,
      `review-media/${productId}/${uid}/${safeType}-${Date.now()}.${preparedUpload.extension}`
    );

    await uploadBytes(fileRef, preparedUpload.file, {
      contentType: preparedUpload.mimeType,
    });

    return await getDownloadURL(fileRef);
  } catch (error) {
    throw new Error(
      error?.message || "We could not upload the review media right now."
    );
  }
}

export async function loadProductReviews(productId) {
  if (!db || !productId) {
    return [];
  }

  try {
    const reviewsQuery = query(
      productReviewsCollection(),
      where("productId", "==", productId)
    );
    const snapshot = await getDocs(reviewsQuery);

    return snapshot.docs
      .map((item) => ({
        id: item.id,
        ...item.data(),
      }))
      .sort((left, right) => {
        const leftTime =
          left.createdAt?.toDate?.()?.getTime?.() ||
          new Date(left.createdAt || 0).getTime() ||
          0;
        const rightTime =
          right.createdAt?.toDate?.()?.getTime?.() ||
          new Date(right.createdAt || 0).getTime() ||
          0;

        return rightTime - leftTime;
      });
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      console.error("Failed to load product reviews from Firestore", error);
    }
    return [];
  }
}

export async function createProductReview(reviewInput) {
  if (!db) {
    throw new Error("Firebase is not configured yet.");
  }

  const payload = {
    productId: reviewInput.productId,
    userId: reviewInput.userId,
    userName: reviewInput.userName || "RentNama Customer",
    rating: Number(reviewInput.rating) || 0,
    comment: reviewInput.comment || "",
    imageUrls: reviewInput.imageUrls || [],
    videoUrls: reviewInput.videoUrls || [],
    verifiedRental: Boolean(reviewInput.verifiedRental),
    status: reviewInput.status || "published",
    createdAt: serverTimestamp(),
  };

  try {
    const reviewRef = await addDoc(productReviewsCollection(), payload);

    return {
      id: reviewRef.id,
      ...payload,
      createdAt: new Date(),
    };
  } catch (error) {
    throw new Error(
      error?.message || "We could not save the review right now."
    );
  }
}
