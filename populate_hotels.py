import os
import sys
import requests
from decimal import Decimal
import django

sys.stdout.reconfigure(encoding='utf-8')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hotel_booking.settings')
django.setup()

from django.contrib.auth import get_user_model
from hotels.models import Hotel, RoomType, Amenity

User = get_user_model()
manager_user = User.objects.filter(role='manager').first() or User.objects.filter(is_superuser=True).first()

headers = {
    'User-Agent': 'HotelBookingApp/1.0 (contact@hotelbooking.ir; Mozilla/5.0)'
}

os.makedirs('media/hotels', exist_ok=True)
os.makedirs('media/rooms', exist_ok=True)

# دریافت امکانات موجود
amenities_list = list(Amenity.objects.all())

# لیست ۲۰ هتل کامل (۴ هتل برای هر یک از ۵ شهر)
hotels_data = [
    # ----------------- تهران (Tehran) -----------------
    {
        'name': 'هتل اسپیناس پالاس',
        'city': 'تهران',
        'address': 'تهران، سعادت‌آباد، میدان بهرود، خیابان عابدی، خیابان ۳۳',
        'stars': 5,
        'phone': '021-75675000',
        'email': 'info@espinashotels.com',
        'lat': 35.7937,
        'lng': 51.3686,
        'desc': 'هتل پنج ستاره لوکس اسپیناس پالاس با معماری مدرن و کاخ‌مانند در بهترین منطقه آب و هوایی شمال تهران واقع شده و چشم‌انداز خیره‌کننده‌ای از پایتخت ارائه می‌دهد.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Espinas_Palace_Hotel.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته دبل استاندارد', 'capacity': 2, 'price': Decimal('2800000'), 'total': 10, 'desc': 'اتاقی آرام و لوکس با تخت دو نفره کینگ، چشم‌انداز رو به کوهستان و سرویس چای و قهوه رایگان.'},
            {'title': 'سوئیت رویال جونیور', 'capacity': 3, 'price': Decimal('4900000'), 'total': 5, 'desc': 'سوئیت وسیع همراه با نشیمن مجزا، مبلمان راحتی ایتالیایی و حمام مجهز به وان جکوزی.'}
        ]
    },
    {
        'name': 'هتل بین‌المللی پارسیان استقلال',
        'city': 'تهران',
        'address': 'تهران، تقاطع بزرگراه شهید چمران و ولی‌عصر، هتل استقلال',
        'stars': 5,
        'phone': '021-22660011',
        'email': 'esteghlal@parsianhotels.ir',
        'lat': 35.7925,
        'lng': 51.4172,
        'desc': 'هتل بین‌المللی پارسیان استقلال (رویال هیلتون سابق)، بزرگ‌ترین هتل ۵ ستاره ایران در دامنه رشته کوه البرز با دو برج شرقی و غربی و دسترسی عالی به نمایشگاه بین‌المللی.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/HOTEL_HILTON_2009_-_panoramio.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته برج غربی', 'capacity': 2, 'price': Decimal('2600000'), 'total': 12, 'desc': 'اتاق دوتخته شیک با نمای کارت‌پستالی از رشته کوه‌های توچال و شهر تهران.'},
            {'title': 'سوئیت بزرگ رویال شرقی', 'capacity': 4, 'price': Decimal('4600000'), 'total': 6, 'desc': 'سوئیت اشرافی با دو اتاق خواب، اتاق جلسه اختصاصی و مینی‌بار مجهز.'}
        ]
    },
    {
        'name': 'هتل پنج ستاره پارسیان آزادی',
        'city': 'تهران',
        'address': 'تهران، بزرگراه شهید چمران، تقاطع یادگار امام',
        'stars': 5,
        'phone': '021-29112000',
        'email': 'azadi@parsianhotels.ir',
        'lat': 35.7892,
        'lng': 51.3853,
        'desc': 'هتل مجلل و مدرن پارسیان آزادی (هایت سابق) با ۲۶ طبقه، رعایت استانداردهای روز بین‌المللی هتلداری و رستوران‌های ملل متنوع در شمال غرب پایتخت.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Hotel_Parsian_Azadi_%28Hyatt%29_-_panoramio.jpg',
        'rooms': [
            {'title': 'اتاق دبل دولوکس پانوراما', 'capacity': 2, 'price': Decimal('2750000'), 'total': 8, 'desc': 'اتاقی در طبقات فوقانی با پنجره‌های قدی و دید پانورامای بی‌نظیر از پایتخت.'},
            {'title': 'سوئیت پرزیدنتال آزادی', 'capacity': 3, 'price': Decimal('5200000'), 'total': 4, 'desc': 'سوئیت مجلل با طراحی مدرن اروپایی، سالن پذیرایی مجزا و حمام مرمرین.'}
        ]
    },
    {
        'name': 'هتل بزرگ هما تهران',
        'city': 'تهران',
        'address': 'تهران، میدان ونک، خیابان شهید خدامی، شماره ۵۱',
        'stars': 5,
        'phone': '021-88773021',
        'email': 'tehran@homahotels.com',
        'lat': 35.7612,
        'lng': 51.4082,
        'desc': 'هتل پنج ستاره هما تهران واقع در منطقه خوش آب و هوای ونک با باغی مشجر، استخر روباز تابستانه، رستوران بوفه معراج در بام و دسترسی آسان به ولیعصر.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/2/25/Tehranhomahotel.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته رو به باغ', 'capacity': 2, 'price': Decimal('2500000'), 'total': 10, 'desc': 'اتاق دنج با بالکن دلباز و چشم‌انداز به باغ اختصاصی و درختان کهنسال هتل هما.'},
            {'title': 'سوئیت لوکس هما', 'capacity': 4, 'price': Decimal('4300000'), 'total': 5, 'desc': 'سوئیت خانوادگی بزرگ با نشیمن دلباز و سرویس کامل پذیرایی.'}
        ]
    },

    # ----------------- اصفهان (Isfahan) -----------------
    {
        'name': 'هتل عباسی',
        'city': 'اصفهان',
        'address': 'اصفهان، خیابان چهارباغ عباسی، ابتدای خیابان آمادگاه',
        'stars': 5,
        'phone': '031-32226010',
        'email': 'info@abbasihotel.ir',
        'lat': 32.6539,
        'lng': 51.6698,
        'desc': 'کهن‌ترین هتل جهان و زیباترین مهمانسرای تاریخی ایران در قلب پایتخت صفوی با باغ ایرانی بی‌نظیر و هنر اصیل اصفهان.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Abbasi_Hotel.jpg/1280px-Abbasi_Hotel.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته چشم‌انداز پردیس', 'capacity': 2, 'price': Decimal('3200000'), 'total': 10, 'desc': 'اتاقی خاطره‌انگیز با نمای مستقیم به باغ تاریخی و جویبارهای پردیس عباسی.'},
            {'title': 'سوئیت صفوی و قاجار', 'capacity': 3, 'price': Decimal('5500000'), 'total': 4, 'desc': 'شاهکار گچ‌بری، آینه‌کاری و تذهیب دوره صفوی با امکانات رفاهی مدرن پنج ستاره.'}
        ]
    },
    {
        'name': 'هتل بین‌المللی پارسیان کوثر اصفهان',
        'city': 'اصفهان',
        'address': 'اصفهان، بلوار ملت، روبه‌روی پل تاریخی سی و سه پل',
        'stars': 5,
        'phone': '031-36240230',
        'email': 'kowsar@parsianhotels.ir',
        'lat': 32.6432,
        'lng': 51.6675,
        'desc': 'هتل پنج ستاره بین‌المللی پارسیان کوثر در ساحل باصفای زاینده‌رود و در جوار سی‌وسه‌پل با مجموعه ورزشی و استخر لوکس و سفره‌خانه سنتی در باغ فیروزه.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Isfahan_KowsarHotel.JPG',
        'rooms': [
            {'title': 'اتاق دوتخته فیروزه رو به زاینده‌رود', 'capacity': 2, 'price': Decimal('2700000'), 'total': 8, 'desc': 'دید رویایی به سی و سه پل با امکانات رفاهی کامل هتلداری بین‌المللی.'},
            {'title': 'سوئیت رویال ترنج', 'capacity': 3, 'price': Decimal('4800000'), 'total': 4, 'desc': 'سوئیت مجلل و مدرن با تراس اختصاصی و فضای نشیمن مجلل.'}
        ]
    },
    {
        'name': 'هتل آسمان اصفهان',
        'city': 'اصفهان',
        'address': 'اصفهان، خیابان مطهری، روبه‌روی پل فلزی',
        'stars': 4,
        'phone': '031-32354141',
        'email': 'info@asemanhotel.ir',
        'lat': 32.6481,
        'lng': 51.6521,
        'desc': 'هتل مرتفع آسمان اصفهان در حاشیه زاینده‌رود دارای تنها رستوران گردان شهر اصفهان با دید پانورامای ۳۶۰ درجه به ابنیه کهن و بافت تاریخی شهر.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Prestige_Rayhaan_Hotel%2C_Isfahan.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته دبل آسمان', 'capacity': 2, 'price': Decimal('1950000'), 'total': 10, 'desc': 'اتاقی نورگیر و آرام مشرف به بیشه‌زارها و رودخانه زاینده‌رود.'},
            {'title': 'سوئیت پرنسس آسمان', 'capacity': 3, 'price': Decimal('3200000'), 'total': 5, 'desc': 'سوئیت ویژه با اتاق خواب مجزا و جکوزی اختصاصی.'}
        ]
    },
    {
        'name': 'هتل تاریخی پیروزی اصفهان',
        'city': 'اصفهان',
        'address': 'اصفهان، میدان امام حسین (ع)، ابتدای چهارباغ پایین',
        'stars': 4,
        'phone': '031-32214354',
        'email': 'info@piroozyhotel.com',
        'lat': 32.6562,
        'lng': 51.6738,
        'desc': 'هتل چهار ستاره باسابقه پیروزی اصفهان در چند قدمی از میدان نقش جهان، کاخ چهلستون، عالی‌قاپو و بازار سنتی اصفهان.',
        'image_url': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
        'rooms': [
            {'title': 'اتاق دوتخته استاندارد مرکز شهر', 'capacity': 2, 'price': Decimal('1800000'), 'total': 12, 'desc': 'دسترسی پیاده ۵ دقیقه‌ای به جاذبه‌های کهن نقش جهان.'},
            {'title': 'سوئit رویال پیروزی', 'capacity': 4, 'price': Decimal('2900000'), 'total': 6, 'desc': 'سوئیت خانوادگی جادار با امکانات پذیرایی کامل.'}
        ]
    },

    # ----------------- شیراز (Shiraz) -----------------
    {
        'name': 'هتل بزرگ شیراز',
        'city': 'شیراز',
        'address': 'شیراز، ورودی شمالی شیراز، جنب دروازه قرآن',
        'stars': 5,
        'phone': '071-32274000',
        'email': 'reservation@shiraz-hotel.com',
        'lat': 29.6361,
        'lng': 52.5583,
        'desc': 'هتل مجلل و کشتی‌شکل بزرگ شیراز بر فراز رشته کوه‌های شمال شیراز با بهترین دید پانوراما به دروازه قرآن و باغ‌های شیراز.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Shiraz_Grand_Hotel.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته دبل ویو کوهستان', 'capacity': 2, 'price': Decimal('3100000'), 'total': 10, 'desc': 'دید به بام شیراز و دروازه قرآن با دکوراسیون گرم و آرامش‌بخش.'},
            {'title': 'سوئیت کانکت رویال شیراز', 'capacity': 4, 'price': Decimal('5600000'), 'total': 4, 'desc': 'سوئیت دوبلکس با دو اتاق خواب، نشیمن شاهانه و دید کوهستانی.'}
        ]
    },
    {
        'name': 'هتل بزرگ چمران شیراز',
        'city': 'شیراز',
        'address': 'شیراز، بلوار شهید چمران، نرسیده به بیمارستان چمران',
        'stars': 5,
        'phone': '071-36288000',
        'email': 'info@chamranhotel.com',
        'lat': 29.6645,
        'lng': 52.5021,
        'desc': 'مرتفع‌ترین هتل شیراز در ۳۰ طبقه با چشم‌اندازی بی‌بدیل به باغ‌های قصرالدشت، رستوران‌های سنتی، ایتالیایی و سالن ماساژ تایلندی.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Chamran_from_tasnim.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته در طبقات مرتفع', 'capacity': 2, 'price': Decimal('2900000'), 'total': 12, 'desc': 'دید بی‌انتها به باغ‌های سرسبز شیراز با سرویس روم تمام‌وقت.'},
            {'title': 'سوئیت پرزیدنتال چمران', 'capacity': 3, 'price': Decimal('4900000'), 'total': 4, 'desc': 'سوئیت مجلل با سونا و جکوزی اختصاصی داخل اتاق.'}
        ]
    },
    {
        'name': 'هتل لوکس هما شیراز',
        'city': 'شیراز',
        'address': 'شیراز، خیابان مشکین‌فام، جنب بوستان آزادی',
        'stars': 5,
        'phone': '071-32288000',
        'email': 'shiraz@homahotels.com',
        'lat': 29.6278,
        'lng': 52.5385,
        'desc': 'هتل ۵ ستاره هما شیراز در کنار بوستان آزادی با باغی رویایی، عطر بهارنارنج، استخر روباز و دسترسی مستقیم به حافظیه و سعدیه.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Shirazhomahotel.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته رو به بوستان آزادی', 'capacity': 2, 'price': Decimal('2700000'), 'total': 10, 'desc': 'دید سرسبز به باغ آزادی با دکوراسیون کلاسیک و آرام.'},
            {'title': 'سوئیت دیپلماتیک هما شیراز', 'capacity': 4, 'price': Decimal('4500000'), 'total': 5, 'desc': 'سوئیت وسیع همراه با اتاق کار اختصاصی و نشیمن مجزا.'}
        ]
    },
    {
        'name': 'هتل سنتی و مجلل زندیه شیراز',
        'city': 'شیراز',
        'address': 'شیراز، خیابان هجرت، نرسیده به ارگ کریم‌خان زند',
        'stars': 5,
        'phone': '071-32234234',
        'email': 'reservation@zandiyehhotel.com',
        'lat': 29.6198,
        'lng': 52.5432,
        'desc': 'هتل باشکوه پنج ستاره زندیه با معماری سنتی اصیل دوره زندیه در حریم ارگ کریمخان و مجهز به حمام سنتی ایرانی و رستوران کلاسیک نگارستان.',
        'image_url': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'rooms': [
            {'title': 'اتاق دوتخته سنتی زندیه', 'capacity': 2, 'price': Decimal('2950000'), 'total': 8, 'desc': 'آمیزه‌ای از آرامش معماری ایرانی و امکانات هتلداری پنج ستاره بین‌المللی.'},
            {'title': 'سوئیت بیزینس زندیه', 'capacity': 3, 'price': Decimal('4900000'), 'total': 4, 'desc': 'سوئیت تشریفاتی با صنایع دستی اصیل خاتم و نقره شیراز.'}
        ]
    },

    # ----------------- مشهد (Mashhad) -----------------
    {
        'name': 'هتل مجلل درویشی',
        'city': 'مشهد',
        'address': 'مشهد، خیابان امام رضا (ع)، بین امام رضا ۲۴ و ۲۶',
        'stars': 5,
        'phone': '051-38080000',
        'email': 'info@darvishihotel.com',
        'lat': 36.2785,
        'lng': 59.6192,
        'desc': 'تنها هتل آتریوم شرق کشور در نزدیکی حرم مطهر رضوی با اتاق‌های دوبلکس ملل و امکانات اقامتی اشرافی.',
        'image_url': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
        'rooms': [
            {'title': 'اتاق دوتخته امپریال', 'capacity': 2, 'price': Decimal('3600000'), 'total': 10, 'desc': 'اقامتی شاهانه در آتریوم هتل درویشی با وان جکوزی اختصاصی.'},
            {'title': 'سوئیت دوبلکس ملل', 'capacity': 4, 'price': Decimal('6800000'), 'total': 4, 'desc': 'دوبلکس با تم معماری رم باستان و چین کهن همراه با خدمات تشریفاتی VIP.'}
        ]
    },
    {
        'name': 'هتل بین‌المللی قصر طلایی مشهد',
        'city': 'مشهد',
        'address': 'مشهد، خیابان امام رضا (ع)، بین امام رضا ۳۴ و ۳۶',
        'stars': 5,
        'phone': '051-38038000',
        'email': 'info@ghasrtalaee.com',
        'lat': 36.2732,
        'lng': 59.6154,
        'desc': 'نام‌آورترین و وسیع‌ترین هتل پنج ستاره بین‌المللی مشهد در ۲۰ طبقه، با طراحی کاخ‌های سلطنتی و ترانسفر رایگان شبانه‌روزی به حرم رضوی.',
        'image_url': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        'rooms': [
            {'title': 'پرنسس سوئیت قصر طلایی', 'capacity': 2, 'price': Decimal('3500000'), 'total': 10, 'desc': 'سوئیت رمانتیک با تخت کینگ سلطنتی، وان جکوزی و پذیرایی ولکام.'},
            {'title': 'سوئیت امپریال چهارنفره', 'capacity': 4, 'price': Decimal('6200000'), 'total': 5, 'desc': 'سوئیت خانوادگی فوق‌لوکس با سالن غذاخوری مجزا و دید مستقیم به گنبد حرم.'}
        ]
    },
    {
        'name': 'هتل بین‌المللی مدینه‌الرضا مشهد',
        'city': 'مشهد',
        'address': 'مشهد، ابتدای خیابان شیرازی، نبش شارستان رضوی',
        'stars': 5,
        'phone': '051-32232121',
        'email': 'info@madinahalreza.com',
        'lat': 36.2891,
        'lng': 59.6128,
        'desc': 'نزدیک‌ترین هتل پنج ستاره به حرم مطهر امام رضا (فقط ۱۵۰ متر فاصله تا باب‌الرضا) با معماری باشکوه ایرانی-اسلامی و رستوران گردان آفتاب.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Historical_Hotel_Pars%2C_Mashhad_%2C_right_view.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته رو به حرم', 'capacity': 2, 'price': Decimal('3300000'), 'total': 14, 'desc': 'نزدیک‌ترین چشم‌انداز به بارگاه ملکوتی حضرت رضا (ع).'},
            {'title': 'سوئیت لوکس رضوی', 'capacity': 3, 'price': Decimal('5400000'), 'total': 6, 'desc': 'فضایی معنوی و آرام با امکانات هتلداری ۵ ستاره برتر.'}
        ]
    },
    {
        'name': 'هتل مجلل الماس ۲ مشهد',
        'city': 'مشهد',
        'address': 'مشهد، خیابان امام رضا (ع)، نبش امام رضا ۲۰',
        'stars': 5,
        'phone': '051-31414000',
        'email': 'info@hotelalmas2.com',
        'lat': 36.2804,
        'lng': 59.6180,
        'desc': 'هتل آسمان‌خراش الماس ۲ با اتاق‌هایی به سبک تمدن‌های مختلف دنیا (ایران باستان، صفوی، ترکیه، روسیه و هند) و کافه‌رستوران شیشه‌ای در بالاترین طبقه.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/8/81/Hotel_almas_2.png',
        'rooms': [
            {'title': 'اتاق دوتخته سبک تمدن صفوی', 'capacity': 2, 'price': Decimal('3200000'), 'total': 10, 'desc': 'طراحی مینیاتوری اصیل صفوی با تمامی تجهیزات مدرن.'},
            {'title': 'سوئیت پرزیدنت سبک روسیه', 'capacity': 4, 'price': Decimal('5900000'), 'total': 4, 'desc': 'طراحی کاخ سن‌پترزبورگ همراه با سالن نشیمن و حمام مجهز به جکوزی.'}
        ]
    },

    # ----------------- کیش (Kish) -----------------
    {
        'name': 'هتل دریایی ترنج',
        'city': 'کیش',
        'address': 'جزیره کیش، جاده جهان، بعد از میدان جاسک، روی آب‌های نیلگون خلیج فارس',
        'stars': 5,
        'phone': '076-44474114',
        'email': 'info@toranj-hotel.com',
        'lat': 26.5415,
        'lng': 53.9213,
        'desc': 'اولین و تنها هتل روی آب خاورمیانه به شکل بته جقه با کف‌های شیشه‌ای و نمای بی‌نظیر غروب آفتاب در خلیج فارس.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/9/97/Kish-toranj-marine-hotel-facade.jpg',
        'rooms': [
            {'title': 'سوئیت رویال دریایی با کف شیشه‌ای', 'capacity': 2, 'price': Decimal('4800000'), 'total': 8, 'desc': 'تماشای ماهی‌ها و آب‌های نیلگون خلیج فارس از کف شیشه‌ای اتاق.'},
            {'title': 'سوئیت امپریال ترنج روی آب', 'capacity': 4, 'price': Decimal('7800000'), 'total': 4, 'desc': 'سوئیت مستقل روی آب با تراس اختصاصی رو به غروب خورشید.'}
        ]
    },
    {
        'name': 'هتل بزرگ داریوش کیش',
        'city': 'کیش',
        'address': 'جزیره کیش، میدان داریوش، نوار ساحلی شرقی',
        'stars': 5,
        'phone': '076-44444900',
        'email': 'info@dariushgrandhotel.com',
        'lat': 26.5298,
        'lng': 54.0289,
        'desc': 'شاهکار معماری با الهام از تخت جمشید و آپادانا در سواحل خلیج فارس با دریاچه اختصاصی، غواصی و زمین تنیس استاندارد.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dariush_hotel_Kish_-_panoramio.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته لوکس رو به دریا', 'capacity': 2, 'price': Decimal('3900000'), 'total': 12, 'desc': 'دید مستقیم به امواج آبی خلیج فارس و ستون‌های باشکوه هخامنشی.'},
            {'title': 'سوئیت رویال آتوسا داریوش', 'capacity': 4, 'price': Decimal('6500000'), 'total': 5, 'desc': 'سوئیت قصرگونه با نشیمن اشرافی، بالکن رو به دریا و سرویس میوه تازه.'}
        ]
    },
    {
        'name': 'هتل مارینا پارک کیش',
        'city': 'کیش',
        'address': 'جزیره کیش، نوار سیاحتی شرق، جنب برج‌های دوقلو',
        'stars': 5,
        'phone': '076-44465000',
        'email': 'info@marinaparkhotel.ir',
        'lat': 26.5187,
        'lng': 54.0253,
        'desc': 'تنها هتل مارینای ایران با ساحل اختصاصی ۷۵۰ متری، پارک آبی، اسکله تفریحی قایق‌سواری و باغ‌های گیاه‌شناسی سرسبز استوایی.',
        'image_url': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'rooms': [
            {'title': 'اتاق دوتخته رو به پارک دریایی', 'capacity': 2, 'price': Decimal('3600000'), 'total': 10, 'desc': 'چشم‌انداز باغ‌های ساحلی و دسترسی اختصاصی به کلوپ ورزش‌های آبی.'},
            {'title': 'سوئیت مارینا دوخوابه', 'capacity': 4, 'price': Decimal('6900000'), 'total': 4, 'desc': 'سوئیت ساحلی لوکس با دو اتاق خواب مستر و جکوزی با نمای دریا.'}
        ]
    },
    {
        'name': 'هتل پانوراما و شایان کیش',
        'city': 'کیش',
        'address': 'جزیره کیش، میدان ساحل، بلوار ساحل، جنب اسکله بزرگ تفریحی',
        'stars': 5,
        'phone': '076-44422771',
        'email': 'info@shayankish.com',
        'lat': 26.5412,
        'lng': 54.0210,
        'desc': 'یکی از اصیل‌ترین و خوش‌مسیرترین هتل‌های پنج ستاره کیش در همسایگی اسکله تفریحی قدیمی و مراکز خرید بزرگ زیتون و پردیس.',
        'image_url': 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Arian_Hotel_%26_Panorama_Hotel_Kish_2025_01.jpg',
        'rooms': [
            {'title': 'اتاق دوتخته شایان رو به ساحل', 'capacity': 2, 'price': Decimal('2800000'), 'total': 12, 'desc': 'فاصله ۲ دقیقه‌ای پیاده‌روی تا اسکله بزرگ تفریحی و دوچرخه‌سواری ساحلی.'},
            {'title': 'ویلا ساحلی دوبلکس', 'capacity': 4, 'price': Decimal('4900000'), 'total': 6, 'desc': 'ویلای ساحلی مستقل در محوطه نخلستان هتل با حیاط اختصاصی.'}
        ]
    }
]

