"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Ruler,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useAppData } from "../../../../context/myContext";

function formatPrice(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function formatDateToIso(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function getBufferedDates(bookedDates) {
  const bufferedDates = new Set();

  bookedDates.forEach((bookedDate) => {
    const baseDate = new Date(`${bookedDate}T00:00:00`);

    for (let offset = -2; offset <= 2; offset += 1) {
      if (offset === 0) {
        continue;
      }

      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + offset);
      bufferedDates.add(formatDateToIso(nextDate));
    }
  });

  return bufferedDates;
}

export default function VendorListingPreviewPage() {
  const params = useParams();
  const { getVendorListingById } = useAppData();
  const listingId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const listing = getVendorListingById(listingId);
  const initialCalendarDate = useMemo(() => {
    if (!listing) {
      return new Date();
    }

    const firstRelevantDate =
      listing.blockedRanges[0]?.from || listing.bookedDates[0] || new Date().toISOString().slice(0, 10);

    return new Date(`${firstRelevantDate}T00:00:00`);
  }, [listing]);
  const [calendarView, setCalendarView] = useState({
    month: initialCalendarDate.getMonth(),
    year: initialCalendarDate.getFullYear(),
  });

  const bufferedDates = useMemo(
    () => (listing ? getBufferedDates(listing.bookedDates) : new Set()),
    [listing]
  );

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/VendorDashboard/Listings"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
          >
            <ArrowLeft size={16} />
            Back to listings
          </Link>
          <section className="mt-5 rounded-[32px] border border-[#ecd8d1] bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-gray-900">
              Listing not found
            </h1>
          </section>
        </div>
      </main>
    );
  }

  function shiftCalendarMonth(direction) {
    setCalendarView((current) => {
      const nextDate = new Date(current.year, current.month + direction, 1);

      return {
        month: nextDate.getMonth(),
        year: nextDate.getFullYear(),
      };
    });
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/VendorDashboard/Listings"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to listings
        </Link>

        <section className="mt-5 overflow-hidden rounded-[32px] border border-[#ecd8d1] bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-gradient-to-br from-[#f6d6cb] via-[#f7e8e1] to-[#fff9f6] p-6 sm:p-8">
              <div className="overflow-hidden rounded-[28px] border border-[#ead6cf] bg-white/80">
                <Image
                  src={listing.image}
                  alt={listing.name}
                  width={900}
                  height={1100}
                  className="h-[420px] w-full object-cover"
                  style={{ objectPosition: "center 18%" }}
                />
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                Listing Preview
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-gray-900">
                {listing.name}
              </h1>
              <p className="mt-2 text-base text-gray-600">{listing.category}</p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-[#f8e5df] px-3 py-1 font-medium text-[#9e5949]">
                  {listing.status}
                </span>
                <span className="rounded-full border border-[#efe1dc] bg-white px-3 py-1 font-medium text-gray-700">
                  {listing.availability}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[#efe0db] bg-[#fffaf8] p-5">
                  <div className="flex items-center gap-2 text-[#b46c5b]">
                    <CircleDollarSign size={18} />
                    <p className="text-sm font-semibold text-gray-900">Pricing</p>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">
                    {formatPrice(listing.price)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Deposit: {formatPrice(listing.securityDeposit)}
                  </p>
                </div>

                <div className="rounded-3xl border border-[#efe0db] bg-[#fffaf8] p-5">
                  <div className="flex items-center gap-2 text-[#b46c5b]">
                    <Ruler size={18} />
                    <p className="text-sm font-semibold text-gray-900">Sizes</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {listing.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-[#efe0db] bg-white p-5">
                <div className="flex items-center gap-2 text-[#b46c5b]">
                  <Tag size={18} />
                  <p className="text-sm font-semibold text-gray-900">Details</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {listing.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {listing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#fff3ee] px-3 py-1 text-xs font-medium text-[#9e5949]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-[#efe0db] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[#b46c5b]">
                    <CalendarDays size={18} />
                    <p className="text-sm font-semibold text-gray-900">
                      Availability Calendar
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => shiftCalendarMonth(-1)}
                      className="rounded-full border border-[#e6d3cb] bg-white p-2 text-gray-700 transition hover:bg-[#fff6f2]"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => shiftCalendarMonth(1)}
                      className="rounded-full border border-[#e6d3cb] bg-white p-2 text-gray-700 transition hover:bg-[#fff6f2]"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#bc7766]">
                  {getMonthLabel(calendarView.year, calendarView.month)}
                </p>

                <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-gray-500">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <span key={day}>{day}</span>
                    )
                  )}
                </div>

                <div className="mt-2 grid grid-cols-7 gap-1">
                  {getMonthDays(calendarView.year, calendarView.month).map(
                    (date, index) => {
                      if (!date) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="h-11 rounded-xl bg-transparent"
                          />
                        );
                      }

                      const isoDate = formatDateToIso(date);
                      const isBooked = listing.bookedDates.includes(isoDate);
                      const isBuffered = !isBooked && bufferedDates.has(isoDate);
                      const isBlocked = listing.blockedRanges.some(
                        (range) => isoDate >= range.from && isoDate <= range.to
                      );

                      return (
                        <div
                          key={isoDate}
                          className={`flex h-11 flex-col items-center justify-center rounded-xl text-xs ${
                            isBooked
                              ? "bg-[#f5c5b8] text-[#8f4738]"
                              : isBuffered
                              ? "bg-[#fde7c8] text-[#95611a]"
                              : isBlocked
                              ? "bg-[#fff1ec] text-[#b96954]"
                              : "bg-[#fffdfc] text-gray-700"
                          }`}
                        >
                          <span>{date.getDate()}</span>
                          <span
                            className={`mt-1 h-1.5 w-1.5 rounded-full ${
                              isBooked ? "bg-[#c97762]" : "bg-transparent"
                            }`}
                          />
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c97762]" />
                    Booked date
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f0be74]" />
                    2-day buffer
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f3b9a6]" />
                    Manually blocked
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-[#efe0db] bg-[#fffaf8] p-5">
                <div className="flex items-center gap-2 text-[#b46c5b]">
                  <ShieldCheck size={18} />
                  <p className="text-sm font-semibold text-gray-900">
                    Availability Logic
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Accepted, ready, and picked-up bookings automatically feed this
                  listing&apos;s booked dates. Manual date blocks stay visible
                  separately for vendor planning.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
