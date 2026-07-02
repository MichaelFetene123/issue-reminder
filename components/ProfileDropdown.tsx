"use client"

import { useTransition } from "react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { logoutAction } from "@/lib/actions/mutations/auth-mutations"

interface ProfileDropdownProps {
  name?: string | null
  email?: string | null
  image?: string | null
}

export function ProfileDropdown({ name, email, image }: ProfileDropdownProps) {
  const [isPending, startTransition] = useTransition()
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border-2 border-border bg-muted hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none cursor-pointer"
          aria-label="Open profile menu"
        >
          {image ? (
            <Image
              src={image}
              alt={name ?? "Profile"}
              fill
              className="object-cover"
              sizes="36px"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-xs font-semibold text-foreground">{initials}</span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* User info header */}
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden border border-border bg-muted">
            {image ? (
              <Image
                src={image}
                alt={name ?? "Profile"}
                fill
                className="object-cover"
                sizes="40px"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-sm font-semibold text-foreground">{initials}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            {name && (
              <span className="text-sm font-semibold truncate">{name}</span>
            )}
            {email && (
              <span className="text-xs text-muted-foreground truncate">{email}</span>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          disabled={isPending}
          onSelect={(e) => {
            e.preventDefault()
            startTransition(() => logoutAction())
          }}
        >
          {isPending ? "Logging out…" : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
