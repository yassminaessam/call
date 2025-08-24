# 🌍 Translation System Documentation

## Overview

This CRM platform includes a comprehensive translation system supporting **Arabic** and **English** with full **RTL (Right-to-Left)** layout support, localized formatting, and dynamic content translation.

## ✨ Features

### 🔄 **Bidirectional Text Support**
- Automatic RTL/LTR direction switching
- CSS-based layout adjustments for margins, padding, and alignment
- Icon and component positioning adjustments

### 🌐 **Localized Formatting**
- **Numbers**: Locale-aware number formatting
- **Currency**: Multi-currency support with proper symbols
- **Dates**: Full date/time formatting with locale preferences
- **Relative Time**: "2 hours ago" in both languages

### 🎯 **Dynamic Translation**
- Instant language switching without page reload
- Context-aware translations for different modules
- Parameter substitution for dynamic content

### 💾 **Persistence**
- Language preference saved to localStorage
- Automatic language detection on app load
- Document direction and language attributes updated

## 🛠️ Implementation

### Core Components

#### 1. **TranslationContext** (`client/contexts/TranslationContext.tsx`)
```typescript
// Usage
const { t, language, setLanguage, isRTL } = useTranslation();

// Basic translation
const title = t('callCenter.title');

// With parameters
const message = t('common.welcome', { name: 'John' });
```

#### 2. **LanguageSwitcher** (`client/components/LanguageSwitcher.tsx`)
```typescript
// Three variants available
<LanguageSwitcher variant="default" />   // Full dropdown with flags
<LanguageSwitcher variant="compact" />   // Compact button
<LanguageSwitcher variant="icon" />      // Icon only
```

#### 3. **Translation Utilities** (`client/hooks/useTranslation.ts`)
```typescript
const { 
  formatNumber, 
  formatCurrency, 
  formatDate, 
  formatTime,
  formatRelativeTime 
} = useTranslationUtils();

// Examples
formatNumber(1234.56)        // 1,234.56 (EN) | ١٬٢٣٤٫٥٦ (AR)
formatCurrency(100, 'USD')   // $100.00 (EN) | US$ ١٠٠٫٠٠ (AR)
formatDate(new Date())       // January 15, 2024 (EN) | ١٥ يناير ٢٠٢٤ (AR)
```

### Translation Files Structure

```typescript
const translations = {
  ar: {
    common: {
      save: 'حفظ',
      cancel: 'إلغاء',
      // ...
    },
    nav: {
      dashboard: 'لوحة التحكم',
      callCenter: 'مركز الاتصالات',
      // ...
    },
    callCenter: {
      title: 'مركز الاتصالات المتقدم',
      subtitle: 'نظام متكامل مع Twilio...',
      // ...
    }
  },
  en: {
    // English translations...
  }
};
```

### RTL CSS Support (`client/styles/rtl.css`)

Automatic CSS adjustments for RTL layout:

```css
/* Margin/Padding adjustments */
[dir="rtl"] .mr-2 { margin-right: 0; margin-left: 0.5rem; }
[dir="rtl"] .ml-2 { margin-left: 0; margin-right: 0.5rem; }

/* Text alignment */
[dir="rtl"] .text-left { text-align: right; }
[dir="rtl"] .text-right { text-align: left; }

/* Arabic font optimization */
[dir="rtl"] {
  font-family: 'Segoe UI', 'Tahoma', 'Noto Sans Arabic', 'Arial', sans-serif;
  line-height: 1.8;
  letter-spacing: 0.025em;
}
```

## 📚 Usage Guide

### 1. **Basic Translation**
```typescript
import { useTranslation } from '@/contexts/TranslationContext';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <h1>{t('dashboard.title')}</h1>
  );
};
```

### 2. **With Parameters**
```typescript
const message = t('common.welcome', { 
  name: 'أحمد', 
  count: 5 
});
// Result: "مرحباً {{name}}، لديك {{count}} رسائل جديدة"
```

### 3. **Conditional Rendering**
```typescript
const { isRTL } = useTranslation();

return (
  <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
    {/* Content */}
  </div>
);
```

### 4. **Localized Formatting**
```typescript
const { formatCurrency, formatDate } = useTranslationUtils();

return (
  <div>
    <span>{formatCurrency(1500, 'USD')}</span>
    <span>{formatDate(new Date())}</span>
  </div>
);
```

## 🎨 Integration Examples

### Update Existing Components

#### Before:
```typescript
<Button>Save Changes</Button>
<h1>Call Center</h1>
<Badge>Completed</Badge>
```

