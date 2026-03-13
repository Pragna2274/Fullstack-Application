import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    title: "Fresh bowls and comfort food",
    subtitle: "Simple meals, quick delivery, no clutter.",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Burgers, pizza, and late-night cravings",
    subtitle: "Your favorites in one clean ordering flow.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Fast checkout and secure payments",
    subtitle: "Review cart, pay securely, and track orders easily.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80",
  },
]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const currentSlide = slides[index]

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-slate-950 shadow-xl shadow-slate-200/70">
      <img
        src={currentSlide.image}
        alt={currentSlide.title}
        className="h-[320px] w-full object-cover sm:h-[380px]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          Featured
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
          {currentSlide.title}
        </h2>
        <p className="mt-3 max-w-lg text-sm text-slate-200 sm:text-base">
          {currentSlide.subtitle}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.title}
                onClick={() => setIndex(slideIndex)}
                className={`h-2.5 rounded-full transition-all ${
                  slideIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition-all hover:bg-white/25"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
              className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition-all hover:bg-white/25"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
