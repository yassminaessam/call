# خريطة الخطوط الداخلية - Grandstream UCM6304A

## الأقسام والخطوط الداخلية

### 📞 قسم المبيعات (Sales)
- 1001: مدير المبيعات
- 1002: مندوب مبيعات 1  
- 1003: مندوب مبيعات 2
- 1004: مندوب مبيعات 3
- 1005: مسؤول خدمة العملاء

### 🛠️ قسم الدعم الفني (Support)
- 1011: مدير الدعم الفني
- 1012: فني دعم مستوى 1
- 1013: فني دعم مستوى 2  
- 1014: فني دعم متقدم
- 1015: مسؤول الجودة

### 👥 قسم الموارد البشرية (HR)
- 1021: مدير الموارد البشرية
- 1022: مسؤول التوظيف
- 1023: مسؤول الرواتب
- 1024: مسؤول التدريب
- 1025: مسؤول شؤون الموظفين

### 📈 قسم التسويق (Marketing)  
- 1031: مدير التسويق
- 1032: مسؤول التسويق الرقمي
- 1033: مصمم جرافيك
- 1034: مسؤول المحتوى
- 1035: مسؤول العلاقات العامة

### 🏭 قسم التصنيع (Manufacturing)
- 1041: مدير الإنتاج
- 1042: مسؤول جودة الإنتاج
- 1043: مسؤول المخازن
- 1044: مهندس الإنتاج
- 1045: مسؤول الصيانة

### 🎯 الإدارة العليا (Management)
- 1051: المدير العام
- 1052: نائب المدير العام
- 1053: مدير العمليات
- 1054: المدير المالي
- 1055: أمين السر

## طوابير الانتظار (Call Queues)

### 📞 طابور المبيعات العامة
- Queue: 100
- Extensions: 1001, 1002, 1003, 1004, 1005
- Strategy: Ring All
- Music on Hold: Yes

### 🛠️ طابور الدعم الفني
- Queue: 200  
- Extensions: 1011, 1012, 1013, 1014, 1015
- Strategy: Least Recent
- Priority: High

### 👥 طابور الموارد البشرية
- Queue: 300
- Extensions: 1021, 1022, 1023, 1024, 1025  
- Strategy: Round Robin
- Business Hours Only: Yes

### 🚨 طابور الطوارئ
- Queue: 911
- Extensions: 1051, 1052, 1053
- Strategy: Ring All
- Priority: Emergency

## أرقام خاصة

### خدمات النظام
- *60: Voice Mail Main Menu
- *61: Voice Mail Check  
- *70: Call Recording Start
- *71: Call Recording Stop
- *80: Conference Room 1
- *81: Conference Room 2

### اختبارات النظام
- *43: Echo Test
- *44: Milliwatt Test
- *45: DTMF Test
- *46: Conference Test

## إعدادات الأمان

### كلمات المرور الافتراضية - يجب تغييرها!
- Admin: admin
- User: 123 (للخطوط الداخلية)

### إعدادات الشبكة الآمنة
- Firewall: Enable
- SSH: Disable (unless needed)
- Telnet: Disable  
- SNMP: Disable (unless needed)
- Web HTTPS: Enable (preferred)

## معلومات مهمة

### معلومات الاتصال بالنظام
- IP Address: 192.168.1.100
- Web Interface: http://192.168.1.100:8088
- SIP Port: 5060
- IAX Port: 4569
- API Port: 8088

### مواصفات الجهاز
- Model: UCM6304A
- Max Users: 2000
- Max Concurrent Calls: 200  
- Max Call Recording: Up to storage limit
- Supported Protocols: SIP, IAX, MGCP, H.323

### معلومات الدعم الفني
- Manual: https://www.grandstream.com/support
- Firmware Updates: تحقق شهرياً
- Backup Configuration: أسبوعياً 
- Log Monitoring: يومياً