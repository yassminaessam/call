import { useTranslation as useTranslationContext } from '@/contexts/TranslationContext';

// Re-export the hook from context for easier importing
export const useTranslation = useTranslationContext;

// Additional utility functions for translation
export const useTranslationUtils = () => {
  const { language, direction, isRTL } = useTranslationContext();

  const formatDirection = (className: string) => {
    if (!isRTL) return className;
    
    // Map LTR classes to RTL equivalents
    const rtlMappings: Record<string, string> = {
      'ml-': 'mr-',
      'mr-': 'ml-',
      'pl-': 'pr-',
      'pr-': 'pl-',
      'left-': 'right-',
      'right-': 'left-',
      'text-left': 'text-right',
      'text-right': 'text-left',
      'justify-start': 'justify-end',
      'justify-end': 'justify-start',
      'rounded-l': 'rounded-r',
      'rounded-r': 'rounded-l',
    };

    let result = className;
    Object.entries(rtlMappings).forEach(([ltr, rtl]) => {
      result = result.replace(new RegExp(ltr, 'g'), rtl);
    });

    return result;
  };

  const getLocalizedPath = (path: string) => {
    // Add language prefix to paths if needed
    return language === 'ar' ? `/ar${path}` : path;
  };

  const formatNumber = (num: number) => {
    // Format numbers according to locale
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(num);
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat(
      language === 'ar' ? 'ar-SA' : 'en-US', 
      {
        style: 'currency',
        currency: currency
      }
    ).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(
      language === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        calendar: language === 'ar' ? 'gregory' : 'gregory'
      }
    ).format(dateObj);
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(
      language === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: language === 'en',
        numberingSystem: 'latn'
      }
    ).format(dateObj);
  };

  const formatRelativeTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const rtf = new Intl.RelativeTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US');
    
    const diff = dateObj.getTime() - Date.now();
    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (Math.abs(diffInDays) > 0) {
      return rtf.format(diffInDays, 'day');
    } else if (Math.abs(diffInHours) > 0) {
      return rtf.format(diffInHours, 'hour');
    } else if (Math.abs(diffInMinutes) > 0) {
      return rtf.format(diffInMinutes, 'minute');
    } else {
      return rtf.format(diffInSeconds, 'second');
    }
  };

  return {
    language,
    direction,
    isRTL,
    formatDirection,
    getLocalizedPath,
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    formatRelativeTime
  };
};

// Helper function for conditional RTL classes
export const rtlClass = (ltrClass: string, rtlClass: string, isRTL: boolean) => {
  return isRTL ? rtlClass : ltrClass;
};

// Helper function to combine classes with RTL awareness
export const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
