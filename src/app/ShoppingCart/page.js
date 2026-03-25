"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { useAppData } from "../../context/myContext";

export default function ShoppingCart() {
  const {
    cart,
    addresses,
    getProductById,
    removeFromCart,
    addToWishlist,
  } = useAppData();

  const cartItems = cart
    .map((item) => {
      const product = getProductById(item.productId);

      if (!product) {
        return null;
      }

      return {
        ...item,
        product,
      };
    })
    .filter(Boolean);

  const defaultAddress =
    addresses.find((address) => address.defaultAddress) || addresses[0];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * (item.quantity || 1),
    0
  );
  const securityDeposit = cartItems.reduce(
    (sum, item) => sum + item.product.securityDeposit,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 249 : 0;
  const discount = cartItems.length >= 2 ? 1000 : 0;
  const total = subtotal + deliveryFee + securityDeposit - discount;

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
                Your Cart
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Review your rental bag
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Double-check sizes, rental dates, and pricing before you move to
                checkout.
              </p>
            </div>
            <div className="rounded-2xl bg-[#fcf1ed] px-4 py-3 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {cartItems.length}
              </span>{" "}
              items in cart
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section>
              <div className="border-b border-[#efe1dc] pb-2 flex justify-between text-sm font-semibold text-gray-700">
                <span>Item</span>
                <span>Price/Rent</span>
              </div>

              <div className="divide-y divide-[#f0e4df] mt-2">
                {cartItems.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    Your cart is empty right now.
                  </div>
                ) : null}

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-5 items-start gap-4"
                  >
                    <div className="flex gap-4">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={112}
                        height={136}
                        className="rounded-2xl object-cover border border-[#efe1dc]"
                        style={{ objectPosition: "center top" }}
                      />
                      <div>
                        <h2 className="font-semibold text-xl text-gray-900">
                          {item.product.name}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 mb-2">
                          {item.product.subtitle}
                        </p>
                        <p className="text-sm text-gray-700 font-medium">
                          Rental dates: {item.rentalDates}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          Size: {item.size}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:underline flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              addToWishlist(
                                item.product.id,
                                "Moved from cart for later"
                              );
                              removeFromCart(item.id);
                            }}
                            className="hover:underline text-pink-500 flex items-center gap-1"
                          >
                            <Heart size={14} /> Wishlist
                          </button>
                          <button className="hover:underline text-gray-600">
                            See more like this
                          </button>
                          <button className="hover:underline text-gray-600 flex items-center gap-1">
                            <Share2 size={14} /> Share
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-semibold text-gray-900 text-lg whitespace-nowrap">
                      Rs. {item.product.price}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="lg:sticky lg:top-6 h-fit rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b46c5b]">
                    Your Order
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-1">
                    Order Summary
                  </h2>
                </div>
                <div className="rounded-full bg-[#f5d7cf] px-3 py-1 text-sm font-medium text-[#9b5848]">
                  {cartItems.length} items
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Rental subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Security deposit</span>
                  <span className="font-medium text-gray-900">
                    Rs. {securityDeposit}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery fee</span>
                  <span className="font-medium text-gray-900">
                    Rs. {deliveryFee}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-green-700">
                  <span>Rental discount</span>
                  <span className="font-medium">- Rs. {discount}</span>
                </div>
                <div className="border-t border-dashed border-[#e7cdc6] pt-3 flex justify-between text-base font-semibold text-gray-900">
                  <span>Total payable</span>
                  <span>Rs. {total}</span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#fcf1ed] p-4 border border-[#f2d8d1]">
                <p className="text-sm font-semibold text-gray-900">
                  Delivery to
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {defaultAddress
                    ? `${defaultAddress.name}, ${defaultAddress.address}`
                    : "No address selected yet."}
                </p>
                <Link
                  href="/YourAddress"
                  className="mt-3 inline-block text-sm font-medium text-[#b46c5b] hover:underline"
                >
                  Change address
                </Link>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#b46c5b]" />
                  <span>Refundable security deposit after return inspection.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#b46c5b]" />
                  <span>Expected delivery within 2-3 working days.</span>
                </div>
              </div>

              <Link
                href="/Checkout"
                className="mt-6 block w-full rounded-full bg-[#c97762] px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-[#b96954]"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
