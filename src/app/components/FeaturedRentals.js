"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppData } from "../../context/myContext";

export default function FeaturedRentals() {
  const { products } = useAppData();
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="bg-[#fffaf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-[#ecd8d1] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
              Featured Rentals
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
              Browse what&apos;s trending right now
            </h2>
          </div>

          <Link
            href="/Product"
            className="shrink-0 text-sm font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
          >
            More
          </Link>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/Product/${product.id}`}
              className="min-w-[250px] max-w-[250px] overflow-hidden rounded-[24px] border border-[#efe1dc] bg-gradient-to-b from-white to-[#fff8f4] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={720}
                height={920}
                className="h-56 w-full object-cover"
                style={{ objectPosition: "center top" }}
              />

              <div className="p-4">
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full bg-[#fcf1ed] px-2.5 py-1 font-medium text-[#9e5949]">
                    {product.subtitle}
                  </span>
                  <span className="rounded-full bg-[#fcf1ed] px-2.5 py-1 font-medium text-[#9e5949]">
                    Deposit Rs. {product.securityDeposit}
                  </span>
                </div>

                <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                  {product.description}
                </p>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Rental price</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xl font-semibold text-gray-900">
                        Rs. {product.price}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        Rs. {product.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-500">
                    Sizes
                    <p className="mt-1 line-clamp-2 font-medium text-gray-900">
                      {product.sizeOptions.join(" • ")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
