"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck2,
  ClipboardCheck,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useAppData } from "../../../context/myContext";

export default function VendorReturnsPage() {
  const { vendorReturns } = useAppData();

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/VendorDashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to vendor dashboard
        </Link>

        <section className="mt-5 rounded-[32px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                Vendor Returns
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Handle pickups, checks, and deposit updates
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                Track returned outfits, monitor inspections, and manage deposit
                releases in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]">
                <RefreshCw size={16} />
                Refresh status
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]">
                <ClipboardCheck size={16} />
                Start inspection
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#efe1dc] bg-[#fffaf8] px-4 py-3">
            <Search size={18} className="text-[#b46c5b]" />
            <input
              type="text"
              placeholder="Search by return ID, customer, or outfit"
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>

          <div className="mt-8 space-y-4">
            {vendorReturns.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bc7766]">
                      {item.id}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                      {item.item}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Customer: {item.customer}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-[#efe1dc] font-medium text-gray-700">
                        <CalendarCheck2 size={14} className="text-[#b46c5b]" />
                        Pickup: {item.pickup}
                      </span>
                      <span className="rounded-full bg-[#f8e5df] px-3 py-1 font-medium text-[#9e5949]">
                        {item.inspection}
                      </span>
                    </div>
                  </div>

                  <div className="xl:text-right">
                    <p className="text-sm text-gray-500">Deposit status</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {item.deposit}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 xl:justify-end">
                      <button className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]">
                        <ShieldCheck size={16} />
                        Quality check
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-full bg-[#c97762] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b96954]">
                        <PackageCheck size={16} />
                        Update return
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-[#efe1dc] bg-[#fffaf8] p-5">
            <div className="flex items-center gap-3">
              <ClipboardCheck size={20} className="text-[#b46c5b]" />
              <div>
                <p className="font-semibold text-gray-900">Returns workflow</p>
                <p className="mt-1 text-sm text-gray-600">
                  Next step: connect return inspections to deposit release and damage notes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
