<div align="center">

# 🔍 مُكتشف المجلات الأكاديمية (Journal Finder AI)

**أداة ذكاء اصطناعي متقدمة لاقتراح أفضل المجلات العلمية لبحثك**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAlex](https://img.shields.io/badge/Powered%20by-OpenAlex-green)](https://openalex.org/)

[English](#english-version) • [العربية](#النسخة-العربية)

</div>

---

## النسخة العربية

### ✨ لماذا هذه الأداة؟

معظم أدوات اقتراح المجلات تعتمد على الذكاء الاصطناعي فقط، مما يؤدي إلى **هلوسة** (اقتراح مجلات وهمية أو بيانات خاطئة). 

**مُكتشف المجلات الأكاديمية** يحل هذه المشكلة بطريقة ذكية:
- يجلب قائمة مجلات **حقيقية** مباشرة من [OpenAlex API](https://openalex.org)
- يُجبر نموذج الذكاء الاصطناعي على الاختيار **فقط** من هذه القائمة
- يدعم بشكل خاص **المجلات العراقية والعربية**

### 🚀 المميزات الرئيسية

- ✅ **مكافحة الهلوسة** — لا يقترح مجلات غير موجودة
- ✅ **دعم إقليمي قوي** — فلاتر للمجلات العالمية / العراقية / العربية
- ✅ **تحليل ذكي** للعنوان + الملخص + الكلمات المفتاحية
- ✅ **نظام تقييم مفصل** (Topic + Quality + Acceptance + Speed + APC + Publisher + Spread)
- ✅ **نصائح عملية** لزيادة فرص القبول في كل مجلة
- ✅ **دعم متعدد المزودين**: Google Gemini (افتراضي) • Mistral AI • OpenRouter
- ✅ **واجهة عربية كاملة** (RTL)
- ✅ **مجاني ومفتوح المصدر** 100%

### 🛠️ طريقة التشغيل المحلي

**المتطلبات:**
- Node.js 20+
- مفتاح Gemini API مجاني (اختياري إذا استخدمت مزود آخر)

```bash
# 1. استنساخ المشروع
git clone https://github.com/bio-colab/journal-finder-ai.git
cd journal-finder-ai

# 2. تثبيت الاعتماديات
npm install

# 3. إعداد المتغيرات البيئية (اختياري)
cp .env.example .env

# 4. تشغيل التطبيق
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

### 🔑 إعداد مفاتيح API

1. **Google Gemini** (موصى به - مجاني):
   - احصل على المفتاح من: [Google AI Studio](https://aistudio.google.com/app/apikey)
   - أدخله في إعدادات التطبيق (الترس في الأعلى)

2. **Mistral AI** أو **OpenRouter**:
   - أدخل المفتاح الخاص بك في الإعدادات

> **ملاحظة أمان**: مفاتيح API تُحفظ فقط في متصفحك (`localStorage`) ولا تُرسل إلى أي سيرفر.

### 📦 البناء للإنتاج

```bash
npm run build
npm start
```

### 🚀 خيارات النشر المجانية

| المنصة       | التكلفة     | الملاحظات                          |
|-------------|-------------|------------------------------------|
| **Railway**     | مجاني       | ممتاز للمشاريع الكاملة            |
| **Render**      | مجاني       | سهل الاستخدام                     |
| **Vercel**      | مجاني       | يحتاج تعديل بسيط (serverless)     |
| **Google Cloud Run** | مجاني   | كان يُستخدم سابقاً في AI Studio   |

### 📸 لقطات شاشة

(أضف لقطات شاشة هنا بعد النشر)

### 👤 المطور

**إعداد وتطوير:**  
**إلياس شرار (Elias Sharar)**

### 📄 الترخيص

هذا المشروع مرخص تحت رخصة **MIT** — يمكنك استخدامه وتعديله وتوزيعه بحرية.

---

## English Version

### Why Journal Finder AI?

Most journal recommendation tools rely purely on LLMs, which often **hallucinate** fake journals or incorrect metrics.

**Journal Finder AI** solves this intelligently:
- Fetches **real** journals directly from OpenAlex API
- Forces the LLM to recommend **only** from this verified list
- Strong support for **Iraqi and Arab journals**

### Key Features

- Strong **anti-hallucination** mechanism
- Regional filters (Global / Iraqi / Arab)
- Detailed scoring breakdown
- Actionable acceptance advice per journal
- Multi-provider support (Gemini, Mistral, OpenRouter)
- Full Arabic RTL interface
- 100% Free & Open Source

### Quick Start (English)

```bash
git clone https://github.com/bio-colab/journal-finder-ai.git
cd journal-finder-ai
npm install
npm run dev
```

### Credits

**Developed by:** Elias Sharar

### License

MIT License

---

**Made with ❤️ for Arabic-speaking researchers**

<div align="center">
  <sub>Special thanks to OpenAlex for providing excellent open academic data.</sub>
</div>
