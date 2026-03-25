"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Store, UserRound } from "lucide-react";
import { useAuthData } from "../../context/authContext";

function LoginSignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firebaseReady, loginCustomer } = useAuthData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signupSuccess = searchParams.get("signup") === "success";
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!firebaseReady) {
      setError("Firebase is not configured yet. Add your env values first.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await loginCustomer({ email, password });
      router.push(redirectTo);
    } catch (loginError) {
      setError(loginError.message || "Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f4_0%,#f7ebe5_52%,#fffdfb_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-[#ecd7ce] bg-[radial-gradient(circle_at_top_left,#f6d1c5_0%,#f4e2da_36%,#fff8f5_100%)] p-8 shadow-[0_18px_60px_rgba(177,122,102,0.12)] sm:p-10">
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/35 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#e7b7a8]/25 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b86f5f]">
              RentNama
            </p>
            <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-[#2f2622] sm:text-5xl">
              Dress for the moment, not just the purchase.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5f524c]">
              Sign in to manage rentals, track orders, update your wishlist, and
              keep every celebration look organized in one place.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e6df] text-[#b86f5f]">
                  <UserRound size={20} />
                </div>
                <p className="mt-4 text-lg font-semibold text-[#2f2622]">
                  Customer access
                </p>
                <p className="mt-2 text-sm leading-6 text-[#625650]">
                  View saved looks, checkout faster, and track every rental from
                  one account.
                </p>
              </div>

              <Link
                href="/VendorLogin"
                className="group rounded-[28px] border border-[#e7c7bc] bg-[#fffaf7] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e6df] text-[#b86f5f]">
                  <Store size={20} />
                </div>
                <p className="mt-4 text-lg font-semibold text-[#2f2622]">
                  Vendor login
                </p>
                <p className="mt-2 text-sm leading-6 text-[#625650]">
                  Manage your catalog, bookings, and rental requests from the
                  vendor portal.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#b46c5b]">
                  Continue as vendor
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-[#ecd7ce] bg-white/95 p-6 shadow-[0_18px_60px_rgba(177,122,102,0.1)] backdrop-blur sm:p-8">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b86f5f]">
              Customer Login
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#2f2622]">
              Welcome back
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#625650]">
              Use your email and password to continue to your rentals, orders,
              and saved looks.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-[#4e433e]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-[#b46c5b] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] px-4 py-3.5 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954]"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            {error ? (
              <p className="mt-4 rounded-2xl border border-[#efd6ce] bg-[#fff6f2] px-4 py-3 text-sm text-[#9e5949]">
                {error}
              </p>
            ) : null}

            {signupSuccess ? (
              <p className="mt-4 rounded-2xl border border-[#d9e7d8] bg-[#f5fbf4] px-4 py-3 text-sm text-[#4e7a46]">
                Account created successfully. Please log in.
              </p>
            ) : null}

            <div className="mt-6 rounded-3xl border border-[#f0e2dc] bg-[#fff8f5] p-4 text-sm text-[#625650]">
              Are you a vendor?
              <Link
                href="/VendorLogin"
                className="ml-2 font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
              >
                Log in here
              </Link>
            </div>

            <p className="mt-6 text-center text-sm text-[#625650]">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-semibold text-[#b46c5b] underline-offset-4 hover:underline"
                onClick={() => router.push("/Signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginSignPage() {
  return (
    <Suspense fallback={null}>
      <LoginSignContent />
    </Suspense>
  );
}
