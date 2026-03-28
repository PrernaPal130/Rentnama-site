import Image from "next/image";
import Link from "next/link";

export default function CategoryBar() {
  const categories = [
    { name: "Saree", img: "/sareemain.png", position: "center top" },
    { name: "Sherwani", img: "/Sherwanimain.png", position: "center top" },
    { name: "Lehenga", img: "/lengha.jpg", position: "center top" },
    { name: "Gown", img: "/gown.webp", position: "center top" },
    { name: "Kurta Set", img: "/kurta.jpg", position: "center top" },
    { name: "Indo-Western", img: "/indowestern.jpeg", position: "center top" },
  ];

  return (
    <section className="bg-gradient-to-b from-[#D27F6C]/10 to-white py-4">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-4 px-4">
        {categories.map((cat, i) => (
          <Link
            key={i}
            href={`/search?q=${encodeURIComponent(cat.name)}`}
            className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-md">
              <Image
                src={cat.img}
                alt={cat.name}
                width={112}
                height={112}
                className="object-cover w-full h-full"
                style={{ objectPosition: cat.position }}
              />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700 mt-2">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
