# 🚀 نظام CRM المتقدم - Advanced CRM Platform

نظام إدارة علاقات العملاء متكامل مع تقنيات الذكاء الاصطناعي ومعالجة الصوت.

<!-- Deployment trigger: 2025-09-12 -->

## ✨ المميزات الرئيسية

### 🎯 نظام مركز الاتصالات المتقدم

- **تكامل Twilio**: مكالمات صوتية حقيقية مع أرقام هاتف فعلية
- **تسجيل تلقائي**: جميع المكالمات يتم تسجيلها وحفظها في السحابة
- **Webhooks ذكية**: معالجة فورية لأحداث المكالمات

### 🗣️ تحويل الصوت إلى نص (Speech-to-Text)

- **Google Speech-to-Text**: تحويل دقيق للمكالمات العربية والإنجليزية
- **معالجة متعدد�� المتحدثين**: تمييز أصوات مختلفة في المكالمة
- **دقة عالية**: معدل دقة يصل إلى 95%+

### 🤖 الذكاء الاصطناعي المتقدم

- **تحليل ذكي بـ GPT-4**: فهم محتوى المكالمات وتحليل المشاعر
- **ردود احترافية**: إنشاء ردود مخصصة حسب القسم والسياق
- **تصنيف تلقائي**: تحديد الأولوية والفئة والإجراءات المطلوبة

### 🎙️ توليد الردود الصوتية

- **متعدد المقدمين**: ElevenLabs، Google TTS، Azure، AWS Polly
- **أصوات طبيعية**: تحويل النصوص إلى ردود صوتية احترافية
- **تخصيص متقدم**: سرعة، نبرة، ومشاعر قابلة للتعديل

## 🏗️ البنية التقنية

### Frontend (React + TypeScript)

```text
client/
├── components/        # مكونات واجهة المستخدم
├── pages/             # صفحات التطبيق
├── hooks/             # React hooks مخصصة
└── lib/               # مكتبات مساعدة
```

### Backend (Node.js + Express)

```text
server/
├── services/              # خدمات التكامل الخارجي
│   ├── twilio.ts          # تكامل Twilio
│   ├── speechToText.ts    # Google Speech-to-Text
│   ├── openai.ts          # تحليل ذكي بـ OpenAI
│   └── textToSpeech.ts    # توليد صوتي
├── routes/                # API endpoints
└── index.ts               # خادم Express
```

### Database (Firebase Realtime Database)

```text
calls/               # سجلات المكالمات
└── aiReplies/       # الردود المولدة
```

## 📦 التثبيت والإعداد

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd advanced-crm
npm install
```

### 2. إعداد متغيرات البيئة

```bash
cp .env.example .env
```

إضافة المفاتيح المطلوبة في `.env`:

```bash
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Google Speech-to-Text
GOOGLE_SPEECH_API_KEY=xxxxxxxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxx

# Voice Generation
ELEVENLABS_API_KEY=xxxxxxxxxx
AZURE_SPEECH_KEY=xxxxxxxxxx

# Firebase
FIREBASE_API_KEY=xxxxxxxxxx
FIREBASE_PROJECT_ID=your-project
```

### 3. تشغيل التطبيق

```bash
npm run dev
```

## 🔧 استخدام النظام

### إجراء مكالمة جديدة

1. انتقل إلى **مركز الاتصالات**
2. اضغط **"بدء مكالمة جديدة"**
3. سيتم تسجيل المكالمة تلقائياً

### معالجة المكالمات تلقائياً

1. **انتهاء المكالمة** → webhook يتم إرساله لـ Twilio
2. **تحويل الصوت** → Google Speech-to-Text يحول التسجيل إلى نص
3. **تحليل ذكي** → GPT-4 يحلل المحتوى ويستخرج الرؤى
4. **إنشاء الرد** → توليد رد احترافي مناسب للسياق
5. **توليد صوتي** → تحويل الرد إلى ملف صوتي

## 🛠️ API Documentation

### Twilio Webhooks

```http
POST /api/webhooks/twilio/voice
POST /api/webhooks/twilio/status
POST /api/webhooks/twilio/recording
```

### معالجة المكالمات

```http
# معالجة مكالمة محددة
POST /api/webhooks/process-call/:callId

# إعادة إنشاء الرد الذكي
POST /api/webhooks/call/:callId/regenerate-response
```

### إدارة النظام

```http
# عرض طابور المعالجة
GET /api/webhooks/processing-queue
```

### إحصائيات متقدمة

- **معدل الرد**: نسبة المكالمات المجابة
- **معدل التحويل**: دقة تحويل الصوت إلى نص
- **رضا العملاء**: تقييم الردود الذكية
- **كفاءة النظام**: زمن الاستجابة والمعالجة

### تقارير تفصيلية

- تحليل المشاعر للمكالمات
- أداء الأقسام المختلفة
- اتجاهات الاستخدام الشهرية

### الأمان والخصوصية (ملخص)

- **تشفير البيانات**: جميع التسجيلات والنصوص مشفرة
- **قواعد Firebase**: تحكم دقيق في الصلاحيات

```javascript
// مثال على قواعد Firebase (توضيحي)
{
  "rules": {}
}
```

## 🚀 النشر في الإنتاج

### إعداد الخادم

```bash
# بناء التطبيق
npm run build

