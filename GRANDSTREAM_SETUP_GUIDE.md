# دليل تكامل Grandstream UCM6304A

## نظرة عامة

يوفر هذا الدليل إرشادات شاملة لتكامل السنترال Grandstream UCM6304A مع نظام CRM. يتيح هذا التكامل إدارة المكالمات، مراقبة الخطوط الداخلية، وتحليل البيانات من خلال واجهة موحدة.

## المتطلبات

### متطلبات الأجهزة
- Grandstream UCM6304A PBX
- اتصال شبكة مستقر
- عنوان IP ثابت للسنترال

### متطلبات البرمجيات
- تفعيل API في السنترال
- إصدار Firmware حديث
- بروتوكول HTTP/HTTPS

## خطوات الإعداد

### 1. إعداد السنترال

#### تفعيل API
```
System Settings → Web Access → HTTP API
- Enable API: Yes
- API Version: v1.0
- Authentication: Basic Auth
```

#### إعداد المستخدم
```
Account → Admin → Create New User
- Username: crm_api
- Password: [كلمة مرور قوية]
- Privileges: API Access, Call Management
```

#### إعداد الشبكة
```
Network Settings → Basic Settings
- Static IP: 192.168.1.100
- Subnet Mask: 255.255.255.0
- Gateway: 192.168.1.1
- DNS: 8.8.8.8
```

### 2. إعداد النظام

#### متغيرات البيئة
```bash
# إضافة إلى ملف .env
GRANDSTREAM_HOST=192.168.1.100
GRANDSTREAM_PORT=8088
GRANDSTREAM_USERNAME=crm_api
GRANDSTREAM_PASSWORD=your_secure_password
GRANDSTREAM_API_VERSION=v1.0
```

#### إعداد قاعدة البيانات
```sql
-- إضافة حقول جديدة لجدول المكالمات
ALTER TABLE "Call" ADD COLUMN "pbx_call_id" TEXT;
ALTER TABLE "Call" ADD COLUMN "extension_from" TEXT;
ALTER TABLE "Call" ADD COLUMN "extension_to" TEXT;
ALTER TABLE "Call" ADD COLUMN "call_direction" TEXT;
```

## الميزات المدعومة

### 1. إدارة المكالمات
- **إجراء مكالمات خارجية**: إجراء مكالمات من خلال واجهة CRM
- **إنهاء المكالمات**: إنهاء المكالمات النشطة
- **تحويل المكالمات**: تحويل المكالمات بين الخطوط الداخلية
- **مؤتمرات صوتية**: إنشاء مؤتمرات متعددة الأطراف

### 2. مراقبة الخطوط
- **حالة الخطوط الداخلية**: مراقبة حالة كل خط (متصل/مشغول/متاح)
- **النشاط المباشر**: تتبع المكالمات النشطة في الوقت الفعلي
- **إحصائيات الاستخدام**: تقارير استخدام الخطوط

### 3. إدارة طوابير الانتظار
- **مراقبة الطوابير**: عرض عدد المكالمات في الانتظار
- **إحصائيات الوكلاء**: عدد الوكلاء المتاحين
- **أوقات الانتظار**: مراقبة أطول أوقات الانتظار

### 4. التسجيل والتوثيق
- **تسجيل المكالمات**: تسجيل تلقائي للمكالمات
- **تخزين التسجيلات**: حفظ التسجيلات في النظام
- **سجل المكالمات**: تسجيل شامل لجميع المكالمات

## API Endpoints

### المكالمات

#### إجراء مكالمة
```javascript
POST /api/grandstream/call/make
{
  "fromExtension": "1001",
  "toNumber": "+201234567890",
  "userId": "user_id_optional"
}
```

#### إنهاء مكالمة
```javascript
POST /api/grandstream/call/{callId}/end
```

#### تحويل مكالمة
```javascript
POST /api/grandstream/call/{callId}/transfer
{
  "targetExtension": "1002"
}
```

### الخطوط الداخلية

#### حالة جميع الخطوط
```javascript
GET /api/grandstream/extensions/status
```

#### حالة خط محدد
```javascript
GET /api/grandstream/extension/{extension}/status
```

### طوابير الانتظار

#### حالة طابور
```javascript
GET /api/grandstream/queue/{queueNumber}/status
```

