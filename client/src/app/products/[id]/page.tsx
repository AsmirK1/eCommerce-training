/* shows details for one specific product */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";


type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const {addToCart} = useCart(); 

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (!product) return <p className="text-center p-10">Product not found.</p>;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black text-gray-100 px-6 py-12">
      <div className="max-w-3xl w-full bg-gradient-to-b from-zinc-900/80 via-zinc-800/80 to-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-purple-900/30 border border-zinc-700/40">
        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-lg">
          {product.title}
        </h1>

        <img
          src={product.image}
          alt={product.title}
          className="rounded-2xl w-full h-96 object-cover shadow-md shadow-purple-700/20 hover:shadow-pink-500/30 transition duration-500 hover:scale-105"
        />

        <div className="mt-6 text-center">
          <p className="text-2xl font-bold text-purple-300 mb-2">${product.price}</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {product.description || "No description available."}
          </p>

        <div className="flex justify-center gap-4">
          {product ? (
            <button
              className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:brightness-110 transition"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.title,
                  price: product.price,
                  image: product.images,
                  amount:1
                })
              }
            >
              Add to Cart ✨
            </button>
          ) : (
            <div>No Product</div>
          )}

            <Link href="/products">
              <button className="px-6 py-2 rounded-full border border-purple-500 text-purple-300 font-medium hover:bg-purple-500/20 transition">
                ← Back to Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
