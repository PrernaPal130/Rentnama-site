"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, ShoppingBag, User } from "lucide-react";
import { CustomerGuard } from "./AuthGuard";
import { useAuthData } from "../context/authContext";

function NavIconLink({ href, label, icon, active }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
        active
          ? "border-[#d88b76] bg-[#fff1ec] text-[#b96954]"
          : "border-[#e4c8c0] bg-white text-gray-700 hover:bg-[#fff6f2]"
      }`}
    >
      {icon}
    </Link>
  );
}

export function CustomerTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, currentUser, logout } = useAuthData();
  const displayName = profile?.name || currentUser?.displayName || "Account";

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="sticky top-0 z-30 border-b border-[#efe1dc] bg-[#fffaf7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b86f5f]"
          >
            RentNama
          </Link>
          <p className="mt-1 text-sm text-gray-600">
            {currentUser ? `Welcome back, ${displayName}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <NavIconLink
            href="/Wishlist"
            label="Wishlist"
            icon={<Heart size={18} />}
            active={pathname?.startsWith("/Wishlist")}
          />
          <NavIconLink
            href="/Cart"
            label="Cart"
            icon={<ShoppingBag size={18} />}
            active={
              pathname?.startsWith("/Cart") ||
              pathname?.startsWith("/ShoppingCart")
            }
          />
          <NavIconLink
            href="/Account"
            label="Account"
            icon={<User size={18} />}
            active={pathname?.startsWith("/Account")}
          />
          {currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CustomerAreaLayout({ children }) {
  return (
    <CustomerGuard>
      <CustomerTopNav />
      {children}
    </CustomerGuard>
  );
}
