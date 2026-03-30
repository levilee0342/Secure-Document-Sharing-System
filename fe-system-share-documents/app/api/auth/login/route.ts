import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simulate user authentication
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Mock user data
    const user = {
      userId: "user_" + Math.random().toString(36).substr(2, 9),
      userName: email.split("@")[0],
      email,
      token: "token_" + Math.random().toString(36).substr(2, 20),
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
