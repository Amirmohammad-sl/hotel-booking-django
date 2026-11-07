import os
import sys
import django

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from decimal import Decimal
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hotel_booking.settings')
django.setup()

from django.contrib.auth import get_user_model
from hotels.models import Amenity, Hotel, RoomType, Review
from bookings.models import DiscountCode, Booking, NotificationLog

User = get_user_model()

def run_seed():
    print("--- شروع درج داده‌های نمونه و راه‌اندازی اولیه سامانه رزرو هتل ---")

    # ۱. ایجاد کاربران (مدیر هتل، مشتری، ادمین)
    admin_user, _ = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@hotelbooking.ir',
            'first_name': 'مدیر',
            'last_name': 'کل سامانه',
            'is_staff': True,
            'is_superuser': True,
            'role': 'manager',
            'phone': '09120000001'
        }
    )
    admin_user.set_password('123')
    admin_user.save()

    manager_user, _ = User.objects.get_or_create(
        username='manager',
        defaults={
            'email': 'manager@hotelbooking.ir',
            'first_name': 'علی',
            'last_name': 'رضایی (مدیر هتل)',
            'role': 'manager',
            'phone': '09121112233'
        }
    )
    manager_user.set_password('123')
    manager_user.save()

    customer_user, _ = User.objects.get_or_create(
        username='customer',
        defaults={
            'email': 'customer@gmail.com',
            'first_name': 'سارا',
            'last_name': 'محمدی',
            'role': 'customer',
            'phone': '09351234567',
            'favorite_city': 'کیش',
            'preferred_min_price': Decimal('1000000'),
            'preferred_max_price': Decimal('4000000')
        }
    )
    customer_user.set_password('123')
    customer_user.save()

    print("✓ کاربران مدیر (manager / 123) و مشتری (customer / 123) و ادمین (admin / 123) ایجاد شدند.")

    # ۲. امکانات (Amenities)
    amenities_data = [
        ("اینترنت وای‌فای پرسرعت", "fa-solid fa-wifi"),
        ("صبحانه بوفه رایگان", "fa-solid fa-mug-hot"),
        ("استخر و سونا", "fa-solid fa-water-ladder"),
        ("پارکینگ اختصاصی", "fa-solid fa-square-parking"),
        ("تلویزیون هوشمند", "fa-solid fa-tv"),
        ("سیستم سرمایش و گرمایش", "fa-solid fa-wind"),
        ("رستوران بین‌المللی", "fa-solid fa-utensils"),
        ("مینی‌بار و یخچال", "fa-solid fa-wine-glass"),
        ("چای‌ساز و نسکافه", "fa-solid fa-coffee"),
    ]

    amenities = {}
    for name, icon in amenities_data:
        obj, _ = Amenity.objects.get_or_create(name=name, defaults={'icon': icon})
        amenities[name] = obj

    print(f"✓ {len(amenities)} امکانات رفاهی تعریف شد.")

    # ۳. هتل‌ها و مختصات روی نقشه
    hotels_info = [
        {
            'name': 'هتل اسپیناس پالاس',
            'city': 'تهران',
            'address': 'تهران، سعادت‌آباد، میدان بهرود، خیابان عابدی، خیابان ۳۳',
            'stars': 5,
            'phone': '021-75675000',
            'email': 'info@espinashotels.com',
            'lat': 35.7937,
            'lng': 51.3686,
            'desc': 'هتل پنج ستاره لوکس اسپیناس پالاس با معماری مدرن و کاخ‌مانند در بهترین منطقه آب و هوایی شمال تهران واقع شده و چشم‌انداز خیره‌کننده‌ای از پایتخت ارائه می‌دهد.'
        },
        {
            'name': 'هتل عباسی',
            'city': 'اصفهان',
            'address': 'اصفهان، خیابان چهارباغ عباسی، ابتدای خیابان آمادگاه',
            'stars': 5,
            'phone': '031-32226010',
            'email': 'info@abbasihotel.ir',
            'lat': 32.6539,
            'lng': 51.6698,
            'desc': 'کهن‌ترین هتل جهان و زیباترین مهمانسرای تاریخی ایران در قلب پایتخت صفوی با باغ ایرانی بی‌نظیر و هنر اصیل اصفهان.'
        },
        {
            'name': 'هتل بزرگ شیراز',
            'city': 'شیراز',
            'address': 'شیراز، ورودی شمالی شیراز، جنب دروازه قرآن',
            'stars': 5,
            'phone': '071-32274000',
            'email': 'reservation@shiraz-hotel.com',
            'lat': 29.6361,
            'lng': 52.5583,
            'desc': 'هتل مجلل و کشتی‌شکل بزرگ شیراز بر فراز رشته کوه‌های شمال شیراز با بهترین دید پانوراما به دروازه قرآن و باغ‌های شیراز.'
        },
        {
            'name': 'هتل مجلل درویشی',
            'city': 'مشهد',
            'address': 'مشهد، خیابان امام رضا (ع)، بین امام رضا ۲۴ و ۲۶',
            'stars': 5,
            'phone': '051-38080000',
            'email': 'info@darvishihotel.com',
            'lat': 36.2785,
            'lng': 59.6192,
            'desc': 'تنها هتل آتریوم شرق کشور در نزدیکی حرم مطهر رضوی با اتاق‌های دوبلکس ملل و امکانات اقامتی اشرافی.'
        },
        {
            'name': 'هتل دریایی ترنج',
            'city': 'کیش',
            'address': 'جزیره کیش، جاده جهان، بعد از میدان جاسک، روی آب‌های نیلگون خلیج فارس',
            'stars': 5,
            'phone': '076-44474114',
            'email': 'info@toranj-hotel.com',
            'lat': 26.5415,
            'lng': 53.9213,
            'desc': 'اولین و تنها هتل روی آب خاورمیانه به شکل بته جقه با کف‌های شیشه‌ای و نمای بی‌نظیر غروب آفتاب در خلیج فارس.'
        }
    ]

    created_hotels = []
    for idx, h_data in enumerate(hotels_info, start=1):
        hotel, created = Hotel.objects.get_or_create(
            name=h_data['name'],
            defaults={
                'manager': manager_user,
                'city': h_data['city'],
                'address': h_data['address'],
                'stars': h_data['stars'],
                'phone': h_data['phone'],
                'email': h_data['email'],
                'latitude': h_data['lat'],
                'longitude': h_data['lng'],
                'description': h_data['desc'],
                'image': f"hotels/hotel_{idx}.jpg"
            }
        )
        if not hotel.image and os.path.exists(f"media/hotels/hotel_{idx}.jpg"):
            hotel.image = f"hotels/hotel_{idx}.jpg"
            hotel.save()
        created_hotels.append(hotel)

    print(f"✓ {len(created_hotels)} هتل برجسته ثبت شد.")

    # ۴. انواع اتاق‌ها
    room_definitions = [
        {
            'hotel': created_hotels[0], # اسپیناس
            'title': 'اتاق دوتخته دبل استاندارد',
            'capacity': 2,
            'price': Decimal('2800000'),
            'total_rooms': 8,
            'amenities': [amenities["اینترنت وای‌فای پرسرعت"], amenities["صبحانه بوفه رایگان"], amenities["تلویزیون هوشمند"], amenities["سیستم سرمایش و گرمایش"]],
            'desc': 'اتاقی آرام و لوکس با تخت دو نفره کینگ، چشم‌انداز رو به کوهستان و سرویس چای و قهوه رایگان.'
        },
        {
            'hotel': created_hotels[0], # اسپیناس
            'title': 'سوئیت رویال جونیور',
            'capacity': 3,
            'price': Decimal('4900000'),
            'total_rooms': 4,
            'amenities': [amenities["اینترنت وای‌فای پرسرعت"], amenities["صبحانه بوفه رایگان"], amenities["استخر و سونا"], amenities["پارکینگ اختصاصی"], amenities["مینی‌بار و یخچال"]],
            'desc': 'سوئیت وسیع همراه با نشیمن مجزا، مبلمان راحتی ایتالیایی و حمام مجهز به وان جکوزی.'
        },
        {
            'hotel': created_hotels[1], # عباسی اصفهان
            'title': 'اتاق دوتخته چشم‌انداز پردیس',
            'capacity': 2,
            'price': Decimal('3200000'),
            'total_rooms': 10,
            'amenities': [amenities["اینترنت وای‌فای پرسرعت"], amenities["صبحانه بوفه رایگان"], amenities["رستوران بین‌المللی"], amenities["چای‌ساز و نسکافه"]],
            'desc': 'اتاقی سنتی با پنجره‌های رو به باغ باشکوه عباسی و تزئینات اصیل گچ‌بری و نقاشی صفوی.'
        },
        {
            'hotel': created_hotels[1], # عباسی اصفهان
            'title': 'سوئیت قاجار',
            'capacity': 4,
            'price': Decimal('5800000'),
            'total_rooms': 3,
            'amenities': [amenities["اینترنت وای‌فای پرسرعت"], amenities["صبحانه بوفه رایگان"], amenities["استخر و سونا"], amenities["پارکینگ اختصاصی"]],
            'desc': 'سوئیتی موزه‌مانند با معماری عصر قاجار و آینه‌کاری‌های خیره‌کننده برای اقامت خانوادگی مجلل.'
        },
        {
            'hotel': created_hotels[2], # بزرگ شیراز
            'title': 'اتاق دوتخته دبل ویو کوهستان',
            'capacity': 2,
            'price': Decimal('2500000'),
            'total_rooms': 6,
            'amenities': [amenities["اینترنت وای‌فای پرسرعت"], amenities["صبحانه بوفه رایگان"], amenities["تلویزیون هوشمند"]],
            'desc': 'مجهز به تمامی استانداردهای بین‌المللی و ویوی زیبای دروازه قرآن شیراز.'
        },
        {
            'hotel': created_hotels[3], # درویشی مشهد
            'title': 'اتاق دوتخته امپریال',
            'capacity': 2,
            'price': Decimal('3500000'),
            'total_rooms': 12,
            'amenities': [amenities["اینترنت وای‌فای پرسرعت"], amenities["صبحانه بوفه رایگان"], amenities["استخر و سونا"], amenities["پارکینگ اختصاصی"]],
            'desc': 'واقع در طبقات بالای هتل آتریوم درویشی با سرویس رفت و برگشت به حرم مطهر.'
        },
        {
            'hotel': created_hotels[4], # ترنج کیش
            'title': 'سوئیت رویال دریایی با کف شیشه‌ای',
            'capacity': 2,
            'price': Decimal('5200000'),
            'total_rooms': 5,
            'amenities': [amenities["اینترنت وای‌فای پرسرعت"], amenities["صبحانه بوفه رایگان"], amenities["مینی‌بار و یخچال"], amenities["رستوران بین‌المللی"]],
            'desc': 'سوئیت معلق روی آب با بالکن اختصاصی رو به غروب خلیج فارس و دریچه شیشه‌ای کف جهت تماشای آبزیان.'
        }
    ]

    created_rooms = []
    for idx, r_data in enumerate(room_definitions, start=1):
        room_img = f"rooms/room_{idx}.jpg" if os.path.exists(f"media/rooms/room_{idx}.jpg") else None
        room, _ = RoomType.objects.get_or_create(
            hotel=r_data['hotel'],
            title=r_data['title'],
            defaults={
                'capacity': r_data['capacity'],
                'price_per_night': r_data['price'],
                'total_rooms': r_data['total_rooms'],
                'description': r_data['desc'],
                'image': room_img
            }
        )
        if not room.image and room_img:
            room.image = room_img
            room.save()
        room.amenities.set(r_data['amenities'])
        created_rooms.append(room)

    print(f"✓ {len(created_rooms)} نوع اتاق تعریف شد.")

    # ۵. کدهای تخفیف
    today = date.today()
    discounts_data = [
        {
            'code': 'FIRST20',
            'percent': 20,
            'max_amount': Decimal('1500000'),
            'min_order': Decimal('0'),
            'hotel': None,
        },
        {
            'code': 'NOROOZ1403',
            'percent': 20,
            'max_amount': Decimal('1000000'),
            'min_order': Decimal('2000000'),
            'hotel': None,
        },
        {
            'code': 'WELCOME10',
            'percent': 10,
            'max_amount': Decimal('500000'),
            'min_order': Decimal('1000000'),
            'hotel': None,
        },
        {
            'code': 'ESPINAS30',
            'percent': 30,
            'max_amount': Decimal('2000000'),
            'min_order': Decimal('3000000'),
            'hotel': created_hotels[0], # مخصوص اسپیناس
        }
    ]

    for d in discounts_data:
        DiscountCode.objects.get_or_create(
            code=d['code'],
            defaults={
                'created_by': manager_user,
                'hotel': d['hotel'],
                'discount_percent': d['percent'],
                'max_discount_amount': d['max_amount'],
                'min_order_amount': d['min_order'],
                'valid_from': today - timedelta(days=5),
                'valid_to': today + timedelta(days=60),
                'max_uses': 100,
                'is_active': True
            }
        )

    print("✓ کدهای تخفیف ویژه (NOROOZ1403 و WELCOME10 و ESPINAS30) تعریف شدند.")

    # ۶. نظرات و امتیازات نمونه
    reviews_data = [
        (created_hotels[0], 5, "اقامتی واقعاً رؤیایی بود. برخورد پرسنل عالی و کیفیت صبحانه در بالاترین سطح ممکن بود."),
        (created_hotels[0], 4, "هتل بسیار شیک با امکانات کامل. دسترسی به نقاط مختلف کمی دور است ولی آرامش فوق‌العاده‌ای دارد."),
        (created_hotels[1], 5, "قدم زدن در حیاط و باغ تاریخی هتل عباسی یکی از بهترین تجربه‌های زندگی من بود."),
        (created_hotels[2], 5, "دید هتل به دروازه قرآن و هوای دلپذیر شیراز بی‌نظیر بود."),
        (created_hotels[4], 5, "تماشای ماهی‌ها از کف شیشه‌ای اتاق حس خاصی داشت. غروب آفتاب فوق‌العاده است.")
    ]

    for hotel, rating, comment in reviews_data:
        Review.objects.get_or_create(
            hotel=hotel,
            user=customer_user,
            defaults={'rating': rating, 'comment': comment}
        )

    print("✓ نظرات و امتیازات هتل‌ها ثبت گردید.")

    # ۷. رزروهای نمونه جهت تست وضعیت اتاق‌ها و داشبورد مدیر
    sample_booking, _ = Booking.objects.get_or_create(
        tracking_code='HTR-DEMO101',
        defaults={
            'user': customer_user,
            'room_type': created_rooms[0],
            'rooms_count': 1,
            'check_in': today,
            'check_out': today + timedelta(days=2),
            'guest_name': 'سارا محمدی',
            'guest_phone': '09351234567',
            'guest_national_id': '0012345678',
            'nights_count': 2,
            'price_per_night': created_rooms[0].price_per_night,
            'total_price': created_rooms[0].price_per_night * 2,
            'discount_amount': Decimal('560000'),
            'final_price': (created_rooms[0].price_per_night * 2) - Decimal('560000'),
            'status': 'confirmed'
        }
    )

    NotificationLog.objects.get_or_create(
        booking=sample_booking,
        notification_type='email',
        defaults={
            'recipient': customer_user.email,
            'subject': f"تأیید رزرو هتل {created_rooms[0].hotel.name}",
            'message': f"رزرو شما با کد رهگیری {sample_booking.tracking_code} تأیید شد.",
            'is_successful': True
        }
    )

    NotificationLog.objects.get_or_create(
        booking=sample_booking,
        notification_type='sms',
        defaults={
            'recipient': customer_user.phone,
            'subject': 'پیامک تأیید رزرو اتاق',
            'message': f"مهمان گرامی سارا محمدی، رزرو شما در {created_rooms[0].hotel.name} تأیید شد. کد: {sample_booking.tracking_code}",
            'is_successful': True
        }
    )

    print("✓ رزرو نمونه فعال و لاگ‌های ایمیل و پیامک ایجاد شدند.")
    print("✓ تکمیل هتل‌های تمامی شهرها (حداقل ۴ هتل در هر شهر)...")
    try:
        import subprocess
        subprocess.run([sys.executable, 'populate_hotels.py'], check=True)
    except Exception as e:
        print("توجه در تکمیل هتل‌ها:", e)
    print("----------------------------------------------------------------")
    print("اطلاعات ورود برای بررسی سریع:")
    print("۱. حساب مدیر هتل: نام کاربری: manager | رمز عبور: 123")
    print("۲. حساب مسافر/مشتری: نام کاربری: customer | رمز عبور: 123")
    print("۳. پنل ادمین جنگو: نام کاربری: admin | رمز عبور: 123")
    print("----------------------------------------------------------------")

if __name__ == '__main__':
    run_seed()
