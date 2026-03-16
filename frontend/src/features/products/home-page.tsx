import { useMemo, useState } from "react"
import { Clock3, ShieldCheck } from "lucide-react"
import HeroCarousel from "@/components/carousel/hero-carousel"
import ProductGrid from "@/components/product/product-grid"

export default function HomePage() {
  const [category, setCategory] = useState("All")

  const categories = useMemo(
    () => ["All", "Pizza", "Burger", "Snacks", "Pasta", "Grill", "Indian", "Dessert"],
    []
  )

  return (
    <div className="pb-14">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
              Feasta
            </p>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Order Your Favorite Food Instantly
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                A simpler food ordering experience with quick browsing, clean
                checkout, and secure payment.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                <Clock3 className="h-4 w-4 text-sky-700" />
                30 min average delivery
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-sky-700" />
                Secure payments
              </div>
            </div>
          </div>

          <HeroCarousel />
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-700">
              Menu
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Fresh picks for every craving
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Browse by category, add items to cart, and complete payment in a clean,
            responsive flow on desktop or mobile.
          </p>
        </div>

        <div className="-mx-4 mb-8 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-3">
          {categories.map((currentCategory) => (
            <button
              key={currentCategory}
              onClick={() => setCategory(currentCategory)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 ${
                category === currentCategory
                  ? "bg-slate-950 text-white shadow-lg"
                  : "border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-sky-200 hover:text-sky-700"
              }`}
            >
              {currentCategory}
            </button>
          ))}
          </div>
        </div>

        <ProductGrid category={category} />
      </section>
    </div>
  )
}
