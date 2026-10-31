import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, Moon, Package as PackageIcon, Settings, Sun, User as UserIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { UserAvatar } from "@/components/UserAvatar";
import { useMe } from "@/hooks/useMe";
import { useTheme } from "@/hooks/useTheme";
import { endSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", id: "home", end: true },
  { to: "/packages", label: "Packages", id: "packages", end: false },
  { to: "/docs", label: "Docs", id: "docs", end: false },
  { to: "/categories", label: "Categories", id: "categories", end: false },
  { to: "/community", label: "Community", id: "community", end: false },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} data-testid="dark-mode-toggle" aria-label="Toggle dark mode"
      className="rounded-full text-[#1E4A9E] hover:bg-[#3B4FC4]/10 dark:text-[#E2E8F0] dark:hover:bg-white/10">
      {theme === "dark" ? <Sun className="size-[18px] transition-transform duration-300 rotate-0" /> : <Moon className="size-[18px] transition-transform duration-300" />}
    </Button>
  );
}

export function Navbar() {
  const { data: user } = useMe();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#C9D6EE]/60 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-[#0F1424]/80" data-testid="navbar">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo imgClassName="h-10" />
          <span className="hidden border-l border-[#C9D6EE] pl-3 text-sm font-semibold tracking-tight text-[#1E4A9E] sm:inline dark:border-white/15 dark:text-[#E2E8F0]" data-testid="navbar-product-name">
            Package Manager
          </span>
        </div>

        <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.id} to={n.to} end={n.end} data-testid={`navbar-${n.id}-link`}
              className={({ isActive }) => cn(
                "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                isActive ? "text-[#3B4FC4] dark:text-[#4DB8D8]" : "text-[#5B6478] hover:text-[#1E4A9E] dark:text-[#9AA3BA] dark:hover:text-white",
              )}>
              {({ isActive }) => (
                <>
                  {n.label}
                  <span className={cn("bg-signature absolute inset-x-3 -bottom-[13px] h-[2px] rounded-full transition-opacity duration-200", isActive ? "opacity-100" : "opacity-0")} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger data-testid="user-menu-trigger" aria-label="Account menu"
                className="rounded-full outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#3B4FC4]">
                <UserAvatar user={user} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-60">
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-semibold" data-testid="user-menu-name">{user.display_name || user.username}</p>
                  <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem data-testid="user-menu-profile" onClick={() => navigate("/profile")}><UserIcon /> Profile</DropdownMenuItem>
                  <DropdownMenuItem data-testid="user-menu-my-packages" onClick={() => navigate("/my-packages")}><PackageIcon /> My Packages</DropdownMenuItem>
                  <DropdownMenuItem data-testid="user-menu-settings" onClick={() => navigate("/settings")}><Settings /> Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" data-testid="user-menu-logout" onClick={() => void endSession("/")}><LogOut /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" data-testid="navbar-login-button"
                className={cn(buttonVariants({ variant: "outline" }), "h-9 rounded-xl border-[#3B4FC4]/40 bg-transparent px-4 text-[#3B4FC4] hover:bg-[#3B4FC4]/8 dark:border-[#4DB8D8]/40 dark:text-[#4DB8D8]")}>
                Login
              </Link>
              <Link to="/register" data-testid="navbar-signup-button" className="btn-signature inline-flex h-9 items-center rounded-xl px-4 text-sm font-semibold">
                Sign Up
              </Link>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger data-testid="mobile-menu-button" aria-label="Open menu"
              className="inline-flex size-9 items-center justify-center rounded-lg text-[#1E4A9E] hover:bg-[#3B4FC4]/10 lg:hidden dark:text-white dark:hover:bg-white/10">
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[290px] border-l-white/10 bg-[#EEF1F8] dark:bg-[#0F1424]" data-testid="mobile-menu">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-[#1E4A9E] dark:text-white">
                  <img src="/brand/ezorb-mark.png" alt="" className="h-7 w-auto" /> Package Manager
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {NAV.map((n) => (
                  <NavLink key={n.id} to={n.to} end={n.end} onClick={() => setOpen(false)} data-testid={`mobile-nav-${n.id}-link`}
                    className={({ isActive }) => cn("rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors",
                      isActive ? "bg-[#3B4FC4]/10 text-[#3B4FC4] dark:bg-white/10 dark:text-[#4DB8D8]" : "text-[#1F2937] hover:bg-black/5 dark:text-[#E2E8F0] dark:hover:bg-white/5")}>
                    {n.label}
                  </NavLink>
                ))}
              </nav>
              {!user && (
                <div className="mt-4 flex flex-col gap-2 px-4">
                  <Link to="/login" onClick={() => setOpen(false)} data-testid="mobile-login-button"
                    className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-xl border-[#3B4FC4]/40 text-[#3B4FC4] dark:text-[#4DB8D8]")}>Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} data-testid="mobile-signup-button"
                    className="btn-signature inline-flex h-10 items-center justify-center rounded-xl text-sm font-semibold">Sign Up</Link>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}