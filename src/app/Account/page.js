"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  MapPin,
  Heart,
  CreditCard,
  Ruler,
  Package,
  LogOut,
} from "lucide-react";
import { useAuthData } from "../../context/authContext";

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, profile, logout } = useAuthData();
  const displayName =
    profile?.name || currentUser?.displayName || "Your";

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const accountOptions = [
    {
      title: "Your Orders",
      subtitle: "View and track your orders",
      href: "/YourOrders",
      icon: <Package className="w-8 h-8" />,
    },
    {
      title: "Cart",
      subtitle: "View your cart items",
      href: "/Cart",
      icon: <ShoppingCart className="w-8 h-8" />,
    },
    {
      title: "Wishlist",
      subtitle: "Your saved items",
      href: "/Wishlist",
      icon: <Heart className="w-8 h-8" />,
    },
    {
      title: "Your Address",
      subtitle: "Manage your saved address",
      href: "/YourAddress",
      icon: <MapPin className="w-8 h-8" />,
    },
    {
      title: "Payment Options",
      subtitle: "Manage cards and UPI",
      href: "#",
      icon: <CreditCard className="w-8 h-8" />,
    },
    {
      title: "Your Measurement",
      subtitle: "Save your sizes",
      href: "#",
      icon: <Ruler className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-[#ecd8d1] bg-white shadow-sm">
        <header className="border-b border-[#efe1dc] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c57f6d]">
                {displayName}&apos;s Account
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Welcome back, {displayName}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Access your orders, cart, saved addresses, payment details, and
                measurements in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accountOptions.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-3xl border border-[#efe1dc] bg-gradient-to-r from-white to-[#fff7f3] p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#d88b76] focus:ring-offset-2"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                  {item.icon}
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500">{item.subtitle}</p>
              </Link>
            ))}
          </div>
        </main>

        <footer className="border-t border-[#efe1dc] px-6 py-6 text-center text-sm text-gray-500 sm:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <a href="#" className="hover:text-gray-700">
              Return Policy
            </a>
            <a href="#" className="hover:text-gray-700">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-gray-700">
              Privacy Policy
            </a>
          </div>
          <p>&copy; 2025 YourBrand. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
