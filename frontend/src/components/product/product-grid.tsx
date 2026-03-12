import { useEffect, useState } from "react"
import { getProducts } from "@/features/products/products.api"
import ProductCard from "./product-card"

type Props = {
  category: string
}

export default function ProductGrid({ category }: Props) {

  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category)

  return (

    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {filteredProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}

    </div>

  )
}