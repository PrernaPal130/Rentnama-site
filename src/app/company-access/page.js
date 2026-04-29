"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserCog,
} from "lucide-react";
import { useAuthData } from "../../context/authContext";

export default function CompanyAccessPage() {
  const router = useRouter();
  const { firebaseReady, loginAdmin } = useAuthData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!firebaseReady) {
      setError("Firebase is not configured yet. Add your env values first.");
      return;
    }

    try {
      setIsSubmitting(true);
      await loginAdmin({ email, password });
      router.push("/MasterDashboard");
    } catch (loginError) {
      setError(loginError.message || "Unable to access the company workspace.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f4ff_0%,#eee8ff_42%,#fffdfd_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-[#ddd6ff] bg-[radial-gradient(circle_at_top_left,#ece7ff_0%,#dcd3ff_34%,#faf7ff_100%)] p-8 shadow-[0_20px_60px_rgba(110,89,186,0.16)] sm:p-10">
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#c8b9ff]/30 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6d58b8]">
              RentNama HQ
            </p>
            <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-[#241d3d] sm:text-5xl">
              Private company access for RentNama operations.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#574f72]">
              This workspace is separate from the public customer and vendor experience.
              Use it to review subscriptions, vendor approvals, commissions, and
              platform performance.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <UserCog className="text-[#6d58b8]" size={20} />
                  <p className="text-sm font-semibold text-[#241d3d]">
                    Company-only workspace
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#62597a]">
                  The company side is not linked in the public RentNama site and is
                  protected by admin-only role checks.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[#6d58b8]" size={20} />
                  <p className="text-sm font-semibold text-[#241d3d]">
                    Role-protected entry
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#62597a]">
                  Even if someone guesses the route, only a Firebase account with
                  <span className="font-semibold"> role = admin </span>
                  can open the master dashboard.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-[#6d58b8]" size={20} />
                  <p className="text-sm font-semibold text-[#241d3d]">
                    Separate from public traffic
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#62597a]">
                  Use this page internally or later move it to a private subdomain
                  like <span className="font-semibold">admin.rentnama.com</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-[#ddd6ff] bg-white/95 p-6 shadow-[0_18px_60px_rgba(110,89,186,0.14)] backdrop-blur sm:p-8">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6d58b8]">
              Private Admin Login
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#241d3d]">
              Enter the master workspace
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#62597a]">
              Sign in with the internal company admin account. This page is not
              part of the public browsing flow.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d4568]">
                  Admin email
                </label>
                <input
                  type="email"
                  placeholder="hq@rentnama.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#d9d2f2] bg-[#fffdfc] px-4 py-3.5 text-[#241d3d] outline-none transition focus:border-[#9b87ea] focus:ring-4 focus:ring-[#ece7ff]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d4568]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-[#d9d2f2] bg-[#fffdfc] px-4 py-3.5 pr-12 text-[#241d3d] outline-none transition focus:border-[#9b87ea] focus:ring-4 focus:ring-[#ece7ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#766d96]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6d58b8] py-3.5 text-sm font-semibold text-white transition hover:bg-[#5d49a4]"
              >
                {isSubmitting ? "Opening workspace..." : "Access Master Dashboard"}
                <ArrowRight size={16} />
              </button>
            </form>

            {error ? (
              <p className="mt-4 rounded-2xl border border-[#e2daf8] bg-[#f7f2ff] px-4 py-3 text-sm text-[#6d58b8]">
                {error}
              </p>
            ) : null}

            <div className="mt-6 rounded-3xl border border-[#ebe6ff] bg-[#f8f5ff] p-4 text-sm text-[#62597a]">
              This route should only be shared internally with the RentNama team.
            </div>

            <p className="mt-6 text-sm text-[#62597a]">
              Need the public site instead?
              <Link
                href="/"
                className="ml-2 font-semibold text-[#6d58b8] underline-offset-4 hover:underline"
              >
                Go to RentNama
              </Link>
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#62597a]">
              <LockKeyhole size={15} />
              Company-only operational access
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
