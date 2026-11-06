from django.db import models
from django.conf import settings
from django.db.models import Avg, Sum, Q

class Amenity(models.Model):
    name = models.CharField(max_length=100, verbose_name="عنوان امکانات")
    icon = models.CharField(
        max_length=50, 
        default="fas fa-check-circle", 
        help_text="کلاس آیکون FontAwesome مثلا: fas fa-wifi",
        verbose_name="کلاس آیکون"
    )

    class Meta:
        verbose_name = "امکانات"
        verbose_name_plural = "امکانات"

    def __str__(self):
        return self.name


class Hotel(models.Model):
    STAR_CHOICES = [(i, f"{i} ستاره") for i in range(1, 6)]

    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='hotels',
        verbose_name="مدیر هتل"
    )
    name = models.CharField(max_length=200, verbose_name="نام هتل")
    city = models.CharField(max_length=100, verbose_name="شهر")
    address = models.TextField(verbose_name="آدرس دقیق")
    stars = models.PositiveSmallIntegerField(
        choices=STAR_CHOICES, 
        default=3, 
        verbose_name="تعداد ستاره"
    )
    description = models.TextField(verbose_name="توضیحات و معرفی هتل")
    phone = models.CharField(max_length=30, verbose_name="شماره تماس پذیرش")
    email = models.EmailField(blank=True, null=True, verbose_name="ایمیل هتل")
    image = models.ImageField(upload_to='hotels/', blank=True, null=True, verbose_name="تصویر شاخص هتل")
    latitude = models.FloatField(default=35.6892, verbose_name="عرض جغرافیایی (Latitude)")
    longitude = models.FloatField(default=51.3890, verbose_name="طول جغرافیایی (Longitude)")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")

    class Meta:
        verbose_name = "هتل"
        verbose_name_plural = "هتل‌ها"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.city})"

    @property
    def average_rating(self):
        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0

    @property
    def reviews_count(self):
        return self.reviews.count()

    @property
    def min_price(self):
        min_p = self.rooms.aggregate(models.Min('price_per_night'))['price_per_night__min']
        return min_p or 0


class RoomType(models.Model):
    hotel = models.ForeignKey(
        Hotel, 
        on_delete=models.CASCADE, 
        related_name='rooms',
        verbose_name="هتل"
    )
    title = models.CharField(max_length=150, verbose_name="عنوان اتاق")
    capacity = models.PositiveIntegerField(default=2, verbose_name="ظرفیت (نفر)")
    price_per_night = models.DecimalField(
        max_digits=12, 
        decimal_places=0, 
        verbose_name="قیمت هر شب (تومان)"
    )
    total_rooms = models.PositiveIntegerField(
        default=5, 
        verbose_name="تعداد کل این نوع اتاق"
    )
    amenities = models.ManyToManyField(
        Amenity, 
        blank=True, 
        related_name='rooms',
        verbose_name="امکانات اتاق"
    )
    description = models.TextField(blank=True, verbose_name="توضیحات اتاق")
    image = models.ImageField(upload_to='rooms/', blank=True, null=True, verbose_name="تصویر اتاق")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "نوع اتاق"
        verbose_name_plural = "انواع اتاق‌ها"
        ordering = ['price_per_night']

    def __str__(self):
        return f"{self.title} - {self.hotel.name} ({self.capacity} نفره)"

    def booked_rooms_count(self, check_in, check_out):
        """
        محاسبه تعداد اتاق‌های رزرو شده در بازه زمانی مورد نظر
        فرمول عدم تداخل: رزروی متداخل است که ورود آن قبل از خروج درخواستی و خروج آن بعد از ورود درخواستی باشد.
        """
        from bookings.models import Booking
        overlapping = Booking.objects.filter(
            room_type=self,
            status='confirmed',
            check_in__lt=check_out,
            check_out__gt=check_in
        )
        total_booked = overlapping.aggregate(Sum('rooms_count'))['rooms_count__sum']
        return total_booked or 0

    def available_rooms_count(self, check_in, check_out):
        """
        تعداد اتاق‌های در دسترس در بازه زمانی داده شده
        """
        booked = self.booked_rooms_count(check_in, check_out)
        return max(0, self.total_rooms - booked)

    def is_available(self, check_in, check_out, requested_count=1):
        return self.available_rooms_count(check_in, check_out) >= requested_count


class Review(models.Model):
    hotel = models.ForeignKey(
        Hotel, 
        on_delete=models.CASCADE, 
        related_name='reviews',
        verbose_name="هتل"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='reviews',
        verbose_name="کاربر"
    )
    rating = models.PositiveSmallIntegerField(
        choices=[(i, f"{i} ستاره") for i in range(1, 6)],
        default=5,
        verbose_name="امتیاز (1 تا 5)"
    )
    comment = models.TextField(verbose_name="متن نظر")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت نظر")

    class Meta:
        verbose_name = "امتیاز و نظر"
        verbose_name_plural = "نظرات و امتیازات"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.hotel.name} ({self.rating}★)"
