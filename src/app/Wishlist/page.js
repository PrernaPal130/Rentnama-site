"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useAppData } from "../../context/myContext";

export default function WishlistPage() {
  const { wishlist, getProductById, moveWishlistToCart, removeFromWishlist } =
    useAppData();

  const wishlistItems = wishlist
    .map((item) => ({
      ...item,
      product: getProductById(item.productId),
    }))
    .filter((item) => item.product);

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/Account"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to your account
        </Link>

        <section className="mt-5 rounded-[28px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                Wishlist
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Pieces you want to rent later
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Keep your favorite outfits in one place and move them to cart
                whenever you are ready.
              </p>
            </div>
            <div className="rounded-2xl bg-[#fcf1ed] px-4 py-3 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {wishlistItems.length}
              </span>{" "}
              saved styles
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {wishlistItems.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-4 shadow-sm"
              >
                <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-[#f6e7e1]">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    style={{ objectPosition: "center top" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#c76f5e] shadow-sm"
                  >
                    <Heart size={18} className="fill-current" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bc7766]">
                    Saved item {item.id}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">
                    {item.product.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.product.subtitle}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-gray-900">
                    Rs. {item.product.price}
                  </p>

                  <div className="mt-3 flex items-start gap-2 rounded-2xl bg-[#fcf1ed] px-3 py-2 text-sm text-gray-600">
                    <Sparkles size={16} className="mt-0.5 text-[#b46c5b]" />
                    <span>{item.note}</span>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => moveWishlistToCart(item.id)}
                      className="flex-1 rounded-full bg-[#c97762] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b96954]"
                    >
                      Move to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex items-center justify-center rounded-full border border-[#e4c8c0] px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#fff6f2]"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
