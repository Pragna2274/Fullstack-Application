import { useCartStore } from "./cart.store"

export default function CartPage() {

  const items = useCartStore((s) => s.items)

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Cart
      </h1>

      {items.map((item) => (

        <div
          key={item.id}
          className="flex items-center gap-4 border p-4 mb-3"
        >

          <img
            src={item.image}
            className="w-20 h-20 object-cover"
          />

          <div className="flex-1">
            {item.name}
          </div>

          <div>
            ₹{item.price}
          </div>

        </div>

      ))}

      <h2 className="text-xl font-bold mt-6">
        Total: ₹{total}
      </h2>

    </div>

  )
}