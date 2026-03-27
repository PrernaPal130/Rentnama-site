"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Home,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuthData } from "../../context/authContext";
import { useAppData } from "../../context/myContext";

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function detectBrand(product) {
  const title = `${product.name} ${product.subtitle}`.toLowerCase();
  if (title.includes("manish malhotra")) return "Manish Malhotra";
  if (title.includes("sabyasachi")) return "Sabyasachi";
  if (title.includes("sherwani")) return "Tasva";
  if (title.includes("lehenga")) return "Aapna Closet";
  return product.ownerId ? "Partner Label" : "RentNama Edit";
}

function detectColor(product) {
  const title = `${product.name} ${product.subtitle}`.toLowerCase();
  if (title.includes("red")) return "Red";
  if (title.includes("ivory")) return "Ivory";
  if (title.includes("black")) return "Black";
  if (title.includes("pink")) return "Pink";
  if (title.includes("green")) return "Green";
  if (title.includes("blue")) return "Blue";
  if (title.includes("gold")) return "Gold";
  return "Pastel";
}

function detectShop(product) {
  const brand = detectBrand(product);
  if (brand === "Tasva") return "Tasva Studio";
  if (brand === "Sabyasachi") return "Sabyasachi Rental House";
  if (brand === "Manish Malhotra") return "Manish Malhotra Closet";
  if (brand === "Aapna Closet") return "Aapna Closet";
  return product.ownerId ? "Verified Partner Shop" : "RentNama Studio";
}

function detectLocation(product) {
  const title = `${product.name} ${product.subtitle}`.toLowerCase();
  const shop = detectShop(product);
  if (shop.includes("Sabyasachi")) return "Kolkata";
  if (shop.includes("Tasva")) return "Delhi";
  if (shop.includes("Manish Malhotra")) return "Mumbai";
  if (shop.includes("Aapna Closet")) return "Chandpur";
  if (title.includes("bridal")) return "Jaipur";
  return product.ownerId ? "Bengaluru" : "Delhi";
}

function detectDateBucket(product) {
  const dates = `${product.rentalDates || ""}`.toLowerCase();
  if (dates.includes("mar")) return "This Week";
  if (dates.includes("apr")) return "Next Week";
  if (dates.includes("may") || dates.includes("jun")) return "Wedding Season";
  return "Flexible Dates";
}

function detectRating(product) {
  if ((product.reviewBullets || []).length >= 2) return 4.8;
  return product.ownerId ? 4.6 : 4.5;
}

function detectDeal(product) {
  const original = Number(product.originalPrice || 0);
  const price = Number(product.price || 0);
  if (!original || !price) return "Featured";
  const discountPercent = Math.round(((original - price) / original) * 100);
  if (discountPercent >= 50) return "Big Deal";
  if (discountPercent >= 30) return "All Deals";
  return "Featured";
}

function buildMeta(product) {
  return {
    brand: detectBrand(product),
    shop: detectShop(product),
    location: detectLocation(product),
    color: detectColor(product),
    dateBucket: detectDateBucket(product),
    rating: detectRating(product),
    deal: detectDeal(product),
    sizes: product.sizeOptions || [],
  };
}

const filterSections = [
  { key: "suggested", label: "Suggested Filters" },
  { key: "location", label: "Location" },
  { key: "size", label: "Size" },
  { key: "color", label: "Color" },
  { key: "dates", label: "Rental Dates" },
  { key: "brands", label: "Brands" },
  { key: "price", label: "Price and Deals" },
  { key: "reviews", label: "Reviews" },
  { key: "shops", label: "Shops" },
];

const desktopLinks = ["Women", "Men", "Kids", "Home", "All Brands", "More"];

function ActionLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#2f2a28] transition hover:text-[#b96954]"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function FilterChip({ label, active, onClick, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border font-medium transition ${
        compact ? "px-3.5 py-2 text-xs" : "px-4 py-2.5 text-sm"
      } ${
        active
          ? "border-[#d88b76] bg-[#fff1ec] text-[#b96954]"
          : "border-[#e4c8c0] bg-white text-gray-700 hover:bg-[#fff6f2]"
      }`}
    >
      {label}
    </button>
  );
}

function ProductCard({ product, meta }) {
  return (
    <Link href={`/Product/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-[20px] bg-[#f7ede8]">
        <Image
          src={product.image}
          alt={product.name}
          width={640}
          height={820}
          className="h-[320px] w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-[360px]"
          style={{ objectPosition: "center top" }}
        />
      </div>

      <div className="px-2 pt-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#a46a5f]">
          <span className="rounded-sm border border-[#e5c9c1] bg-[#fff4ef] px-2 py-1">
            {meta.brand}
          </span>
          <span className="rounded-sm border border-[#e5c9c1] bg-[#fff4ef] px-2 py-1">
            {meta.shop}
          </span>
          <span className="rounded-sm border border-[#e5c9c1] bg-[#fff4ef] px-2 py-1">
            {meta.location}
          </span>
        </div>

        <h2 className="mt-3 text-[15px] font-semibold text-[#1f1c1a]">
          {product.name}
        </h2>
        <p className="mt-1 line-clamp-2 text-[14px] text-gray-600">
          {product.subtitle}
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Star size={13} className="fill-current text-[#c97762]" />
            {meta.rating.toFixed(1)}
          </span>
          <span className="text-[#2e8b57]">{meta.deal}</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-[15px] font-semibold text-[#1f1c1a]">
            Rs. {product.price}
          </span>
          <span className="text-sm text-gray-400 line-through">
            Rs. {product.originalPrice}
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Sizes: {product.sizeOptions.join(" • ")}
        </p>
      </div>
    </Link>
  );
}

