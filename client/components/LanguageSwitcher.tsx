import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Globe } from "lucide-react";
import { useTranslation, Language } from "@/contexts/TranslationContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export default function LanguageSwitcher({ 
  variant = 'default', 
  className 
}: LanguageSwitcherProps) {
  const { language, setLanguage, t, ready } = useTranslation() as any; // extended context includes ready

  const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
    { 
      code: 'ar', 
      name: t('common.arabic'), 
      nativeName: 'العربية', 
      flag: '🇸🇦' 
    },
    { 
      code: 'en', 
      name: t('common.english'), 
      nativeName: 'English', 
      flag: '🇺🇸' 
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    console.log('🌐 Language change requested:', newLanguage);
    setLanguage(newLanguage);

    // Force a small delay and then log the state
    setTimeout(() => {
      console.log('🌐 Current language after change:', language);
      console.log('🌐 Document direction:', document.documentElement.dir);
      console.log('🌐 Document language:', document.documentElement.lang);
    }, 100);
  };

  // Provide a lightweight visual when translations not yet ready
  const loadingBadge = !ready ? (
    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
      {t('common.loading')}
    </span>
  ) : null;

  if (variant === 'icon') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn("h-8 w-8", className)}
            title={t('common.language')}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">{t('common.language')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[150px]">
          {loadingBadge && <div className="px-2 py-1 text-xs">{loadingBadge}</div>}
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                language === lang.code && "bg-accent"
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1">{lang.nativeName}</span>
              {language === lang.code && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("gap-2", className)}
          >
            <span className="text-sm">{currentLanguage?.flag}</span>
            <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
            {loadingBadge}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[150px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                language === lang.code && "bg-accent"
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1">{lang.nativeName}</span>
              {language === lang.code && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("gap-2 min-w-[120px] justify-start", className)}
        >
          <Languages className="h-4 w-4" />
          <span className="flex items-center gap-2">
            <span>{currentLanguage?.flag}</span>
            <span>{currentLanguage?.nativeName}</span>
          </span>
          {loadingBadge}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          {t('common.language')}
        </div>
        {loadingBadge && <div className="px-2 pb-1">{loadingBadge}</div>}
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "flex items-center gap-3 cursor-pointer px-2 py-2",
              language === lang.code && "bg-accent"
            )}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {language === lang.code && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
