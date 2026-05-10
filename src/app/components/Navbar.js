"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Search, Heart, User, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import { useAuthData } from "../../context/authContext";

export default function Navbar() {
  const router = useRouter();
  const { currentUser, profile, logout } = useAuthData();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isVendor = profile?.role === "vendor";
  const accountHref = currentUser
    ? isVendor
      ? "/VendorDashboard"
      : "/Account"
    : "/LoginSign";
  const accountLabel =
    profile?.name ||
    profile?.businessName ||
    currentUser?.displayName ||
    "Login / Signup";

  async function handleLogout() {
    await logout();
    setMobileMenuOpen(false);
    router.push("/");
  }

  function submitSearch(event) {
    event.preventDefault();
    const nextQuery = searchQuery.trim();
    setMobileMenuOpen(false);
    router.push(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
  }

  return (
    <nav className="w-full bg-white shadow-sm px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo - Left side */}
        <div className="flex-shrink-0">
          <Image
            src="/M.png"
            alt="Rentnama Logo"
            width={80}
            height={45}
            className="hidden sm:block"
          />
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end flex-1 min-w-[220px]">
          {/* Top Buttons Row */}
          <div className="hidden sm:flex items-center justify-end space-x-3 mb-2">
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-700 hover:text-black transition"
            >
              Categories
            </Link>

            <Link
              href={accountHref}
              className="text-sm font-medium text-white bg-[#000000]  px-2 py-2 rounded-full"
            >
              {accountLabel}
            </Link>

            <Link
              href="/business"
              className="text-sm font-medium text-white bg-[#000000] px-2 py-2 rounded-full"
            >
              For Business
            </Link>

            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-full border border-[#d7c2ba] bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : null}
          </div>

          {/* Bottom Row - Search & Icons */}
          <div className="flex items-center justify-end w-full space-x-2 sm:space-x-3">
            {/* Search Bar */}
            <form
              onSubmit={submitSearch}
              className="flex min-w-0 flex-1 items-center bg-[#f2ecf6] px-2 py-1 rounded-full w-full sm:w-56 md:w-64"
            >
              <input
                type="text"
                placeholder="Search by product"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="min-w-0 bg-transparent outline-none text-xs sm:text-sm flex-grow"
              />
              <button type="submit" aria-label="Search products">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </form>

            {/* Icons */}
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
              {!isVendor ? (
                <Link href="/Wishlist" aria-label="Wishlist">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-black cursor-pointer" />
                </Link>
              ) : null}
              {!isVendor ? (
                <Link href="/ShoppingCart" aria-label="Shopping cart">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-black cursor-pointer" />
                </Link>
              ) : null}
              <Link
                href={accountHref}
                aria-label={isVendor ? "Vendor dashboard" : "Your account"}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-black cursor-pointer" />
              </Link>
            </div>
                   <button 
    onClick={() => router.push("/LoginSign")}
    className="text-xs font-medium hover:text-gray-600 transition-colors"
  >
    Login
  </button>
  <button 
    onClick={() => router.push("/Signup")}
    className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-all"
  >
    Sign Up
  </button>
</div>

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="sm:hidden p-1 rounded-md border border-gray-300"
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-[24px] border border-[#ead8d1] bg-[#fffaf7] p-4 shadow-sm sm:hidden">
          <div className="grid gap-3">
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl border border-[#ead8d1] bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
            >
              Categories
            </Link>

            <Link
              href="/business"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl border border-[#ead8d1] bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
            >
              For Business
            </Link>

            <Link
              href={accountHref}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl border border-[#ead8d1] bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
            >
              {isVendor ? "Vendor Dashboard" : "Account"}
            </Link>

            {!isVendor ? (
              <Link
                href="/Wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#ead8d1] bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
            ) : null}

            {!isVendor ? (
              <Link
                href="/ShoppingCart"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#ead8d1] bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
              </Link>
            ) : null}

            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ead8d1] bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
