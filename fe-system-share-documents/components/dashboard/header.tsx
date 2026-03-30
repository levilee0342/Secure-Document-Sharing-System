"use client"

import { Button } from "@/components/ui/button"

interface HeaderProps {
  user: any
  onLogout: () => void
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome, {user.name}</h2>
          <p className="text-sm text-muted-foreground">Manage and share your secure documents</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          Sign out
        </Button>
      </div>
    </header>
  )
}
