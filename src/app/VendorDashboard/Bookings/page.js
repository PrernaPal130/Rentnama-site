"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Package,
  PackageCheck,
  Truck,
  Undo2,
  XCircle,
  Search,
} from "lucide-react";
import { useAppData } from "../../../context/myContext";

export default function VendorBookingsPage() {
  const { vendorBookings, updateVendorBookingStatus } = useAppData();

  const pendingCount = vendorBookings.filter((booking) =>
    booking.status === "Pending"
  ).length;
  const dispatchingCount = vendorBookings.filter((booking) =>
    ["Accepted", "Ready", "Picked Up"].includes(booking.status)
  ).length;
  const completedCount = vendorBookings.filter((booking) =>
    ["Returned", "Declined"].includes(booking.status)
  ).length;

  function getBookingActions(booking) {
    switch (booking.status) {
      case "Pending":
        return [
          {
            label: "Decline",
            icon: <XCircle size={16} />,
            variant: "secondary",
            nextStatus: "Declined",
          },
          {
            label: "Accept",
            icon: <CheckCircle2 size={16} />,
            variant: "primary",
            nextStatus: "Accepted",
          },
        ];
      case "Accepted":
        return [
          {
            label: "Mark ready",
            icon: <PackageCheck size={16} />,
            variant: "primary",
            nextStatus: "Ready",
          },
        ];
      case "Ready":
        return [
          {
            label: "Picked up",
            icon: <Truck size={16} />,
            variant: "primary",
            nextStatus: "Picked Up",
          },
        ];
      case "Picked Up":
        return [
          {
            label: "Returned",
            icon: <Undo2 size={16} />,
            variant: "primary",
            nextStatus: "Returned",
          },
        ];
      default:
        return [];
    }
  }

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
                Vendor Bookings
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Track booking requests and active rentals
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                Review pending requests, confirm outgoing rentals, and keep your
                schedule organized.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#efe1dc] bg-[#fffaf8] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[#bc7766] font-semibold">
                  Pending
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {`${pendingCount}`.padStart(2, "0")}
                </p>
              </div>
              <div className="rounded-2xl border border-[#efe1dc] bg-[#fffaf8] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[#bc7766] font-semibold">
                  Dispatching
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {`${dispatchingCount}`.padStart(2, "0")}
                </p>
              </div>
              <div className="rounded-2xl border border-[#efe1dc] bg-[#fffaf8] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[#bc7766] font-semibold">
                  Completed
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {`${completedCount}`.padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#efe1dc] bg-[#fffaf8] px-4 py-3">
            <Search size={18} className="text-[#b46c5b]" />
            <input
              type="text"
              placeholder="Search by customer, booking ID, or outfit"
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>

          <div className="mt-8 space-y-4">
            {vendorBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bc7766]">
                      {booking.id}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                      {booking.item}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Customer: {booking.customer}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-[#efe1dc] font-medium text-gray-700">
                        <CalendarDays size={14} className="text-[#b46c5b]" />
                        {booking.rentalDates}
                      </span>
                      <span className="rounded-full bg-[#f8e5df] px-3 py-1 font-medium text-[#9e5949]">
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="xl:text-right">
                    <p className="text-sm text-gray-500">Booking amount</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      Rs. {booking.amount}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 xl:justify-end">
                      {getBookingActions(booking).length > 0 ? (
                        getBookingActions(booking).map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() =>
                              updateVendorBookingStatus(
                                booking.id,
                                action.nextStatus
                              )
                            }
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                              action.variant === "primary"
                                ? "bg-[#c97762] text-white hover:bg-[#b96954]"
                                : "border border-[#e4c8c0] bg-white text-gray-700 hover:bg-[#fff6f2]"
                            }`}
                          >
                            {action.icon}
                            {action.label}
                          </button>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#efe1dc] bg-white px-4 py-2.5 text-sm font-medium text-gray-600">
                          {booking.status === "Returned" ? (
                            <Package size={16} />
                          ) : (
                            <Clock3 size={16} />
                          )}
                          {booking.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-[#efe1dc] bg-[#fffaf8] p-5">
            <div className="flex items-center gap-3">
              <PackageCheck size={20} className="text-[#b46c5b]" />
              <div>
                <p className="font-semibold text-gray-900">Bookings workflow</p>
                <p className="mt-1 text-sm text-gray-600">
                  Booking actions now drive real vendor statuses and update listing availability automatically.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