export default function SearchResultsClient({ initialQuery = "" }) {
  const { products } = useAppData();
  const { currentUser } = useAuthData();
  const [query, setQuery] = useState(initialQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("suggested");
  const [desktopExpanded, setDesktopExpanded] = useState({
    suggested: false,
    location: false,
    size: false,
    color: false,
    dates: false,
    brands: false,
    price: true,
    reviews: false,
    shops: false,
  });
  const [sortBy, setSortBy] = useState("Popularity");
  const [customPrice, setCustomPrice] = useState({ min: "", max: "" });
  const [customDates, setCustomDates] = useState({ from: "", to: "" });
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    size: [],
    color: [],
    dates: [],
    brands: [],
    price: [],
    reviews: [],
    shops: [],
    deals: [],
  });
  const normalizedQuery = normalizeValue(query);

  const productEntries = useMemo(
    () => products.map((product) => ({ product, meta: buildMeta(product) })),
    [products]
  );

  const filterOptions = useMemo(() => {
    const brands = [...new Set(productEntries.map((item) => item.meta.brand))];
    const locations = [...new Set(productEntries.map((item) => item.meta.location))];
    const colors = [...new Set(productEntries.map((item) => item.meta.color))];
    const dates = [...new Set(productEntries.map((item) => item.meta.dateBucket))];
    const shops = [...new Set(productEntries.map((item) => item.meta.shop))];
    const sizes = [...new Set(productEntries.flatMap((item) => item.meta.sizes))];

    return {
      suggested: ["4★ & Up", "All Deals", "Big Deal", "This Week"],
      location: locations,
      size: sizes,
      color: colors,
      dates,
      brands,
      price: ["Under Rs. 5,000", "Rs. 5,000 - Rs. 8,000", "Over Rs. 8,000"],
      reviews: ["4★ & Up", "4.5★ & Up"],
      shops,
    };
  }, [productEntries]);

  function toggleFilter(group, value) {
    setSelectedFilters((current) => {
      const currentValues = current[group] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        [group]: nextValues,
      };
    });
  }

  function matchesPrice(product, selectedPrice) {
    const price = Number(product.price || 0);
    if (selectedPrice === "Under Rs. 5,000") return price < 5000;
    if (selectedPrice === "Rs. 5,000 - Rs. 8,000") return price >= 5000 && price <= 8000;
    if (selectedPrice === "Over Rs. 8,000") return price > 8000;
    return true;
  }

  const results = useMemo(() => {
    const filtered = productEntries.filter(({ product, meta }) => {
      const price = Number(product.price || 0);
      const productDateText = `${product.rentalDates || ""}`.toLowerCase();
      const haystack = [
        product.name,
        product.subtitle,
        product.description,
        meta.brand,
        meta.shop,
        meta.location,
        meta.color,
        ...(product.sizeOptions || []),
      ]
        .join(" ")
        .toLowerCase();

      if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
      if (
        selectedFilters.location.length > 0 &&
        !selectedFilters.location.includes(meta.location)
      ) {
        return false;
      }
      if (
        selectedFilters.size.length > 0 &&
        !selectedFilters.size.some((size) => meta.sizes.includes(size))
      ) {
        return false;
      }
      if (
        selectedFilters.color.length > 0 &&
        !selectedFilters.color.includes(meta.color)
      ) {
        return false;
      }
      if (
        selectedFilters.dates.length > 0 &&
        !selectedFilters.dates.includes(meta.dateBucket)
      ) {
        return false;
      }
      if (
        selectedFilters.brands.length > 0 &&
        !selectedFilters.brands.includes(meta.brand)
      ) {
        return false;
      }
      if (
        selectedFilters.shops.length > 0 &&
        !selectedFilters.shops.includes(meta.shop)
      ) {
        return false;
      }
      if (
        selectedFilters.price.length > 0 &&
        !selectedFilters.price.some((priceOption) => matchesPrice(product, priceOption))
      ) {
        return false;
      }
      if (customPrice.min && price < Number(customPrice.min)) return false;
      if (customPrice.max && price > Number(customPrice.max)) return false;
      if (customDates.from && !productDateText) return false;
      if (customDates.to && !productDateText) return false;
      if (selectedFilters.reviews.includes("4★ & Up") && meta.rating < 4) return false;
      if (selectedFilters.reviews.includes("4.5★ & Up") && meta.rating < 4.5) return false;
      if (
        selectedFilters.deals.length > 0 &&
        !selectedFilters.deals.includes(meta.deal)
      ) {
        return false;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "Price: Low to High") {
        return Number(a.product.price || 0) - Number(b.product.price || 0);
      }
      if (sortBy === "Price: High to Low") {
        return Number(b.product.price || 0) - Number(a.product.price || 0);
      }
      if (sortBy === "Review: High to Low") {
        return b.meta.rating - a.meta.rating;
      }
      if (sortBy === "Review: Low to High") {
        return a.meta.rating - b.meta.rating;
      }
      if (sortBy === "Newest") {
        return String(b.product.id).localeCompare(String(a.product.id));
      }
      return b.meta.rating - a.meta.rating;
    });
  }, [
    customDates.from,
    customDates.to,
    customPrice.max,
    customPrice.min,
    normalizedQuery,
    productEntries,
    selectedFilters,
    sortBy,
  ]);

  const activeFilterCount =
    Object.values(selectedFilters).reduce((sum, values) => sum + values.length, 0) +
    (customPrice.min ? 1 : 0) +
    (customPrice.max ? 1 : 0) +
    (customDates.from ? 1 : 0) +
    (customDates.to ? 1 : 0);

  function resetFilters() {
    setSelectedFilters({
      location: [],
      size: [],
      color: [],
      dates: [],
      brands: [],
      price: [],
      reviews: [],
      shops: [],
      deals: [],
    });
    setCustomPrice({ min: "", max: "" });
    setCustomDates({ from: "", to: "" });
  }

  function renderFilterContent(sectionKey, compact = false) {
    if (sectionKey === "suggested") {
      return (
        <div className="flex flex-wrap gap-2.5">
          {filterOptions.suggested.map((option) => {
            const isReviewOption = option.includes("★");
            const group = isReviewOption
              ? "reviews"
              : option === "This Week"
                ? "dates"
                : "deals";
            return (
              <FilterChip
                key={option}
                label={option}
                compact={compact}
                active={selectedFilters[group].includes(option)}
                onClick={() => toggleFilter(group, option)}
              />
            );
          })}
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-wrap gap-2.5">
          {(filterOptions[sectionKey] || []).map((option) => (
            <FilterChip
              key={option}
              label={option}
              compact={compact}
              active={selectedFilters[sectionKey].includes(option)}
              onClick={() => toggleFilter(sectionKey, option)}
            />
          ))}
        </div>

        {sectionKey === "price" ? (
          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="number"
                min="0"
                value={customPrice.min}
                onChange={(event) =>
                  setCustomPrice((current) => ({
                    ...current,
                    min: event.target.value,
                  }))
                }
                placeholder="Min price"
                className="rounded-xl border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#d88b76]"
              />
              <input
                type="number"
                min="0"
                value={customPrice.max}
                onChange={(event) =>
                  setCustomPrice((current) => ({
                    ...current,
                    max: event.target.value,
                  }))
                }
                placeholder="Max price"
                className="rounded-xl border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#d88b76]"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full bg-[#c97762] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b96954]"
              >
                Apply price
              </button>
            </div>
          </div>
        ) : null}

        {sectionKey === "dates" ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={customDates.from}
              onChange={(event) =>
                setCustomDates((current) => ({
                  ...current,
                  from: event.target.value,
                }))
              }
              className="rounded-xl border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#d88b76]"
            />
            <input
              type="date"
              min={customDates.from || undefined}
              value={customDates.to}
              onChange={(event) =>
                setCustomDates((current) => ({
                  ...current,
                  to: event.target.value,
                }))
              }
              className="rounded-xl border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#d88b76]"
            />
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#ebddd7] bg-[#fffaf7]">
        <div className="mx-auto hidden max-w-[1880px] items-center gap-8 px-10 py-5 xl:flex">
          <Link href="/" className="text-3xl font-black tracking-tight text-[#c97762]">
            RentNama
          </Link>

          <nav className="flex items-center gap-10 text-[15px] font-semibold text-[#221f1d]">
            {desktopLinks.map((item) => (
              <Link key={item} href="/" className="transition hover:text-[#b96954]">
                {item}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-8">
            <div className="flex min-w-[390px] items-center gap-3 rounded-sm border border-[#e3d6cf] bg-[#f7f0ec] px-5 py-3">
              <Search size={20} className="text-[#8d6f66]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search rentals"
                className="w-full bg-transparent text-[15px] text-[#2b2523] outline-none"
              />
            </div>

            <ActionLink href="/Account" icon={<User size={19} />} label="Account" />
            <ActionLink href="/Wishlist" icon={<Heart size={19} />} label="Wishlist" />
            <ActionLink href="/Cart" icon={<ShoppingBag size={19} />} label="Cart" />
          </div>
        </div>

        <div className="xl:hidden">
          <div className="flex items-center gap-3 px-4 py-4">
            <Link
              href="/"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e4c8c0] bg-white text-[#2f2a28]"
              aria-label="Home"
            >
              <Home size={20} />
            </Link>

            <div className="flex flex-1 items-center gap-3 rounded-full border border-[#e4c8c0] bg-white px-4 py-3">
              <Search size={18} className="text-[#b46c5b]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search rentals"
                className="w-full bg-transparent text-sm text-[#2b2523] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#f0e0da] px-4 py-3 text-sm text-[#2f2a28]">
            <div className="flex items-center gap-4">
              <ActionLink
                href="/Account"
                icon={<User size={17} />}
                label={currentUser ? "Account" : "Login"}
              />
              <ActionLink href="/Wishlist" icon={<Heart size={17} />} label="Wishlist" />
              <ActionLink href="/Cart" icon={<ShoppingBag size={17} />} label="Cart" />
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1880px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-baseline gap-3 border-b border-[#efe4de] pb-6">
            <h1 className="text-3xl font-bold lowercase text-[#1f1c1a]">
              {query || "rentals"}
            </h1>
            <span className="text-xl text-[#b8a29a]">•</span>
            <p className="text-xl text-[#7a6a63]">{results.length.toLocaleString()} items</p>
          </div>

          <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2 xl:hidden">
            <FilterChip
              label={activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
              active={isFilterOpen || activeFilterCount > 0}
              onClick={() => setIsFilterOpen(true)}
            />
            <FilterChip
              label="4★ & Up"
              active={selectedFilters.reviews.includes("4★ & Up")}
              onClick={() => toggleFilter("reviews", "4★ & Up")}
            />
            <FilterChip
              label="All Deals"
              active={selectedFilters.deals.includes("All Deals")}
              onClick={() => toggleFilter("deals", "All Deals")}
            />
            <FilterChip
              label="This Week"
              active={selectedFilters.dates.includes("This Week")}
              onClick={() => toggleFilter("dates", "This Week")}
            />
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="hidden xl:block">
              <div className="sticky top-28 rounded-[28px] border border-[#ede2dc] bg-[#fffaf8] p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-semibold text-[#1f1c1a]">Filters</h2>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-md border border-[#ddd0ca] px-4 py-2 text-sm font-medium text-[#a6887e] transition hover:bg-white"
                  >
                    Reset
                  </button>
                </div>

                <div className="mt-5 border-t border-[#ecdfd9]">
                  {filterSections.map((section) => (
                    <div key={section.key} className="border-b border-[#ecdfd9] py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setDesktopExpanded((current) => ({
                            ...current,
                            [section.key]: !current[section.key],
                          }))
                        }
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span
                          className={`text-[16px] ${
                            section.key === "price" ? "text-[#b96954]" : "text-[#2b2523]"
                          }`}
                        >
                          {section.label}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition ${
                            desktopExpanded[section.key] ? "rotate-180" : ""
                          } text-[#2b2523]`}
                        />
                      </button>

                      {desktopExpanded[section.key] ? (
                        <div className="mt-4">{renderFilterContent(section.key, true)}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <section>
              <div className="mb-6 hidden items-center justify-end xl:flex">
                <div className="flex min-w-[370px] items-center justify-between rounded-sm border border-[#ddd0ca] bg-white px-6 py-4">
                  <span className="text-[15px] text-[#6f615b]">
                    Sort by <span className="font-semibold text-[#1f1c1a]">{sortBy}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="bg-transparent text-sm text-transparent outline-none"
                      aria-label="Sort products"
                    >
                      <option>Popularity</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Review: High to Low</option>
                      <option>Review: Low to High</option>
                      <option>Newest</option>
                    </select>
                    <ChevronDown size={20} className="text-[#2b2523]" />
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between xl:hidden">
                <p className="text-sm text-[#6f615b]">{results.length} styles matched</p>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] px-4 py-2 text-sm font-medium text-[#2b2523]"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
              </div>

              {results.length === 0 ? (
                <div className="rounded-[28px] border border-[#efe1dc] bg-[#fffaf8] p-12 text-center text-gray-500">
                  No rentals matched your search yet.
                </div>
              ) : (
                <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                  {results.map(({ product, meta }) => (
                    <ProductCard key={product.id} product={product} meta={meta} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {isFilterOpen ? (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px] xl:hidden">
          <div className="ml-auto h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#efe1dc] px-5 py-4">
              <h2 className="text-2xl font-semibold text-[#1f1c1a]">Filters</h2>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full border border-[#e4c8c0] p-2 text-gray-700 transition hover:bg-[#fff6f2]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid h-[calc(100%-84px)] grid-cols-[138px_minmax(0,1fr)]">
              <aside className="border-r border-[#efe1dc] bg-[#fffaf8]">
                {filterSections.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setActiveSection(section.key)}
                    className={`flex w-full items-center px-4 py-4 text-left text-sm transition ${
                      activeSection === section.key
                        ? "bg-white font-semibold text-[#1f1c1a]"
                        : "text-[#6f615b] hover:bg-[#fff3ee]"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </aside>

              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto px-4 py-5">
                  <h3 className="text-2xl font-semibold text-[#1f1c1a]">
                    {filterSections.find((section) => section.key === activeSection)?.label}
                  </h3>
                  <div className="mt-5">{renderFilterContent(activeSection)}</div>
                </div>

                <div className="border-t border-[#efe1dc] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-sm font-medium text-[#b46c5b]"
                    >
                      Clear all
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="rounded-full bg-[#f4c646] px-5 py-3 text-sm font-semibold text-[#1f1c1a]"
                    >
                      Show {results.length} results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
