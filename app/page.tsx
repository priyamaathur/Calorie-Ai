"use client"

import { useRouter } from "next/navigation"

export default function Home() {

const router = useRouter()

return (
<div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">

<h1 className="text-4xl font-bold mb-4">
Calorie AI
</h1>

<p className="text-gray-400 mb-8">
Your Smart Health Assistant
</p>

<div className="flex flex-col gap-4">

<button
onClick={() => router.push("/dashboard")}
className="bg-green-500 px-6 py-2 rounded-lg text-lg hover:bg-green-600"
>
Continue as Guest
</button>

<button
onClick={() => router.push("/login")}
className="bg-gray-700 px-6 py-2 rounded-lg text-lg hover:bg-gray-600"
>
Login
</button>

</div>

</div>
)
}