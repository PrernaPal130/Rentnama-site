"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  HandCoins,
  LineChart,
  MapPin,
  ShoppingBag,
  Store,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useAppData } from "../../../context/myContext";
import { useAuthData } from "../../../context/authContext";

export default function VendorAnalyticsPage() {
  const { profile } = useAuthData();
  const { vendorListings, vendorBookings, adminVendors } = useAppData();
  const vendorRecord =
    adminVendors.find(
      (vendor) =>
        vendor.ownerId === profile?.uid ||
        vendor.businessName === profile?.businessName ||
        vendor.email === profile?.email
    ) || null;

  const onlineOrders = vendorBookings.filter((booking) =>
    ["Accepted", "Ready", "Picked Up", "Returned"].includes(booking.status)
  );
  const grossRevenue = onlineOrders.reduce(
    (sum, booking) => sum + Number(booking.amount || 0),
    0
  );
  const commissionRate = vendorListings[0]?.onlineCommissionRate || 18;
  const commissionValue = Math.round((grossRevenue * commissionRate) / 100);
  const vendorNetRevenue = grossRevenue - commissionValue;
  const offlineVisitLeads =
    vendorRecord?.offlineVisitLeads ||
    vendorBookings.filter((booking) => booking.visitLead).length;
  const actualVisitors =
    vendorListings.reduce((sum, listing) => sum + Number(listing.viewCount || 0), 0) ||
    vendorRecord?.actualVisitCount ||
    0;
  const conversionRate = actualVisitors
    ? Math.round((onlineOrders.length / actualVisitors) * 100)
    : 0;
  const billingStatus = vendorRecord?.subscriptionBillingStatus || "Paid";
  const renewalDate = vendorRecord?.subscriptionRenewalDate || "15 Apr 2026";
  const monthlyChart = vendorRecord?.monthlyChart || [];
  const maxVisitors = Math.max(
    ...monthlyChart.map((entry) => entry.visitors || 0),
    1
  );

  const listingPerformance = vendorListings
    .map((listing) => {
      const listingOrders = vendorBookings.filter(
        (booking) => booking.listingId === listing.id
      );
      const listingRevenue = listingOrders.reduce(
        (sum, booking) => sum + Number(booking.amount || 0),
        0
      );

      return {
        id: listing.id,
        name: listing.name,
        visits: Number(listing.viewCount || 0),
        orders: listingOrders.length,
        revenue: listingRevenue,
        conversionRate:
          listing.viewCount && listingOrders.length
            ? Math.round((listingOrders.length / listing.viewCount) * 100)
            : 0,
      };
    })
    .sort((first, second) => second.revenue - first.revenue);

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
                Vendor Analytics
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Track actual visits, conversions, and monthly earnings
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
                This workspace now uses tracked listing visits, online orders, and
                subscription billing signals so you can review real storefront
                momentum instead of only broad estimates.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ee] px-4 py-2 text-sm font-medium text-[#a96051]">
              <LineChart size={16} />
              Billing status: {billingStatus}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <div className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                <HandCoins size={20} />
              </div>
              <p className="mt-4 text-sm text-gray-500">Gross revenue</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                Rs. {grossRevenue.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                <TrendingUp size={20} />
              </div>
              <p className="mt-4 text-sm text-gray-500">Net after commission</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                Rs. {vendorNetRevenue.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                <ShoppingBag size={20} />
              </div>
              <p className="mt-4 text-sm text-gray-500">Online orders</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {onlineOrders.length}
              </p>
            </div>

            <div className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                <Eye size={20} />
              </div>
              <p className="mt-4 text-sm text-gray-500">Tracked visits</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {actualVisitors}
              </p>
            </div>

            <div className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                <MapPin size={20} />
              </div>
              <p className="mt-4 text-sm text-gray-500">Offline visit leads</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {offlineVisitLeads}
              </p>
            </div>

            <div className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                <Wallet size={20} />
              </div>
              <p className="mt-4 text-sm text-gray-500">Billing renewal</p>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {renewalDate}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-3xl border border-[#efe1dc] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                Monthly Chart
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Visitors, conversions, and revenue
              </h2>

              <div className="mt-5 space-y-4">
                {monthlyChart.map((entry) => (
                  <article
                    key={entry.label}
                    className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {entry.label}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {entry.visitors} visits · {entry.orders} orders · Rs.{" "}
                          {Number(entry.revenue || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="h-2 w-36 overflow-hidden rounded-full bg-[#f4dfd8]">
                        <div
                          className="h-full rounded-full bg-[#c97762]"
                          style={{
                            width: `${Math.max(
                              16,
                              Math.round((entry.visitors / maxVisitors) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}

                {!monthlyChart.length ? (
                  <div className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4 text-sm text-gray-600">
                    Monthly chart data will appear here as tracked visits and online
                    orders build up.
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                Listing Performance
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Which outfits are converting best
              </h2>

              <div className="mt-5 space-y-4">
                {listingPerformance.map((listing, index) => (
                  <article
                    key={listing.id}
                    className="rounded-2xl border border-[#efe0db] bg-white/90 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bc7766]">
                          #{index + 1} performer
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                          {listing.name}
                        </h3>
                      </div>

                      <div className="grid gap-2 text-sm text-gray-600 sm:text-right">
                        <p>
                          <span className="font-semibold text-gray-900">
                            {listing.visits}
                          </span>{" "}
                          tracked visits
                        </p>
                        <p>
                          <span className="font-semibold text-gray-900">
                            {listing.orders}
                          </span>{" "}
                          online orders
                        </p>
                        <p>
                          <span className="font-semibold text-gray-900">
                            {listing.conversionRate}%
                          </span>{" "}
                          conversion
                        </p>
                        <p>
                          <span className="font-semibold text-gray-900">
                            Rs. {listing.revenue.toLocaleString("en-IN")}
                          </span>{" "}
                          revenue
                        </p>
                      </div>
                    </div>
                  </article>
                ))}

                {listingPerformance.length === 0 ? (
                  <div className="rounded-2xl border border-[#efe0db] bg-white/90 p-4 text-sm text-gray-600">
                    Listing performance will appear here once inventory and bookings are available.
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <div className="mt-6 rounded-3xl border border-[#efe1dc] bg-[#fffaf8] p-5">
            <div className="flex items-center gap-3">
              <Store size={20} className="text-[#b46c5b]" />
              <div>
                <p className="font-semibold text-gray-900">How to use these analytics</p>
                <p className="mt-1 text-sm text-gray-600">
                  Tracked visits now grow when customers open product pages, online
                  orders update conversion metrics, and billing status helps the vendor
                  see whether subscription access is healthy for the next cycle.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
