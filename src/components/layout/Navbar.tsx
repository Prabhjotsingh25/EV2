import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="bg-gradient-primary bg-clip-text text-transparent">EventHub</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Button variant={isActive("/") ? "default" : "ghost"} asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant={isActive("/about") ? "default" : "ghost"} asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button variant={isActive("/events") ? "default" : "ghost"} asChild>
            <Link to="/events">Events</Link>
          </Button>
          <Button variant={isActive("/contact") ? "default" : "ghost"} asChild>
            <Link to="/contact">Contact</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">My Account</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/admin">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
