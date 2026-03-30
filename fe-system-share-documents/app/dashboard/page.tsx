"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/layout"
import DashboardContent from "@/components/dashboard/content"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/")
      return
    }

    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("userName")

    setUser({
      id: userId,
      name: userName,
    })
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <DashboardContent user={user} />
    </DashboardLayout>
  )
}
