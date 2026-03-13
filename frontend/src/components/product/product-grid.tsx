import { useEffect, useState } from "react"
import { getProducts } from "@/features/products/products.api"
import ProductCard from "./product-card"

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

type Props = {
  category: string
}

export default function ProductGrid({ category }: Props) {

  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {

    setLoading(true)

    const data = await getProducts(page, 10)

    setProducts((prev) => [...prev, ...data])

    setLoading(false)

  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {

    const handleScroll = () => {

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setPage((prev) => prev + 1)
      }

    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)

  }, [])

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category)

  return (

    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {filteredProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}

      {loading && (
        <p className="col-span-full text-center py-6">
          Loading more products...
        </p>
      )}

    </div>

  )
}
