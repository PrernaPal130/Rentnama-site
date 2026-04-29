"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { VendorGuard } from "../../components/AuthGuard";
import { useAuthData } from "../../context/authContext";
import {
  beginVendorMfaEnrollment,
  completeVendorMfaEnrollment,
  createMfaRecaptcha,
  getEnrolledFactors,
  reauthenticateVendorForMfa,
} from "../../lib/firebase";

function VendorSetupMfaInner() {
  const router = useRouter();
  const { currentUser, profile } = useAuthData();
  const recaptchaRef = useRef(null);
  const [verificationId, setVerificationId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsPasswordRefresh, setNeedsPasswordRefresh] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [hasSentOtp, setHasSentOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const phoneNumber = (profile?.phoneNumber || "").replace(/\s+/g, "");
  const hasEnrolledFactor =
    currentUser && getEnrolledFactors(currentUser).length > 0;

  async function buildFreshRecaptcha() {
    if (recaptchaRef.current?.clear) {
      recaptchaRef.current.clear();
    }

    recaptchaRef.current = null;

    const container = document.getElementById("vendor-mfa-recaptcha");
    if (container) {
      container.innerHTML = "";
    }

    const verifier = createMfaRecaptcha("vendor-mfa-recaptcha");
    await verifier.render();
    recaptchaRef.current = verifier;
    return verifier;
  }

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    return () => {
      if (recaptchaRef.current?.clear) {
        recaptchaRef.current.clear();
      }
      recaptchaRef.current = null;
    };
  }, [currentUser]);

  useEffect(() => {
    if (hasEnrolledFactor) {
      router.replace("/VendorDashboard");
    }
  }, [hasEnrolledFactor, router]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  function formatCountdown(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  async function handleVerifyPassword() {
    if (!currentUser) {
      setError("Vendor session is not active right now.");
      return;
    }

    if (!confirmPassword) {
      setError("Enter your vendor password first.");
      return;
    }

    try {
      setIsCheckingPassword(true);
      setError("");
      setInfo("");
      await reauthenticateVendorForMfa(currentUser, confirmPassword);
      setPasswordVerified(true);
      setNeedsPasswordRefresh(false);
      setInfo("Password verified. You can now send the OTP.");
    } catch (passwordError) {
      setPasswordVerified(false);
      setError(
        passwordError instanceof Error
          ? passwordError.message
          : "We could not verify your vendor password right now."
      );
    } finally {
      setIsCheckingPassword(false);
    }
  }

  async function handleSendOtp() {
    if (!currentUser || !phoneNumber) {
      setError("Vendor phone number is not ready yet.");
      return;
    }

    if (!passwordVerified) {
      setError("Verify your vendor password first before sending OTP.");
      return;
    }

    if (hasSentOtp && resendCountdown > 0) {
      return;
    }

    try {
      setIsSending(true);
      setError("");
      setInfo("");
      const verifier = await buildFreshRecaptcha();
      const nextVerificationId = await beginVendorMfaEnrollment(
        currentUser,
        phoneNumber,
        verifier
      );
      setVerificationId(nextVerificationId);
      setHasSentOtp(true);
      setResendCountdown(300);
      setInfo("OTP sent to your registered phone number.");
    } catch (sendError) {
      setError(sendError.message || "Unable to send OTP right now.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();

    if (!currentUser || !verificationId) {
      setError("Send the OTP first before verifying.");
      return;
    }

    try {
      setIsVerifying(true);
      setError("");
      if (needsPasswordRefresh) {
        if (!confirmPassword) {
          throw new Error("Enter your vendor password once more to continue.");
        }

        await reauthenticateVendorForMfa(currentUser, confirmPassword);
      }

      await completeVendorMfaEnrollment(
        currentUser,
        verificationId,
        otp,
        profile?.businessName || "Vendor phone"
      );
      router.push("/VendorDashboard");
    } catch (verifyError) {
      const nextMessage =
        verifyError.message || "Unable to verify OTP right now.";
      if (
        nextMessage.includes("confirm your vendor password again") ||
        nextMessage.toLowerCase().includes("recent")
      ) {
        setNeedsPasswordRefresh(true);
        setPasswordVerified(false);
      }
      setError(nextMessage);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f4_0%,#f6ebe5_58%,#fffdfb_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/VendorLogin"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to vendor login
        </Link>

        <section className="mt-5 grid overflow-hidden rounded-[36px] border border-[#ecd7ce] bg-white shadow-[0_18px_60px_rgba(177,122,102,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#f4d0c4_0%,#f5e1d8_42%,#fff9f6_100%)] p-8 sm:p-10">
            <div className="absolute -right-8 top-10 h-40 w-40 rounded-full bg-white/35 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[#e5b4a5]/25 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b86f5f]">
                Vendor Security Setup
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#625650]">
                Before entering the vendor dashboard, enroll your registered
                phone number as a secure second factor for login.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Registered phone
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    {phoneNumber || "No phone number found for this vendor profile yet."}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      What this does
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    After setup, vendor login will require both password and an
                    OTP sent to this phone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ee] px-4 py-2 text-sm font-medium text-[#a96051]">
                <ShieldCheck size={16} />
                Set up vendor OTP
              </div>

              <h2 className="mt-4 text-3xl font-semibold text-[#2f2622]">
                Enroll your phone
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#625650]">
                Send an OTP to your vendor phone number and verify it to finish
                multi-factor setup.
              </p>

              <div id="vendor-mfa-recaptcha" className="mt-6" />

              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
                <div className="space-y-3">
                  <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                    Confirm vendor password
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password again"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 pr-12 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f756d]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyPassword}
                      disabled={isCheckingPassword || !confirmPassword}
                      className="rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-[#fff6f2] disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {isCheckingPassword ? "Verifying..." : "Verify password"}
                    </button>
                  </div>
                  <p className="text-xs leading-5 text-[#7b6660]">
                    Verify the password first. If Firebase later asks for a fresh secure
                    session again, just verify the password here once more.
                  </p>
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
                  onClick={handleSendOtp}
                  disabled={
                    isSending ||
                    !phoneNumber ||
                    !passwordVerified ||
                    (hasSentOtp && resendCountdown > 0)
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954] disabled:cursor-not-allowed disabled:bg-[#d6a89c]"
                >
                  {isSending
                    ? "Sending OTP..."
                    : hasSentOtp
                    ? "Resend OTP"
                    : "Send OTP"}
                  <ArrowRight size={16} />
                </button>

                {hasSentOtp ? (
                  <p className="text-center text-xs text-[#7b6660]">
                    {resendCountdown > 0
                      ? `You can resend OTP after ${formatCountdown(resendCountdown)}`
                      : "You can now resend OTP if needed."}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isVerifying || !verificationId}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e4c8c0] bg-white py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-[#fff6f2] disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {isVerifying ? "Verifying..." : "Verify and finish setup"}
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
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function VendorSetupMfaPage() {
  return (
    <VendorGuard>
      <VendorSetupMfaInner />
    </VendorGuard>
  );
}
