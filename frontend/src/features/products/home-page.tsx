import { useState } from "react"
import HeroCarousel from "@/components/carousel/hero-carousel"
import ProductGrid from "@/components/product/product-grid"

export default function HomePage() {

  const [category, setCategory] = useState("All")

  const categories = [
    "All",
    "Pizza",
    "Burger",
    "Snacks",
    "Pasta",
    "Grill",
    "Indian",
    "Dessert"
  ]

  return (

    <div className="p-6">

      <HeroCarousel />

      {/* Categories */}
      <div className="max-w-7xl mx-auto mb-10">

      <h2 className="text-2xl md:text-2xl font-bold text-center pb-6">
  <span className="text-orange-500">Feasta</span> — Where every meal becomes a feast
</h2>
        <div className="flex flex-wrap gap-4 justify-center">

          {categories.map((c) => (

            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full border transition
              ${
                category === c
                  ? "bg-amber-500 text-black border-amber-500"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {c}
            </button>

          ))}

        </div>

      </div>

      {/* Products */}
      <ProductGrid category={category} />

    </div>

  )
}