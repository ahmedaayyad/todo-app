"use client"

import type React from "react"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Header />
      <main className="dashboard-main">{children}</main>
    </div>
  )
}
