import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Phone,
  TrendingUp,
  Users,
  Target,
  Factory,
  HeadphonesIcon,
  MessageSquare,
  Settings,
  Brain,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/TranslationContext";

interface EliteSidebarProps {
  className?: string;
}

export default function EliteSidebar({ className }: EliteSidebarProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const eliteOperations = [
    {
      id: 'dashboard',
      name: t('nav.dashboard') || 'Dashboard',
      description: t('dashboard.subtitle') || 'Elite Operations Dashboard',
      icon: Home,
      href: '/',
      status: 'ACTIVE',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'call-center',
      name: t('nav.callCenter') || 'Call Center',
      description: t('callCenter.description') || 'Call and Communication Management',
      icon: Phone,
      href: '/calls',
      status: 'OPERATIONAL',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'ai-answering',
      name: t('nav.aiAnswering') || 'AI Answering',
      description: t('aiAnswering.description') || 'Smart Response System',
      icon: Brain,
      href: '/ai-answering',
      status: 'AI_ACTIVE',
      isPro: true,
      color: 'from-purple-500 to-blue-600'
    },
    {
      id: 'sales',
      name: t('nav.sales') || 'Sales',
      description: t('sales.description') || 'Sales and Deal Management',
      icon: TrendingUp,
      href: '/sales',
      status: 'ACTIVE',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'hr',
      name: t('nav.hr') || 'Human Resources',
      description: t('hr.description') || 'Employee and HR Management',
      icon: Users,
      href: '/hr',
      status: 'OPERATIONAL',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'marketing',
      name: t('nav.marketing') || 'Marketing',
      description: t('marketing.description') || 'Marketing Campaigns and Customer Management',
      icon: Target,
      href: '/marketing',
      status: 'ACTIVE',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'manufacturing',
      name: t('nav.manufacturing') || 'Manufacturing',
      description: t('manufacturing.description') || 'Production Operations Management',
      icon: Factory,
      href: '/manufacturing',
      status: 'OPERATIONAL',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'support',
      name: t('nav.support') || 'Support',
      description: t('support.description') || 'Customer Service and Technical Support',
      icon: HeadphonesIcon,
      href: '/support',
      status: 'AVAILABLE',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'settings',
      name: t('nav.settings') || 'Settings',
      description: t('settings.description') || 'System Settings and Configuration',
      icon: Settings,
      href: '/settings',
      status: 'READY',
      color: 'from-gray-500 to-slate-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'OPERATIONAL': return 'bg-blue-500';
      case 'AI_ACTIVE': return 'bg-purple-500';
      case 'AVAILABLE': return 'bg-cyan-500';
      case 'READY': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '●';
      case 'OPERATIONAL': return '◉';
      case 'AI_ACTIVE': return '⚡';
      case 'AVAILABLE': return '✓';
      case 'READY': return '○';
      default: return '●';
    }
  };

  return (
    <div className={cn("w-80 h-screen bg-gradient-to-b from-slate-50 to-blue-50 border-r border-gray-200 flex flex-col", className)}>
      {/* Header with Logo */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-700 transform rotate-12 translate-y-1"></div>
            <MessageSquare className="w-8 h-8 text-white relative z-10" />
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600 mb-1">{t('layout.companyName') || 'Fusion CRM'}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">{t('layout.systemType') || 'ELITE CRM SYSTEM'}</div>
        </div>
      </div>

      {/* Elite Operations Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4" />
          <span className="font-bold text-sm">{t('layout.eliteOperations') || 'ELITE OPERATIONS'}</span>
          <Badge className="bg-white/20 text-white text-xs px-2 py-1">
            {eliteOperations.length} {t('nav.items') || 'ITEMS'}
          </Badge>
        </div>
        
        {/* CRM Status */}
        <div className="flex items-center gap-2 mt-3">
          <Zap className="w-4 h-4" />
          <span className="text-sm">{t('layout.crmStatus') || 'CRM Status'}: {t('layout.operational') || 'OPERATIONAL'}</span>
          <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
        </div>
      </div>

      {/* Elite Operations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {eliteOperations.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/" && location.pathname.startsWith(item.href));
          const isHovered = hoveredItem === item.id;

          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "block p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-white border-blue-300 shadow-lg transform scale-105" 
                  : "bg-white/70 border-gray-200 hover:border-blue-200 hover:shadow-md hover:transform hover:scale-102"
              )}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Background gradient on hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300",
                item.color,
                isHovered && "opacity-5"
              )} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-gradient-to-r transition-all duration-300",
                      item.color,
                      isActive ? "shadow-lg" : "shadow-sm"
                    )}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm leading-tight">
                        {item.name}
                      </div>
                      {item.isPro && (
                        <Badge className="bg-purple-500 text-white text-xs px-2 py-1 mt-1">
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", getStatusColor(item.status))} />
                    <ChevronRight className={cn(
                      "w-4 h-4 text-gray-400 transition-all duration-300",
                      isActive && "text-blue-500 transform translate-x-1"
                    )} />
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {item.description}
                </div>

                {/* Status badge */}
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                    getStatusColor(item.status), 
                    "text-white"
                  )}>
                    <span>{getStatusIcon(item.status)}</span>
                    {item.status}
                  </div>
                  
                  {isActive && (
                    <div className="flex items-center text-xs text-blue-600">
                      <Activity className="w-3 h-3 mr-1" />
                      {t('common.active') || 'ACTIVE'}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>{t('layout.systemStatus') || 'System Status'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t('layout.allSystemsOperational') || 'All Systems Operational'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}