"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Menu, X, User, LogOut, Calendar, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()
  const { user, logout, isAdmin } = useAuth()
  const { notifications, unreadCount } = useNotifications()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">NG</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">{t("header.title")}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/ministries" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.ministries")}
          </Link>
          <Link href="/book-appointment" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.bookAppointment")}
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.about")}
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSelector />

          {user ? (
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <div className="relative">
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs notification-bell"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {t("nav.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {t("nav.admin")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">{t("auth.login")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">{t("auth.register")}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            <Link
              href="/"
              className="block py-3 px-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/ministries"
              className="block py-3 px-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.ministries")}
            </Link>
            <Link
              href="/book-appointment"
              className="block py-3 px-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.bookAppointment")}
            </Link>
            <Link
              href="/about"
              className="block py-3 px-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className="block py-3 px-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.contact")}
            </Link>

            {/* Mobile User Actions */}
            {user && (
              <div className="border-t pt-4 mt-4 space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center py-3 px-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="mr-3 h-4 w-4" />
                  {t("nav.dashboard")}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center py-3 px-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4" />
                    {t("nav.admin")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full py-3 px-2 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors text-left"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  {t("auth.logout")}
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
