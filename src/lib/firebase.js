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
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
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

export async function uploadVendorListingImage(uid, listingId, file) {
  if (!storage) {
    throw new Error("Firebase Storage is not configured yet.");
  }

  if (!uid || !listingId || !file) {
    throw new Error("Listing image upload needs a vendor, listing, and file.");
  }

  try {
    const extension = file.name?.split(".").pop()?.toLowerCase() || "jpg";
    const imageRef = ref(
      storage,
      `vendor-listings/${uid}/${listingId}.${extension}`
    );

    await uploadBytes(imageRef, file, {
      contentType: file.type || "image/jpeg",
    });

    return await getDownloadURL(imageRef);
  } catch (error) {
    throw new Error(
      error?.message || "We could not upload the listing image right now."
    );
  }
}
