import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Compass,
  HandCoins,
  MapPin,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

const highlights = [
  {
    title: "Subscription-based vendor access",
    description:
      "Vendors join RentNama on a subscription model to list outfits, manage visibility, and stay active on the platform.",
    icon: <Building2 size={20} />,
  },
  {
    title: "Commission on online orders",
    description:
      "For every online rental order placed through RentNama, we charge a commission while helping vendors reach more customers.",
    icon: <HandCoins size={20} />,
  },
  {
    title: "Offline store discovery",
    description:
      "Customers can also be redirected to your physical store if they want to visit, see the garment in person, or buy offline.",
    icon: <MapPin size={20} />,
  },
];

const steps = [
  "Create your vendor account and share your business details.",
  "Choose the subscription plan that fits your store size and inventory.",
  "Upload your outfits, pricing, sizes, and availability.",
  "Receive online rental bookings and offline store discovery leads.",
  "Manage orders, blocked dates, returns, and visibility from one dashboard.",
];

const partnerBenefits = [
  "Reach customers who want occasionwear without the full purchase cost.",
  "Use RentNama as both an online rental channel and an offline store-discovery channel.",
  "Showcase premium inventory to users who are actively shopping for events.",
  "Manage catalog, bookings, and blocked dates from a dedicated vendor panel.",
];

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f4_0%,#f6ebe5_54%,#fffdfb_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[36px] border border-[#ecd7ce] bg-white shadow-[0_18px_60px_rgba(177,122,102,0.12)]">
          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#f4d0c4_0%,#f5e1d8_42%,#fff9f6_100%)] p-8 sm:p-10">
              <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-white/35 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-[#e5b4a5]/25 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b86f5f]">
                  RentNama For Business
                </p>
                <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[#2f2622] sm:text-5xl">
                  Grow your fashion rental business with a platform built for
                  discovery, bookings, and store traffic.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[#625650]">
                  RentNama helps boutiques, designers, and rental stores list
                  premium outfits online, earn from digital rental demand, and
                  still bring customers into their physical stores when they want
                  to see or buy the garments offline.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/VendorSignup"
                    className="inline-flex items-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                  >
                    Join as a vendor
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/VendorLogin"
                    className="inline-flex items-center gap-2 rounded-full border border-[#e4c8c0] bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#fff6f2]"
                  >
                    Already a partner?
                  </Link>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[28px] border border-white/75 bg-white/70 p-5 backdrop-blur-sm"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e6df] text-[#b86f5f]">
                        {item.icon}
                      </div>
                      <p className="mt-4 text-base font-semibold text-[#2f2622]">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#625650]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              <div className="grid gap-6">
                <section className="rounded-[28px] border border-[#ecd8d1] bg-[#fffaf7] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                      <Compass size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bc7766]">
                        Business Model
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                        How RentNama works with vendors
                      </h2>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600">
                    <p>
                      RentNama works on a subscription-based model for vendor
                      partners. This gives your store access to the platform,
                      listing visibility, and the vendor dashboard.
                    </p>
                    <p>
                      For online rental orders placed through our website, we
                      earn through commission. This keeps the model aligned with
                      vendor growth and real order performance.
                    </p>
                    <p>
                      We also help drive offline discovery. If customers want to
                      visit your store, inspect garments in person, or buy them
                      offline, RentNama can redirect them to your shop.
                    </p>
                    <p>
                      This gives vendors two clear revenue paths: subscription-backed
                      visibility plus store visits, and commission-based online
                      rentals completed through the platform.
                    </p>
                  </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[28px] border border-[#ecd8d1] bg-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                        <Store size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bc7766]">
                          Join RentNama
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                          Guidelines to partner with us
                        </h2>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {steps.map((step, index) => (
                        <div
                          key={step}
                          className="flex gap-4 rounded-2xl border border-[#efe1dc] bg-[#fffaf8] px-4 py-4"
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c97762] text-sm font-semibold text-white">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-6 text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#ecd8d1] bg-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8e5df] text-[#9e5949]">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bc7766]">
                          Why Join
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                          What vendors gain
                        </h2>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {partnerBenefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex gap-3 rounded-2xl border border-[#efe1dc] bg-[#fffaf8] px-4 py-4"
                        >
                          <Sparkles
                            size={18}
                            className="mt-1 flex-shrink-0 text-[#c97762]"
                          />
                          <p className="text-sm leading-6 text-gray-700">
                            {benefit}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-[24px] border border-[#efd9d0] bg-[linear-gradient(135deg,#fff5f0_0%,#fffdfb_100%)] p-5">
                      <p className="text-sm font-semibold text-[#2f2622]">
                        Ready to list your collection?
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#625650]">
                        Create your vendor account and start onboarding your
                        store inventory into RentNama.
                      </p>
                      <Link
                        href="/VendorSignup"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#c97762] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96954]"
                      >
                        Go to vendor sign up
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
