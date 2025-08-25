import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PrefetchLink from '@/components/PrefetchLink';
import EliteSidebar from '@/components/EliteSidebar';
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
  Bell,
  Router,
  Brain,
  PhoneCall,
  ChevronDown,
  ChevronRight
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

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[320px_1fr] lg:grid-cols-[320px_1fr] animate-fade-in">
      {/* Desktop Elite Sidebar */}
      <div className="hidden md:block">
        <EliteSidebar />
      </div>

      <div className="flex flex-col">
        {/* Mobile Elite Header */}
        <header className="flex h-16 items-center gap-4 border-b border-gray-200/50 px-4 lg:h-[70px] lg:px-6 md:hidden bg-gradient-to-r from-slate-50 to-blue-50 backdrop-blur-xl relative overflow-hidden">
          {/* Elite Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
          
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 h-9 w-9 bg-white/80 border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 relative z-10"
              >
                <Menu className="h-5 w-5 text-gray-600" />
                <span className="sr-only">{t('layout.toggleNavigation')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-80">
              <EliteSidebar />
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 flex items-center gap-3 relative z-10">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-1.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-700 transform rotate-12 translate-y-1"></div>
              <MessageSquare className="w-4 h-4 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-600">{t('layout.companyName')}</h1>
              <div className="text-xs text-gray-500 uppercase tracking-wide">{t('layout.systemType')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative z-10">
            <LanguageSwitcher variant="compact" />
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 bg-white/80 border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 relative"
            >
              <Bell className="h-4 w-4 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            </Button>
          </div>
        </header>

        {/* Desktop Elite Header */}
        <header className="hidden md:flex h-16 items-center gap-4 border-b border-gray-200/50 px-6 lg:h-[70px] lg:px-8 bg-gradient-to-r from-slate-50 to-blue-50 backdrop-blur-xl relative overflow-hidden">
          {/* Elite Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
          
          <div className="flex-1 relative z-10">
            {/* Elite Search Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-700 transform rotate-12 translate-y-1"></div>
                  <MessageSquare className="w-5 h-5 text-white relative z-10" />
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{t('layout.companyName')}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{t('layout.systemType')}</div>
                </div>
              </div>
              
              <div className="ml-8">
                <form
                  className="w-full max-w-md"
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Searching for:', searchQuery);
                  }}
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder={t('layout.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/80 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Elite Right Section */}
          <div className="flex items-center gap-4 relative z-10">
            {/* System Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/70 rounded-lg border border-gray-200/50 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">{t('layout.operational')}</span>
            </div>
            
            {/* Language Switcher */}
            <LanguageSwitcher variant="compact" />
            
            {/* Elite Notification Button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 bg-white/80 border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 relative"
            >
              <Bell className="h-4 w-4 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </div>
            </Button>
            
            {/* Elite User Menu */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-lg border border-gray-200/50 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium text-gray-900">Admin</div>
                <div className="text-xs text-gray-500">Elite User</div>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 animate-slide-up">
          <div className="w-full max-w-full animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
