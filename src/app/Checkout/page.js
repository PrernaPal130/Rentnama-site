"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
  Wallet,
} from "lucide-react";
import { useAppData } from "../../context/myContext";

export default function CheckoutPage() {
  const {
    cart,
    addresses,
    getProductById,
    placeOrder,
    removeFromCart,
    updateCartItem,
  } =
    useAppData();
  const router = useRouter();

  const cartItems = cart
    .map((item) => {
      const product = getProductById(item.productId);

      if (!product) {
        return null;
      }

      return { ...item, product };
    })
    .filter(Boolean);

  const initialAddressId =
    addresses.find((address) => address.defaultAddress)?.id || addresses[0]?.id || "";
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddressId);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paytm");

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId
  );

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
  const total = subtotal + securityDeposit + deliveryFee - discount;

  function handlePlaceOrder() {
    if (!selectedAddressId || cartItems.length === 0) {
      return;
    }

    placeOrder({
      addressId: selectedAddressId,
      paymentMethod: selectedPaymentMethod,
      totals: {
        subtotal,
        securityDeposit,
        deliveryFee,
        discount,
        total,
      },
    });

    router.push("/YourOrders");
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/Cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to cart
        </Link>

        <section className="mt-5 rounded-[28px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                Checkout
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Confirm your rental order
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Review your outfit selections, delivery address, and payment
                summary before placing the order.
              </p>
            </div>
            <div className="rounded-2xl bg-[#fcf1ed] px-4 py-3 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {cartItems.length}
              </span>{" "}
              items ready
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                      Delivery Address
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Choose the address for this order
                    </h2>
                  </div>
                </div>

                <div className="mt-5 max-h-80 space-y-3 overflow-y-auto pr-1">
                  {addresses.length === 0 ? (
                    <div className="rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
                      <p className="text-sm text-gray-600">
                        No saved address found. Add one before placing an order.
                      </p>
                      <Link
                        href="/YourAddress"
                        className="mt-3 inline-block text-sm font-medium text-[#b46c5b] hover:underline"
                      >
                        Add address
                      </Link>
                    </div>
                  ) : null}

                  {addresses.map((address) => {
                    const isSelected = address.id === selectedAddressId;

                    return (
                      <label
                        key={address.id}
                        className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${
                          isSelected
                            ? "border-[#d88b76] bg-[#fff4ef]"
                            : "border-[#efe0db] bg-white/90"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 h-4 w-4 border-[#d5b7af] text-[#c97762] focus:ring-[#d88b76]"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {address.name}
                            </p>
                            <span className="rounded-full bg-[#f5d7cf] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9b5848]">
                              {address.label}
                            </span>
                            {address.defaultAddress ? (
                              <span className="text-xs font-medium text-[#b46c5b]">
                                Default
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            {address.phone}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {address.address}
                          </p>
                          {address.note ? (
                            <p className="mt-2 text-sm text-[#9e5949]">
                              {address.note}
                            </p>
                          ) : null}
                        </div>
                      </label>
                    );
                  })}
                </div>

                <Link
                  href="/YourAddress"
                  className="mt-4 inline-block text-sm font-medium text-[#b46c5b] hover:underline"
                >
                  Manage addresses
                </Link>
              </section>

              <section className="rounded-3xl border border-[#efe1dc] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                      Order Items
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">
                      What you are renting
                    </h2>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      Your cart is empty right now.
                    </p>
                  ) : null}

                  {cartItems.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={96}
                        height={120}
                        className="rounded-2xl object-cover"
                        style={{ objectPosition: "center top" }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {item.product.subtitle}
                        </p>
                        <p className="mt-3 text-sm text-gray-700">
                          Rental dates: {item.rentalDates}
                        </p>
                        <div className="mt-3 rounded-2xl bg-white/90 p-3 border border-[#efe0db]">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bc7766]">
                            Selected Size
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {item.size}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.product.sizeOptions.map((sizeOption) => (
                              <button
                                key={sizeOption}
                                type="button"
                                onClick={() =>
                                  updateCartItem(item.id, { size: sizeOption })
                                }
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                  item.size === sizeOption
                                    ? "border-[#d88b76] bg-[#fff1ec] text-[#b96954]"
                                    : "border-[#e4c8c0] bg-white text-gray-700 hover:bg-[#fff6f2]"
                                }`}
                              >
                                {sizeOption}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#b85c50] hover:underline"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                      <div className="text-right text-base font-semibold text-gray-900">
                        Rs. {item.product.price}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                      Payment
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">
                    Payment method
                    </h2>
                  </div>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                      Recommended
                    </p>
                    <div className="mt-3 overflow-hidden rounded-3xl border border-[#ead6cf] bg-white">
                      <label className="flex cursor-pointer items-start gap-4 border-b border-[#f0e2dc] bg-[#fff7f2] p-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedPaymentMethod === "paytm"}
                          onChange={() => setSelectedPaymentMethod("paytm")}
                          className="mt-1 h-4 w-4 border-[#d5b7af] text-[#c97762] focus:ring-[#d88b76]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="inline-flex rounded-lg bg-[#f7b06f] px-3 py-1 text-xs font-semibold text-[#61340b]">
                            Previously used
                          </div>
                          <p className="mt-2 text-2xl font-semibold text-gray-900">
                            Paytm
                          </p>
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#0b74c8] shadow-sm">
                          Paytm
                        </div>
                      </label>

                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                      UPI
                    </p>
                    <div className="mt-3 overflow-hidden rounded-3xl border border-[#ead6cf] bg-white">
                      <label className="flex cursor-pointer items-start gap-4 p-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedPaymentMethod === "upi-app"}
                          onChange={() => setSelectedPaymentMethod("upi-app")}
                          className="mt-1 h-4 w-4 border-[#d5b7af] text-[#c97762] focus:ring-[#d88b76]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xl font-medium text-gray-900">
                            Pay by any UPI App
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            Google Pay, PhonePe, Paytm and more
                          </p>
                        </div>
                        <div className="rounded-xl bg-[#f6f0ed] px-3 py-2 text-xs font-semibold text-gray-700">
                          UPI
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                      Credit & Debit Cards
                    </p>
                    <div className="mt-3 overflow-hidden rounded-3xl border border-[#ead6cf] bg-white">
                      <label className="flex cursor-pointer items-start gap-4 border-b border-[#f0e2dc] p-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedPaymentMethod === "visa"}
                          onChange={() => setSelectedPaymentMethod("visa")}
                          className="mt-1 h-4 w-4 border-[#d5b7af] text-[#c97762] focus:ring-[#d88b76]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xl font-medium text-gray-900">
                            Visa
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            VISA ••••2785 | Himanshu Pal
                          </p>
                        </div>
                        <CreditCard size={20} className="mt-1 text-gray-500" />
                      </label>

                      <button
                        type="button"
                        className="flex w-full items-center gap-3 p-4 text-left text-[#156f8e] hover:bg-[#fff8f5]"
                      >
                        <Plus size={20} />
                        <span className="text-lg font-medium">
                          Add a new credit or debit card
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                      More Ways to Pay
                    </p>
                    <div className="mt-3 overflow-hidden rounded-3xl border border-[#ead6cf] bg-white">
                      <label className="flex cursor-pointer items-start gap-4 border-b border-[#f0e2dc] p-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedPaymentMethod === "pay-later"}
                          onChange={() => setSelectedPaymentMethod("pay-later")}
                          className="mt-1 h-4 w-4 border-[#d5b7af] text-[#c97762] focus:ring-[#d88b76]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xl font-medium text-gray-900">
                            Pay Later
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            Get instant credit up to Rs 60,000. Check eligibility
                            and apply now.
                          </p>
                        </div>
                        <Wallet size={20} className="mt-1 text-gray-500" />
                      </label>

                      <label className="flex cursor-pointer items-start gap-4 p-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedPaymentMethod === "emi"}
                          onChange={() => setSelectedPaymentMethod("emi")}
                          className="mt-1 h-4 w-4 border-[#d5b7af] text-[#c97762] focus:ring-[#d88b76]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xl font-medium text-gray-400">
                            EMI
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Unavailable for this payment right now.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm lg:sticky lg:top-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b46c5b]">
                Final Summary
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Your total
              </h2>

              <div className="mt-5 space-y-3 rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
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
                  Selected delivery address
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {selectedAddress
                    ? `${selectedAddress.name}, ${selectedAddress.address}`
                    : "Please select an address for this order."}
                </p>
              </div>

              <div className="mt-4 space-y-3 rounded-2xl bg-[#fcf1ed] p-4 border border-[#f2d8d1] text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 text-[#b46c5b]" />
                  <span>All outfits are quality checked before dispatch.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-[#b46c5b]" />
                  <span>Easy return pickup after your rental period ends.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || cartItems.length === 0}
                className="mt-6 w-full rounded-full bg-[#c97762] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#b96954] disabled:cursor-not-allowed disabled:bg-[#dfb5aa]"
              >
                Place Order
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Your selected address and payment method will be saved with this order.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
