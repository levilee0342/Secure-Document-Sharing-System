import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json()

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Mock user creation
    const user = {
      userId: "user_" + Math.random().toString(36).substr(2, 9),
      userName: fullName,
      email,
      token: "token_" + Math.random().toString(36).substr(2, 20),
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
