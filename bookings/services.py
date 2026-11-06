from django.core.mail import send_mail
from django.conf import settings
from .models import NotificationLog

def send_booking_confirmation(booking):
    """
    سرویس ارسال ایمیل و پیامک تأیید رزرو با ثبت در سیستم لاگ اعلان‌ها
    """
    hotel = booking.room_type.hotel
    guest_name = booking.guest_name
    guest_email = booking.user.email if booking.user.email else f"guest_{booking.user.username}@example.com"
    guest_phone = booking.guest_phone or booking.user.phone or "09120000000"

    # ۱. متن ایمیل تأیید رزرو
    email_subject = f"تأیید رزرو هتل {hotel.name} - کد رهگیری: {booking.tracking_code}"
    email_body = f"""
سلام {guest_name} گرامی،

رزرو شما با موفقیت در سامانه رزرو هتل ثبت شد.

اطلاعات رزرو:
----------------------------------------
کد رهگیری: {booking.tracking_code}
هتل: {hotel.name} ({hotel.city})
آدرس: {hotel.address}
نوع اتاق: {booking.room_type.title} (تعداد: {booking.rooms_count} اتاق)
تاریخ ورود: {booking.check_in} (ساعت ۱۴:۰۰)
تاریخ خروج: {booking.check_out} (ساعت ۱۲:۰۰)
تعداد شب‌ها: {booking.nights_count} شب
مبلغ کل: {booking.total_price:,.0f} تومان
تخفیف اعمال شده: {booking.discount_amount:,.0f} تومان
مبلغ پرداختی: {booking.final_price:,.0f} تومان
وضعیت رزرو: {booking.get_status_display()}
----------------------------------------

جهت ورود به هتل، همراه داشتن کارت شناسایی معتبر و ارائه کد رهگیری الزامی است.
شماره تماس پذیرش هتل: {hotel.phone}

با تشکر از حسن انتخاب شما!
    """.strip()

    # ارسال ایمیل از طریق backend جنگو
    try:
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@hotelbooking.ir'),
            recipient_list=[guest_email],
            fail_silently=False,
        )
        email_sent = True
    except Exception as e:
        email_sent = False

    NotificationLog.objects.create(
        booking=booking,
        notification_type='email',
        recipient=guest_email,
        subject=email_subject,
        message=email_body,
        is_successful=email_sent
    )

    # ۲. شبیه‌سازی ارسال پیامک تأیید رزرو
    sms_text = f"مهمان گرامی {guest_name}، رزرو شما در هتل {hotel.name} با کد رهگیری {booking.tracking_code} برای تاریخ {booking.check_in} با موفقیت ثبت شد. تلفن هتل: {hotel.phone}"
    
    NotificationLog.objects.create(
        booking=booking,
        notification_type='sms',
        recipient=guest_phone,
        subject="پیامک تأیید رزرو اتاق",
        message=sms_text,
        is_successful=True
    )

    return True
