"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button" // Using original button variants
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    BookOpen, FileText, LogOut, Menu, Users, Link2,
    MessageSquare, Settings, UserCircle, LayoutDashboard, ChevronLeft, ChevronRight
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
// Assuming these components exist and paths are correct
// import { FreeTrialBanner } from "@/components/free-trial-banner"
import { Logo } from "@/components/logo" // Adjust path if needed

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false); // <--- New state for hydration fix
  const pathname = usePathname()
  const router = useRouter();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // --- Effect to check mobile size (runs only client-side) ---
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
    checkIsMobile(); // Initial check
    window.addEventListener("resize", checkIsMobile);
    // Optionally set initial sidebar state based on mobile status AFTER mount
    if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
    }
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []); // Empty dependency array runs once on mount

  // --- Effect to signal component has mounted (runs only client-side) ---
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // --- Effect to get user info from localStorage ---
  useEffect(() => {
    // This runs client-side only, so it's safe after hydration
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserName(userData?.name || null);
        setUserEmail(userData?.email || null);
      } else { setUserName(null); setUserEmail(null); }
    } catch (error) { console.error("Error parsing user data:", error); setUserName(null); setUserEmail(null); }
  }, []); // Empty dependency array runs once on mount

  // --- Effect to redirect from /dashboard root ---
  useEffect(() => {
    if (pathname === "/dashboard") {
      router.replace("/dashboard/assignments");
    }
  }, [pathname, router]);

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  // --- Logout Handler ---
  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUserName(null); setUserEmail(null);
      router.push('/login');
  };

  // --- Navigation Items Component ---
  const NavItems = ({ mobile = false }: { mobile?: boolean }) => {
    const navLinks = [
        { href: "/dashboard/courses", icon: BookOpen, label: "Courses" },
        { href: "/dashboard/assignments", icon: FileText, label: "Assignments" },
        { href: "/dashboard/classroom", icon: Users, label: "Classroom" },
        { href: "/dashboard/integrations", icon: Link2, label: "Integrations" },
    ];

    return (
        <>
            {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                    <Button
                        key={link.href}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start text-sm font-normal group transition-colors duration-150",
                            isSidebarCollapsed && !mobile ? "justify-center px-2 h-10" : "px-3 h-10",
                            !isActive && "hover:bg-accent focus-visible:bg-accent hover:text-accent-foreground focus-visible:text-accent-foreground text-muted-foreground",
                            isActive && "text-secondary-foreground dark:text-secondary-foreground"
                        )}
                        asChild
                    >
                        <Link href={link.href}>
                            <link.icon className={cn(
                                "h-4 w-4 transition-colors",
                                isSidebarCollapsed && !mobile ? "mr-0" : "mr-3",
                                isActive ? "text-secondary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                            )} />
                            {(!isSidebarCollapsed || mobile) && <span>{link.label}</span>}
                        </Link>
                    </Button>
                );
            })}
            <div className="mt-auto pt-6">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-sm font-normal text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                        isSidebarCollapsed && !mobile ? "justify-center px-2 h-10" : "px-3 h-10"
                    )}
                    asChild
                >
                    <a href="https://gradegenie.hipporello.net/desk" target="_blank" rel="noopener noreferrer">
                        <MessageSquare className={cn("h-4 w-4", isSidebarCollapsed && !mobile ? "mr-0" : "mr-3")} />
                        {(!isSidebarCollapsed || mobile) && <span>Feedback</span>}
                    </a>
                </Button>
            </div>
        </>
    );
  };


  // --- Get User Initial ---
   const getUserInitial = () => {
       if (userName && userName.length > 0) return userName[0].toUpperCase();
       if (userEmail && userEmail.length > 0) return userEmail[0].toUpperCase();
       return "U";
   };

   // --- Hydration Check ---
   // Render null or a placeholder until the component has mounted on the client
   // This prevents the initial mismatch between server and client render based on window size
   if (!hasMounted) {
     // Option 1: Render nothing (can cause layout shifts)
     // return null;
     // Option 2: Render a basic placeholder or skeleton
     return (
        <div className="flex min-h-screen flex-col">
            {/* Simplified Header Placeholder */}
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
                <div className="container flex h-16 items-center px-4 sm:px-6">
                    <div className="flex items-center"><Logo size="md" /></div>
                    <div className="flex flex-1 justify-end"><div className="h-10 w-10 rounded-full bg-muted"></div></div>
                </div>
            </header>
            <div className="flex flex-1">
                {/* Sidebar Placeholder */}
                 <aside className={cn("hidden lg:flex flex-col border-r border-border bg-background", isSidebarCollapsed ? "lg:w-20" : "lg:w-64")}></aside>
                 {/* Main Content Area Placeholder */}
                 <main className={cn("flex-1", isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}></main>
            </div>
        </div>
     );
   }

  // --- Main Render Output (runs only after mount) ---
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      {/* <FreeTrialBanner ... /> */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center">
            {/* Mobile Menu Trigger - Now correctly rendered only when isMobile is true AND mounted */}
            {isMobile && ( // Check isMobile here
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2 lg:hidden text-muted-foreground">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px] p-0 bg-background border-r">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center border-b px-4 h-16">
                       <Link href="/dashboard/assignments" className="flex items-center" aria-label="Go to assignments dashboard">
                            <Logo size="md" asChild />
                       </Link>
                    </div>
                    <nav className="flex flex-col space-y-1.5 p-3 flex-grow">
                      <NavItems mobile={true} />
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {/* Desktop Logo */}
            <Link href="/dashboard/assignments" className="flex items-center" aria-label="Go to assignments dashboard">
                <Logo size="md" asChild />
            </Link>
          </div>

          {/* Right Side Header Items */}
          <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-3">
            <Button variant="ghost" size="sm" className="h-9 hidden sm:flex items-center text-muted-foreground hover:text-accent-foreground hover:bg-accent" asChild>
              <a href="https://gradegenie.hipporello.net/desk" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-1.5 h-4 w-4" /> Feedback
              </a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                 <DropdownMenuLabel>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium leading-none truncate" title={userName || ''}>{userName || "My Account"}</p>
                      {userEmail && <p className="text-xs leading-none text-muted-foreground truncate" title={userEmail}>{userEmail}</p>}
                    </div>
                 </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/profile"> <UserCircle className="mr-2 h-4 w-4" /> <span>Profile</span> </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings"> <Settings className="mr-2 h-4 w-4" /> <span>Settings</span> </Link>
                 </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="https://gradegenie.hipporello.net/desk" target="_blank" rel="noopener noreferrer"> <MessageSquare className="mr-2 h-4 w-4" /> <span>Feedback</span> </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar - Render based on isMobile state only AFTER mount */}
        <aside
          className={cn(
            "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex flex-col border-r border-border", // Use lg:flex now
            "bg-background",
            "transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "lg:w-20" : "lg:w-64",
          )}
        >
          <div className="flex flex-col px-3 py-4 h-full relative flex-grow pt-20">
             <Button
               variant="outline"
               size="icon"
               className="absolute right-0 translate-x-1/2 top-20 h-7 w-7 rounded-full border bg-background hover:bg-accent p-0 z-10 shadow-sm text-muted-foreground hover:text-accent-foreground"
               onClick={toggleSidebar}
               aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
             >
               {isSidebarCollapsed ? ( <ChevronRight className="h-4 w-4" /> ) : ( <ChevronLeft className="h-4 w-4" /> )}
             </Button>
             <nav className="flex flex-col space-y-1.5 flex-grow mt-4">
                <NavItems />
             </nav>
          </div>
        </aside>

        {/* Page Content */}
        <main className={cn(
            "flex-1 overflow-y-auto",
            "transition-all duration-300 ease-in-out",
            // Adjust margin based on sidebar state only AFTER mount and on desktop
             isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}>
            <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
                {children}
            </div>
        </main>
      </div>
    </div>
  )
}
