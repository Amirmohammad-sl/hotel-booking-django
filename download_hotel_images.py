import os
import requests
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hotel_booking.settings')
django.setup()

from hotels.models import Hotel, RoomType

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# لیست تصاویر اختصاصی هر هتل از اینترنت
hotel_images_map = {
    'هتل اسپیناس پالاس': [
        'https://upload.wikimedia.org/wikipedia/commons/e/ec/Espinas_Palace_Hotel.jpg',
        'https://boutimar.com/img/hotels/espinas-palace/hero.jpg',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    'هتل عباسی': [
        'https://upload.wikimedia.org/wikipedia/commons/2/22/Esfahan_%28Iran%29_Abbasi_Hotel.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Abbasi_Hotel%2C_Isfahan%2C_Iran.jpg',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    'هتل بزرگ شیراز': [
        'https://upload.wikimedia.org/wikipedia/commons/a/ab/Shiraz_Grand_Hotel.jpg',
        'https://iran.1stquest.com/storage/images/hotel/static/6ae18a5c715734d554540b1c84ca94a8.jpg',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    'هتل مجلل درویشی': [
        'https://mstiran.com/resource/files/cache/hotels-Iran-Mashhad-Darvishi-mashhad-darvishi-hotel-facade-1050958ff0e01930de2f730b578a8722.jpg',
        'https://www.eghamat24.com/app/public/new_images/390x312/Mashhad-Darvishi-44.jpg',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80'
    ],
    'هتل دریایی ترنج': [
        'https://upload.wikimedia.org/wikipedia/commons/9/97/Kish-toranj-marine-hotel-facade.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/2/2b/Hoteltoranj.jpg',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ]
}

# تصاویر اختصاصی انواع اتاق‌ها
room_images_map = {
    'اتاق دوتخته دبل استاندارد': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    'سوئیت رویال جونیور': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    'اتاق دوتخته چشم‌انداز پردیس': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
    'سوئیت قاجار': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
    'اتاق دوتخته دبل ویو کوهستان': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80',
    'اتاق دوتخته امپریال': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
    'سوئیت رویال دریایی با کف شیشه‌ای': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80'
}

os.makedirs('media/hotels', exist_ok=True)
os.makedirs('media/rooms', exist_ok=True)

print("--- دانلود و تنظیم تصاویر واقعی هتل‌ها ---")
for h_name, urls in hotel_images_map.items():
    hotel = Hotel.objects.filter(name__icontains=h_name).first()
    if not hotel:
        print(f"هتل {h_name} یافت نشد!")
        continue

    downloaded = False
    for url in urls:
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200 and len(resp.content) > 1000:
                ext = 'jpg'
                if '.png' in url.lower():
                    ext = 'png'
                filename = f"hotels/hotel_{hotel.id}.{ext}"
                filepath = os.path.join('media', filename)
                with open(filepath, 'wb') as f:
                    f.write(resp.content)
                hotel.image = filename
                hotel.save()
                print(f"✓ تصویر هتل «{hotel.name}» ذخیره شد ({len(resp.content)//1024} KB) از {url[:50]}")
                downloaded = True
                break
        except Exception as e:
            print(f"خطا در دریافت {url[:40]}: {e}")

    if not downloaded:
        print(f"✗ نتوانست تصویری برای {h_name} دانلود کند.")

print("\n--- دانلود و تنظیم تصاویر انواع اتاق‌ها ---")
for r_title, url in room_images_map.items():
    rooms = RoomType.objects.filter(title__icontains=r_title)
    if not rooms.exists():
        continue

    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            for room in rooms:
                filename = f"rooms/room_{room.id}.jpg"
                filepath = os.path.join('media', filename)
                with open(filepath, 'wb') as f:
                    f.write(resp.content)
                room.image = filename
                room.save()
                print(f"✓ تصویر اتاق «{room.title}» هتل «{room.hotel.name}» ذخیره شد.")
    except Exception as e:
        print(f"خطا در دانلود تصویر اتاق {r_title}: {e}")

print("\nعملیات با موفقیت به پایان رسید.")
