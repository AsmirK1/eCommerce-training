 import Link from "next/link";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  /* const validImage =
    image && image.startsWith("http")
      ? image
      : "https://placehold.co/600x400?text=No+Image"; */

 return (
    <div className="flex flex-col justify-between bg-gradient-to-b from-[#111111] to-[#1a1a1a] border border-[#333] shadow-xl hover:shadow-[0_0_25px_#ff00ff66] transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden w-full max-w-xs h-[360px]">
      {/* image */}
      <figure className="w-full h-[180px] bg-[#111] overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </figure>

      {/* content */}
      <div className="flex flex-col justify-between flex-grow px-4 py-3 text-center">
        <div>
          <h2
            className="text-sm md:text-base font-semibold text-white truncate max-w-[200px] mx-auto"
            title={name}
          >
            {name}
          </h2>
          <p className="text-[#ffb6c1] text-sm mb-3">${price}</p>
        </div>

        <Link href={`/products/${id}`} className="mt-auto">
          <button className="w-full py-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600 text-white font-medium text-sm hover:brightness-110 transition-all duration-300 shadow-[0_0_12px_#ff00ff80]">
            View Details ✨
          </button>
        </Link>
      </div>
    </div>
  );
}