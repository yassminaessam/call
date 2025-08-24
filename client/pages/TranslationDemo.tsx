import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Languages, 
  CheckCircle, 
  Globe, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Phone,
  MessageSquare
} from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { useTranslationUtils } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function TranslationDemo() {
  const { t, language, isRTL } = useTranslation();
  const { formatNumber, formatCurrency, formatDate, formatTime, formatRelativeTime } = useTranslationUtils();

  // Demo data
  const sampleDate = new Date();
  const sampleAmount = 1234.56;
  const sampleCount = 12345;
  const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

  const features = [
    {
      icon: Languages,
      title: t('translationDemo.features.bidirectional.title'),
      description: t('translationDemo.features.bidirectional.desc'),
      status: t('translationDemo.status.completed')
    },
    {
      icon: Globe,
      title: t('translationDemo.features.formatting.title'),
      description: t('translationDemo.features.formatting.desc'),
      status: t('translationDemo.status.completed')
    },
    {
      icon: CheckCircle,
      title: t('translationDemo.features.dynamic.title'),
      description: t('translationDemo.features.dynamic.desc'),
      status: t('translationDemo.status.completed')
    },
    {
      icon: MessageSquare,
      title: t('translationDemo.features.context.title'),
      description: t('translationDemo.features.context.desc'),
      status: t('translationDemo.status.completed')
    }
  ];

  const demoCards = [
    {
      title: t('nav.callCenter'),
      description: t('callCenter.subtitle'),
      icon: Phone,
      color: "bg-blue-500"
    },
    {
      title: t('nav.sales'),
      description: t('sales.subtitle') || 'Lead tracking and deal management',
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: t('nav.support'),
      description: t('support.subtitle') || 'Customer support and ticket management',
      icon: MessageSquare,
      color: "bg-purple-500"
    },
    {
      title: t('nav.hr'),
      description: t('hr.subtitle') || 'Employee management and attendance tracking',
      icon: Users,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="container max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Languages className="h-10 w-10" />
            {t('translationDemo.title')}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {t('translationDemo.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Current: {language === 'ar' ? 'العربية' : 'English'}
          </Badge>
          <LanguageSwitcher variant="default" />
        </div>
      </div>

      {/* Current Language Info */}
      <Alert className="mb-8">
        <Globe className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>{t('translationDemo.activeLanguage')}:</strong> {language === 'ar' ? 'Arabic (العربية)' : 'English'}
              <span className="mx-2">•</span>
              <strong>{t('translationDemo.direction')}:</strong> {isRTL ? t('translationDemo.directions.rtl') : t('translationDemo.directions.ltr')}
            </div>
            <div className="flex items-center gap-2">
              {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              <span className="text-sm font-mono">{isRTL ? 'RTL' : 'LTR'}</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid gap-8">
        {/* Translation Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {t('translationDemo.featuresSection.title')}
            </CardTitle>
            <CardDescription>
              {t('translationDemo.featuresSection.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {feature.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Localized Formatting Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('translationDemo.formattingSection.title')}
            </CardTitle>
            <CardDescription>
              {t('translationDemo.formattingSection.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">{t('translationDemo.formattingSection.number')}</h4>
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(sampleCount)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('translationDemo.formattingSection.rawValue')}: {sampleCount}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">{t('translationDemo.formattingSection.currency')}</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(sampleAmount)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('translationDemo.formattingSection.rawValue')}: ${sampleAmount}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">{t('translationDemo.formattingSection.date')}</h4>
                  <div className="text-lg font-semibold">
                    {formatDate(sampleDate)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatTime(sampleDate)}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">{t('translationDemo.formattingSection.relative')}</h4>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatRelativeTime(pastDate)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('translationDemo.formattingSection.autoUpdates')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Navigation Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('dashboard.departmentOverview')}
            </CardTitle>
            <CardDescription>
              {t('translationDemo.modulesSection.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {demoCards.map((card, index) => (
                <div key={index} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${card.color} text-white`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    {t('common.view')}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common UI Elements Demo */}
        <Card>
          <CardHeader>
            <CardTitle>{t('translationDemo.commonUISection.title')}</CardTitle>
            <CardDescription>
              {t('translationDemo.commonUISection.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Buttons */}
              <div>
                <h4 className="font-semibold mb-3">{t('translationDemo.commonUISection.actions')}</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button>{t('common.save')}</Button>
                  <Button variant="outline">{t('common.cancel')}</Button>
                  <Button variant="destructive">{t('common.delete')}</Button>
                  <Button variant="secondary">{t('common.edit')}</Button>
                  <Button variant="ghost">{t('common.view')}</Button>
                </div>
              </div>

              <Separator />

              {/* Status Badges */}
              <div>
                <h4 className="font-semibold mb-3">{t('translationDemo.commonUISection.statuses')}</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge>{t('callCenter.statuses.completed')}</Badge>
                  <Badge variant="secondary">{t('callCenter.statuses.ongoing')}</Badge>
                  <Badge variant="destructive">{t('callCenter.statuses.missed')}</Badge>
                  <Badge variant="outline">{t('callCenter.statuses.failed')}</Badge>
                </div>
              </div>

              <Separator />

              {/* Priority Labels */}
              <div>
                <h4 className="font-semibold mb-3">{t('translationDemo.commonUISection.priorities')}</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-red-500">{t('callCenter.priorities.urgent')}</Badge>
                  <Badge className="bg-orange-500">{t('callCenter.priorities.high')}</Badge>
                  <Badge className="bg-yellow-500">{t('callCenter.priorities.medium')}</Badge>
                  <Badge className="bg-green-500">{t('callCenter.priorities.low')}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('translationDemo.implementation.title')}</CardTitle>
            <CardDescription>
              {t('translationDemo.implementation.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">{t('translationDemo.implementation.context.title')}</h4>
                <p className="text-blue-800 text-sm">
                  {t('translationDemo.implementation.context.desc')}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">{t('translationDemo.implementation.rtl.title')}</h4>
                <p className="text-green-800 text-sm">
                  {t('translationDemo.implementation.rtl.desc')}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">{t('translationDemo.implementation.intl.title')}</h4>
                <p className="text-purple-800 text-sm">
                  {t('translationDemo.implementation.intl.desc')}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">{t('translationDemo.implementation.params.title')}</h4>
                <p className="text-orange-800 text-sm">
                  {t('translationDemo.implementation.params.desc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
