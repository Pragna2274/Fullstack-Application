import { Minus, Plus, ShoppingBag } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCartStore } from "@/features/cart/cart.store"
import {
  addServerCartItem,
  deleteServerCartItem,
  updateServerCartItem,
} from "@/features/cart/cart.api"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

export default function CartSidebar({ open, setOpen }: Props) {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const setServerItemId = useCartStore((state) => state.setServerItemId)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const syncIncremental = async (
    item: (typeof items)[number],
    action: "increment" | "decrement"
  ) => {
    if (!localStorage.getItem("accessToken")) {
      return
    }

    try {
      if (action === "increment") {
        if (!item.serverItemId) {
          const createdItem = await addServerCartItem(item.id, 1)
          setServerItemId(item.id, createdItem.id)
          return
        }

        await updateServerCartItem(item.serverItemId, item.quantity + 1)
        return
      }

      if (!item.serverItemId) {
        return
      }

      if (item.quantity === 1) {
        await deleteServerCartItem(item.serverItemId)
        return
      }

      await updateServerCartItem(item.serverItemId, item.quantity - 1)
    } catch (error) {
      console.error("Cart sync failed", error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full max-w-[420px] flex-col border-l border-slate-200 bg-white p-0"
      >
        <SheetHeader className="border-b border-slate-200 px-6 py-5">
          <SheetTitle className="flex items-center gap-3 text-xl font-black tracking-tight text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <ShoppingBag className="h-5 w-5" />
            </span>
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-sky-100 p-4 text-sky-700">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-lg font-bold text-slate-900">No items added yet</p>
              <p className="mt-2 text-sm text-slate-500">
                Add a few dishes to see them here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[24px] border border-slate-100 bg-slate-50 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Rs. {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full bg-white p-1 shadow-sm">
                      <button
                        onClick={async () => {
                          await syncIncremental(item, "decrement")
                          removeItem(item.id)
                        }}
                        className="rounded-full p-2 text-slate-600 transition-all hover:scale-105"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={async () => {
                          await syncIncremental(item, "increment")
                          addItem({
                            id: item.id,
                            image: item.image,
                            name: item.name,
                            price: item.price,
                            serverItemId: item.serverItemId,
                          })
                        }}
                        className="rounded-full bg-sky-700 p-2 text-white transition-all hover:scale-105"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-sky-700">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-950 px-6 py-5 text-white">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
            <span>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
            <span>Total</span>
          </div>
          <div className="mb-5 text-2xl font-black text-sky-300">
            Rs. {total.toFixed(2)}
          </div>
          <button
            onClick={() => {
              setOpen(false)
              navigate("/cart")
            }}
            className="w-full rounded-full bg-sky-700 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-sky-800"
          >
            View cart and checkout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
