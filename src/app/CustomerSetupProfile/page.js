"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { CustomerGuard } from "../../components/AuthGuard";
import { useAuthData } from "../../context/authContext";

function CustomerSetupProfileInner() {
  const router = useRouter();
  const { currentUser, profile, updateCustomerProfile } = useAuthData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(profile?.name || "");
    setEmail(profile?.email || "");
  }, [profile]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser?.uid) {
      setError("Customer account not found right now.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await updateCustomerProfile(currentUser.uid, {
        name,
        email,
        phoneNumber: profile?.phoneNumber || currentUser.phoneNumber || "",
      });
      router.push("/");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save your details right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f4_0%,#f7ebe5_52%,#fffdfb_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-[#ecd7ce] bg-[radial-gradient(circle_at_top_left,#f6d1c5_0%,#f4e2da_36%,#fff8f5_100%)] p-8 shadow-[0_18px_60px_rgba(177,122,102,0.12)] sm:p-10">
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/35 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#e7b7a8]/25 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b86f5f]">
              One quick step
            </p>
            <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-[#2f2622] sm:text-5xl">
              Complete your customer profile.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#625650]">
              Add your name and email once so your rentals, checkout flow, and
              order updates feel complete across the app.
            </p>
          </div>
        </section>

        <section className="rounded-[36px] border border-[#ecd7ce] bg-white/95 p-6 shadow-[0_18px_60px_rgba(177,122,102,0.1)] backdrop-blur sm:p-8">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b86f5f]">
              Customer details
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#2f2622]">
              Finish your profile
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                  Full name
                </label>
                <div className="relative">
                  <UserRound
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b46c5b]"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] py-3.5 pl-11 pr-4 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4e433e]">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b46c5b]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-[#e6d3cb] bg-[#fffdfc] py-3.5 pl-11 pr-4 text-[#2f2622] outline-none transition focus:border-[#d88b76] focus:ring-4 focus:ring-[#f4dfd7]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c97762] py-3.5 text-sm font-semibold text-white transition hover:bg-[#b96954]"
              >
                {isSubmitting ? "Saving details..." : "Save and continue"}
                <ArrowRight size={16} />
              </button>
            </form>

            {error ? (
              <p className="mt-4 rounded-2xl border border-[#efd6ce] bg-[#fff6f2] px-4 py-3 text-sm text-[#9e5949]">
                {error}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function CustomerSetupProfilePage() {
  return (
    <CustomerGuard>
      <CustomerSetupProfileInner />
    </CustomerGuard>
  );
}
