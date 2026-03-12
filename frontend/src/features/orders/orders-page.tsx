import { useEffect, useState } from "react"
import { getOrders } from "./orders.api"

export default function OrdersPage() {

  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {

    try {

      const data = await getOrders()

      setOrders(data)

    } catch (err) {

      console.error(err)

    }

  }

  return (

    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        Your Orders
      </h1>

      {orders.length === 0 && (
        <p className="text-gray-500">
          No orders yet.
        </p>
      )}

      {orders.map((order: any) => (

        <div
          key={order.id}
          className="border rounded p-4 mb-4 bg-white"
        >

          <p className="font-medium">
            Order ID: {order.id}
          </p>

          <p className="text-gray-500 text-sm">
            Total: ₹{order.total}
          </p>

        </div>

      ))}

    </div>

  )
}