"use client"

import { useRouter } from "next/navigation"

export function LogoutAction({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      
      // Invalidate the router cache so all Server Components re-fetch their data
      router.refresh()
      
      // Navigate to the home page
      router.push("/")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <div className={className} onClick={handleLogout}>
      {children}
    </div>
  )
}
