from django import template
from django.utils import timezone
from datetime import timedelta
from bookings.jalali import (
    gregorian_to_jalali,
    gregorian_to_jalali_pretty,
    gregorian_to_jalali_datetime_pretty,
    to_persian_digits,
)

register = template.Library()

@register.filter(name='to_jalali')
def to_jalali_filter(value):
    """تبدیل به تاریخ شمسی عددی YYYY/MM/DD"""
    if not value:
        return ''
    return gregorian_to_jalali(value)


@register.filter(name='jalali_pretty')
def jalali_pretty_filter(value):
    """نمایش فارسی: ۱۵ آبان ۱۴۰۳"""
    if not value:
        return ''
    return gregorian_to_jalali_pretty(value)


@register.filter(name='jalali_datetime')
def jalali_datetime_filter(value):
    """نمایش فارسی تاریخ و زمان: ۱۵ آبان ۱۴۰۳ - ساعت ۱۴:۳۰"""
    if not value:
        return ''
    return gregorian_to_jalali_datetime_pretty(value)


@register.filter(name='fa_num')
def persian_num_filter(value):
    """تبدیل ارقام به فارسی"""
    if value is None:
        return ''
    return to_persian_digits(value)


@register.simple_tag
def jalali_today():
    """تاریخ امروز شمسی"""
    return gregorian_to_jalali(timezone.localdate())


@register.simple_tag
def jalali_tomorrow():
    """تاریخ فردا شمسی"""
    return gregorian_to_jalali(timezone.localdate() + timedelta(days=1))
