"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthData } from "../context/authContext";
import { getEnrolledFactors } from "../lib/firebase";

function GuardFallback({ title, href, linkLabel }) {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-[28px] border border-[#ecd8d1] bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
          Redirecting
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          We&apos;re checking your account access and moving you to the right
          place.
        </p>
        <Link
          href={href}
          className="mt-6 inline-flex rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]"
        >
          {linkLabel}
        </Link>
      </div>
    </main>
  );
}

function GuardLoading({ title }) {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-[28px] border border-[#ecd8d1] bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
          Loading
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          We&apos;re loading your account details.
        </p>
      </div>
    </main>
  );
}

export function CustomerGuard({ children }) {
  const { currentUser, profile, authLoading } = useAuthData();
  const router = useRouter();
  const pathname = usePathname();
  const isCustomerSetupRoute = pathname?.startsWith("/CustomerSetupProfile");
  const needsCustomerProfile =
    currentUser &&
    profile?.role === "customer" &&
    (!profile?.name || !profile?.email);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      router.replace(`/LoginSign?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (profile?.role === "vendor") {
      router.replace("/VendorDashboard");
      return;
    }

    if (needsCustomerProfile && !isCustomerSetupRoute) {
      router.replace("/CustomerSetupProfile");
    }
  }, [
    authLoading,
    currentUser,
    isCustomerSetupRoute,
    needsCustomerProfile,
    pathname,
    profile,
    router,
  ]);

  if (authLoading) {
    return <GuardLoading title="Loading your customer account" />;
  }

  if (
    !currentUser ||
    profile?.role === "vendor" ||
    (needsCustomerProfile && !isCustomerSetupRoute)
  ) {
    return (
      <GuardFallback
        title="Customer access required"
        href="/LoginSign"
        linkLabel="Go to customer login"
      />
    );
  }

  return children;
}

export function VendorGuard({ children }) {
  const { currentUser, profile, authLoading } = useAuthData();
  const router = useRouter();
  const pathname = usePathname();
  const isSetupRoute = pathname?.startsWith("/VendorSetupMfa");
  const isVerifyRoute = pathname?.startsWith("/VendorVerifyEmail");
  const needsEmailVerification =
    currentUser && profile?.role === "vendor" && !currentUser.emailVerified;
  const needsMfaSetup =
    currentUser && profile?.role === "vendor" && getEnrolledFactors(currentUser).length === 0;

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      router.replace(`/VendorLogin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (profile?.role && profile.role !== "vendor") {
      router.replace("/");
      return;
    }

    if (needsEmailVerification && !isVerifyRoute) {
      router.replace("/VendorVerifyEmail");
      return;
    }

    if (needsMfaSetup && !isSetupRoute) {
      router.replace("/VendorSetupMfa");
    }
  }, [
    authLoading,
    currentUser,
    isSetupRoute,
    isVerifyRoute,
    needsEmailVerification,
    needsMfaSetup,
    pathname,
    profile,
    router,
  ]);

  if (authLoading) {
    return <GuardLoading title="Loading your vendor account" />;
  }

  if (
    !currentUser ||
    (profile?.role && profile.role !== "vendor") ||
    (needsEmailVerification && !isVerifyRoute) ||
    (needsMfaSetup && !isSetupRoute)
  ) {
    return (
      <GuardFallback
        title="Vendor access required"
        href="/VendorLogin"
        linkLabel="Go to vendor login"
      />
    );
  }

  return children;
}
