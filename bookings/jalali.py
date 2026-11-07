"""
ماژول اختصاصی تبدیل و مدیریت تاریخ‌های شمسی (جلالی)
"""
import datetime
import jdatetime

PERSIAN_MONTH_NAMES = [
    '', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
]

PERSIAN_DIGITS_MAP = str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹')
ENGLISH_DIGITS_MAP = str.maketrans('۰۱۲۳۴۵۶۷۸۹', '0123456789')


def to_persian_digits(text):
    if text is None:
        return ''
    return str(text).translate(PERSIAN_DIGITS_MAP)


def to_english_digits(text):
    if text is None:
        return ''
    return str(text).translate(ENGLISH_DIGITS_MAP)


def gregorian_to_jalali(dt, format_str='%Y/%m/%d'):
    """
    تبدیل تاریخ میلادی به تاریخ شمسی
    dt: شیء datetime.date یا datetime.datetime یا رشته تاریخ
    """
    if not dt:
        return ''
    
    if isinstance(dt, str):
        parsed = parse_flexible_date(dt)
        if not parsed:
            return dt
        dt = parsed

    if isinstance(dt, datetime.datetime):
        jdate = jdatetime.datetime.fromgregorian(datetime=dt)
        return jdate.strftime(format_str)
    elif isinstance(dt, datetime.date):
        jdate = jdatetime.date.fromgregorian(date=dt)
        return jdate.strftime(format_str)
    return str(dt)


def gregorian_to_jalali_pretty(dt):
    """
    نمایش زیبا به صورت: ۱۵ آبان ۱۴۰۳
    """
    if not dt:
        return ''
    if isinstance(dt, str):
        dt = parse_flexible_date(dt)
        if not dt:
            return ''
            
    if isinstance(dt, (datetime.date, datetime.datetime)):
        jd = jdatetime.date.fromgregorian(date=dt if isinstance(dt, datetime.date) else dt.date())
        m_name = PERSIAN_MONTH_NAMES[jd.month] if 1 <= jd.month <= 12 else ''
        return to_persian_digits(f"{jd.day} {m_name} {jd.year}")
    return str(dt)


def gregorian_to_jalali_datetime_pretty(dt):
    """
    نمایش تاریخ و ساعت شمسی: ۱۵ آبان ۱۴۰۳ - ساعت ۱۴:۳۰
    """
    if not dt:
        return ''
    if isinstance(dt, datetime.datetime):
        jdt = jdatetime.datetime.fromgregorian(datetime=dt)
        m_name = PERSIAN_MONTH_NAMES[jdt.month] if 1 <= jdt.month <= 12 else ''
        time_part = jdt.strftime('%H:%M')
        return to_persian_digits(f"{jdt.day} {m_name} {jdt.year} - {time_part}")
    elif isinstance(dt, datetime.date):
        return gregorian_to_jalali_pretty(dt)
    return str(dt)


def jalali_to_gregorian(jdate_str):
    """
    تبدیل رشته تاریخ شمسی به شیء datetime.date میلادی
    پشتیبانی از فرمت‌های YYYY/MM/DD یا YYYY-MM-DD با ارقام فارسی یا انگلیسی
    """
    if not jdate_str:
        return None
    cleaned = to_english_digits(str(jdate_str).strip()).replace('-', '/')
    parts = [int(p) for p in cleaned.split('/') if p.isdigit()]
    if len(parts) == 3:
        jy, jm, jd = parts
        try:
            return jdatetime.date(jy, jm, jd).togregorian()
        except Exception:
            return None
    return None


def parse_flexible_date(val):
    """
    پارس کردن منعطف تاریخ (اگر شمسی بود به میلادی تبدیل می‌کند و اگر میلادی بود همان را برمی‌گرداند)
    """
    if not val:
        return None
    if isinstance(val, datetime.date):
        return val
    if isinstance(val, datetime.datetime):
        return val.date()

    cleaned = to_english_digits(str(val).strip()).replace('-', '/')
    parts = [int(p) for p in cleaned.split('/') if p.isdigit()]
    if len(parts) == 3:
        y, m, d = parts
        if 1300 <= y <= 1500:
            # سال شمسی
            try:
                return jdatetime.date(y, m, d).togregorian()
            except Exception:
                return None
        elif 1900 <= y <= 2100:
            # سال میلادی
            try:
                return datetime.date(y, m, d)
            except Exception:
                return None
    return None
