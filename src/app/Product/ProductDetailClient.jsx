"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Clock3,
  ImagePlus,
  MapPin,
  Phone,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
  Video,
} from "lucide-react";
import { useAppData } from "../../context/myContext";
import { useAuthData } from "../../context/authContext";
import { CustomerTopNav } from "../../components/CustomerAreaLayout";
import {
  createProductReview,
  loadProtectedShopDetails,
  loadProductReviews,
  uploadReviewMedia,
  validateVideoClipDuration,
} from "../../lib/firebase";

export default function ProductDetailClient({ productId }) {
  const {
    cart,
    orders,
    viewedStoreShops,
    storeAccessPassActive,
    getProductById,
    addToCart,
    startDirectCheckout,
    addToWishlist,
    removeFromCart,
    requestStoreAccess,
    trackProductView,
  } = useAppData();
  const { currentUser, profile } = useAuthData();
  const router = useRouter();
  const product = getProductById(productId);
  const showCustomerTopNav = !currentUser || profile?.role !== "vendor";

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [reviewPostMessage, setReviewPostMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isPostingReview, setIsPostingReview] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [protectedStoreDetails, setProtectedStoreDetails] = useState(null);
  const [storeDetailsLoading, setStoreDetailsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || "M");
  const [selectedImage, setSelectedImage] = useState(product?.image || "/lengha.jpg");
  const [rentalStartDate, setRentalStartDate] = useState("2026-03-28");
  const [rentalEndDate, setRentalEndDate] = useState("2026-04-02");
  const [cartFeedback, setCartFeedback] = useState("");
  const cartFeedbackTimeoutRef = useRef(null);
  const storeName = product?.shopName || "Apna Closet Signature Studio";
  const storeLocation = product?.storeLocation || "SCO 12-14, Sector 17C, Chandigarh";
  const storeContact = product?.storeContact || "+91 98765 43210";
  const storeHours = product?.storeHours || "11:00 AM - 8:00 PM";
  const offlineOrderNote =
    product?.offlineOrderNote ||
    "Visit the store for fabric inspection, styling help, fittings, and offline order placement.";
  const storeAddress = [
    product?.shopNumber,
    product?.houseNumber,
    product?.landmark,
    product?.street,
    product?.sector,
    product?.city,
    product?.district,
    product?.state,
    product?.pincode,
  ]
    .filter(Boolean)
    .join(", ") || storeLocation;
  const hasOrderedProduct = orders.some((order) => order.productId === product?.id);
  const shopAccessKey =
    product?.shopAccessKey || product?.ownerId || product?.shopName || product?.id;
  const hasStoreAccess =
    storeAccessPassActive || viewedStoreShops.includes(shopAccessKey);
  const freeStoreViewsRemaining = Math.max(0, 5 - viewedStoreShops.length);
  const [storeAccessError, setStoreAccessError] = useState("");
  const fallbackProtectedDetails = {
    shopName: storeName,
    storeLocation,
    shopNumber: product?.shopNumber || "",
    houseNumber: product?.houseNumber || "",
    landmark: product?.landmark || "",
    street: product?.street || "",
    sector: product?.sector || "",
    city: product?.city || "",
    district: product?.district || "",
    state: product?.state || "",
    pincode: product?.pincode || "",
    storeContact,
    storeHours,
    offlineOrderNote,
  };
  const visibleStoreDetails = protectedStoreDetails || fallbackProtectedDetails;
  const visibleStoreAddress = [
    visibleStoreDetails.shopNumber,
    visibleStoreDetails.houseNumber,
    visibleStoreDetails.landmark,
    visibleStoreDetails.street,
    visibleStoreDetails.sector,
    visibleStoreDetails.city,
    visibleStoreDetails.district,
    visibleStoreDetails.state,
    visibleStoreDetails.pincode,
  ]
    .filter(Boolean)
    .join(", ") || visibleStoreDetails.storeLocation || storeLocation;

  useEffect(() => {
    if (!product?.id) {
      return;
    }

    trackProductView(product.id);
  }, [product?.id]);

  useEffect(() => {
    async function hydrateReviews() {
      if (!product?.id) {
        setProductReviews([]);
        setReviewsLoading(false);
        return;
      }

      try {
        setReviewsLoading(true);
        const nextReviews = await loadProductReviews(product.id);
        setProductReviews(nextReviews);
      } finally {
        setReviewsLoading(false);
      }
    }

    hydrateReviews();
  }, [product?.id]);

  useEffect(() => {
    return () => {
      if (cartFeedbackTimeoutRef.current) {
        window.clearTimeout(cartFeedbackTimeoutRef.current);
      }
    };
  }, []);

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
  const cartItemsForProduct = cart.filter((item) => item.productId === product.id);
  const isInCart = cartItemsForProduct.length > 0;

  function showCartMessage(status) {
    setCartFeedback(status);

    if (cartFeedbackTimeoutRef.current) {
      window.clearTimeout(cartFeedbackTimeoutRef.current);
    }

    cartFeedbackTimeoutRef.current = window.setTimeout(() => {
      setCartFeedback("");
    }, 1600);
  }

  function handleCartAction() {
    if (isInCart) {
      cartItemsForProduct.forEach((item) => removeFromCart(item.id));
      showCartMessage("removed");
      return;
    }

    addToCart(product.id, {
      size: selectedSize,
      rentalDates: selectedRentalDates,
    });
    showCartMessage("added");
  }

  function scrollToStoreDetails() {
    const section = document.getElementById("store-details");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function revealProtectedStoreDetails() {
    if (protectedStoreDetails || !shopAccessKey) {
      scrollToStoreDetails();
      return;
    }

    try {
      setStoreDetailsLoading(true);
      const remoteDetails = await loadProtectedShopDetails(shopAccessKey);
      setProtectedStoreDetails(remoteDetails || fallbackProtectedDetails);
    } finally {
      setStoreDetailsLoading(false);
      scrollToStoreDetails();
    }
  }

  function handleViewStoreDetails() {
    setStoreAccessError("");

    if (!currentUser || profile?.role !== "customer") {
      router.push(`/LoginSign?redirect=${encodeURIComponent(`/Product/${product.id}`)}`);
      return;
    }

    if (hasStoreAccess) {
      revealProtectedStoreDetails();
      return;
    }

    const result = requestStoreAccess(shopAccessKey);

    if (result.allowed) {
      revealProtectedStoreDetails();
      return;
    }

    router.push(
      `/StoreAccessUpgrade?shop=${encodeURIComponent(
        storeName
      )}&productId=${encodeURIComponent(product.id)}`
    );
  }

  async function handleReviewMediaChange(type, event) {
    const file = event.target.files?.[0] || null;
    setReviewPostMessage("");
    setReviewError("");

    if (type === "image") {
      setSelectedImageFile(file);
      return;
    }

    if (!file) {
      setSelectedVideoFile(null);
      return;
    }

    try {
      await validateVideoClipDuration(file, 30);
      setSelectedVideoFile(file);
    } catch (error) {
      setSelectedVideoFile(null);
      setReviewError(
        error instanceof Error
          ? error.message
          : "Please choose a clip up to 30 seconds."
      );
    }
  }

  async function handlePostReview() {
    if (!review.trim() && !selectedImageFile && !selectedVideoFile) {
      return;
    }

    if (!currentUser || profile?.role !== "customer") {
      setReviewError("Log in as a customer to post a review.");
      return;
    }

    if (!hasOrderedProduct) {
      setReviewError(
        "Only customers who have rented this outfit before can post a review."
      );
      return;
    }

    try {
      setIsPostingReview(true);
      setReviewError("");
      setReviewPostMessage("");

      const [imageUrl, videoUrl] = await Promise.all([
        selectedImageFile
          ? uploadReviewMedia(product.id, currentUser.uid, selectedImageFile, "image")
          : Promise.resolve(null),
        selectedVideoFile
          ? uploadReviewMedia(product.id, currentUser.uid, selectedVideoFile, "video")
          : Promise.resolve(null),
      ]);

      const nextReview = await createProductReview({
        productId: product.id,
        userId: currentUser.uid,
        userName:
          profile?.name || currentUser.displayName || "RentNama Customer",
        rating,
        comment: review.trim(),
        imageUrls: imageUrl ? [imageUrl] : [],
        videoUrls: videoUrl ? [videoUrl] : [],
        verifiedRental: true,
      });

      setProductReviews((current) => [nextReview, ...current]);
      setReview("");
      setRating(0);
      setSelectedImageFile(null);
      setSelectedVideoFile(null);
      setReviewPostMessage("Your review has been posted successfully.");
    } catch (postError) {
      setReviewError(
        postError instanceof Error
          ? postError.message
          : "We could not post the review right now."
      );
    } finally {
      setIsPostingReview(false);
    }
  }

  function handleRentNow() {
    const directItem = startDirectCheckout(product.id, {
      size: selectedSize,
      rentalDates: selectedRentalDates,
    });

    if (!directItem) {
      return;
    }

    router.push("/Checkout?mode=direct");
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

                    {product.clipUrl ? (
                      <div className="mt-4 rounded-[24px] border border-[#ecd8d1] bg-white p-3 shadow-sm">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <PlayCircle size={16} className="text-[#b46c5b]" />
                          Short style clip
                        </div>
                        <video
                          src={product.clipUrl}
                          controls
                          className="h-60 w-full rounded-[20px] object-cover"
                        />
                      </div>
                    ) : null}
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
                        {hasStoreAccess
                          ? storeLocation
                          : "Store address is hidden until you unlock store details."}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {storeAccessPassActive
                          ? "Your store access pass is active for unlimited details."
                          : hasStoreAccess
                          ? "Visit the store to inspect the outfit or place an offline order."
                          : `${freeStoreViewsRemaining} free shop detail views left.`}
                      </p>
                      <button
                        type="button"
                        onClick={handleViewStoreDetails}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fff1ec] px-4 py-2 text-sm font-semibold text-[#b96954] transition hover:bg-[#fde7df]"
                      >
                        {storeDetailsLoading ? "Opening..." : "View store details"}
                        <ArrowRight size={15} />
                      </button>
                      {!storeAccessPassActive && !hasStoreAccess ? (
                        <Link
                          href="/StoreAccessUpgrade"
                          className="mt-3 inline-flex text-xs font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
                        >
                          Get more store access
                        </Link>
                      ) : null}
                      {storeAccessError ? (
                        <p className="mt-3 text-xs text-[#9e5949]">{storeAccessError}</p>
                      ) : null}
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
                      onClick={handleRentNow}
                      className="rounded-full bg-[#c97762] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#b96954]"
                    >
                      Rent Now
                    </button>
                    <button
                      type="button"
                      onClick={handleCartAction}
                      className={`rounded-full px-6 py-3 text-sm font-medium transition ${
                        cartFeedback === "added"
                          ? "border border-[#c97762] bg-[#c97762] text-white"
                          : cartFeedback === "removed"
                          ? "border border-[#b85c50] bg-[#fff1ee] text-[#b85c50]"
                          : isInCart
                          ? "border border-[#b85c50] bg-[#fff4f1] text-[#b85c50] hover:bg-[#ffe9e4]"
                          : "border border-[#e4c8c0] bg-white text-gray-700 hover:bg-[#fff6f2]"
                      }`}
                    >
                      {cartFeedback === "added"
                        ? "Added"
                        : cartFeedback === "removed"
                        ? "Removed"
                        : isInCart
                        ? "Remove from Cart"
                        : "Add to Cart"}
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

                  {reviewsLoading ? (
                    <div className="rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm">
                      Loading customer reviews...
                    </div>
                  ) : null}

                  {!reviewsLoading && productReviews.length === 0 ? (
                    <div className="rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm">
                      No customer reviews yet. Be the first to post one.
                    </div>
                  ) : null}

                  {productReviews.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-[#efe0db] bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold text-gray-900">
                          {item.userName || "RentNama Customer"}
                        </p>
                        {item.verifiedRental ? (
                          <span className="rounded-full bg-[#eef8ee] px-3 py-1 text-xs font-semibold text-[#4e7a46]">
                            Verified rental
                          </span>
                        ) : null}
                        <span className="text-xs text-gray-500">
                          {item.createdAt?.toDate?.()
                            ? item.createdAt.toDate().toLocaleDateString("en-IN")
                            : item.createdAt instanceof Date
                            ? item.createdAt.toLocaleDateString("en-IN")
                            : "Just now"}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={`${item.id}-${star}`}
                            className={`h-4 w-4 ${
                              star <= (item.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {item.comment ? (
                        <p className="mt-3 text-sm leading-7 text-gray-700">
                          {item.comment}
                        </p>
                      ) : null}

                      {item.imageUrls?.length ? (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {item.imageUrls.map((url) => (
                            <Image
                              key={url}
                              src={url}
                              alt="Customer review upload"
                              width={160}
                              height={160}
                              className="h-32 w-full rounded-2xl object-cover"
                            />
                          ))}
                        </div>
                      ) : null}

                      {item.videoUrls?.length ? (
                        <div className="mt-4 space-y-3">
                          {item.videoUrls.map((url) => (
                            <div
                              key={url}
                              className="overflow-hidden rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-3"
                            >
                              <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#9e5949]">
                                <PlayCircle size={16} />
                                Customer clip
                              </div>
                              <video
                                src={url}
                                controls
                                className="h-64 w-full rounded-2xl object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#efe1dc] pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add a review</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {hasOrderedProduct
                      ? "You have rented this outfit before, so you can post a verified review."
                      : "Only customers who have already rented this outfit can post a review."}
                  </p>
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
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]">
                      <ImagePlus size={16} className="text-[#b96954]" />
                      Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleReviewMediaChange("image", event)}
                        className="hidden"
                      />
                    </label>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]">
                      <Video size={16} className="text-[#b96954]" />
                      Video
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(event) => handleReviewMediaChange("video", event)}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handlePostReview}
                      disabled={
                        isPostingReview ||
                        !hasOrderedProduct ||
                        (!review.trim() && !selectedImageFile && !selectedVideoFile)
                      }
                      className="rounded-full bg-[#c97762] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b96954] disabled:cursor-not-allowed disabled:bg-[#dfb5aa]"
                    >
                      {isPostingReview ? "Posting..." : "Post"}
                    </button>
                  </div>

                  {selectedImageFile || selectedVideoFile ? (
                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                      {selectedImageFile ? <p>Image selected: {selectedImageFile.name}</p> : null}
                      {selectedVideoFile ? (
                        <p>Clip selected: {selectedVideoFile.name} (max 30 sec)</p>
                      ) : null}
                    </div>
                  ) : null}

                  {reviewError ? (
                    <p className="mt-3 rounded-2xl border border-[#efd6ce] bg-[#fff6f2] px-4 py-3 text-sm text-[#9e5949]">
                      {reviewError}
                    </p>
                  ) : null}

                  {reviewPostMessage ? (
                    <p className="mt-3 rounded-2xl border border-[#d9e7d8] bg-[#f5fbf4] px-4 py-3 text-sm text-[#4e7a46]">
                      {reviewPostMessage}
                    </p>
                  ) : null}
                </div>
              </section>
            </div>

            {hasStoreAccess ? (
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
                      {visibleStoreDetails.shopName}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Vendor listed on the {product.subscriptionPlan || "Growth"} plan.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#efe0db] bg-white p-5">
                    <div className="flex items-center gap-2 text-[#b46c5b]">
                      <MapPin size={16} />
                      <p className="text-sm font-semibold text-gray-900">Full address</p>
                    </div>
                    <p className="mt-3 text-base font-medium text-gray-900">
                      {visibleStoreAddress}
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
                      {visibleStoreDetails.storeContact}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <Clock3 size={14} />
                      <span>{visibleStoreDetails.storeHours}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#efe0db] bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900">
                    Offline order support
                  </p>
                  <p className="mt-2 text-sm leading-7 text-gray-700">
                    {visibleStoreDetails.offlineOrderNote}
                  </p>
                </div>
              </section>
            ) : null}
          </section>
        </div>
      </main>
    </>
  );
}
