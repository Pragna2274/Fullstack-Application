import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCartStore } from "@/features/cart/cart.store"
import { createOrder } from "@/features/orders/orders.api"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

export default function CartSidebar({ open, setOpen }: Props) {

  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

 const handleCheckout = async () => {

  if (items.length === 0) {
    alert("Your cart is empty")
    return
  }

  try {

    const order = await createOrder(items)

    console.log("Order:", order)

    alert("Order created successfully")

    setOpen(false)

  } catch (error) {

    console.error(error)

    alert("Checkout failed")

  }

}
  return (

    <Sheet open={open} onOpenChange={setOpen}>

      <SheetContent
        side="right"
        className="flex flex-col w-[380px] bg-white p-6"
      >

        <SheetHeader>
          <SheetTitle className="text-xl">
            Cart
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="mt-6 flex-1 overflow-y-auto space-y-4">

          {items.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              Your cart is empty
            </div>
          )}

          {items.map((item) => (

            <div
              key={item.id}
              className="flex items-center gap-3 border p-3 rounded-lg"
            >

              <img
                src={item.image}
                className="w-16 h-16 object-cover rounded-md"
              />

              <div className="flex-1">

                <p className="font-medium">
                  {item.name} × {item.quantity}
                </p>

                <p className="text-sm text-gray-500">
                  ₹{item.price}
                </p>

              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>

            </div>

          ))}

        </div>

        {/* Footer */}
        <div className="border-t pt-4 mt-4">

          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
          >
            Checkout
          </button>

        </div>

      </SheetContent>

    </Sheet>

  )
}