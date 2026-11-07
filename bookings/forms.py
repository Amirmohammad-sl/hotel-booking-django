from django import forms
from .models import Booking, DiscountCode
from hotels.models import Hotel
from bookings.jalali import parse_flexible_date, gregorian_to_jalali

class JalaliDateField(forms.Field):
    widget = forms.TextInput(attrs={
        'class': 'form-control jalali-datepicker',
        'placeholder': '۱۴۰۳/۰۸/۱۵',
        'autocomplete': 'off',
        'dir': 'ltr',
        'style': 'text-align: center;'
    })

    def prepare_value(self, value):
        if not value:
            return ''
        return gregorian_to_jalali(value)

    def to_python(self, value):
        if not value:
            return None
        dt = parse_flexible_date(value)
        if not dt:
            raise forms.ValidationError('فرمت تاریخ نامعتبر است. لطفاً تاریخ معتبر وارد کنید.')
        return dt


class BookingForm(forms.ModelForm):
    check_in = JalaliDateField(label="تاریخ ورود (شمسی)")
    check_out = JalaliDateField(label="تاریخ خروج (شمسی)")
    discount_code_input = forms.CharField(
        max_length=50, 
        required=False, 
        label="کد تخفیف",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'در صورت داشتن کد تخفیف وارد کنید'})
    )

    class Meta:
        model = Booking
        fields = [
            'rooms_count', 'check_in', 'check_out', 
            'guest_name', 'guest_phone', 'guest_national_id', 'special_requests'
        ]
        widgets = {
            'rooms_count': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'value': 1}),
            'guest_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'نام و نام خانوادگی'}),
            'guest_phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'شماره موبایل'}),
            'guest_national_id': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'کد ملی (۱۰ رقم)'}),
            'special_requests': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'درخواست‌های اختصاصی (طبقه بالا، تخت اضافه، زمان ورود خاص...)'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        check_in = cleaned_data.get('check_in')
        check_out = cleaned_data.get('check_out')

        if check_in and check_out:
            if check_out <= check_in:
                self.add_error('check_out', 'تاریخ خروج باید حداقل یک روز بعد از تاریخ ورود باشد.')

        return cleaned_data


class DiscountCodeForm(forms.ModelForm):
    valid_from = JalaliDateField(label="شروع اعتبار (شمسی)")
    valid_to = JalaliDateField(label="پایان اعتبار (شمسی)")

    def __init__(self, *args, **kwargs):
        manager = kwargs.pop('manager', None)
        super().__init__(*args, **kwargs)
        if manager:
            self.fields['hotel'].queryset = Hotel.objects.filter(manager=manager)
            self.fields['hotel'].empty_label = "تمامی هتل‌های من"

    class Meta:
        model = DiscountCode
        fields = [
            'code', 'hotel', 'discount_percent', 'max_discount_amount',
            'min_order_amount', 'valid_from', 'valid_to', 'max_uses', 'is_active'
        ]
        widgets = {
            'code': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'مثلاً: YALDA1403'}),
            'hotel': forms.Select(attrs={'class': 'form-select'}),
            'discount_percent': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'max': 100, 'placeholder': 'درصد'}),
            'max_discount_amount': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'تومان (اختیاری)'}),
            'min_order_amount': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'تومان'}),
            'max_uses': forms.NumberInput(attrs={'class': 'form-control', 'min': 1}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
