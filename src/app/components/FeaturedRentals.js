"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useAppData } from "../../context/myContext";

export default function FeaturedRentals() {
  const { products, addToCart, addToWishlist } = useAppData();
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="bg-[#fffaf7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
              Featured Rentals
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900">
              Ready to rent for your next event
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
              Explore standout occasionwear already available on RentNama, with
              rental pricing, deposits, and quick actions right from the home page.
            </p>
          </div>

          <Link
            href="/Product"
            className="inline-flex items-center justify-center rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
          >
            View product page
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[28px] border border-[#efe1dc] bg-gradient-to-b from-white to-[#fff8f4] shadow-sm"
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={720}
                  height={920}
                  className="h-80 w-full object-cover"
                  style={{ objectPosition: "center top" }}
                />
                <button
                  type="button"
                  onClick={() => addToWishlist(product.id, "Saved from homepage")}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#c76f5e] shadow-sm transition hover:bg-white"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#fcf1ed] px-3 py-1 text-xs font-medium text-[#9e5949]">
                    {product.subtitle}
                  </span>
                  <span className="rounded-full bg-[#fcf1ed] px-3 py-1 text-xs font-medium text-[#9e5949]">
                    Deposit Rs. {product.securityDeposit}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {product.description}
                </p>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Rental price</p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-2xl font-semibold text-gray-900">
                        Rs. {product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        Rs. {product.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    Sizes
                    <p className="mt-1 font-medium text-gray-900">
                      {product.sizeOptions.join(" • ")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                  >
                    <ShoppingBag size={16} />
                    Add to cart
                  </button>
                  <Link
                    href="/Product"
                    className="inline-flex items-center rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
