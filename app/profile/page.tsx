"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePage() {

  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [bmi, setBmi] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) return

      const userId = userData.user.id

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.log(error)
        return
      }

      if (data) {
        setName(data.full_name ?? "")
        setGender(data.gender ?? "")
        setHeight(data.height_cm?.toString() ?? "")
        setWeight(data.weight_kg?.toString() ?? "")
        setBmi(data.bmi?.toString() ?? "")
      }
    }

    loadProfile()
  }, [])

  const calculateBMI = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)

    if (!h || !w) return

    const bmiValue = (w / (h * h)).toFixed(2)
    setBmi(bmiValue)
  }

  const saveProfile = async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      alert("User not logged in")
      return
    }

    const userId = userData.user.id

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: name,
        gender: gender,
        height_cm: height,
        weight_kg: weight,
        bmi: bmi
      })

    if (error) {
      alert(error.message)
      return
    }

    alert("Profile saved successfully")
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-8 border rounded-lg w-96 space-y-3">

        <h1 className="text-2xl font-bold">Profile Setup</h1>

        <input
          className="border p-2 w-full"
          placeholder="Full Name"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2 w-full"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          className="border p-2 w-full"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <button
          onClick={calculateBMI}
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          Calculate BMI
        </button>

        <input
          className="border p-2 w-full"
          placeholder="BMI"
          value={bmi}
          readOnly
        />

        <button
          onClick={saveProfile}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Save Profile
        </button>

      </div>
    </div>
  )
}