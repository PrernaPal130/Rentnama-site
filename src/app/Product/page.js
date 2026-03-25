"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { useAppData } from "../../context/myContext";

export default function ProductPage() {
  const { getProductById, addToCart, addToWishlist } = useAppData();
  const product = getProductById("PROD-001");

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedSize, setSelectedSize] = useState(product.defaultSize);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [rentalStartDate, setRentalStartDate] = useState("2026-03-28");
  const [rentalEndDate, setRentalEndDate] = useState("2026-04-02");
  const [cartFeedback, setCartFeedback] = useState(false);

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

  return (
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
                {product.gallery.map((src, index) => {
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
                })}
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

                <div className="mt-5 rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
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
                        onChange={(e) => setRentalStartDate(e.target.value)}
                        className="w-full rounded-2xl border border-[#e5d1cb] px-4 py-3 outline-none focus:border-[#d88b76]"
                      />
                    </label>
                    <label className="text-sm text-gray-700">
                      <span className="mb-2 block font-medium">End date</span>
                      <input
                        type="date"
                        value={rentalEndDate}
                        min={rentalStartDate}
                        onChange={(e) => setRentalEndDate(e.target.value)}
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
                    security deposit is refundable after return inspection.
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

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
                  <p className="text-sm text-gray-500">Fabric</p>
                  <p className="mt-1 font-medium text-gray-900">Net</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
                  <p className="text-sm text-gray-500">Work</p>
                  <p className="mt-1 font-medium text-gray-900">Sequins</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
                  <p className="text-sm text-gray-500">Neck Design</p>
                  <p className="mt-1 font-medium text-gray-900">Sweetheart</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
                  <p className="text-sm text-gray-500">Sleeves</p>
                  <p className="mt-1 font-medium text-gray-900">Sleeveless</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#efe1dc] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bc7766]">
                Ratings & Reviews
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Loved by renters
              </h2>

              <div className="mt-5 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">4.9 overall rating</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {product.gallery.slice(0, 3).map((src, i) => (
                  <Image
                    key={i}
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
                  onChange={(e) => setReview(e.target.value)}
                  className="mt-4 w-full rounded-2xl border border-[#e5d1cb] p-4 text-sm outline-none focus:border-[#d88b76]"
                  rows={5}
                />
                <div className="mt-2 text-right text-xs text-gray-500">
                  {review.length}/600
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
