"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Smartphone, Store, UserRound } from "lucide-react";
import { useAuthData } from "../../context/authContext";
import { createMfaRecaptcha } from "../../lib/firebase";
import { getUserProfile } from "../../lib/firebase";

function LoginSignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firebaseReady, beginCustomerPhoneAuth, completeCustomerPhoneAuth } =
    useAuthData();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef(null);
  const redirectTo = searchParams.get("redirect") || "/";

  async function buildFreshRecaptcha() {
    if (recaptchaRef.current?.clear) {
      recaptchaRef.current.clear();
    }

    recaptchaRef.current = null;

    const container = document.getElementById("customer-login-recaptcha");
    if (container) {
      container.innerHTML = "";
    }

    const verifier = createMfaRecaptcha("customer-login-recaptcha");
    await verifier.render();
    recaptchaRef.current = verifier;
    return verifier;
  }

  useEffect(() => {
    return () => {
      if (recaptchaRef.current?.clear) {
        recaptchaRef.current.clear();
      }
      recaptchaRef.current = null;
    };
  }, []);

  async function handleSendOtp(event) {
    event.preventDefault();

    if (!firebaseReady) {
      setError("Firebase is not configured yet. Add your env values first.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setInfo("");
      const verifier = await buildFreshRecaptcha();

      const nextConfirmationResult = await beginCustomerPhoneAuth(
        phoneNumber,
        verifier
      );

      setConfirmationResult(nextConfirmationResult);
      setInfo("OTP sent to your phone number.");
    } catch (loginError) {
      setError(loginError.message || "Unable to send OTP right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      const user = await completeCustomerPhoneAuth(confirmationResult, otp, {
        phoneNumber,
      });
      const profile = await getUserProfile(user.uid);

      if (!profile?.name || !profile?.email) {
        router.push("/CustomerSetupProfile");
        return;
      }

      router.push(redirectTo);
    } catch (loginError) {
      setError(loginError.message || "Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const otpStep = Boolean(confirmationResult);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f4_0%,#f7ebe5_52%,#fffdfb_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-[#ecd7ce] bg-[radial-gradient(circle_at_top_left,#f6d1c5_0%,#f4e2da_36%,#fff8f5_100%)] p-8 shadow-[0_18px_60px_rgba(177,122,102,0.12)] sm:p-10">
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/35 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#e7b7a8]/25 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b86f5f]">
              RentNama
            </p>
            <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-[#2f2622] sm:text-5xl">
              Dress for the moment, not just the purchase.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5f524c]">
              Sign in with your phone number to manage rentals, track orders,
              update your wishlist, and keep every celebration look organized in one place.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e6df] text-[#b86f5f]">
                  <UserRound size={20} />
                </div>
                <p className="mt-4 text-lg font-semibold text-[#2f2622]">
                  Customer access
                </p>
                <p className="mt-2 text-sm leading-6 text-[#625650]">
                  Fast phone OTP login for browsing, saving looks, and checkout.
                </p>
              </div>

              <Link
                href="/VendorLogin"
                className="group rounded-[28px] border border-[#e7c7bc] bg-[#fffaf7] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e6df] text-[#b86f5f]">
                  <Store size={20} />
                </div>
                <p className="mt-4 text-lg font-semibold text-[#2f2622]">
                  Vendor login
                </p>
                <p className="mt-2 text-sm leading-6 text-[#625650]">
                  Manage your catalog, bookings, and rental requests from the vendor portal.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b]">
                  Continue as vendor
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-[#ecd7ce] bg-white/95 p-6 shadow-[0_18px_60px_rgba(177,122,102,0.1)] backdrop-blur sm:p-8">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b86f5f]">
              Customer Login
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#2f2622]">
              {otpStep ? "Verify OTP" : "Welcome back"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#625650]">
              {otpStep
                ? `Enter the OTP sent to ${phoneNumber} to continue.`
                : "Use your phone number to receive a secure one-time code and continue shopping."}
            </p>

            <div id="customer-login-recaptcha" className="mt-4" />

            <form
              onSubmit={otpStep ? handleVerifyOtp : handleSendOtp}
              className="mt-8 space-y-5"
            >
              {!otpStep ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                  />
                </div>
              ) : (
                <>
                  <div className="rounded-[28px] border border-[#efd9d0] bg-[#fff8f4] p-4 text-sm leading-6 text-[#765d56]">
                    OTP sent to <span className="font-semibold">{phoneNumber}</span>.
                    Enter it to log in to your customer account.
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                      OTP
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationResult(null);
                      setOtp("");
                      setInfo("");
                    }}
                    className="text-sm font-medium text-[#b46c5b] hover:underline"
                  >
                    Change phone number
                  </button>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954]"
              >
                {otpStep
                  ? isSubmitting
                    ? "Verifying..."
                    : "Verify OTP"
                  : isSubmitting
                    ? "Sending OTP..."
                    : "Send OTP"}
              </button>
            </form>

            {info ? (
              <p className="mt-4 rounded-2xl border border-[#d9e7d8] bg-[#f5fbf4] px-4 py-3 text-sm text-[#4e7a46]">
                {info}
              </p>
            ) : null}

            {error ? (
              <p className="mt-4 rounded-2xl border border-[#efd6ce] bg-[#fff6f2] px-4 py-3 text-sm text-[#9e5949]">
                {error}
              </p>
            ) : null}

            <div className="mt-6 rounded-3xl border border-[#f0e2dc] bg-[#fff8f5] p-4 text-sm text-[#625650]">
              Are you a vendor?
              <Link
                href="/VendorLogin"
                className="ml-2 font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
              >
                Log in here
              </Link>
            </div>

            <p className="mt-6 text-center text-sm text-[#625650]">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
                onClick={() => router.push("/Signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginSignPage() {
  return (
    <Suspense fallback={null}>
      <LoginSignContent />
    </Suspense>
  );
}
