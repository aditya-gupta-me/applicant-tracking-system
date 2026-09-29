import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar"
import { signOut } from "@repo/auth"
import { Button } from "@repo/ui/components/button"
import { Building2, ChevronDown, LayoutDashboard, LogOut, Settings, UserRound } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

type SidebarItem = {
  label: string
  href: string
  icon: typeof LayoutDashboard
}

type AppSidebarProps = {
  user: {
    name: string
    email: string
  }
  organizationName: string
  items: SidebarItem[]
}

export function AppSidebar({ user, organizationName, items }: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const accountMenuRef = useRef<HTMLDetailsElement>(null)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    function closeAccountMenu(event: PointerEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener("pointerdown", closeAccountMenu)
    return () => document.removeEventListener("pointerdown", closeAccountMenu)
  }, [])

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Senior ATS</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{organizationName}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link to={item.href} />}
                      isActive={location.pathname === item.href}
                      tooltip={item.label}
                      className="cursor-pointer"
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <details
          ref={accountMenuRef}
          open={isAccountMenuOpen}
          onToggle={(event) => setIsAccountMenuOpen(event.currentTarget.open)}
          className="group relative"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl p-2 outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring [&::-webkit-details-marker]:hidden">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
              {initials || <UserRound className="size-4" />}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium">{user.name}</span>
              <span className="block truncate text-xs text-sidebar-foreground/60">{user.email}</span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-sidebar-foreground/60 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute bottom-full left-0 right-0 z-50 mb-2 flex flex-col gap-1 rounded-xl border border-sidebar-border bg-popover p-2 text-popover-foreground shadow-lg">
            <Button
              variant="ghost"
              className="cursor-pointer justify-start gap-2"
              type="button"
              onClick={() => navigate("/account")}
            >
              <UserRound />
              My account
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer justify-start gap-2"
              type="button"
              onClick={() => navigate("/settings")}
            >
              <Settings />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer justify-start gap-2 text-destructive hover:text-destructive"
              type="button"
              onClick={() => void signOut()}
            >
              <LogOut />
              Logout
            </Button>
          </div>
        </details>
      </SidebarFooter>
    </Sidebar>
  )
}