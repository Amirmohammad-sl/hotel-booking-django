from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات تکمیلی سیستم هتل', {
            'fields': ('role', 'phone', 'favorite_city', 'preferred_min_price', 'preferred_max_price'),
        }),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone')
