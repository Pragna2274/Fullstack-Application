import { Link } from "react-router-dom"

export default function PaymentSuccess() {

  return (

    <div className="flex flex-col items-center justify-center h-screen">

      <h1 className="text-3xl font-bold mb-4">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-500 mb-6">
        Your order has been placed successfully.
      </p>

      <Link
        to="/"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Back to Home
      </Link>

    </div>

  )
}