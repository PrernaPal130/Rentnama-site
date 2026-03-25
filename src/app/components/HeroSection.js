import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#ffffff]">
      {/* Wrapper to control height and aspect ratio */}
      <div className="relative w-full aspect-[16/6] sm:aspect-[16/7] md:aspect-[16/5]">
        <Image
          src="/ApnaCloset.png" // your universal hero image
          alt="Rentzaari Hero"
          fill
          priority
          className="object-contain object-center bg-[#ffffff]"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
