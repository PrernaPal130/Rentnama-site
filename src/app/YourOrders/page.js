"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, PackageCheck, Truck, RotateCcw } from "lucide-react";
import { useAppData } from "../../context/myContext";

const statusIcons = {
  placed: PackageCheck,
  shipping: Truck,
  returned: RotateCcw,
  delivered: PackageCheck,
};

export default function YourOrdersPage() {
  const { orders, getProductById } = useAppData();

  const orderItems = orders
    .map((order) => ({
      ...order,
      product: getProductById(order.productId),
    }))
    .filter((order) => order.product);

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
                Your Orders
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Track every rental in one place
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Check delivery status, upcoming rental dates, and returns for
                your current and past orders.
              </p>
            </div>
            <div className="rounded-2xl bg-[#fcf1ed] px-4 py-3 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {orderItems.length}
              </span>{" "}
              active and recent orders
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {orderItems.map((order) => {
              const StatusIcon = statusIcons[order.statusType] || PackageCheck;

              return (
                <Link
                  key={order.id}
                  href={`/YourOrders/${order.id}`}
                  className="block rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex gap-4">
                      <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-[#f6e7e1] sm:h-32 sm:w-28">
                        <Image
                          src={order.product.image}
                          alt={order.product.name}
                          fill
                          className="object-cover"
                          style={{ objectPosition: "center 18%" }}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bc7766]">
                          Order ID {order.id}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-gray-900">
                          {order.product.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          {order.product.subtitle}
                        </p>
                        <p className="mt-3 text-sm font-medium text-gray-800">
                          Rental dates: {order.rentalDates}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f8e5df] px-3 py-1 text-sm font-medium text-[#9e5949]">
                          <StatusIcon size={16} />
                          {order.status}
                        </div>
                      </div>
                    </div>

                    <div className="xl:min-w-[280px] xl:text-right">
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-800">
                            Ordered on:
                          </span>{" "}
                          {order.orderedOn || "Not available"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-800">
                            Delivery:
                          </span>{" "}
                          {order.addressSnapshot?.name || "Not available"}
                        </p>
                        <p className="line-clamp-2">
                          <span className="font-medium text-gray-800">
                            Address:
                          </span>{" "}
                          {order.addressSnapshot?.address || "Not available"}
                        </p>
                        <p className="capitalize">
                          <span className="font-medium text-gray-800">
                            Payment:
                          </span>{" "}
                          {(order.paymentMethod || "not available").replaceAll(
                            "-",
                            " "
                          )}
                        </p>
                      </div>

                      <p className="mt-4 text-sm text-gray-500">Total rent</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        Rs. {order.totals?.subtotal || order.product.price}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {order.depositNote || "Refundable security deposit"}
                      </p>
                      <div className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#c97762] px-5 py-2.5 text-sm font-semibold leading-none text-white transition-colors hover:bg-[#b96954]">
                        View details
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
