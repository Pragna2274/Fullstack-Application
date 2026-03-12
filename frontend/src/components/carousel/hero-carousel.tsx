import { useState, useEffect } from "react"

export default function HeroCarousel() {

  const images = [
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    "https://images.unsplash.com/photo-1550547660-d9450f859349"
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)

  }, [])

  return (

   <div className="w-full h-80 overflow-hidden rounded-xl shadow mb-10">

      <img
        src={images[index]}
        className="w-full h-full object-cover"
      />

    </div>

  )
}