#### After:
```typescript
<Button>{t('common.save')}</Button>
<h1>{t('callCenter.title')}</h1>
<Badge>{t('callCenter.statuses.completed')}</Badge>
```

### Add Language Switcher

```typescript
// In layout header
<div className="flex items-center gap-2">
  <LanguageSwitcher variant="compact" />
  <Button variant="outline" size="icon">
    <Bell className="h-4 w-4" />
  </Button>
</div>
```

## 📖 Translation Keys Reference

### Common Keys
- `common.save` - Save
- `common.cancel` - Cancel  
- `common.delete` - Delete
- `common.edit` - Edit
- `common.view` - View
- `common.search` - Search
- `common.loading` - Loading...
- `common.error` - Error
- `common.success` - Success

### Navigation Keys
- `nav.dashboard` - Dashboard
- `nav.callCenter` - Call Center
- `nav.sales` - Sales
- `nav.hr` - HR
- `nav.marketing` - Marketing
- `nav.manufacturing` - Manufacturing
- `nav.support` - Support
- `nav.aiAnswering` - AI Answering
- `nav.settings` - Settings

### Call Center Keys
- `callCenter.title` - Advanced Call Center
- `callCenter.subtitle` - Integrated system with Twilio...
- `callCenter.startNewCall` - Start New Call
- `callCenter.endCall` - End Call
- `callCenter.statuses.completed` - Completed
- `callCenter.statuses.missed` - Missed
- `callCenter.statuses.ongoing` - Ongoing

## 🔧 Configuration

### Environment Setup

No additional environment variables needed. The translation system works out of the box.

### Adding New Languages

1. **Add language to context**:
```typescript
// In TranslationContext.tsx
export type Language = 'ar' | 'en' | 'fr'; // Add new language
```

2. **Add translations**:
```typescript
const translations = {
  ar: { /* Arabic */ },
  en: { /* English */ },
  fr: { /* French */ } // Add new translation object
};
```

3. **Update language switcher**:
```typescript
// In LanguageSwitcher.tsx
const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' } // Add new language
];
```

### Adding New Translation Keys

1. **Add to translation objects**:
```typescript
const translations = {
  ar: {
    newModule: {
      title: 'العنوان الجديد',
      description: 'الوصف الجديد'
    }
  },
  en: {
    newModule: {
      title: 'New Title',
      description: 'New Description'
    }
  }
};
```

2. **Use in components**:
```typescript
const title = t('newModule.title');
const description = t('newModule.description');
```

## 🚀 Demo Page

Visit `/translation-demo` to see the translation system in action:

- **Live Language Switching**: See instant updates
- **RTL Layout Demo**: Watch layout changes
- **Localized Formatting**: Numbers, dates, currency
- **UI Components**: Translated buttons, badges, forms

## 🔍 Testing

### Manual Testing Checklist

- [ ] Language switching works instantly
- [ ] RTL layout adjusts properly
- [ ] All UI text translates correctly
- [ ] Numbers format according to locale
- [ ] Dates display in correct format
- [ ] Currency shows proper symbols
- [ ] Layout direction is correct
- [ ] Language preference persists
- [ ] All modules support translation

### Browser Testing

- [ ] Chrome
- [ ] Firefox  
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## 🐛 Troubleshooting

### Common Issues

1. **Translation key not found**:
   - Check key exists in both language objects
   - Verify exact key path (case sensitive)
   - Use fallback: `t('key', 'Default text')`

2. **RTL layout issues**:
   - Import RTL CSS: `@import './styles/rtl.css'`
   - Check HTML `dir` attribute is set
   - Verify CSS classes are RTL-aware

3. **Formatting issues**:
   - Ensure locale codes are correct
   - Check browser Intl API support
   - Provide fallback formatting

### Debug Mode

```typescript
// Enable translation debugging
const debugTranslation = (key: string, value: string) => {
  console.log(`Translation: ${key} = ${value}`);
  return value;
};
```

## 🔮 Future Enhancements

### Planned Features
- [ ] Lazy loading for translation files
- [ ] Translation management dashboard
- [ ] Pluralization support
- [ ] Translation validation
- [ ] Export/import translation files
- [ ] Translation completion tracking
- [ ] Context-aware help system

### Additional Languages
- [ ] French (Français)
- [ ] German (Deutsch)
- [ ] Spanish (Español)
- [ ] Chinese (中文)

---

## 📞 Support

For questions about the translation system:

1. Check this documentation
2. Review the demo page (`/translation-demo`)
3. Examine component implementations
4. Test with the language switcher

The translation system is designed to be comprehensive, maintainable, and user-friendly for both developers and end users.
