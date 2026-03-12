import { useEffect, useState } from "react"
import { getProducts } from "@/api/product"
import type { Product } from "@/types/product"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts()
      setProducts(data)
    }

    fetchProducts()
  }, [])

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg">
          <img src={product.imageUrl} alt={product.name} />
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  )
}