
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster position="top-right" />
      
      <header className="sticky top-0 z-50 w-full glass-darker backdrop-blur-md bg-white/70 border-b border-border/40">
        <div className="container-page py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="transition-all hover:opacity-80">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Elegance
              </h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/" isActive={isActive("/")}>
                Home
              </NavLink>
              <NavLink to="/items" isActive={isActive("/items")}>
                Items
              </NavLink>
            </nav>
            
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden md:inline">
                    {user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 animate-fade-in">
        {children}
      </main>
      
      <footer className="border-t border-border/40 bg-secondary/50">
        <div className="container-page py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Elegance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/80 hover:text-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </Link>
  );
};

export default Layout;
