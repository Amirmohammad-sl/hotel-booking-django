from django import forms
from .models import Hotel, RoomType, Review, Amenity

class HotelForm(forms.ModelForm):
    class Meta:
        model = Hotel
        fields = [
            'name', 'city', 'address', 'stars', 'description', 
            'phone', 'email', 'image', 'latitude', 'longitude'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'نام هتل'}),
            'city': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'مثلاً: تهران، اصفهان، شیراز'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'آدرس کامل'}),
            'stars': forms.Select(attrs={'class': 'form-select'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'توضیحات و امکانات کلی هتل'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'شماره تماس'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'ایمیل هتل'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
            'latitude': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.0001', 'id': 'id_latitude'}),
            'longitude': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.0001', 'id': 'id_longitude'}),
        }


class RoomTypeForm(forms.ModelForm):
    amenities = forms.ModelMultipleChoiceField(
        queryset=Amenity.objects.all(),
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'form-check-input'}),
        required=False,
        label="امکانات اتاق"
    )

    class Meta:
        model = RoomType
        fields = [
            'title', 'capacity', 'price_per_night', 
            'total_rooms', 'amenities', 'description', 'image'
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'مثلاً: سوئیت دوتخته رویال'}),
            'capacity': forms.NumberInput(attrs={'class': 'form-control', 'min': 1}),
            'price_per_night': forms.NumberInput(attrs={'class': 'form-control', 'step': '10000', 'placeholder': 'تومان'}),
            'total_rooms': forms.NumberInput(attrs={'class': 'form-control', 'min': 1, 'placeholder': 'تعداد کل اتاق‌های این مدل'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'مشخصات و ویژگی‌های اتاق'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
        }


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(attrs={'class': 'form-select'}),
            'comment': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'نظر و تجربه اقامت خود در این هتل را بنویسید...'}),
        }