### التحكم

#### إرسال DTMF
```javascript
POST /api/grandstream/call/{callId}/dtmf
{
  "dtmf": "123*#"
}
```

#### إنشاء مؤتمر
```javascript
POST /api/grandstream/conference/create
{
  "extensions": ["1001", "1002", "1003"]
}
```

## خريطة الخطوط الداخلية

### الأقسام المقترحة
```
1001-1010: المبيعات
1011-1020: الدعم الفني
1021-1030: الموارد البشرية
1031-1040: التسويق
1041-1050: الإدارة
```

### طوابير الانتظار
```
100: المبيعات العامة
200: الدعم الفني
300: خدمة العملاء
400: الطوارئ
```

## الأمان والحماية

### أفضل الممارسات
1. **كلمات مرور قوية**: استخدم كلمات مرور معقدة
2. **تغيير كلمات المرور الافتراضية**: لا تستخدم كلمات المرور الافتراضية
3. **تقييد الوصول**: حدد عناوين IP المسموحة
4. **التشفير**: فعل HTTPS عند الإمكان
5. **مراقبة السجلات**: راقب سجلات الوصول بانتظام

### إعدادات الأمان المطلوبة
```
Security Settings → General Security
- Enable Strong Password: Yes
- Session Timeout: 30 minutes
- Login Attempts: 3 max
- IP Whitelist: Enable
```

## استكشاف الأخطاء

### مشاكل شائعة

#### 1. فشل الاتصال
```
خطأ: Connection refused
الحل: تحقق من عنوان IP والمنفذ
```

#### 2. خطأ المصادقة
```
خطأ: 401 Unauthorized
الحل: تحقق من اسم المستخدم وكلمة المرور
```

#### 3. عدم توفر API
```
خطأ: API not enabled
الحل: فعل API في إعدادات السنترال
```

### أوامر التشخيص

#### اختبار الاتصال
```bash
curl -u admin:password http://192.168.1.100:8088/api/v1.0/status
```

#### اختبار المصادقة
```bash
curl -u username:password http://192.168.1.100:8088/api/v1.0/extensions
```

## مراقبة الأداء

### مؤشرات الأداء الرئيسية
- **زمن الاستجابة**: < 500ms
- **معدل نجاح المكالمات**: > 95%
- **توفر النظام**: > 99.9%
- **استخدام النطاق الترددي**: مراقبة مستمرة

### التنبيهات
- تنبيه عند انقطاع الاتصال
- تنبيه عند فشل المكالمات
- تنبيه عند امتلاء طوابير الانتظار

## النسخ الاحتياطي والاستعادة

### النسخ الاحتياطي اليومي
```bash
# نسخ احتياطي لإعدادات السنترال
curl -u admin:password http://192.168.1.100:8088/api/v1.0/backup > backup_$(date +%Y%m%d).tar.gz
```

### استعادة الإعدادات
```bash
# استعادة من ملف النسخ الاحتياطي
curl -u admin:password -X POST -F "file=@backup.tar.gz" http://192.168.1.100:8088/api/v1.0/restore
```

## التحديثات والصيانة

### تحديث Firmware
1. تحميل أحدث إصدار من Grandstream
2. نسخ احتياطي كامل قبل التحديث
3. تطبيق التحديث خلال ساعات عدم الذروة
4. اختبار جميع الوظائف بعد التحديث

### صيانة دورية
- فحص سجلات النظام أسبوعياً
- تنظيف ملفات التسجيل شهرياً
- مراجعة إعدادات الأمان ربع سنوياً
- تحديث كلمات المرور كل 6 أشهر

## الدعم الفني

### موارد المساعدة
- [وثائق Grandstream الرسمية](https://www.grandstream.com/support)
- [منتدى المطورين](https://forum.grandstream.com)
- [قاعدة المعرفة](https://www.grandstream.com/knowledge-base)

### معلومات الاتصال
- البريد الإلكتروني: support@company.com
- الهاتف: +20-XXX-XXXXXXX
- ساعات العمل: 9:00 ص - 5:00 م (من الأحد إلى الخميس)

---

تاريخ آخر تحديث: أغسطس 2025
إصدار الوثيقة: 1.0