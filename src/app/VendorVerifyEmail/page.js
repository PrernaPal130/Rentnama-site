"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { useAuthData } from "../../context/authContext";
import {
  refreshCurrentUser,
  resendVendorVerificationEmail,
} from "../../lib/firebase";

function VendorVerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, profile } = useAuthData();
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const fallbackEmail = profile?.email || searchParams.get("email") || "";
  const fallbackVendorId = profile?.vendorId || searchParams.get("vendorId") || "";
  const fallbackBusinessName =
    profile?.businessName || searchParams.get("businessName") || "";
  const sessionMissing = !currentUser;
  const loginHint =
    searchParams.get("loginHint") || fallbackVendorId || fallbackEmail || "";
  const vendorLoginHref = useMemo(() => {
    const params = new URLSearchParams();

    if (loginHint) {
      params.set("loginHint", loginHint);
    }
    if (fallbackVendorId) {
      params.set("vendorId", fallbackVendorId);
    }
    if (fallbackEmail) {
      params.set("email", fallbackEmail);
    }
    if (fallbackBusinessName) {
      params.set("businessName", fallbackBusinessName);
    }

    const queryString = params.toString();
    return queryString ? `/VendorLogin?${queryString}` : "/VendorLogin";
  }, [fallbackBusinessName, fallbackEmail, fallbackVendorId, loginHint]);

  useEffect(() => {
    if (currentUser?.emailVerified) {
      router.replace("/VendorSetupMfa");
    }
  }, [currentUser, profile, router]);

  async function handleRefreshStatus() {
    if (!currentUser) {
      setError(
        "Your verification session is no longer active. Log in again to refresh email status."
      );
      return;
    }

    try {
      setIsChecking(true);
      setError("");
      const refreshedUser = await refreshCurrentUser(currentUser);

      if (refreshedUser?.emailVerified) {
        router.push("/VendorSetupMfa");
        return;
      }

      setInfo("Your email is still not verified yet. Please open the link from your inbox first.");
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "We could not refresh verification status right now."
      );
    } finally {
      setIsChecking(false);
    }
  }

  async function handleResendEmail() {
    if (!currentUser) {
      setError(
        "Log in again with your vendor account to resend the verification email."
      );
      return;
    }

    try {
      setIsResending(true);
      setError("");
      setInfo("");
      await resendVendorVerificationEmail(currentUser);
      setInfo("Verification email sent again. Please check your inbox.");
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : "We could not resend the email right now."
      );
    } finally {
      setIsResending(false);
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
                Vendor Verification
              </p>
              <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-[#2f2622] sm:text-5xl">
                Please verify your email before setting up OTP.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#625650]">
                We sent a verification link to your vendor email. Open it first,
                then continue to the OTP setup page for stronger account security.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <MailCheck className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Verify this email
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    {fallbackEmail || "Your registered vendor email address"}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Vendor account
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    {fallbackBusinessName || "Your RentNama vendor profile"}
                    {fallbackVendorId ? ` (${fallbackVendorId})` : ""}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#b86f5f]" size={20} />
                    <p className="text-sm font-semibold text-[#2f2622]">
                      Why this matters
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#625650]">
                    Email verification confirms ownership of the vendor account before
                    your phone is enrolled as the second factor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ee] px-4 py-2 text-sm font-medium text-[#a96051]">
                <MailCheck size={16} />
                Verify vendor email
              </div>

              <h2 className="mt-4 text-3xl font-semibold text-[#2f2622]">
                {sessionMissing ? "Log in again to continue" : "Check your inbox"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#625650]">
                {sessionMissing
                  ? "Your vendor session is no longer active. Log in again so Firebase knows which vendor account should continue email verification and OTP setup."
                  : "Once you click the verification link from your email, come back here and continue straight to OTP setup. If Firebase asks for a fresh secure session there, we will confirm the password on that page itself instead of sending you back through login again."}
              </p>

              <div className="mt-8 space-y-4">
                {sessionMissing ? (
                  <Link
                    href={vendorLoginHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                  >
                    Log in again to continue
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleRefreshStatus}
                      disabled={isChecking}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                    >
                      {isChecking ? "Checking..." : "I have verified my email"}
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={handleResendEmail}
                      disabled={isResending}
                      className="inline-flex w-full items-center justify-center rounded-full border border-[#e4c8c0] bg-white py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-[#fff6f2]"
                    >
                      {isResending ? "Resending..." : "Resend verification email"}
                    </button>
                  </>
                )}

                {sessionMissing ? (
                  <Link
                    href={vendorLoginHref}
                    className="inline-flex w-full items-center justify-center rounded-full border border-[#e4c8c0] bg-[#fff8f4] py-3.5 text-sm font-semibold text-[#9e5949] transition hover:bg-[#fff2eb]"
                  >
                    Log in again to continue
                  </Link>
                ) : null}
              </div>

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

export default function VendorVerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VendorVerifyEmailContent />
    </Suspense>
  );
}
