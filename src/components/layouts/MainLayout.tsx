import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Calendar, TrendingUp, Settings, Menu, Coffee } from 'lucide-react';
import { useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/monthly', label: 'Monthly View', icon: Calendar },
    { path: '/yearly', label: 'Yearly View', icon: TrendingUp },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`flex ${mobile ? 'flex-col' : 'flex-row'} gap-2`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link key={item.path} to={item.path} onClick={() => mobile && setOpen(false)}>
            <Button
              variant={active ? 'default' : 'ghost'}
              className={`w-full justify-start ${mobile ? 'h-12' : ''}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-6">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden xl:inline-block">Kiran Coffee Works</span>
            <span className="font-bold text-lg xl:hidden">KCW</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1">
            <NavLinks />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden ml-auto">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center gap-2 mb-6">
                  <Coffee className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">Kiran Coffee Works</span>
                </div>
                <NavLinks mobile />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
