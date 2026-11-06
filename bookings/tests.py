from datetime import date, timedelta
from decimal import Decimal
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from hotels.models import Hotel, RoomType, Amenity, Review
from bookings.models import Booking, DiscountCode, NotificationLog
from bookings.services import send_booking_confirmation

User = get_user_model()

class HotelBookingSystemTests(TestCase):
    def setUp(self):
        self.client = Client()
        
        # ۱. ساخت کاربر مدیر هتل و مسافر
        self.manager = User.objects.create_user(
            username='test_manager',
            password='password123',
            role='manager',
            phone='09121111111'
        )

        self.customer = User.objects.create_user(
            username='test_customer',
            password='password123',
            role='customer',
            phone='09352222222',
            favorite_city='اصفهان'
        )

        # ۲. ساخت هتل
        self.hotel = Hotel.objects.create(
            manager=self.manager,
            name='هتل آزمایشی پارسیان',
            city='اصفهان',
            address='اصفهان، میدان نقش جهان',
            stars=5,
            phone='031-12345678',
            latitude=32.6577,
            longitude=51.6776,
            description='هتلی زیبا در قلب اصفهان'
        )

        # ۳. ساخت نوع اتاق
        self.room = RoomType.objects.create(
            hotel=self.hotel,
            title='اتاق دوتخته لوکس',
            capacity=2,
            price_per_night=Decimal('2000000'),
            total_rooms=3,
            description='اتاق دو نفره'
        )

        # ۴. کد تخفیف
        self.discount = DiscountCode.objects.create(
            code='DISCOUNT20',
            created_by=self.manager,
            discount_percent=20,
            min_order_amount=Decimal('1000000'),
            valid_from=date.today() - timedelta(days=1),
            valid_to=date.today() + timedelta(days=30),
            max_uses=10,
            is_active=True
        )

    def test_hotel_min_price_and_rating(self):
        self.assertEqual(self.hotel.min_price, Decimal('2000000'))
        Review.objects.create(hotel=self.hotel, user=self.customer, rating=5, comment='عالی')
        Review.objects.create(hotel=self.hotel, user=self.customer, rating=3, comment='خوب')
        self.assertEqual(self.hotel.average_rating, 4.0)

    def test_room_availability_logic(self):
        # قبل از رزرو: ۳ اتاق موجود
        check_in = date.today() + timedelta(days=2)
        check_out = date.today() + timedelta(days=4)
        self.assertEqual(self.room.available_rooms_count(check_in, check_out), 3)

        # ایجاد ۱ رزرو
        booking = Booking.objects.create(
            user=self.customer,
            room_type=self.room,
            rooms_count=1,
            check_in=check_in,
            check_out=check_out,
            guest_name='تست مهمان',
            guest_phone='09120000000',
            nights_count=2,
            price_per_night=self.room.price_per_night,
            total_price=Decimal('4000000'),
            final_price=Decimal('4000000'),
            status='confirmed'
        )

        # اکنون باید ۲ اتاق آزاد باشد
        self.assertEqual(self.room.available_rooms_count(check_in, check_out), 2)
        self.assertTrue(self.room.is_available(check_in, check_out, 2))
        self.assertFalse(self.room.is_available(check_in, check_out, 3))

    def test_discount_validation_and_calculation(self):
        is_valid, msg = self.discount.validate_for_booking(Decimal('2000000'))
        self.assertTrue(is_valid)
        discount_amount = self.discount.calculate_discount(Decimal('2000000'))
        self.assertEqual(discount_amount, Decimal('400000'))

    def test_home_page_and_recommendations(self):
        # تست نمایش صفحه اصلی با ورود کاربر دارای شهر مورد علاقه
        self.client.login(username='test_customer', password='password123')
        response = self.client.get(reverse('hotels:home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'هتل آزمایشی پارسیان')

    def test_hotel_search_by_city_and_dates(self):
        url = reverse('hotels:hotel_list')
        response = self.client.get(url, {
            'city': 'اصفهان',
            'check_in': (date.today() + timedelta(days=1)).strftime('%Y-%m-%d'),
            'check_out': (date.today() + timedelta(days=3)).strftime('%Y-%m-%d'),
            'capacity': 2
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'هتل آزمایشی پارسیان')

    def test_manager_access_restrictions(self):
        # مشتری عادی نباید به داشبورد دسترسی داشته باشد
        self.client.login(username='test_customer', password='password123')
        res = self.client.get(reverse('bookings:manager_dashboard'))
        self.assertEqual(res.status_code, 302) # هدایت به لاگین

        # مدیر هتل دسترسی دارد
        self.client.login(username='test_manager', password='password123')
        res2 = self.client.get(reverse('bookings:manager_dashboard'))
        self.assertEqual(res2.status_code, 200)
        self.assertContains(res2, 'داشبورد اختصاصی مدیر هتل')

    def test_notification_service(self):
        booking = Booking.objects.create(
            user=self.customer,
            room_type=self.room,
            rooms_count=1,
            check_in=date.today(),
            check_out=date.today() + timedelta(days=1),
            guest_name='مهمان تستی',
            guest_phone='09120000000',
            nights_count=1,
            price_per_night=self.room.price_per_night,
            total_price=self.room.price_per_night,
            final_price=self.room.price_per_night,
            status='confirmed'
        )
        send_booking_confirmation(booking)
        email_log = NotificationLog.objects.filter(booking=booking, notification_type='email').first()
        sms_log = NotificationLog.objects.filter(booking=booking, notification_type='sms').first()
        self.assertIsNotNone(email_log)
        self.assertIsNotNone(sms_log)
        self.assertTrue(email_log.is_successful)
