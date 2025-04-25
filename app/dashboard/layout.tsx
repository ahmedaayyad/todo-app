import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is logged in
  const cookieStore = cookies()
  const authCookie = cookieStore.get("auth-token")

  if (!authCookie) {
    redirect("/")
  }

  return <div className="min-h-screen bg-background">{children}</div>
}
