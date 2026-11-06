# 🏨 سامانه هوشمند و پلتفرم سه‌بعدی رزرو آنلاین هتل (پروژه کارشناسی مهندسی کامپیوتر)
## AURA 3D — Ultra-Luxury Architectural Hotel Booking Experience

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Tests](https://img.shields.io/badge/Unit_Tests-7%20Passed-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Academic_Defense-blue?style=for-the-badge)

**پلتفرم جامع و بین‌المللی جستجو و رزرو لوکس اقامتگاه‌های ۵ ستاره با تجربه بصری تعاملی سه‌بعدی**  
توسعه‌یافته با ترکیب معماری پایدار بک‌اند جنگو (Django 6.0) و رابط کاربری فضایی مدرن ری‌اکت و تری‌جی‌اس (React 19 + Three.js WebGL).

</div>

---

## 🌟 ویژگی‌های برجسته فرانت‌اند سه‌بعدی (AURA 3D Experience)

1. **محیط تعاملی سه‌بعدی سینماتیک در بخش Hero (Hero 3D Architectural Resort)**:
   - رندر بلادرنگ معماری مدرن هتل با تراس‌های شناور، استخر اینفینیتی شیشه‌ای روی بام، پنجره‌های با نور پردازی نئونی و کریستال‌های چرخان طلایی.
   - قابلیت درگ و چرخش آزاد ۳۶۰ درجه دوربین با ماوس و تاچ در محیط سه‌بعدی.
   - تغییر زاویه دید به همراه افکت‌های نرم پارالکس.

2. **کره زمین سه‌بعدی تعاملی (Interactive 3D WebGL Globe)**:
   - رندر سه‌بعدی کره زمین با اتمسفر نئونی درخشان، شبکه‌بندی مختصات جغرافیایی و مارکرهای پالس‌دار برای مقاصد برجسته جهان (دبی، پاریس، استانبول، توکیو، نیویورک، مالدیو).
   - انیمیشن پرواز دوربین (Fly-To) به سمت شهر انتخاب‌شده، نمایش اطلاعات آب‌وهوا و دما و فیلتر آنی هتل‌های مرتبط.

3. **پنل جستجوی گلاسمورفیسم لوکس (Glassmorphism Search Console)**:
   - انتخاب مقصد، تاریخ ورود و خروج، تعداد مسافران و اتاق‌ها با افکت شیشه‌ای نیمه‌شب و فیلتر آنی کارت‌ها.

4. **کارت‌های هتل با فیزیک و شیب سه‌بعدی (3D Tilt & Specular Glare)**:
   - محاسبه بردار مختصات نشانگر ماوس و اعمال زاویه سه‌بعدی پیوسته با بازتاب نور براق و سایه‌پردازی پویا.

5. **صفحه اختصاصی و جامع جزئیات هتل (Hotel Details Page)**:
   - گالری تصاویر باکیفیت به همراه لایت‌باکس تمام‌صفحه.
   - **تور مجازی سه‌بعدی ۳۶۰ درجه سوئیت لوکس** همراه با قابلیت سوییچ نورپردازی (روز، غروب، شب) و چرخش دوربین.
   - نمایش تفکیک‌شده انواع سوئیت‌ها با متراژ، نوع تخت، منظره و قیمت لحظه‌ای.
   - لیست تجربیات و بازخوردهای تأییدشده مهمانان بین‌المللی.
   - پنل چسبان (Sticky) خلاصه رزرواسیون با محاسبه خودکار مالیات و تضمین بهترین قیمت.

6. **مودال تعاملی رزرو و پرداخت چندمرحله‌ای (Interactive Booking Wizard)**:
   - انتخاب تاریخ، افزودنی‌های ویژه (ترانسفر فرودگاهی رولز رویس، صبحانه میشلن، اسپا).
   - اعتبارسنجی کدهای تخفیف وی‌آی‌پی (`AURAESCAPE25`, `DUBAIROYAL30`, `AURAVIP20`, `TOKYOSAKURA15`).
   - درگاه شبیه‌سازی پرداخت امن و **صدور واچر چاپی رسمی با کد رهگیری اختصاصی یکتا**.

---

## 🚀 راهنمای سریع راه‌اندازی (Quick Start)

### پیش‌نیازها:
- پایتون نسخه 3.10 یا بالاتر
- نود جی‌اس (Node.js) نسخه 18 یا بالاتر

### ۱. کلون پروژه و ورود به دایرکتوری:
```bash
git clone https://github.com/Amirmohammad-sl/hotel-booking-django.git
cd hotel-booking-django
```

### ۲. راه‌اندازی بک‌اند جنگو (Django Backend):
```bash
python -m venv venv
# فعال‌سازی در ویندوز:
.\venv\Scripts\activate
# فعال‌سازی در لینوکس یا مک:
source venv/bin/activate

pip install django
python manage.py migrate
python seed_data.py
python manage.py runserver
```
🌐 دسترسی به بک‌اند جنگو: **`http://127.0.0.1:8000/`**

### ۳. راه‌اندازی فرانت‌اند سه‌بعدی مدرن (React 3D Frontend):
در یک تب ترمینال مجزا:
```bash
cd frontend
npm install
npm run dev
```
✨ دسترسی به پرتال لوکس سه‌بعدی: **`http://localhost:5173/`**

---

## 🧪 آزمون‌های واحد خودکار (Unit Tests)

برای بررسی منطق عدم تداخل رزروها و اعتبارسنجی سیستم:
```bash
python manage.py test
```
خروجی تست‌ها:
```text
Creating test database for alias 'default'...
.......
----------------------------------------------------------------------
Ran 7 tests in 19.127s

OK
```

---

## 📑 فازبندی مراحل پیاده‌سازی پروژه (Project Phases)

این پروژه در **۹ فاز مهندسی نرم‌افزار** به‌صورت مستند و گام‌به‌گام طراحی و پیاده‌سازی شده است:

### فاز ۱: تحلیل نیازمندی‌ها، سناریوهای کاربری و معماری
- استخراج سناریوهای کاربری مسافر، مدیر هتل و سوپراستور VIP.
- انتخاب الگوهای معماری ماژولار و تفکیک لایه‌های سرویس، دیتابیس و رابط کاربری.

### فاز ۲: طراحی دیتابیس و روابط مدل‌ها (Data Modeling & ORM)
- طراحی مدل‌های کاربر سفارشی (`accounts.User`)، هتل (`Hotel`)، نوع اتاق (`RoomType`)، امکانات رفاهی (`Amenity`).
- طراحی جداول رزروها (`Booking`)، کوپن‌های تخفیف (`DiscountCode`) و لاگ اطلاع‌رسانی (`NotificationLog`).

### فاز ۳: پیاده‌سازی احراز هویت و سطوح دسترسی (Authentication & RBAC)
- ایجاد فرم‌های امن ثبت‌نام و ورود کاربران.
- تعریف سطوح دسترسی مبتنی بر نقش (Role-Based Access Control) برای مسافران و مدیران اقامتگاه‌ها.

### فاز ۴: هسته بیزینس لاجیک رزرواسیون و جلوگیری از تداخل (Overbooking Prevention)
- پیاده‌سازی شرط ریاضی تداخل رزروها در لایه دیتابیس:
  $$\text{check\_in} < \text{req\_out} \quad \wedge \quad \text{check\_out} > \text{req\_in}$$
- تضمین صددرصدی عدم تخصیص یک اتاق همزمان به دو مسافر مختلف.

### فاز ۵: موتور کدهای تخفیف، صدور فاکتور و واچر رسمی
- اعتبارسنجی سقف ریالی، حداقل سفارش و تاریخ اعتبار کدهای تخفیف.
- طراحی برگه رسمی رزرو هتل با قابلیت چاپ استاندارد (`window.print`).

### فاز ۶: سرویس اعلان‌ها و لاگ اطلاع‌رسانی
- سرویس اطلاع‌رسانی تأیید رزرو، شبیه‌سازی ارسال پیامک و ایمیل با ثبت رکورد در `NotificationLog`.

### فاز ۷: پاک‌سازی و رفع وابستگی‌های سنتی نقشه
- حذف نقشه‌های دستی لوکیشن و کامپوننت‌های سنتی به درخواست کارفرما جهت ایجاد نمای مدرن‌تر و یکنواخت‌تر.

### فاز ۸: طراحی و استقرار پرتال سه‌بعدی تعاملی (AURA 3D Frontend)
- راه‌اندازی استک React 19 + TypeScript + Vite + Tailwind CSS v4.
- پیاده‌سازی صحنه معماری سه‌بعدی Hero با کنترل زاویه دید و المان‌های شناور با Three.js.
- پیاده‌سازی کره زمین سه‌بعدی (3D Globe) چرخان با مارکرهای تعاملی ۶ قطب گردشگری جهان (Dubai, Paris, Istanbul, Tokyo, New York, Maldives).
- کارت‌های هتل با افکت تعاملی Tilt سه‌بعدی بر اساس موقعیت نشانگر ماوس.
- پیاده‌سازی صفحه جزئیات کامل هتل با تور مجازی سه‌بعدی سوئیت و انتخاب حالت‌های نوری (روز، غروب، شب).
- مودال رزرو چندمرحله‌ای، اعتبارسنجی کوپن‌های تخفیف و صدور واچر چاپی.

### فاز ۹: تست‌های نهایی، بهینه‌سازی باندل و مستندسازی دفاع کارشناسی
- بیلد موفق و بهینه‌سازی باندل وب‌پک و ویت بدون خطا.
- موفقیت تمامی تست‌های واحد بک‌اند.
- نگارش گزارش دانشگاهی تفصیلی در `PROJECT_REPORT.md` و دستورالعمل اجرایی در `README.md`.

---

## 📂 ساختار فایل‌های پروژه

```text
hotel-booking-django/
│
├── frontend/                 # پلتفرم فرانت‌اند سه‌بعدی مدرن (React 19 + Three.js + Tailwind v4)
│   ├── src/
│   │   ├── components/       # کامپوننت‌های رابط کاربری
│   │   │   ├── 3d/           # صحنه‌های سه‌بعدی WebGL (Hero3DScene, Interactive3DGlobe)
│   │   │   ├── Navbar.tsx    # نوبار شیشه‌ای شناور
│   │   │   ├── HeroSearch.tsx # کنسول گلاسمورفیسم جستجو
│   │   │   ├── HotelCard.tsx # کارت‌های هتل با افکت 3D Tilt
│   │   │   ├── BookingModal.tsx # مودال چندمرحله‌ای رزرو، تخفیف و واچر
│   │   │   ├── PopularDestinations.tsx
│   │   │   ├── SpecialOffers.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Newsletter.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/            # صفحات کامل سامانه
│   │   │   ├── HomePage.tsx  # صفحه اصلی شامل صحنه‌های 3D و کاوشگر
│   │   │   └── HotelDetailPage.tsx # صفحه تفصیلی هتل با تور مجازی 360 درجه سوئیت
│   │   ├── data/hotels.ts    # دیتاست غنی و واقع‌گرایانه هتل‌های لوکس بین‌المللی
│   │   ├── types/index.ts    # تعاریف تایپ‌های جامع TypeScript
│   │   ├── App.tsx           # روتینگ و استیت‌های سراسری اپلیکیشن
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── hotel_booking/            # هسته مرکزی و تنظیمات جنگو (settings, urls, wsgi)
├── accounts/                 # ماژول احراز هویت، مدل سفارشی کاربر و کنترل دسترسی
├── hotels/                   # مدل‌های هتل، اتاق‌ها، امکانات، نظرات مسافران
├── bookings/                 # لاجیک رزرواسیون، آزمون‌های واحد، کدهای تخفیف، لاگ اعلان‌ها
├── templates/                # قالب‌های MVT جنگو
├── static/                   # فایل‌های استاتیک استایل و جاوااسکریپت جنگو
├── seed_data.py              # اسکریپت درج خودکار داده‌های نمونه اولیه
├── PROJECT_REPORT.md         # مستندات و گزارش جامع جهت دفاع پایان‌نامه
├── README.md                 # راهنمای فنی و مخزن گیت‌هاب
└── manage.py
```

---

## 👨‍💻 توسعه‌دهنده و حقوق معنوی

- **پروژه کارشناسی مهندسی نرم‌افزار**
- **دانشجو:** امیرمحمد سلیمانی ([@Amirmohammad-sl](https://github.com/Amirmohammad-sl))
- **ریپازیتوری رسمی گیت‌هاب:** [https://github.com/Amirmohammad-sl/hotel-booking-django](https://github.com/Amirmohammad-sl/hotel-booking-django)
