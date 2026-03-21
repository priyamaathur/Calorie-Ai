export const runtime = "nodejs"

import { NextResponse } from "next/server"

export async function POST(req: Request) {

const formData = await req.formData()
const image = formData.get("image") as File

if (!image) {
return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
}

// 🔥 SIMPLE forward (NO buffer, NO form-data package)
const newForm = new FormData()
newForm.append("file", image)

const response = await fetch("http://127.0.0.1:8000/predict", {
method: "POST",
body: newForm
})

if (!response.ok) {
const text = await response.text()
console.error(text)
return NextResponse.json({ error: "Python server error" }, { status: 500 })
}

const data = await response.json()

return NextResponse.json(data)
}


//uvicorn ai_server:app --reload --port 8000     