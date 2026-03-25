"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useAuthData } from "../../context/authContext";
import {
  beginVendorMfaSignIn,
  completeVendorMfaSignIn,
  createMfaRecaptcha,
} from "../../lib/firebase";

function VendorLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firebaseReady } = useAuthData();
  const [vendorId, setVendorId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentialsVerified, setCredentialsVerified] = useState(false);
  const [mfaResolver, setMfaResolver] = useState(null);
  const [verificationId, setVerificationId] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const recaptchaRef = useRef(null);
  const signupSuccess = searchParams.get("signup") === "success";
  const signedUpVendorId = searchParams.get("vendorId");
  const signedUpBusinessName = searchParams.get("businessName");
  const redirectTo = searchParams.get("redirect") || "/VendorDashboard";

  useEffect(() => {
    return () => {
      if (recaptchaRef.current?.clear) {
        recaptchaRef.current.clear();
      }
      recaptchaRef.current = null;
    };
  }, []);

  async function handleCredentialSubmit(event) {
    event.preventDefault();
    setError("");

    if (!firebaseReady) {
      setError("Firebase is not configured yet. Add your env values first.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (!recaptchaRef.current) {
        recaptchaRef.current = createMfaRecaptcha("vendor-login-recaptcha");
      }

      const result = await beginVendorMfaSignIn({
        loginValue: vendorId,
        password,
        appVerifier: recaptchaRef.current,
      });

      if (result.status === "needs-enrollment") {
        router.push("/VendorSetupMfa");
        return;
      }

      setMfaResolver(result.resolver);
      setVerificationId(result.verificationId);
      setMaskedPhone(result.hint?.phoneNumber || "");
      setCredentialsVerified(true);
    } catch (loginError) {
      setError(loginError.message || "Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVendorLogin(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      if (!mfaResolver || !verificationId) {
        throw new Error("OTP verification is not ready yet.");
      }

      await completeVendorMfaSignIn(mfaResolver, verificationId, otp);
      router.push(redirectTo);
    } catch (loginError) {
      setError(loginError.message || "Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f4_0%,#f6ebe5_58%,#fffdfb_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/LoginSign"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to customer login
        </Link>

        <section className="mt-5 grid overflow-hidden rounded-[36px] border border-[#ecd7ce] bg-white shadow-[0_18px_60px_rgba(177,122,102,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#f4d0c4_0%,#f5e1d8_42%,#fff9f6_100%)] p-8 sm:p-10">
            <div className="absolute -right-8 top-10 h-40 w-40 rounded-full bg-white/35 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[#e5b4a5]/25 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b86f5f]">
                Vendor Portal
              </p>
              <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-[#2f2622] sm:text-5xl">
                Secure vendor access for your rental business.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#625650]">
                Sign in with your vendor ID and password, then verify the OTP
                sent to your registered phone number before entering the vendor
                dashboard.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <LockKeyhole className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Step 1: Credentials
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    Enter your vendor ID or email and account password.
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Step 2: OTP verification
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    Confirm the real one-time code sent to your registered phone.
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Stronger account security
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    This two-step vendor login keeps catalog and order access
                    better protected than phone-only OTP.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ee] px-4 py-2 text-sm font-medium text-[#a96051]">
                <Building2 size={16} />
                Vendor sign in
              </div>

              <h2 className="mt-4 text-3xl font-semibold text-[#2f2622]">
                {credentialsVerified ? "Verify OTP" : "Log in to your vendor account"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#625650]">
                {credentialsVerified
                  ? `We have sent an OTP to ${
                      maskedPhone || "your registered phone number"
                    }. Enter it to complete login.`
                  : "Start with your vendor ID or email and password. OTP verification comes next."}
              </p>

              <div id="vendor-login-recaptcha" className="mt-4" />

              <form
                onSubmit={credentialsVerified ? handleVendorLogin : handleCredentialSubmit}
                className="mt-8 space-y-5"
              >
                {!credentialsVerified ? (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                        Vendor ID or Email
                      </label>
                      <input
                        type="text"
                        placeholder="vendor@rentnama.com or vendor ID"
                        value={vendorId}
                        onChange={(event) => setVendorId(event.target.value)}
                        required
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-[28px] border border-[#efd9d0] bg-[#fff8f4] p-4 text-sm leading-6 text-[#765d56]">
                      Credentials verified for <span className="font-semibold">{vendorId}</span>.
                      Enter the OTP sent to{" "}
                      <span className="font-semibold">
                        {maskedPhone || "the registered phone number"}
                      </span>{" "}
                      to continue.
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                        OTP
                      </label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        required
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCredentialsVerified(false);
                        setMfaResolver(null);
                        setVerificationId("");
                        setOtp("");
                      }}
                      className="text-sm font-medium text-[#b46c5b] hover:underline"
                    >
                      Change vendor ID or password
                    </button>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                >
                  {credentialsVerified
                    ? isSubmitting
                      ? "Signing in..."
                      : "Verify OTP and Log In"
                    : "Continue to OTP"}
                  <ArrowRight size={16} />
                </button>
              </form>

              {error ? (
                <p className="mt-4 rounded-2xl border border-[#efd6ce] bg-[#fff6f2] px-4 py-3 text-sm text-[#9e5949]">
                  {error}
                </p>
              ) : null}

              {signupSuccess ? (
                <p className="mt-4 rounded-2xl border border-[#d9e7d8] bg-[#f5fbf4] px-4 py-3 text-sm text-[#4e7a46]">
                  Vendor account created
                  {signedUpBusinessName ? ` for ${signedUpBusinessName}` : ""}.
                  {signedUpVendorId ? ` Your vendor ID is ${signedUpVendorId}.` : ""}
                  {" "}Please log in to continue.
                </p>
              ) : null}

              <p className="mt-6 text-sm text-[#625650]">
                New vendor?
                <Link
                  href="/VendorSignup"
                  className="ml-2 font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
                >
                  Create a vendor account
                </Link>
              </p>

              <p className="mt-4 text-sm text-[#625650]">
                Need customer access instead?
                <Link
                  href="/LoginSign"
                  className="ml-2 font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
                >
                  Go to customer login
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function VendorLoginPage() {
  return (
    <Suspense fallback={null}>
      <VendorLoginContent />
    </Suspense>
  );
}
