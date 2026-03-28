"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { useAppData } from "../../context/myContext";
import { useAuthData } from "../../context/authContext";
import { CustomerTopNav } from "../../components/CustomerAreaLayout";

export default function ProductDetailClient({ productId }) {
  const { getProductById, addToCart, addToWishlist } = useAppData();
  const { currentUser, profile } = useAuthData();
  const product = getProductById(productId);
  const showCustomerTopNav = !currentUser || profile?.role !== "vendor";

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || "M");
  const [selectedImage, setSelectedImage] = useState(product?.image || "/lengha.jpg");
  const [rentalStartDate, setRentalStartDate] = useState("2026-03-28");
  const [rentalEndDate, setRentalEndDate] = useState("2026-04-02");
  const [cartFeedback, setCartFeedback] = useState(false);
  const storeName = product?.shopName || "Apna Closet Signature Studio";
  const storeLocation = product?.storeLocation || "SCO 12-14, Sector 17C, Chandigarh";
  const storeContact = product?.storeContact || "+91 98765 43210";
  const storeHours = product?.storeHours || "11:00 AM - 8:00 PM";
  const offlineOrderNote =
    product?.offlineOrderNote ||
    "Visit the store for fabric inspection, styling help, fittings, and offline order placement.";

  if (!product) {
    return (
      <>
        {showCustomerTopNav ? <CustomerTopNav /> : null}
        <main className="min-h-screen bg-[#fffaf7] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[28px] border border-[#ecd8d1] bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
              Product not found
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-gray-900">
              This rental is not available right now.
            </h1>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>
          </div>
        </main>
      </>
    );
  }

  const selectedRentalDates =
    rentalStartDate && rentalEndDate
      ? `${rentalStartDate} to ${rentalEndDate}`
      : product.rentalDates;

  function handleAddToCart() {
    addToCart(product.id, {
      size: selectedSize,
      rentalDates: selectedRentalDates,
    });
    setCartFeedback(true);
    window.setTimeout(() => {
      setCartFeedback(false);
    }, 1600);
  }

  function scrollToStoreDetails() {
    const section = document.getElementById("store-details");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {showCustomerTopNav ? <CustomerTopNav /> : null}
      <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <section className="mt-5 rounded-[28px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-4 md:grid-cols-[88px_minmax(0,1fr)]">
                <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
                  {(product.gallery?.length ? product.gallery : [product.image]).map(
                    (src, index) => {
                      const isActive = selectedImage === src;

                      return (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          onClick={() => setSelectedImage(src)}
                          className={`overflow-hidden rounded-2xl border-2 transition ${
                            isActive
                              ? "border-[#d88b76] shadow-sm"
                              : "border-[#f0dfd9]"
                          }`}
                        >
                          <Image
                            src={src}
                            alt={`${product.name} preview ${index + 1}`}
                            width={84}
                            height={100}
                            className="h-24 w-20 object-cover"
                            style={{ objectPosition: "center top" }}
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="order-1 overflow-hidden rounded-[28px] border border-[#ecd8d1] bg-gradient-to-b from-[#fff8f5] to-[#f6e5df] md:order-2">
                  <div className="flex items-start justify-between p-4">
                    <div />
                    <button
                      type="button"
                      onClick={() => addToWishlist(product.id, "Saved from product page")}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#c76f5e] shadow-sm transition hover:bg-white"
                    >
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                    <div className="relative overflow-hidden rounded-[24px] bg-[#f8e7e1]">
                      <Image
                        src={selectedImage}
                        alt={product.name}
                        width={900}
                        height={1100}
                        className="h-[420px] w-full object-cover sm:h-[520px]"
                        style={{ objectPosition: "center top" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                  Designer Rental
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-3 max-w-xl text-base text-gray-600">
                  {product.subtitle}. Crafted for standout wedding functions,
                  engagement nights, and modern festive dressing.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#fcf1ed] px-4 py-2 text-[#9e5949]">
                    <Sparkles size={16} />
                    Premium occasionwear
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#fcf1ed] px-4 py-2 text-[#9e5949]">
                    <Truck size={16} />
                    Delivery in 2-3 days
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-[#efe1dc] bg-[#fffaf8] p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-[#b46c5b]">
                        <Store size={16} />
                        <p className="text-sm font-semibold text-gray-900">Partner shop</p>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        {storeName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Listed on subscription with RentNama
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-[#b46c5b]">
                        <MapPin size={16} />
                        <p className="text-sm font-semibold text-gray-900">Visit store offline</p>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        {storeLocation}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Visit the store to inspect the outfit or place an offline order.
                      </p>
                      <button
                        type="button"
                        onClick={scrollToStoreDetails}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fff1ec] px-4 py-2 text-sm font-semibold text-[#b96954] transition hover:bg-[#fde7df]"
                      >
                        View store details
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
                  <div className="flex flex-wrap items-end gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Rental price</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-3xl font-semibold text-gray-900">
                          Rs. {product.price}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          Rs. {product.originalPrice}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#fcf1ed] px-4 py-3 text-sm text-gray-600">
                      Security Deposit:{" "}
                      <span className="font-semibold text-gray-900">
                        Rs. {product.securityDeposit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-gray-800">Select size</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {product.sizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                            selectedSize === size
                              ? "border-[#d88b76] bg-[#fff1ec] text-[#b96954]"
                              : "border-[#e7d2cb] text-gray-700 hover:bg-[#fff8f5]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#efe0db] bg-white/90 p-4">
                    <p className="text-sm font-medium text-gray-800">Rental window</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Choose your preferred rental dates.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label className="text-sm text-gray-700">
                        <span className="mb-2 block font-medium">Start date</span>
                        <input
                          type="date"
                          value={rentalStartDate}
                          onChange={(event) => setRentalStartDate(event.target.value)}
                          className="w-full rounded-2xl border border-[#e5d1cb] px-4 py-3 outline-none focus:border-[#d88b76]"
                        />
                      </label>
                      <label className="text-sm text-gray-700">
                        <span className="mb-2 block font-medium">End date</span>
                        <input
                          type="date"
                          value={rentalEndDate}
                          min={rentalStartDate}
                          onChange={(event) => setRentalEndDate(event.target.value)}
                          className="w-full rounded-2xl border border-[#e5d1cb] px-4 py-3 outline-none focus:border-[#d88b76]"
                        />
                      </label>
                    </div>
                    <p className="mt-3 text-sm text-[#9e5949]">
                      Selected: {selectedRentalDates}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        addToCart(product.id, {
                          size: selectedSize,
                          rentalDates: selectedRentalDates,
                        })
                      }
                      className="rounded-full bg-[#c97762] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b96954]"
                    >
                      Rent Now
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`rounded-full px-6 py-3 text-sm font-medium transition ${
                        cartFeedback
                          ? "border border-[#c97762] bg-[#c97762] text-white"
                          : "border border-[#e4c8c0] bg-white text-gray-700 hover:bg-[#fff6f2]"
                      }`}
                    >
                      {cartFeedback ? "Added" : "Add to Cart"}
                    </button>
                    <button
                      type="button"
                      onClick={() => addToWishlist(product.id, "Saved from product page")}
                      className="rounded-full border border-[#e4c8c0] bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
                    >
                      Wishlist
                    </button>
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#fcf1ed] p-4 text-sm text-gray-600">
                    <ShieldCheck size={18} className="mt-0.5 text-[#b46c5b]" />
                    <p>
                      Every rental is quality-checked before dispatch, and your
                      security deposit is refundable after return inspection. Online
                      rentals earn through platform commission, while offline store
                      visits help you discover the outfit in person.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bc7766]">
                  Product Details
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  Why this piece stands out
                </h2>
                <p className="mt-4 text-sm leading-7 text-gray-700">
                  {product.description}
                </p>
              </section>

              <section className="rounded-3xl border border-[#efe1dc] bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bc7766]">
                  Ratings & Reviews
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  Loved by renters
                </h2>

                <div className="mt-5 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">4.9 overall rating</span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {(product.gallery?.length ? product.gallery : [product.image])
                    .slice(0, 3)
                    .map((src, index) => (
                      <Image
                        key={index}
                        src={src}
                        alt="review image"
                        width={140}
                        height={160}
                        className="h-32 w-full rounded-2xl object-cover"
                        style={{ objectPosition: "center top" }}
                      />
                    ))}
                </div>

                <div className="mt-5 space-y-3">
                  {product.reviewBullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="flex items-start gap-3 rounded-2xl bg-[#fcf1ed] p-3 text-sm text-gray-700"
                    >
                      <span className="mt-0.5 text-[#c97762]">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#efe1dc] pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add a review</h3>
                  <div className="mt-3 flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setRating(star)}
                        className={`h-5 w-5 cursor-pointer ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <textarea
                    placeholder="Share your experience with the fit, fabric, and finish"
                    maxLength={600}
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    className="mt-4 w-full rounded-2xl border border-[#e5d1cb] p-4 text-sm outline-none focus:border-[#d88b76]"
                    rows={5}
                  />
                  <div className="mt-2 text-right text-xs text-gray-500">
                    {review.length}/600
                  </div>
                </div>
              </section>
            </div>

            <section
              id="store-details"
              className="mt-8 rounded-3xl border border-[#efe1dc] bg-[#fffaf8] p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bc7766]">
                Store Details
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Visit this partner boutique offline
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-700">
                RentNama lets customers discover the physical boutique behind the
                outfit. You can visit the store to inspect the garment, check the
                finishing, try styling options, or place an offline order directly.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#efe0db] bg-white p-5">
                  <div className="flex items-center gap-2 text-[#b46c5b]">
                    <Store size={16} />
                    <p className="text-sm font-semibold text-gray-900">Shop name</p>
                  </div>
                  <p className="mt-3 text-base font-medium text-gray-900">
                    {storeName}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Vendor listed on the {product.subscriptionPlan || "Growth"} plan.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#efe0db] bg-white p-5">
                  <div className="flex items-center gap-2 text-[#b46c5b]">
                    <MapPin size={16} />
                    <p className="text-sm font-semibold text-gray-900">Location</p>
                  </div>
                  <p className="mt-3 text-base font-medium text-gray-900">
                    {storeLocation}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Available for both online rentals and offline store visits.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#efe0db] bg-white p-5">
                  <div className="flex items-center gap-2 text-[#b46c5b]">
                    <Phone size={16} />
                    <p className="text-sm font-semibold text-gray-900">Contact</p>
                  </div>
                  <p className="mt-3 text-base font-medium text-gray-900">
                    {storeContact}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Clock3 size={14} />
                    <span>{storeHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#efe0db] bg-white p-5">
                <p className="text-sm font-semibold text-gray-900">
                  Offline order support
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-700">
                  {offlineOrderNote}
                </p>
              </div>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
