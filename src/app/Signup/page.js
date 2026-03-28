"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useAuthData } from "../../context/authContext";
import { createMfaRecaptcha } from "../../lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const { firebaseReady, beginCustomerPhoneAuth, completeCustomerPhoneAuth } =
    useAuthData();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef(null);

  async function buildFreshRecaptcha() {
    if (recaptchaRef.current?.clear) {
      recaptchaRef.current.clear();
    }

    recaptchaRef.current = null;

    const container = document.getElementById("customer-signup-recaptcha");
    if (container) {
      container.innerHTML = "";
    }

    const verifier = createMfaRecaptcha("customer-signup-recaptcha");
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
    } catch (signupError) {
      setError(signupError.message || "Unable to send OTP right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      await completeCustomerPhoneAuth(confirmationResult, otp, {
        name,
        phoneNumber,
        email,
      });
      router.push("/");
    } catch (signupError) {
      setError(signupError.message || "Unable to create your account right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const otpStep = Boolean(confirmationResult);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f4_0%,#f7ebe5_52%,#fffdfb_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/LoginSign"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <section className="mt-5 grid overflow-hidden rounded-[36px] border border-[#ecd7ce] bg-white shadow-[0_18px_60px_rgba(177,122,102,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#f4d0c4_0%,#f5e1d8_42%,#fff9f6_100%)] p-8 sm:p-10">
            <div className="absolute -right-8 top-10 h-40 w-40 rounded-full bg-white/35 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[#e5b4a5]/25 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b86f5f]">
                Customer Sign Up
              </p>
              <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-[#2f2622] sm:text-5xl">
                Create your RentNama account.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#625650]">
                Verify your phone number once and keep your wishlist, addresses,
                and rental orders connected to one easy customer account.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Phone-first access
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    Use your phone number for a faster, mobile-friendly login experience.
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Heart className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Save what you love
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    Keep your saved looks, addresses, and orders ready across sessions.
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Secure verification
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    Verify the one-time code sent to your phone to finish setup.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b86f5f]">
                Create Account
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#2f2622]">
                {otpStep ? "Verify OTP" : "Get started"}
              </h2>

              <div id="customer-signup-recaptcha" className="mt-4" />

              <form
                onSubmit={otpStep ? handleVerifyOtp : handleSendOtp}
                className="mt-8 space-y-5"
              >
                {!otpStep ? (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Optional for order updates"
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-[28px] border border-[#efd9d0] bg-[#fff8f4] p-4 text-sm leading-6 text-[#765d56]">
                      OTP sent to <span className="font-semibold">{phoneNumber}</span>.
                      Enter it to create your customer account.
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
                        setConfirmationResult(null);
                        setOtp("");
                        setInfo("");
                      }}
                      className="text-sm font-medium text-[#b46c5b] hover:underline"
                    >
                      Change details
                    </button>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                >
                  {otpStep
                    ? isSubmitting
                      ? "Verifying..."
                      : "Verify OTP and Continue"
                    : isSubmitting
                      ? "Sending OTP..."
                      : "Send OTP"}
                  <ArrowRight size={16} />
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

              <p className="mt-6 text-sm text-[#625650]">
                Already have an account?
                <Link
                  href="/LoginSign"
                  className="ml-2 font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
