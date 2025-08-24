import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info,
  X,
  Trash2
} from "lucide-react";
import { useCRMState } from "@/hooks/use-crm-state";
import { useTranslation } from "@/contexts/TranslationContext";

export default function NotificationSystem() {
  const { t } = useTranslation();
  const { state, markNotificationRead, clearNotifications } = useCRMState();
  const unreadCount = state.notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('notifications.justNow');
    if (diffInMinutes < 60) return t('notifications.minutesAgo', { count: diffInMinutes });
    if (diffInMinutes < 1440) return t('notifications.hoursAgo', { count: Math.floor(diffInMinutes / 60) });
    return t('notifications.daysAgo', { count: Math.floor(diffInMinutes / 1440) });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">{t('notifications.title')}</h3>
          {state.notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearNotifications}
              className="h-8 px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {state.notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{t('notifications.empty')}</p>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="p-2 space-y-2">
              {state.notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-colors ${
                    notification.read ? 'opacity-60' : 'bg-accent/50'
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground ml-2">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
