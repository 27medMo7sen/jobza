"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Home,
  Briefcase,
  Users,
  Menu,
  LogOut,
  User,
  Plus,
  Search,
  MessageSquare,
  LayoutDashboard,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

interface UnifiedSidebarProps {
  userRole: UserRole;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  onClick?: () => void;
}

const getNavigationItems = (role: UserRole): NavItem[] => {
  const baseItems: NavItem[] = [
    { title: "Dashboard", href: `/${role}/dashboard`, icon: LayoutDashboard },
    { title: "Profile", href: `/${role}/profile`, icon: User },
  ];

  switch (role) {
    case "employer":
      return [
        {
          title: "Dashboard",
          href: "/employer/dashboard",
          icon: LayoutDashboard,
        },
        { title: "Messages", href: "/messages", icon: MessageSquare },
        { title: "My Jobs", href: "/employer/jobs", icon: Briefcase },
        { title: "Post Job", href: "/post-job", icon: Plus },
        { title: "Browse Workers", href: "/browse-workers", icon: Search },
        { title: "Profile", href: "/employer/profile", icon: User },
        { title: "Settings", href: "/employer/settings", icon: Settings },
        {
          title: "Logout",
          href: "/",
          icon: LogOut,
          onClick: () => {
            window.location.href = "/";
          },
        },
      ];
    case "worker":
      return [
        ...baseItems.slice(0, 1),
        { title: "Job Offers", href: "/worker/job-offers", icon: Briefcase },
        { title: "Applications", href: "/worker/applications", icon: Clock },
        ...baseItems.slice(1),
        {
          title: "Logout",
          href: "/",
          icon: LogOut,
          onClick: () => {
            window.location.href = "/";
          },
        },
      ];
    case "agency":
      return [
        ...baseItems.slice(0, 1),
        { title: "Workers", href: "/agency/workers", icon: Users },
        ...baseItems.slice(1),
        {
          title: "Logout",
          href: "/",
          icon: LogOut,
          onClick: () => {
            window.location.href = "/";
          },
        },
      ];
    case "admin":
      return [
        ...baseItems.slice(0, 1),
        { title: "Profile", href: "/admin/profile", icon: User },
        {
          title: "Logout",
          href: "/",
          icon: LogOut,
          onClick: () => {
            window.location.href = "/";
          },
        },
      ];
    default:
      return baseItems;
  }
};

export function UnifiedSidebar({
  userRole,
  userName,
  userEmail,
  userAvatar,
  onCollapsedChange,
}: UnifiedSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const navigationItems = getNavigationItems(userRole);

  const handleSignOut = async () => {
    try {
      // Clear any stored user data
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("token");

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback redirect
      window.location.href = "/";
    }
  };

  const NavItems = ({
    className,
    isCollapsed = false,
  }: {
    className?: string;
    isCollapsed?: boolean;
  }) => (
    <nav className={cn("space-y-2", className)}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const isLogout = item.title === "Logout";

        if (item.onClick) {
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isCollapsed ? "px-2" : "px-3",
                isLogout
                  ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 hover:border-red-200 dark:hover:border-red-500/30 border border-transparent"
                  : "text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
              )}
              onClick={() => {
                item.onClick?.();
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isLogout && "text-red-600 dark:text-red-400"
                )}
              />
              {!isCollapsed && (
                <>
                  {item.title}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isCollapsed ? "px-2" : "px-3",
              isActive
                ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                : "text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && (
              <>
                {item.title}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile menu button - only shows on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        {/* Menu toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-10 w-10 p-0 bg-background/95 backdrop-blur-sm border-border/50 hover:bg-background shadow-lg text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile content padding to prevent overlap */}
      <div className="lg:hidden h-16"></div>

      {/* Mobile Sidebar - completely hidden on small screens when closed */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="flex flex-col w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Mobile navigation menu</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-sidebar-border">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    J
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Jobza
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-6">
              <NavItems />
            </div>

            {/* User Profile */}
            <div className="border-t border-sidebar-border p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-3 py-2 text-sm h-auto text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={userAvatar || "/placeholder.svg"}
                        alt={userName}
                      />
                      <AvatarFallback className="text-xs">
                        {userName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {userName || "User"}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-white/70">
                        {userEmail}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${userRole}/profile`}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - only visible on large screens */}
      <div
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            {!collapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    J
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Jobza
                </span>
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newCollapsed = !collapsed;
                setCollapsed(newCollapsed);
                onCollapsedChange?.(newCollapsed);
              }}
              className={cn(
                "p-1 h-8 w-8 transition-all duration-300 text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white",
                collapsed ? "mx-auto" : "ml-auto"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6">
            <NavItems isCollapsed={collapsed} />
          </div>

          {/* User Profile */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 text-sm h-auto text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={userAvatar || "/placeholder.svg"}
                      alt={userName}
                    />
                    <AvatarFallback className="text-xs">
                      {userName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {userName || "User"}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-white/70">
                        {userEmail}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${userRole}/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile overlay - only shows when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
