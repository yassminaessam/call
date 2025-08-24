import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PrefetchLink from '@/components/PrefetchLink';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Home,
  Phone,
  TrendingUp,
  Users,
  Target,
  Factory,
  HeadphonesIcon,
  MessageSquare,
  Settings,
  Search,
  User,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/TranslationContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface CRMLayoutProps {
  children: React.ReactNode;
}

export default function CRMLayout({ children }: CRMLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isRTL, language } = useTranslation();

  // Force re-render when language changes by using useMemo or recreating array in render
  const navigation = useMemo(() => [
    { name: t('nav.dashboard'), href: "/", icon: Home },
    { name: t('nav.callCenter'), href: "/calls", icon: Phone },
    { name: t('nav.sales'), href: "/sales", icon: TrendingUp },
    { name: t('nav.hr'), href: "/hr", icon: Users },
    { name: t('nav.marketing'), href: "/marketing", icon: Target },
    { name: t('nav.manufacturing'), href: "/manufacturing", icon: Factory },
    { name: t('nav.support'), href: "/support", icon: HeadphonesIcon },
    { name: t('nav.aiAnswering'), href: "/ai-answering", icon: MessageSquare },
    { name: t('nav.settings'), href: "/settings", icon: Settings }
  ], [t, language]);

  // Debug logging
  React.useEffect(() => {
    console.log('🌐 CRMLayout language changed:', language);
    console.log('🌐 Navigation items:', navigation.map(nav => nav.name));
  }, [language, navigation]);

  const NavLink = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href || 
      (item.href !== "/" && location.pathname.startsWith(item.href));
    
    const prefetchEligible = item.href !== '/';
    return (
      <PrefetchLink
        to={item.href}
        prefetch={prefetchEligible ? 'hover-visible' : 'none'}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          isActive 
            ? "bg-accent text-accent-foreground font-medium" 
            : "text-muted-foreground"
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="h-4 w-4" />
        {item.name}
      </PrefetchLink>
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-6 w-6 rounded bg-primary" />
          <span>{t('layout.companyName')}</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <div className="py-2">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            {t('layout.systemStatus')}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {t('layout.allSystemsOperational')}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>

      <div className="flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('layout.toggleNavigation')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{t('layout.companyName')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="compact" />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="flex-1">
            <form
              className="w-full max-w-sm"
              onSubmit={(e) => {
                e.preventDefault();
                // Global search functionality can be added here
                console.log('Searching for:', searchQuery);
              }}
            >
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('layout.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8"
                />
              </div>
            </form>
          </div>
          <LanguageSwitcher variant="compact" />
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              // User menu functionality can be added here
              console.log('User menu clicked');
            }}
          >
            <User className="h-4 w-4" />
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
