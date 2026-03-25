"use client";

import Image from "next/image";

export default function BrandBar() {
  const brands = [
    { name: "Sabyasachi", logo: "/sabyasachi.jpg" },
    { name: "Manyavar", logo: "/manayavar.png" },
    { name: "Manish Malhotra", logo: "/manish.webp" },
    { name: "Anita Dongre", logo: "/anitadogre.jpg" },
    { name: "Tasva", logo: "/tasva.webp" },
    { name: "Koskii", logo: "/koskii.avif" },
    { name: "Ritu Kumar", logo: "/ritukumar.jpg" },
    { name: "Samyakk", logo: "/samayakk.jpg" },
  ];

  const repeatedGroups = Array.from({ length: 4 });

  return (
    <div className="relative overflow-hidden bg-[#D27F6C] py-3 border-t border-b border-gray-200">
      {/* Each repeated group has the same width, so the loop resets seamlessly. */}
      <div className="marquee-track flex w-max bg-[#D27F6C]">
        {repeatedGroups.map((_, groupIndex) => (
          <div key={groupIndex} className="flex flex-shrink-0 gap-4">
            {brands.map((brand, brandIndex) => (
              <div
                key={`${groupIndex}-${brandIndex}`}
                className="flex-shrink-0 w-20 h-8 sm:w-24 sm:h-10 md:w-28 md:h-12 flex items-center justify-center bg-[#D27F6C]"
              >
                <div className="relative w-full h-full p-1">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .marquee-track {
          animation: scroll 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
