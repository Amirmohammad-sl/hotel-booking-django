import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils import timezone
from hotels.models import RoomType, Hotel

class DiscountCode(models.Model):
    code = models.CharField(max_length=50, unique=True, verbose_name="کد تخفیف")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_discounts',
        verbose_name="ایجاد شده توسط"
    )
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='discount_codes',
        verbose_name="مخصوص هتل خاص (اختیاری)",
        help_text="اگر خالی باشد روی تمامی هتل‌های مدیر اعمال می‌شود"
    )
    discount_percent = models.PositiveIntegerField(
        verbose_name="درصد تخفیف (1 تا 100)"
    )
    max_discount_amount = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        null=True,
        blank=True,
        verbose_name="حداکثر سقف تخفیف (تومان)",
        help_text="اختیاری"
    )
    min_order_amount = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        default=0,
        verbose_name="حداقل مبلغ رزرو (تومان)"
    )
    valid_from = models.DateField(verbose_name="شروع اعتبار")
    valid_to = models.DateField(verbose_name="پایان اعتبار")
    max_uses = models.PositiveIntegerField(default=100, verbose_name="حداکثر دفعات مجاز استفاده")
    times_used = models.PositiveIntegerField(default=0, verbose_name="تعداد دفعات استفاده شده")
    is_active = models.BooleanField(default=True, verbose_name="فعال است؟")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "کد تخفیف"
        verbose_name_plural = "کدهای تخفیف"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} ({self.discount_percent}%)"

    def validate_for_booking(self, order_amount, hotel=None, current_date=None):
        if not self.is_active:
            return False, "این کد تخفیف غیرفعال است."
        
        today = current_date or timezone.localdate()
        if today < self.valid_from:
            return False, "زمان استفاده از این کد تخفیف هنوز فرا نرسیده است."
        if today > self.valid_to:
            return False, "مهلت استفاده از این کد تخفیف منقضی شده است."
        
        if self.times_used >= self.max_uses:
            return False, "ظرفیت استفاده از این کد تخفیف به پایان رسیده است."
        
        if order_amount < self.min_order_amount:
            return False, f"حداقل مبلغ سفارش برای اعمال این کد {self.min_order_amount:,.0f} تومان است."
        
        if self.hotel and hotel and self.hotel != hotel:
            return False, f"این کد تخفیف فقط برای هتل «{self.hotel.name}» معتبر است."
            
        return True, "کد تخفیف معتبر است."

    def calculate_discount(self, order_amount):
        discount = (Decimal(self.discount_percent) / Decimal(100)) * Decimal(order_amount)
        if self.max_discount_amount and discount > self.max_discount_amount:
            discount = self.max_discount_amount
        return discount


class Booking(models.Model):
    STATUS_CHOICES = (
        ('confirmed', 'تأیید شده'),
        ('cancelled', 'لغو شده'),
        ('completed', 'به پایان رسیده'),
    )

    tracking_code = models.CharField(
        max_length=20, 
        unique=True, 
        editable=False, 
        verbose_name="کد رهگیری رزرو"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='bookings',
        verbose_name="کاربر رزرو کننده"
    )
    room_type = models.ForeignKey(
        RoomType, 
        on_delete=models.CASCADE, 
        related_name='bookings',
        verbose_name="نوع اتاق"
    )
    rooms_count = models.PositiveIntegerField(
        default=1, 
        verbose_name="تعداد اتاق درخواستی"
    )
    check_in = models.DateField(verbose_name="تاریخ ورود")
    check_out = models.DateField(verbose_name="تاریخ خروج")
    guest_name = models.CharField(max_length=150, verbose_name="نام و نام خانوادگی مهمان اصلی")
    guest_phone = models.CharField(max_length=20, verbose_name="تلفن همراه مهمان")
    guest_national_id = models.CharField(max_length=20, blank=True, null=True, verbose_name="کد ملی مهمان")
    special_requests = models.TextField(blank=True, null=True, verbose_name="درخواست‌های ویژه")
    
    nights_count = models.PositiveIntegerField(default=1, verbose_name="تعداد شب‌ها")
    price_per_night = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="قیمت هر شب")
    total_price = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="مبلغ پایه (کل)")
    discount_code = models.ForeignKey(
        DiscountCode, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='bookings',
        verbose_name="کد تخفیف استفاده شده"
    )
    discount_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=0, 
        default=0, 
        verbose_name="مبلغ تخفیف"
    )
    final_price = models.DecimalField(
        max_digits=12, 
        decimal_places=0, 
        verbose_name="مبلغ نهایی پرداختی"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='confirmed', 
        verbose_name="وضعیت رزرو"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ و ساعت ثبت")

    class Meta:
        verbose_name = "رزرو"
        verbose_name_plural = "رزروها"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.tracking_code:
            self.tracking_code = f"HTR-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tracking_code} - {self.guest_name} ({self.room_type.hotel.name})"


class NotificationLog(models.Model):
    TYPE_CHOICES = (
        ('email', 'ایمیل تأیید'),
        ('sms', 'پیامک تأیید'),
    )

    booking = models.ForeignKey(
        Booking, 
        on_delete=models.CASCADE, 
        related_name='notifications',
        verbose_name="رزرو مربوطه"
    )
    notification_type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name="نوع اطلاع‌رسانی")
    recipient = models.CharField(max_length=150, verbose_name="گیرنده (ایمیل یا شماره موبایل)")
    subject = models.CharField(max_length=255, verbose_name="موضوع")
    message = models.TextField(verbose_name="متن پیام ارسال شده")
    sent_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان ارسال")
    is_successful = models.BooleanField(default=True, verbose_name="وضعیت موفقیت ارسال")

    class Meta:
        verbose_name = "لاگ اعلان"
        verbose_name_plural = "لاگ‌های اطلاع‌رسانی"
        ordering = ['-sent_at']

    def __str__(self):
        return f"{self.get_notification_type_display()} به {self.recipient} ({self.booking.tracking_code})"