# تصاویر انواع اتاق‌ها از Unsplash
room_photos = [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80'
]

print("--- شروع درج و تکمیل داده‌های ۲۰ هتل در ۵ شهر ---")

for idx, h in enumerate(hotels_data, start=1):
    hotel, created = Hotel.objects.get_or_create(
        name=h['name'],
        defaults={
            'manager': manager_user,
            'city': h['city'],
            'address': h['address'],
            'stars': h['stars'],
            'phone': h['phone'],
            'email': h['email'],
            'latitude': h['lat'],
            'longitude': h['lng'],
            'description': h['desc'],
            'image': f'hotels/hotel_{idx}.jpg'
        }
    )
    if not created:
        hotel.city = h['city']
        hotel.address = h['address']
        hotel.stars = h['stars']
        hotel.phone = h['phone']
        hotel.email = h['email']
        hotel.latitude = h['lat']
        hotel.longitude = h['lng']
        hotel.description = h['desc']
        if not hotel.image:
            hotel.image = f'hotels/hotel_{idx}.jpg'
        hotel.save()

    # دانلود تصویر هتل در صورت نبود
    img_filename = f'hotels/hotel_{hotel.id}.jpg'
    img_path = os.path.join('media', img_filename)
    if not os.path.exists(img_path) or os.path.getsize(img_path) < 1000:
        url = h['image_url']
        try:
            print(f"در حال دانلود تصویر هتل «{hotel.name}» از {url[:50]}...")
            r = requests.get(url, headers=headers, timeout=12)
            if r.status_code == 200 and len(r.content) > 1000:
                with open(img_path, 'wb') as f:
                    f.write(r.content)
                hotel.image = img_filename
                hotel.save()
                print(f"✓ تصویر هتل {hotel.name} با حجم {len(r.content)//1024} KB ذخیره شد.")
            else:
                print(f"✗ خطای دریافت کد {r.status_code} برای {hotel.name}")
        except Exception as e:
            print(f"خطای دانلود تصویر {hotel.name}: {e}")

    # تعریف اتاق‌های هتل
    for r_idx, r_info in enumerate(h['rooms'], start=1):
        room, r_created = RoomType.objects.get_or_create(
            hotel=hotel,
            title=r_info['title'],
            defaults={
                'capacity': r_info['capacity'],
                'price_per_night': r_info['price'],
                'total_rooms': r_info['total'],
                'description': r_info['desc'],
                'image': f'rooms/room_{hotel.id}_{r_idx}.jpg'
            }
        )
        if not r_created:
            room.capacity = r_info['capacity']
            room.price_per_night = r_info['price']
            room.total_rooms = r_info['total']
            room.description = r_info['desc']
            if not room.image:
                room.image = f'rooms/room_{hotel.id}_{r_idx}.jpg'
            room.save()

        # الصاق امکانات اتاق
        if amenities_list:
            if r_idx == 1:
                room.amenities.set(amenities_list[:4])
            else:
                room.amenities.set(amenities_list[2:])

        # تصویر اتاق
        room_img_filename = f'rooms/room_{room.id}.jpg'
        room_img_path = os.path.join('media', room_img_filename)
        if not os.path.exists(room_img_path) or os.path.getsize(room_img_path) < 1000:
            photo_url = room_photos[(hotel.id + r_idx) % len(room_photos)]
            try:
                r = requests.get(photo_url, headers=headers, timeout=10)
                if r.status_code == 200 and len(r.content) > 1000:
                    with open(room_img_path, 'wb') as f:
                        f.write(r.content)
                    room.image = room_img_filename
                    room.save()
            except Exception as e:
                pass

print("\n--- پایان درج داده‌ها. آمار هتل‌ها در هر شهر: ---")
from collections import Counter
counts = Counter([h.city for h in Hotel.objects.all()])
for city, cnt in counts.items():
    print(f"شهر {city}: {cnt} هتل")
print(f"مجموع کل هتل‌ها: {Hotel.objects.count()} هتل")
print(f"مجموع انواع اتاق‌ها: {RoomType.objects.count()} نوع اتاق")
