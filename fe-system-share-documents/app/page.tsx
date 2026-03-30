"use client"

import { useState } from "react"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"

export default function Home() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border p-8 shadow-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">SecureShare</h1>
            <p className="text-sm text-muted-foreground">Secure Document Sharing with Encryption</p>
          </div>

          {authMode === "login" ? (
            <LoginForm onSwitchMode={() => setAuthMode("register")} />
          ) : (
            <RegisterForm onSwitchMode={() => setAuthMode("login")} />
          )}
        </div>
      </div>
    </div>
  )
}
