export default function ProfilePage() {

  const email = "user@email.com"

  return (

    <div className="max-w-3xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        Profile
      </h1>

      <div className="bg-white shadow rounded-lg p-6">

        <div className="mb-4">

          <p className="text-gray-500 text-sm">
            Email
          </p>

          <p className="font-medium">
            {email}
          </p>

        </div>

      </div>

    </div>

  )
}