# تشغيل في الإنتاج
npm start
```

### متطلبات الخادم

- **Node.js 18+**
- **SSL Certificate** (لـ Webhooks)
- **Domain مخصص** (للواجهة الأمامية)

### مراقبة النظام

- مراجعة سجلات Firebase
- مراقبة استخدام APIs الخارجية
- تنبيهات الأخطاء والصيانة

## 🔧 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. فشل Twilio Webhook

```bash
# تحقق من URL
curl -X POST https://your-domain.com/api/webhooks/twilio/voice

# مراجعة logs
tail -f /var/log/app/webhook.log
```

#### 2. خطأ في تحويل الصوت

- تأكد من تنسيق الصوت (MP3, WAV)
- فحص Google API quota
- التحقق من جودة الصوت

#### 3. فشل الذكاء الاصطناعي

- مراجعة OpenAI API limits
- فحص طول النص المدخل
- التأكد من صحة المفاتيح

## 📈 خطط التطوير المستقبلية

## ⚡ تحسينات الأداء (Phase 2.1)

### تقسيم الكود (Code Splitting)

تم تحويل الصفحات الثقيلة إلى تحميل كسول باستخدام `React.lazy` و `Suspense` مع مكون تحميل موحد `LoadingSpinner`، مع إبقاء لوحة التحكم (Dashboard) محمّلة مسبقاً.

| Chunk | يحتوي |
| radix | حزمة مكونات Radix UI |
| charts | مكتبة Recharts |
| three | three.js + @react-three/* |

يساعد ذلك على تقليل زمن تحميل أولي وتسريع التنقل الداخلي.

### التحميل المسبق الذكي (Prefetch)

أضيف مكون `PrefetchLink` الذي يقوم بتحميل الـ chunk الخاص بالصفحة عند:

- ظهور الرابط داخل نافذة العرض (IntersectionObserver)
- أو مرور المؤشر (Hover)

هذا يقلل زمن الانتقال الفعلي عند الضغط على الرابط.

### تحليل الحزمة (Bundle Analysis)

يمكنك إنشاء تقرير بصري لحجم الحزم:

```bash
ANALYZE=1 npm run build
```

سيتم إنشاء الملف: `dist/spa/stats.html`

### اختبارات i18n

تمت إضافة اختبارات تغطي دوال: `formatCurrency`, `formatNumber`, `plural`, واتجاه اللغة.

## 🌍 المرحلة 3: نظام i18n متقدم (Lazy Loading & Fallback)

تم تطوير نظام الترجمة ليدعم التحميل الديناميكي (Lazy Loading) وحلقات fallback ذكية بدون تحميل جميع اللغات مسبقاً.

### ✅ ما الذي أضفناه؟

| الميزة | الوصف |
|--------|-------|
| Lazy Loading | تحميل ملفات JSON لكل نطاق (Domain) فقط عند الحاجة باستخدام `import.meta.glob` |
| Fallback Chain | تسلسل تلقائي: `ar-EG-x → ar-EG → ar → en` و `ar-EG → ar → en` و `ar → en` |
| Direction & RTL | ضبط `dir` و `lang` و إضافة صنف `rtl` على `<html>` تلقائياً |
| Missing Key Logging | تسجيل أول مرة فقط لكل مفتاح مفقود: `[i18n] Missing translation for ar-EG:dashboard.someKey` |
| Domain Tracking | أي استدعاء `t('domain.key')` يضيف الـ domain لقائمة prefetch الذكية |
| Prefetch | عند تغيير اللغة أو في التهيئة يتم تسخين (warm) نطاقات أساسية: `common`, `nav`, `dashboard` |
| Browser Detection | اختيار اللغة تلقائياً في أول زيارة من `navigator.language` إذا لم يُخزن تفضيل مسبقاً |
| Persistent Choice | تخزين اللغة في `localStorage` (`crm-language`) |
| Pseudo Locale | دعم `ar-EG-x` للاختبارات المستقبلية (مثلاً تشويه نصوص للتوسع البصري) |
| اختبارات ترجمة | اختبار fallback + تسجيل المفاتيح المفقودة مرة واحدة + الاستعداد (ready flag) |

### 🧠 كيف يعمل التحميل الديناميكي؟

يتم إنشاء خريطة تحميل:

```ts
const moduleLoaders = import.meta.glob('/locales/**/!(_)*.json', { import: 'default' });
```

وعند أول طلب لمفتاح من نطاق (مثل `dashboard.title`) يتم ضمان تحميل ملف: `/locales/<locale>/dashboard.json` فقط.

### 🔁 منطق الـ Fallback

1. يحاول اللغة الحالية (مثلاً `ar-EG`)
2. اللغة الأساسية (إن وجدت، `ar`)
3. الإنجليزية `en`
4. عند الفشل: يعيد المفتاح نفسه ويُسجل تحذيراً مرة واحدة.

### 🧪 واجهة الدالة `t`

```ts
t('dashboard.recentActivities.newCall', { name: 'أحمد', type: 'مبيعات' });
```

يدعم استبدال القيم داخل النص بصيغة `{{name}}`.

### 🔍 تسجيل المفاتيح المفقودة

يتم تجنب الضجيج عبر Set داخلي يمنع تكرار نفس التحذير:

```text
[i18n] Missing translation for ar:dashboard.nonexistent
```

### 🚀 إضافة لغة جديدة

1. أنشئ مجلد: `locales/fr/`
2. أضف ملفات نطاقات مطلوبة (مثلاً `common.json`, `nav.json`, `dashboard.json`)
3. حدّث واجهة `Language` في `TranslationContext.tsx` (إن أردت دعمها رسمياً)
4. شغّل فحص المفاتيح (لاحقاً يمكن بناء أداة تفاضل) أو راجع التحذيرات أثناء التشغيل.

### 🧪 الاختبارات

ملف `translation.spec.tsx` يتحقق من:

- الاستعداد `ready` قبل استخدام النصوص
- نجاح fallback
- تسجيل مفتاح مفقود مرة واحدة فقط

### 🛠️ أوامر i18n المساعدة

```bash
npm run i18n:scan      # (مستقبلاً) فحص المفاتيح - سكربت أساس قابل للتوسيع
npm run i18n:pseudo    # إنشاء/تحديث pseudo-locale (ar-EG-x) للتوسيع البصري
```

### 📐 أفضل ممارسات تعريف المفاتيح

- استخدم صيغة `domain.key.subKey`
- حافظ على أسماء موجزة وبدون فراغات
- تجنب تكرار النصوص العابرة – ضعها في `common.json`

### 🧩 أفكار لاحقة

| فكرة | قيمة |
|------|------|
| استخراج المفاتيح غير المستخدمة | تنظيف الحزم وتقليل الحجم |
| دمج ترجمة سحابية (Crowdin / Lokalise) | تسريع دورة الترجمة |
| فهرس تشغيل (runtime index) | كشف مبكر للمفاتيح الناقصة في التطوير |
| واجهة إدارة ترجمات داخل التطبيق | تعديل مباشر بدون إعادة نشر |

---

### خطوات لاحقة مقترحة

- Prefetch انتقائي مبني على تكرار الاستخدام (Analytics)
- Lazy loading لملفات الترجمة عند تعدد اللغات
- قياس Web Vitals (CLS / LCP / FID) عبر أداة مراقبة مستقبلية

### مميزات قادمة

- **🌍 دعم لغات إضافية** (فرنسية، ألمانية، إسبانية)
- **📱 تطبيق موبايل** للمكالمات أثناء التنقل
- **🔄 تكامل CRM إضافي** (Salesforce، HubSpot)
- **📊 ذكاء اصطناعي متقدم** لتوقع سلوك العملاء

### تحسينات تقنية

- **⚡ أداء محسن** مع caching متقدم
- **🔧 APIs محسنة** مع GraphQL
- **🛡️ أمان معزز** مع OAuth 2.0
- **📦 Docker containers** للنشر السهل

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch للميزة الجديدة
3. إضافة tests للكود الجديد
4. إرسال Pull Request

## 📞 الدعم والمساعدة

### الحصول على المساعدة

- **📧 البريد الإلكتروني**: [support@crm-platform.com](mailto:support@crm-platform.com)
- **💬 Discord**: [رابط الخادم](https://discord.gg/crm-platform)
- **📚 Documentation**: [Documentation](https://docs.crm-platform.com)

### التقرير عن الأخطاء

استخدم [GitHub Issues](https://github.com/your-repo/issues) للتقرير عن:

- 🐛 أخطاء برمجية
- 💡 اقتراحات تحسين
- 📖 تحديثات للوثائق

---

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

---

<div align="center">

### 🎉 تم بناؤه بـ ❤️ باستخدام React، Node.js، والذكاء الاصطناعي

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange.svg)](https://firebase.google.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple.svg)](https://openai.com/)

</div>
#   T r i g g e r   d e p l o y m e n t 
 
 #   T r i g g e r   d e p l o y m e n t 
 
 