"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useAppData } from "../../../context/myContext";

const statusConfig = {
  placed: {
    icon: PackageCheck,
    title: "Order placed",
    description: "Your rental order has been received and is being prepared.",
  },
  shipping: {
    icon: Truck,
    title: "On the way",
    description: "Your outfit is packed and moving toward the delivery address.",
  },
  delivered: {
    icon: CheckCircle2,
    title: "Delivered",
    description: "The order has been delivered and your rental window is active.",
  },
  returned: {
    icon: CheckCircle2,
    title: "Returned",
    description: "The item has been returned and the order is now completed.",
  },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const { getOrderById, getProductById } = useAppData();

  const order = getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const product = getProductById(order.productId);

  if (!product) {
    notFound();
  }

  const statusInfo = statusConfig[order.statusType] || statusConfig.placed;
  const StatusIcon = statusInfo.icon;
  const totals = order.totals || {
    subtotal: product.price,
    securityDeposit: product.securityDeposit,
    deliveryFee: 249,
    discount: 0,
    total: product.price + product.securityDeposit + 249,
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/YourOrders"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b] hover:text-[#9e5949]"
        >
          <ArrowLeft size={16} />
          Back to your orders
        </Link>

        <section className="mt-5 rounded-[28px] border border-[#ecd8d1] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                Order Details
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-gray-600">Order ID {order.id}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f8e5df] px-4 py-2 text-sm font-medium text-[#9e5949]">
              <StatusIcon size={16} />
              {order.status}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
                <div className="flex flex-col gap-5 md:flex-row">
                  <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-[#f6e7e1] md:h-80 md:w-64">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: "center 18%" }}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                      Rental Item
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      {product.subtitle}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-gray-700">
                      {product.description}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[#efe0db] bg-white/90 p-4">
                        <div className="flex items-center gap-2 text-[#b46c5b]">
                          <Ruler size={16} />
                          <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                            Size
                          </p>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {order.size || product.defaultSize}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#efe0db] bg-white/90 p-4">
                        <div className="flex items-center gap-2 text-[#b46c5b]">
                          <CalendarDays size={16} />
                          <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                            Rental Dates
                          </p>
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {order.rentalDates}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[#efe1dc] bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                  Delivery & Payment
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  Fulfilment details
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4">
                    <div className="flex items-center gap-2 text-[#b46c5b]">
                      <MapPin size={16} />
                      <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                        Delivery Address
                      </p>
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-900">
                      {order.addressSnapshot?.name || "Not available"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {order.addressSnapshot?.phone || ""}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {order.addressSnapshot?.address || ""}
                    </p>
                    {order.addressSnapshot?.note ? (
                      <p className="mt-2 text-sm text-[#9e5949]">
                        {order.addressSnapshot.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-[#efe0db] bg-[#fffaf8] p-4">
                    <div className="flex items-center gap-2 text-[#b46c5b]">
                      <CreditCard size={16} />
                      <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                        Payment Method
                      </p>
                    </div>
                    <p className="mt-3 text-sm font-medium capitalize text-gray-900">
                      {(order.paymentMethod || "Not available").replaceAll(
                        "-",
                        " "
                      )}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Security deposit note: {order.depositNote}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                  Order Status
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  Current progress
                </h2>

                <div className="mt-5 rounded-2xl border border-[#efe0db] bg-white/90 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                      <StatusIcon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {statusInfo.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {statusInfo.description}
                      </p>
                    </div>
                  </div>
                  {order.orderedOn ? (
                    <p className="mt-4 text-sm text-gray-600">
                      Ordered on {order.orderedOn}
                    </p>
                  ) : null}
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-5 shadow-sm lg:sticky lg:top-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b46c5b]">
                Pricing Summary
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Order total
              </h2>

              <div className="mt-5 space-y-3 rounded-2xl bg-white/90 p-4 border border-[#efe0db]">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Rental subtotal</span>
                  <span className="font-medium text-gray-900">
                    Rs. {totals.subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Security deposit</span>
                  <span className="font-medium text-gray-900">
                    Rs. {totals.securityDeposit}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery fee</span>
                  <span className="font-medium text-gray-900">
                    Rs. {totals.deliveryFee}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-green-700">
                  <span>Rental discount</span>
                  <span className="font-medium">- Rs. {totals.discount}</span>
                </div>
                <div className="border-t border-dashed border-[#e7cdc6] pt-3 flex justify-between text-base font-semibold text-gray-900">
                  <span>Total payable</span>
                  <span>Rs. {totals.total}</span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#fcf1ed] p-4 border border-[#f2d8d1] text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 text-[#b46c5b]" />
                  <span>
                    Your deposit remains refundable after return inspection and
                    successful garment verification.
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
