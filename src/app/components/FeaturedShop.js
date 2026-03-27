import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export default function FeaturedShops() {
  const shops = [
    {
      id: 1,
      name: "Verified boutique",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/kurta2.webp",
      position: "center top",
    },
    {
      id: 2,
      name: "Trusted bridal studio",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/lengha2.webp",
      position: "center top",
    },
    {
      id: 3,
      name: "Verified designer label",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/lengha3.webp",
      position: "center top",
    },
    {
      id: 4,
      name: "Trusted saree house",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/saree.webp",
      position: "center top",
    },
    {
      id: 5,
      name: "Verified festive store",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/indo.jpeg",
      position: "center top",
    },
    {
      id: 6,
      name: "Trusted couture partner",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/lengha4.webp",
      position: "center top",
    },
    {
      id: 7,
      name: "Verified menswear rental",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/sherwani.webp",
      position: "center top",
    },
  ];

  return (
    <section className="bg-white px-4 py-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Featured Shops</h2>

      <div className="flex justify-center gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="min-w-[160px] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg sm:min-w-[200px]"
          >
            <div className="relative h-56 w-full sm:h-64 lg:h-72">
              <Image
                src={shop.image}
                alt={shop.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 240px"
                style={{ objectPosition: shop.position }}
              />
            </div>
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-medium text-gray-800">{shop.name}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef8f1] px-2 py-1 text-[10px] font-semibold text-[#2f6b49]">
                  <BadgeCheck size={11} />
                  Trusted
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {shop.rating} <span className="text-yellow-500">*</span>
              </p>
              <p className="text-xs text-gray-500">{shop.reviews}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
