"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  LogOut,
  PackageCheck,
  Plus,
  Store,
  Users,
} from "lucide-react";
import { useAppData } from "../../context/myContext";
import { useAuthData } from "../../context/authContext";

export default function VendorDashboardPage() {
  const router = useRouter();
  const { profile, logout } = useAuthData();
  const { vendorListings, vendorBookings, vendorReturns } = useAppData();
  const businessName =
    profile?.businessName || profile?.name || "Studio RentNama";

  const pendingRequests = vendorBookings.filter((booking) =>
    booking.status.toLowerCase().includes("pending")
  ).length;
  const upcomingRentals = vendorBookings.length;
  const repeatCustomers = new Set(vendorBookings.map((booking) => booking.customer))
    .size;

  const overviewCards = [
    {
      title: "Pending Requests",
      value: `${pendingRequests}`.padStart(2, "0"),
      detail: "Bookings waiting for your confirmation",
      href: "/VendorDashboard/Bookings",
      icon: <Clock3 size={20} />,
    },
    {
      title: "Upcoming Rentals",
      value: `${upcomingRentals}`.padStart(2, "0"),
      detail: "Orders scheduled for this week",
      href: "/VendorDashboard/Bookings",
      icon: <CalendarDays size={20} />,
    },
    {
      title: "Repeat Customers",
      value: `${repeatCustomers}`.padStart(2, "0"),
      detail: "Customers currently active in the pipeline",
      href: "/VendorDashboard/Bookings",
      icon: <Users size={20} />,
    },
  ];

  const recentRequests = vendorBookings.slice(0, 3).map((booking) => ({
    id: booking.id.replace("BOOK", "REQ"),
    customer: booking.customer,
    item: booking.item,
    date: booking.rentalDates,
    status: booking.status,
  }));

  async function handleLogout() {
    await logout();
    router.push("/VendorLogin");
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/VendorLogin"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to vendor login
        </Link>

        <section className="mt-5 rounded-[32px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                {businessName}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Welcome back, {businessName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                Manage listings, review booking requests, and track active
                rentals from one vendor workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/VendorDashboard/Bookings"
                className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
              >
                <PackageCheck size={16} />
                View all bookings
              </Link>
              <Link
                href="/VendorDashboard/Listings"
                className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
              >
                <Store size={16} />
                Show all listed items
              </Link>
              <Link
                href="/VendorDashboard/Listings/New"
                className="inline-flex items-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]"
              >
                <Plus size={16} />
                Add new listing
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overviewCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                  {card.icon}
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {card.detail}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                  <Store size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                    Recent Requests
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Booking activity
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {recentRequests.map((request) => (
                  <article
                    key={request.id}
                    className="rounded-2xl border border-[#efe0db] bg-white/90 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bc7766]">
                          Request {request.id}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                          {request.item}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Customer: {request.customer}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          Rental dates: {request.date}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <div className="inline-flex rounded-full bg-[#f8e5df] px-3 py-1 text-sm font-medium text-[#9e5949]">
                          {request.status}
                        </div>
                        <div className="mt-3">
                          <Link
                            href="/VendorDashboard/Bookings"
                            className="inline-flex rounded-full bg-[#c97762] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                          >
                            Review
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#efe1dc] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                Store Controls
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Open the right workspace
              </h2>

              <div className="mt-5 space-y-3">
                <Link
                  href="/VendorDashboard/Listings/New"
                  className="flex w-full items-center justify-between rounded-2xl border border-[#efe0db] bg-[#fffaf8] px-4 py-4 text-left transition hover:bg-[#fff3ee]"
                >
                  <div>
                    <p className="font-medium text-gray-900">Add rental item</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Create a new outfit listing with pricing and details.
                    </p>
                  </div>
                  <Plus size={18} className="text-[#b46c5b]" />
                </Link>

                <Link
                  href="/VendorDashboard/Listings"
                  className="flex w-full items-center justify-between rounded-2xl border border-[#efe0db] bg-[#fffaf8] px-4 py-4 text-left transition hover:bg-[#fff3ee]"
                >
                  <div>
                    <p className="font-medium text-gray-900">Show listings</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {vendorListings.length} inventory items with pricing,
                      photos, and blocked dates.
                    </p>
                  </div>
                  <Store size={18} className="text-[#b46c5b]" />
                </Link>

                <Link
                  href="/VendorDashboard/Bookings"
                  className="flex w-full items-center justify-between rounded-2xl border border-[#efe0db] bg-[#fffaf8] px-4 py-4 text-left transition hover:bg-[#fff3ee]"
                >
                  <div>
                    <p className="font-medium text-gray-900">Update availability</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {vendorBookings.length} booking records ready for review.
                    </p>
                  </div>
                  <CalendarDays size={18} className="text-[#b46c5b]" />
                </Link>

                <Link
                  href="/VendorDashboard/Returns"
                  className="flex w-full items-center justify-between rounded-2xl border border-[#efe0db] bg-[#fffaf8] px-4 py-4 text-left transition hover:bg-[#fff3ee]"
                >
                  <div>
                    <p className="font-medium text-gray-900">Manage returns</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {vendorReturns.length} return and inspection updates in progress.
                    </p>
                  </div>
                  <PackageCheck size={18} className="text-[#b46c5b]" />
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
