import { LoginForm } from "@/components/auth/login-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 auth-background">
      <LoginForm />
    </main>
  )
}
