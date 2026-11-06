from django.contrib import admin
from .models import DiscountCode, Booking, NotificationLog

@admin.register(DiscountCode)
class DiscountCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'hotel', 'discount_percent', 'min_order_amount', 'valid_from', 'valid_to', 'times_used', 'max_uses', 'is_active')
    list_filter = ('is_active', 'valid_from', 'valid_to')
    search_fields = ('code',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('tracking_code', 'guest_name', 'room_type', 'check_in', 'check_out', 'rooms_count', 'final_price', 'status', 'created_at')
    list_filter = ('status', 'check_in', 'check_out', 'created_at')
    search_fields = ('tracking_code', 'guest_name', 'guest_phone', 'guest_national_id')

@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('booking', 'notification_type', 'recipient', 'subject', 'sent_at', 'is_successful')
    list_filter = ('notification_type', 'is_successful', 'sent_at')
    search_fields = ('recipient', 'subject', 'booking__tracking_code')
