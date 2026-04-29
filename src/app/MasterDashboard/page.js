"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  BadgeCheck,
  Building2,
  Eye,
  HandCoins,
  LayoutDashboard,
  LineChart,
  PackageCheck,
  ShieldAlert,
  Store,
  UserCheck,
  Users,
} from "lucide-react";
import { useAppData } from "../../context/myContext";

function statusClasses(status) {
  if (status === "Approved" || status === "Active" || status === "Paid") {
    return "bg-[#ecf8f1] text-[#226c49]";
  }

  if (status === "Pending" || status === "Due Soon" || status === "Under Review") {
    return "bg-[#fff5df] text-[#946520]";
  }

  if (status === "Past Due" || status === "Suspended" || status === "Rejected") {
    return "bg-[#fff0eb] text-[#a95244]";
  }

  return "bg-[#f5efed] text-[#6c5c57]";
}

export default function MasterDashboardPage() {
  const {
    adminVendors,
    vendorListings,
    vendorBookings,
    orders,
    approveVendor,
    rejectVendor,
    suspendVendor,
    archiveVendor,
  } = useAppData();
  const [selectedVendorId, setSelectedVendorId] = useState(
    adminVendors[0]?.id || null
  );

  const selectedVendor =
    adminVendors.find((vendor) => vendor.id === selectedVendorId) ||
    adminVendors[0] ||
    null;

  const totalOrders = vendorBookings.filter((booking) =>
    ["Accepted", "Ready", "Picked Up", "Returned"].includes(booking.status)
  ).length;
  const totalCommissions = adminVendors.reduce(
    (sum, vendor) => sum + Number(vendor.monthlyCommissionValue || 0),
    0
  );
  const activeSubscriptions = adminVendors.filter(
    (vendor) =>
      vendor.approvalStatus === "Approved" &&
      vendor.accountStatus === "Active" &&
      vendor.subscriptionBillingStatus !== "Past Due"
  ).length;

  const overviewCards = [
    {
      title: "Total vendors",
      value: adminVendors.length,
      detail: "Approved, pending, and managed businesses on the platform",
      icon: <Users size={20} />,
    },
    {
      title: "Total listings",
      value: vendorListings.length,
      detail: "Active catalogue inventory supplied by partner vendors",
      icon: <Store size={20} />,
    },
    {
      title: "Total online orders",
      value: totalOrders || orders.length,
      detail: "Orders currently flowing through the commission model",
      icon: <PackageCheck size={20} />,
    },
    {
      title: "Total commissions",
      value: `Rs. ${totalCommissions.toLocaleString("en-IN")}`,
      detail: "Current monthly platform commission across vendor partners",
      icon: <HandCoins size={20} />,
    },
    {
      title: "Active subscriptions",
      value: activeSubscriptions,
      detail: "Vendors with live billing and active storefront access",
      icon: <BadgeCheck size={20} />,
    },
  ];

  const platformChart = useMemo(() => {
    const monthMap = new Map();

    adminVendors.forEach((vendor) => {
      (vendor.monthlyChart || []).forEach((entry) => {
        const previous = monthMap.get(entry.label) || {
          label: entry.label,
          visitors: 0,
          orders: 0,
          revenue: 0,
        };

        monthMap.set(entry.label, {
          label: entry.label,
          visitors: previous.visitors + Number(entry.visitors || 0),
          orders: previous.orders + Number(entry.orders || 0),
          revenue: previous.revenue + Number(entry.revenue || 0),
        });
      });
    });

    return Array.from(monthMap.values());
  }, [adminVendors]);

  const maxVisitors = Math.max(
    ...platformChart.map((entry) => entry.visitors || 0),
    1
  );

  const selectedVendorListings = vendorListings.filter(
    (listing) => listing.ownerId === selectedVendor?.ownerId
  );
  const selectedVendorOrders = vendorBookings.filter((booking) =>
    selectedVendorListings.some((listing) => listing.id === booking.listingId)
  );

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to landing page
        </Link>

        <section className="mt-5 rounded-[32px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                Admin / Master Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Control the RentNama platform from one workspace
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
                Review vendor onboarding, subscription health, platform commissions,
                listing scale, and storefront performance from a single control panel.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ee] px-4 py-2 text-sm font-medium text-[#a96051]">
              <LayoutDashboard size={16} />
              Platform operations snapshot
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {overviewCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                  {card.icon}
                </div>
                <p className="mt-4 text-sm text-gray-500">{card.title}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {card.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-3xl border border-[#efe1dc] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                  <LineChart size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                    Platform Analytics
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Monthly visitors, orders, and revenue
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {platformChart.map((entry) => (
                  <article
                    key={entry.label}
                    className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {entry.label}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {entry.visitors} visitors · {entry.orders} orders · Rs.{" "}
                          {entry.revenue.toLocaleString("en-IN")} revenue
                        </p>
                      </div>
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-[#f4dfd8]">
                        <div
                          className="h-full rounded-full bg-[#c97762]"
                          style={{
                            width: `${Math.max(
                              18,
                              Math.round((entry.visitors / maxVisitors) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                Billing Watchlist
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Subscription health by vendor
              </h2>

              <div className="mt-5 space-y-4">
                {adminVendors.map((vendor) => (
                  <article
                    key={vendor.id}
                    className="rounded-2xl border border-[#efe0db] bg-white/90 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {vendor.businessName}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {vendor.subscriptionPlan} plan · renews {vendor.subscriptionRenewalDate}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClasses(
                          vendor.subscriptionBillingStatus
                        )}`}
                      >
                        {vendor.subscriptionBillingStatus}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                    Vendor Management
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Approve, review, and control vendor access
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {adminVendors.map((vendor) => (
                  <article
                    key={vendor.id}
                    className={`rounded-2xl border p-4 transition ${
                      selectedVendor?.id === vendor.id
                        ? "border-[#d88b76] bg-white"
                        : "border-[#efe0db] bg-white/90"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedVendorId(vendor.id)}
                          className="text-left"
                        >
                          <p className="text-lg font-semibold text-gray-900">
                            {vendor.businessName}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {vendor.ownerName} · {vendor.city}, {vendor.state}
                          </p>
                        </button>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClasses(
                              vendor.approvalStatus
                            )}`}
                          >
                            {vendor.approvalStatus}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClasses(
                              vendor.accountStatus
                            )}`}
                          >
                            {vendor.accountStatus}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClasses(
                              vendor.subscriptionBillingStatus
                            )}`}
                          >
                            {vendor.subscriptionBillingStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVendorId(vendor.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#fff6f2]"
                        >
                          <Eye size={14} />
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => approveVendor(vendor.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#ecf8f1] px-4 py-2.5 text-sm font-medium text-[#226c49] hover:bg-[#dff2e7]"
                        >
                          <UserCheck size={14} />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectVendor(vendor.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#fff3df] px-4 py-2.5 text-sm font-medium text-[#946520] hover:bg-[#ffebc6]"
                        >
                          <ShieldAlert size={14} />
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => suspendVendor(vendor.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#fff0eb] px-4 py-2.5 text-sm font-medium text-[#a95244] hover:bg-[#ffe4dc]"
                        >
                          <Ban size={14} />
                          Suspend
                        </button>
                        <button
                          type="button"
                          onClick={() => archiveVendor(vendor.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#ead7d1] bg-[#f9f4f2] px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#f2eae7]"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#efe1dc] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                Vendor Details
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {selectedVendor?.businessName || "Select a vendor"}
              </h2>

              {selectedVendor ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4">
                    <p className="text-sm text-gray-500">Owner & contact</p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {selectedVendor.ownerName}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedVendor.email}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedVendor.phoneNumber}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4">
                      <p className="text-sm text-gray-500">Subscription</p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">
                        {selectedVendor.subscriptionPlan} · {selectedVendor.subscriptionBillingStatus}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Renewal date: {selectedVendor.subscriptionRenewalDate}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4">
                      <p className="text-sm text-gray-500">Performance</p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">
                        {selectedVendor.actualVisitCount} visits · {selectedVendor.onlineOrderCount} online orders
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Offline leads: {selectedVendor.offlineVisitLeads}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4">
                    <p className="text-sm text-gray-500">Storefront footprint</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {selectedVendorListings.length} listings · {selectedVendorOrders.length} tracked booking records
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Monthly revenue: Rs.{" "}
                      {Number(selectedVendor.monthlyRevenue || 0).toLocaleString(
                        "en-IN"
                      )}{" "}
                      · Commission: Rs.{" "}
                      {Number(
                        selectedVendor.monthlyCommissionValue || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4">
                    <p className="text-sm text-gray-500">Latest monthly chart</p>
                    <div className="mt-4 space-y-3">
                      {(selectedVendor.monthlyChart || []).map((entry) => (
                        <div key={entry.label} className="flex items-center gap-4">
                          <div className="w-10 text-sm font-medium text-gray-700">
                            {entry.label}
                          </div>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f4dfd8]">
                            <div
                              className="h-full rounded-full bg-[#c97762]"
                              style={{
                                width: `${Math.max(
                                  12,
                                  Math.round(
                                    (entry.visitors /
                                      Math.max(
                                        ...selectedVendor.monthlyChart.map(
                                          (item) => item.visitors || 0
                                        ),
                                        1
                                      )) *
                                      100
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="w-28 text-right text-sm text-gray-600">
                            {entry.visitors} visits
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4 text-sm text-gray-600">
                  Select a vendor card to review details and platform controls.
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
