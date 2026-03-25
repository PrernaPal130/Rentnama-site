"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ImagePlus,
  IndianRupee,
  Pencil,
  Ruler,
  Tag,
} from "lucide-react";
import { useAppData } from "../../../../../context/myContext";

function makeFormState(listing) {
  if (!listing) {
    return {
      productName: "",
      category: "",
      rentalPrice: "",
      securityDeposit: "",
      sizes: "",
      availability: "",
      description: "",
    };
  }

  return {
    productName: listing.name || "",
    category: listing.category || "",
    rentalPrice: listing.price ? String(listing.price) : "",
    securityDeposit: listing.securityDeposit
      ? String(listing.securityDeposit)
      : "",
    sizes: Array.isArray(listing.sizes) ? listing.sizes.join(", ") : "",
    availability: listing.availability || "",
    description: listing.description || "",
  };
}

export default function EditVendorListingPage() {
  const params = useParams();
  const router = useRouter();
  const { getVendorListingById, updateVendorListing } = useAppData();
  const listingId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const listing = getVendorListingById(listingId);
  const [formData, setFormData] = useState(makeFormState(listing));

  useEffect(() => {
    setFormData(makeFormState(listing));
  }, [listing]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!listingId) {
      return;
    }

    updateVendorListing(listingId, formData);
    router.push("/VendorDashboard/Listings");
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/VendorDashboard/Listings"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
          >
            <ArrowLeft size={16} />
            Back to listings
          </Link>

          <section className="mt-5 rounded-[32px] border border-[#ecd8d1] bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
              Listing not found
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-gray-900">
              This listing could not be found.
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              It may have been removed or the page may have been opened with an
              invalid listing ID.
            </p>
          </section>
        </div>
      </main>
    );
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

        <section className="mt-5 grid overflow-hidden rounded-[32px] border border-[#ecd8d1] bg-white shadow-sm lg:grid-cols-[0.92fr_1.08fr]">
          <div className="bg-gradient-to-br from-[#f6d6cb] via-[#f7e8e1] to-[#fff9f6] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
              Edit Listing
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-gray-900">
              Update your listing details with confidence
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-600">
              Refine pricing, sizes, and description so this outfit stays clear,
              bookable, and easy for customers to trust.
            </p>

            <div className="mt-8 space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-[#ead6cf] bg-white/80">
                <div className="relative bg-[#f5ddd5]">
                  <Image
                    src={listing.image}
                    alt={listing.name}
                    width={720}
                    height={880}
                    className="h-72 w-full object-cover"
                    style={{ objectPosition: "center 18%" }}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c57f6d]">
                    Current Photo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Use this image as your reference while updating the listing
                    details for {listing.name}.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#ead6cf] bg-white/75 p-5">
                <div className="flex items-center gap-3">
                  <Tag size={18} className="text-[#b46c5b]" />
                  <p className="font-semibold text-gray-900">Live listing info</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Listing ID: {listing.id}. Keep names, category, and price
                  current so vendor operations stay accurate.
                </p>
              </div>

              <div className="rounded-3xl border border-[#ead6cf] bg-white/75 p-5">
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-[#b46c5b]" />
                  <p className="font-semibold text-gray-900">
                    Availability support
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Calendar blocking stays on the Listings page, while this form
                  handles your core product details.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ee] px-4 py-2 text-sm font-medium text-[#a96051]">
                <Pencil size={16} />
                Edit listing details
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                      Product name
                    </label>
                    <input
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                      Category
                    </label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                      Sizes
                    </label>
                    <div className="relative">
                      <Ruler
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b46c5b]"
                      />
                      <input
                        name="sizes"
                        value={formData.sizes}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                      Rental price
                    </label>
                    <div className="relative">
                      <IndianRupee
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b46c5b]"
                      />
                      <input
                        name="rentalPrice"
                        value={formData.rentalPrice}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                      Security deposit
                    </label>
                    <div className="relative">
                      <IndianRupee
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b46c5b]"
                      />
                      <input
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                      Availability note
                    </label>
                    <input
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                      Product description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-dashed border-[#e7cfc7] bg-[#fff9f6] p-5">
                  <div className="flex items-center gap-3">
                    <ImagePlus size={18} className="text-[#b46c5b]" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Product photos
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Photo editing can be connected next. This form now focuses
                        on updating the saved listing details cleanly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                  >
                    Save changes
                    <ArrowRight size={16} />
                  </button>
                  <Link
                    href="/VendorDashboard/Listings"
                    className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
