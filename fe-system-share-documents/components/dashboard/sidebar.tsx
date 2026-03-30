"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Documents", href: "/dashboard/documents", icon: "📄" },
    { name: "Groups", href: "/dashboard/groups", icon: "👥" },
    { name: "Audit Log", href: "/dashboard/audit", icon: "📋" },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ]

  return (
    <aside
      className={`${open ? "w-64" : "w-20"} transition-all duration-300 bg-sidebar border-r border-sidebar-border`}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {open && <h1 className="text-lg font-bold text-sidebar-foreground">SecureShare</h1>}
        <button onClick={onToggle} className="text-sidebar-foreground hover:bg-sidebar-accent/10 p-2 rounded">
          ☰
        </button>
      </div>

      <nav className="space-y-2 px-2 mt-8">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {open && <span className="text-sm font-medium">{item.name}</span>}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
