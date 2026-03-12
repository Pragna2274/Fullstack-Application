import { useCartStore } from "@/features/cart/cart.store"

export default function ProductCard({ product }: any) {

  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)

  const cartItem = items.find((i) => i.id === product.id)

  return (

    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4">

      <img
        src={product.image}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <h3 className="font-semibold text-lg">
        {product.name}
      </h3>

      <p className="text-gray-500 text-sm mb-2">
        {product.description}
      </p>

      <div className="flex justify-between items-center">

        <span className="font-bold text-amber-600">
          ₹{product.price}
        </span>

        {!cartItem ? (

          <button
            onClick={() => addItem(product)}
            className="bg-black text-white px-4 py-1 rounded"
          >
            Add
          </button>

        ) : (

          <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded">

            <button
              onClick={() => removeItem(product.id)}
              className="text-lg font-bold"
            >
              −
            </button>

            <span className="font-semibold">
              {cartItem.quantity}
            </span>

            <button
              onClick={() => addItem(product)}
              className="text-lg font-bold"
            >
              +
            </button>

          </div>

        )}

      </div>

    </div>
  )
}