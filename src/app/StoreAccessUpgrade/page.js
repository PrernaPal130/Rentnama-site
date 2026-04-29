"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  Store,
} from "lucide-react";
import { useAppData } from "../../context/myContext";
import { useAuthData } from "../../context/authContext";

function StoreAccessUpgradeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, profile } = useAuthData();
  const { storeAccessPassActive, viewedStoreShops, unlockStoreAccessPass } =
    useAppData();
  const shopName = searchParams.get("shop") || "partner boutiques";
  const productId = searchParams.get("productId") || "";
  const remainingFreeViews = Math.max(0, 5 - viewedStoreShops.length);

  function handleActivatePass() {
    if (!currentUser || profile?.role !== "customer") {
      router.push(
        `/LoginSign?redirect=${encodeURIComponent("/StoreAccessUpgrade")}`
      );
      return;
    }

    unlockStoreAccessPass();

    if (productId) {
      router.push(`/Product/${productId}`);
      return;
    }

    router.push("/Account");
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={productId ? `/Product/${productId}` : "/Account"}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          {productId ? "Back to product" : "Back to account"}
        </Link>

        <section className="mt-5 grid overflow-hidden rounded-[36px] border border-[#ecd8d1] bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-[radial-gradient(circle_at_top_left,#f4d0c4_0%,#f5e1d8_42%,#fff9f6_100%)] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b86f5f]">
              Store Access Pass
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#2f2622] sm:text-5xl">
              Unlock more boutique visits on RentNama.
            </h1>
            <p className="mt-5 text-sm leading-7 text-[#625650]">
              Browse the outfit online, then unlock full store details when you want
              to visit the boutique offline. Your current free access can still
              reveal {remainingFreeViews} more shop{remainingFreeViews === 1 ? "" : "s"}.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Store className="text-[#b86f5f]" size={20} />
                  <p className="text-sm font-semibold text-[#2f2622]">
                    Current unlock target
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#625650]">
                  {shopName}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#b86f5f]" size={20} />
                  <p className="text-sm font-semibold text-[#2f2622]">
                    What you unlock
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#625650]">
                  Full boutique address, contact number, store timings, and offline
                  order support details across unlimited shops.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ee] px-4 py-2 text-sm font-medium text-[#a96051]">
                <CreditCard size={16} />
                Upgrade access
              </div>

              <h2 className="mt-4 text-3xl font-semibold text-[#2f2622]">
                {storeAccessPassActive ? "Pass already active" : "Unlimited boutique access"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#625650]">
                For the demo, this page activates the store access pass directly.
                Later this can be connected to a real payment gateway.
              </p>

              <div className="mt-8 rounded-[28px] border border-[#ecd8d1] bg-[#fffaf8] p-6">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#bc7766]">
                  Pass Price
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-4xl font-semibold text-[#2f2622]">Rs. 50</span>
                  <span className="pb-1 text-sm text-[#625650]">per month</span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-[#625650]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-[#4e7a46]" />
                    <span>Unlimited store detail reveals after the first 5 free shops.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-[#4e7a46]" />
                    <span>Better for customers who want offline trials and boutique visits.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-[#4e7a46]" />
                    <span>Ideal for comparing multiple vendors before placing an order.</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleActivatePass}
                disabled={storeAccessPassActive}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954] disabled:cursor-not-allowed disabled:bg-[#dfb5aa]"
              >
                {storeAccessPassActive ? "Pass Activated" : "Activate store access pass"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StoreAccessUpgradeFallback() {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="mt-5 rounded-[36px] border border-[#ecd8d1] bg-white p-8 shadow-sm">
          <p className="text-sm text-[#625650]">Loading store access options...</p>
        </section>
      </div>
    </main>
  );
}

export default function StoreAccessUpgradePage() {
  return (
    <Suspense fallback={<StoreAccessUpgradeFallback />}>
      <StoreAccessUpgradeContent />
    </Suspense>
  );
}
