import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <img src={product.imageUrl} className="h-40 w-full object-cover" />

      <CardContent className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{product.name}</h2>

        <p className="text-sm text-gray-500">{product.description}</p>

       <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition p-4">
          <Badge>${product.price}</Badge>

          <Button>Add</Button>
        </div>
      </CardContent>
    </Card>
  )
}