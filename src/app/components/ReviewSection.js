import Image from "next/image";

export default function ReviewsSection() {
  const reviews = [
    {
      text: "It literally solved all my problems.",
      name: "Hanna",
      role: "Client Review",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      text: "Loved it!",
      name: "Marco",
      role: "Client Review",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      text: "Much needed!",
      name: "Nora",
      role: "Client Review",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      text: "It blew my mind.",
      name: "Leo",
      role: "Client Review",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
  ];

  return (
    <section className="py-10">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Our Reviews</h2>
      <div className="flex snap-x snap-mandatory space-x-4 overflow-x-auto scroll-smooth pb-4">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="max-w-sm min-w-[280px] flex-shrink-0 snap-start rounded-2xl border bg-white p-6 shadow-md"
          >
            <p className="mb-6 text-lg italic text-gray-700">&quot;{review.text}&quot;</p>
            <div className="flex items-center space-x-3">
              <Image
                src={review.avatar}
                alt={review.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{review.name}</p>
                <p className="text-sm text-gray-500">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
