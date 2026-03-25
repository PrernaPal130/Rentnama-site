import Image from "next/image";

export default function FeaturedShops() {
  const shops = [
    {
      id: 1,
      name: "Shop rating",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/kurta2.webp",
      position: "center top",
    },
    {
      id: 2,
      name: "Shop rating",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/lengha2.webp",
      position: "center top",
    },
    {
      id: 3,
      name: "Shop rating",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/lengha3.webp",
      position: "center top",
    },
    {
      id: 4,
      name: "Shop rating",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/saree.webp",
      position: "center top",
    },
    {
      id: 5,
      name: "Shop rating",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/indo.jpeg",
      position: "center top",
    },
    {
      id: 6,
      name: "Shop rating",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/lengha4.webp",
      position: "center top",
    },
    {
      id: 7,
      name: "Shop rating",
      rating: "4.5",
      reviews: "(5k reviews)",
      image: "/sherwani.webp",
      position: "center top",
    },
  ];

  return (
    <section className="bg-white px-4 py-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Featured Shops</h2>

      <div className="flex justify-center gap-6 overflow-x-auto no-scrollbar">
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
              <p className="text-sm font-medium text-gray-800">{shop.name}</p>
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
