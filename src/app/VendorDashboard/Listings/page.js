"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import {
  Archive,
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  PackagePlus,
  Pencil,
  Search,
  SlidersHorizontal,
  Tag,
  Trash2,
} from "lucide-react";
import { useAppData } from "../../../context/myContext";

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

function parseIsoDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
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

export default function VendorListingsPage() {
  const {
    vendorListings,
    blockVendorListingDates,
    archiveVendorListing,
    deleteVendorListing,
  } = useAppData();
  const [dateRanges, setDateRanges] = useState({});
  const [openPicker, setOpenPicker] = useState(null);

  function formatPrice(value) {
    return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
  }

  function handleRangeChange(listingId, field, value) {
    setDateRanges((current) => ({
      ...current,
      [listingId]: {
        ...current[listingId],
        [field]: value,
      },
    }));
  }

  function openRangePicker(listingId, field) {
    const existingValue = dateRanges[listingId]?.[field];
    const baseDate = existingValue
      ? parseIsoDate(existingValue)
      : new Date(2026, 3, 1);

    setOpenPicker({
      listingId,
      field,
      month: baseDate.getMonth(),
      year: baseDate.getFullYear(),
    });
  }

  function shiftPickerMonth(direction) {
    setOpenPicker((current) => {
      if (!current) {
        return current;
      }

      const nextDate = new Date(current.year, current.month + direction, 1);

      return {
        ...current,
        month: nextDate.getMonth(),
        year: nextDate.getFullYear(),
      };
    });
  }

  function selectRangeDate(listingId, isoDate) {
    const currentRange = dateRanges[listingId] || {};
    const activeField = openPicker?.field || "from";

    if (activeField === "from") {
      const shouldResetTo =
        currentRange.to && parseIsoDate(isoDate) > parseIsoDate(currentRange.to);

      handleRangeChange(listingId, "from", isoDate);
      if (shouldResetTo) {
        handleRangeChange(listingId, "to", "");
      }
      setOpenPicker((current) =>
        current ? { ...current, field: "to" } : current
      );
      return;
    }

    if (currentRange.from && parseIsoDate(isoDate) < parseIsoDate(currentRange.from)) {
      handleRangeChange(listingId, "from", isoDate);
      handleRangeChange(listingId, "to", "");
      setOpenPicker((current) =>
        current ? { ...current, field: "to" } : current
      );
      return;
    }

    handleRangeChange(listingId, "to", isoDate);
  }

  function handleBlockDates(listingId) {
    const selectedRange = dateRanges[listingId];

    if (!selectedRange?.from || !selectedRange?.to) {
      return;
    }

    blockVendorListingDates(listingId, selectedRange);

    setDateRanges((current) => ({
      ...current,
      [listingId]: { from: "", to: "" },
    }));
    setOpenPicker(null);
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
                Vendor Listings
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Manage your rental catalog
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                Review active pieces, update availability, and prepare new items
                to go live on your storefront.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]">
                <SlidersHorizontal size={16} />
                Filter
              </button>
              <Link
                href="/VendorDashboard/Listings/New"
                className="inline-flex items-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]"
              >
                <PackagePlus size={16} />
                Add new listing
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#efe1dc] bg-[#fffaf8] px-4 py-3">
            <Search size={18} className="text-[#b46c5b]" />
            <input
              type="text"
              placeholder="Search by product name, category, or listing ID"
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>

          <div className="mt-8 space-y-4">
            {vendorListings.map((listing) => (
              <article
                key={listing.id}
                className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm"
              >
                <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="relative overflow-hidden rounded-3xl bg-[#f7e4dd]">
                    <Image
                      src={listing.image}
                      alt={listing.name}
                      width={180}
                      height={220}
                      className="h-56 w-full object-cover"
                      style={{ objectPosition: "center 18%" }}
                    />
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bc7766]">
                          {listing.id}
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                          {listing.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          {listing.category}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm">
                          <span className="rounded-full bg-[#f8e5df] px-3 py-1 font-medium text-[#9e5949]">
                            {listing.status}
                          </span>
                          <span className="rounded-full border border-[#efe1dc] bg-white px-3 py-1 font-medium text-gray-700">
                            {formatPrice(listing.price)}
                          </span>
                          <span className="rounded-full border border-[#efe1dc] bg-white px-3 py-1 font-medium text-gray-700">
                            {listing.availability}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/VendorDashboard/Listings/${listing.id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
                        >
                          <Eye size={16} />
                          Preview
                        </Link>
                        <Link
                          href={`/VendorDashboard/Listings/${listing.id}/edit`}
                          className="inline-flex items-center gap-2 rounded-full bg-[#c97762] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                        >
                          <Pencil size={16} />
                          Edit listing
                        </Link>
                        <button
                          type="button"
                          onClick={() => archiveVendorListing(listing.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
                        >
                          <Archive size={16} />
                          Archive
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteVendorListing(listing.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#f0d1c7] bg-[#fff7f3] px-4 py-2.5 text-sm font-medium text-[#b45a49] transition hover:bg-[#fdeee8]"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
                      <div className="rounded-2xl border border-[#efe0db] bg-white/90 p-4">
                        <div className="flex items-center gap-2 text-[#b46c5b]">
                          <Tag size={16} />
                          <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                            Tags
                          </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
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

                      <div className="rounded-2xl border border-[#efe0db] bg-white/90 p-4">
                        <div className="flex items-center gap-2 text-[#b46c5b]">
                          <CalendarDays size={16} />
                          <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                            Block Dates
                          </p>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <label className="text-sm text-gray-700">
                            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-gray-500">
                              From
                            </span>
                            <button
                              type="button"
                              onClick={() => openRangePicker(listing.id, "from")}
                              className="flex w-full items-center justify-between rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3 text-sm text-gray-700 transition hover:border-[#d88b76]"
                            >
                              <span>
                                {dateRanges[listing.id]?.from || "Choose from date"}
                              </span>
                              <CalendarDays size={16} className="text-[#b46c5b]" />
                            </button>
                          </label>

                          <label className="text-sm text-gray-700">
                            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-gray-500">
                              To
                            </span>
                            <button
                              type="button"
                              onClick={() => openRangePicker(listing.id, "to")}
                              className="flex w-full items-center justify-between rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3 text-sm text-gray-700 transition hover:border-[#d88b76]"
                            >
                              <span>
                                {dateRanges[listing.id]?.to || "Choose to date"}
                              </span>
                              <CalendarDays size={16} className="text-[#b46c5b]" />
                            </button>
                          </label>
                        </div>

                        {openPicker?.listingId === listing.id ? (
                          <div className="mt-4 rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-3">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => shiftPickerMonth(-1)}
                                className="rounded-full border border-[#e6d3cb] bg-white p-2 text-gray-700 transition hover:bg-[#fff6f2]"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <div className="text-center">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bc7766]">
                                  {getMonthLabel(openPicker.year, openPicker.month)}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  Pick {openPicker.field === "from" ? "start" : "end"} date
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => shiftPickerMonth(1)}
                                className="rounded-full border border-[#e6d3cb] bg-white p-2 text-gray-700 transition hover:bg-[#fff6f2]"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>

                            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-gray-500">
                              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                (day) => (
                                  <span key={day}>{day}</span>
                                )
                              )}
                            </div>

                            <div className="mt-2 grid grid-cols-7 gap-1">
                              {getMonthDays(openPicker.year, openPicker.month).map(
                                (date, index) => {
                                  if (!date) {
                                    return (
                                      <div
                                        key={`empty-${index}`}
                                        className="h-10 rounded-xl bg-transparent"
                                      />
                                    );
                                  }

                                  const isoDate = formatDateToIso(date);
                                  const isBooked = listing.bookedDates.includes(isoDate);
                                  const bufferedDates = getBufferedDates(
                                    listing.bookedDates
                                  );
                                  const isBuffered =
                                    !isBooked && bufferedDates.has(isoDate);
                                  const isBlocked = listing.blockedRanges.some(
                                    (range) =>
                                      isoDate >= range.from && isoDate <= range.to
                                  );
                                  const selectedFrom = dateRanges[listing.id]?.from;
                                  const selectedTo = dateRanges[listing.id]?.to;
                                  const isSelectedRange =
                                    selectedFrom &&
                                    selectedTo &&
                                    isoDate >= selectedFrom &&
                                    isoDate <= selectedTo;
                                  const isSelectedEdge =
                                    isoDate === selectedFrom || isoDate === selectedTo;

                                  return (
                                    <button
                                      key={isoDate}
                                      type="button"
                                      onClick={() => selectRangeDate(listing.id, isoDate)}
                                      className={`flex h-10 flex-col items-center justify-center rounded-xl text-xs transition ${
                                        isSelectedEdge
                                          ? "bg-[#c97762] text-white"
                                          : isSelectedRange
                                          ? "bg-[#f7d9cf] text-[#8f4738]"
                                          : isBooked
                                          ? "bg-[#f5c5b8] text-[#8f4738]"
                                          : isBuffered
                                          ? "bg-[#fde7c8] text-[#95611a]"
                                          : isBlocked
                                          ? "bg-[#fff1ec] text-[#b96954]"
                                          : "bg-[#fffdfc] text-gray-700 hover:bg-[#fff3ee]"
                                      }`}
                                    >
                                      <span>{date.getDate()}</span>
                                      <span
                                        className={`mt-1 h-1.5 w-1.5 rounded-full ${
                                          isSelectedEdge
                                            ? "bg-white"
                                            : isBooked
                                            ? "bg-[#c97762]"
                                            : "bg-transparent"
                                        }`}
                                      />
                                    </button>
                                  );
                                }
                              )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-600">
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
                              <span className="inline-flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#c97762]" />
                                Selected range
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleBlockDates(listing.id)}
                              disabled={
                                !dateRanges[listing.id]?.from ||
                                !dateRanges[listing.id]?.to
                              }
                              className="mt-4 w-full rounded-full bg-[#c97762] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954] disabled:cursor-not-allowed disabled:bg-[#dfb5aa]"
                            >
                              Block Dates
                            </button>
                          </div>
                        ) : null}

                        <p className="mt-3 text-xs leading-5 text-gray-500">
                          Open the calendar to view monthly availability, booked
                          dates, buffers, and blocked ranges in one place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-[#efe1dc] bg-[#fffaf8] p-5">
            <div className="flex items-center gap-3">
              <CalendarDays size={20} className="text-[#b46c5b]" />
              <div>
                <p className="font-semibold text-gray-900">Availability planning</p>
                <p className="mt-1 text-sm text-gray-600">
                  Listings now share one vendor data source, so new outfits and blocked date ranges stay in sync.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
