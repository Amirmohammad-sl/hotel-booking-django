import json
from datetime import datetime, timedelta
from decimal import Decimal
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Avg, Min, Max
from django.http import JsonResponse
from django.utils import timezone
from .models import Hotel, RoomType, Review, Amenity
from .forms import ReviewForm
from bookings.models import Booking
from bookings.jalali import parse_flexible_date, gregorian_to_jalali

def home_view(request):
    cities = Hotel.objects.values_list('city', flat=True).distinct()
    featured_hotels = Hotel.objects.all().order_by('-stars', '-created_at')[:6]
    
    # الگوریتم سیستم پیشنهاددهنده هوشمند هتل
    recommendations = []
    user = request.user
    if user.is_authenticated:
        rec_query = Q()
        if user.favorite_city:
            rec_query |= Q(city__icontains=user.favorite_city)
        
        # بررسی شهرهای رزروهای قبلی کاربر
        past_booked_cities = Booking.objects.filter(user=user).values_list('room_type__hotel__city', flat=True)
        if past_booked_cities:
            rec_query |= Q(city__in=list(past_booked_cities))
            
        recommended_qs = Hotel.objects.filter(rec_query).distinct()
        
        # فیلتر بازه قیمت مورد علاقه
        if user.preferred_min_price or user.preferred_max_price:
            filtered_by_price = []
            for h in recommended_qs:
                min_p = h.min_price
                min_cond = (min_p >= user.preferred_min_price) if user.preferred_min_price else True
                max_cond = (min_p <= user.preferred_max_price) if user.preferred_max_price else True
                if min_cond and max_cond:
                    filtered_by_price.append(h)
            if filtered_by_price:
                recommendations = filtered_by_price[:4]
            else:
                recommendations = list(recommended_qs[:4])
        else:
            recommendations = list(recommended_qs[:4])

    if not recommendations:
        # در صورت نبود ترجیحات کاربر، پیشنهاد بر اساس برترین هتل‌های دارای بالاترین امتیاز
        recommendations = list(Hotel.objects.annotate(avg_rate=Avg('reviews__rating')).order_by('-avg_rate', '-stars')[:4])

    today = gregorian_to_jalali(timezone.localdate())
    tomorrow = gregorian_to_jalali(timezone.localdate() + timedelta(days=1))

    context = {
        'cities': cities,
        'featured_hotels': featured_hotels,
        'recommendations': recommendations,
        'today': today,
        'tomorrow': tomorrow,
    }
    return render(request, 'hotels/home.html', context)


def hotel_list_view(request):
    city = request.GET.get('city', '').strip()
    check_in_str = request.GET.get('check_in', '').strip()
    check_out_str = request.GET.get('check_out', '').strip()
    capacity_str = request.GET.get('capacity', '').strip()
    stars_str = request.GET.get('stars', '').strip()
    min_price_str = request.GET.get('min_price', '').strip()
    max_price_str = request.GET.get('max_price', '').strip()
    amenity_ids = request.GET.getlist('amenities')

    queryset = Hotel.objects.all()

    if city:
        queryset = queryset.filter(Q(city__icontains=city) | Q(name__icontains=city) | Q(address__icontains=city))

    if stars_str and stars_str.isdigit():
        queryset = queryset.filter(stars=int(stars_str))

    # پردازش تاریخ‌های جستجو
    check_in = None
    check_out = None
    if check_in_str and check_out_str:
        check_in = parse_flexible_date(check_in_str)
        check_out = parse_flexible_date(check_out_str)
        if check_in and check_out:
            if check_out <= check_in:
                messages.warning(request, "تاریخ خروج باید بعد از تاریخ ورود باشد.")
                check_in = None
                check_out = None

    capacity = int(capacity_str) if capacity_str and capacity_str.isdigit() else 1

    # فیلتر هتل‌ها بر اساس اتاق‌های موجود در بازه زمانی و ظرفیت
    filtered_hotels = []
    for hotel in queryset:
        rooms_qs = hotel.rooms.filter(capacity__gte=capacity)
        
        if min_price_str and min_price_str.isdigit():
            rooms_qs = rooms_qs.filter(price_per_night__gte=Decimal(min_price_str))
        if max_price_str and max_price_str.isdigit():
            rooms_qs = rooms_qs.filter(price_per_night__lte=Decimal(max_price_str))
        if amenity_ids:
            for a_id in amenity_ids:
                rooms_qs = rooms_qs.filter(amenities__id=a_id)

        if check_in and check_out:
            available_rooms = [r for r in rooms_qs if r.is_available(check_in, check_out)]
            if available_rooms:
                hotel.matched_rooms_count = len(available_rooms)
                hotel.calculated_min_price = min(r.price_per_night for r in available_rooms)
                filtered_hotels.append(hotel)
        else:
            if rooms_qs.exists() or (not city and not capacity_str and not min_price_str and not max_price_str):
                hotel.matched_rooms_count = rooms_qs.count()
                hotel.calculated_min_price = hotel.min_price
                filtered_hotels.append(hotel)

    all_amenities = Amenity.objects.all()
    cities = Hotel.objects.values_list('city', flat=True).distinct()

    context = {
        'hotels': filtered_hotels,
        'city': city,
        'check_in': check_in_str,
        'check_out': check_out_str,
        'capacity': capacity,
        'stars': stars_str,
        'min_price': min_price_str,
        'max_price': max_price_str,
        'selected_amenities': [int(x) for x in amenity_ids if x.isdigit()],
        'all_amenities': all_amenities,
        'cities': cities,
        'total_found': len(filtered_hotels),
    }
    return render(request, 'hotels/hotel_list.html', context)


def hotel_detail_view(request, hotel_id):
    hotel = get_object_or_404(Hotel, id=hotel_id)
    check_in_str = request.GET.get('check_in', '')
    check_out_str = request.GET.get('check_out', '')
    capacity_str = request.GET.get('capacity', '')

    check_in = None
    check_out = None
    if check_in_str and check_out_str:
        check_in = parse_flexible_date(check_in_str)
        check_out = parse_flexible_date(check_out_str)

    rooms_data = []
    for room in hotel.rooms.all():
        if check_in and check_out:
            free_count = room.available_rooms_count(check_in, check_out)
        else:
            free_count = room.total_rooms
        rooms_data.append({
            'room': room,
            'free_count': free_count,
            'is_free': free_count > 0
        })

    reviews = hotel.reviews.all().order_by('-created_at')
    review_form = ReviewForm()

    context = {
        'hotel': hotel,
        'rooms_data': rooms_data,
        'reviews': reviews,
        'review_form': review_form,
        'check_in': check_in_str,
        'check_out': check_out_str,
        'capacity': capacity_str,
    }
    return render(request, 'hotels/hotel_detail.html', context)


def room_detail_view(request, room_id):
    room = get_object_or_404(RoomType, id=room_id)
    hotel = room.hotel

    # تولید داده‌های تقویم وضعیت اتاق برای ۳۰ روز آینده
    today = timezone.localdate()
    calendar_days = []
    for i in range(30):
        target_date = today + timedelta(days=i)
        next_day = target_date + timedelta(days=1)
        free_count = room.available_rooms_count(target_date, next_day)
        booked_count = room.total_rooms - free_count
        calendar_days.append({
            'date': target_date.strftime('%Y-%m-%d'),
            'day_num': target_date.day,
            'month_name': target_date.strftime('%b'),
            'free_count': free_count,
            'booked_count': booked_count,
            'total_rooms': room.total_rooms,
            'is_available': free_count > 0,
        })

    context = {
        'room': room,
        'hotel': hotel,
        'calendar_days': calendar_days,
        'today': today.strftime('%Y-%m-%d'),
        'tomorrow': (today + timedelta(days=1)).strftime('%Y-%m-%d'),
    }
    return render(request, 'hotels/room_detail.html', context)


def room_calendar_api(request, room_id):
    """
    API برای دریافت وضعیت اتاق در تقویم به فرمت JSON (جهت تعامل جاوا اسکریپت تقویم)
    """
    room = get_object_or_404(RoomType, id=room_id)
    start_str = request.GET.get('start')
    end_str = request.GET.get('end')
    
    if start_str and end_str:
        try:
            start_date = datetime.strptime(start_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_str, '%Y-%m-%d').date()
        except ValueError:
            start_date = timezone.localdate()
            end_date = start_date + timedelta(days=30)
    else:
        start_date = timezone.localdate()
        end_date = start_date + timedelta(days=30)

    events = []
    curr = start_date
    while curr <= end_date:
        next_d = curr + timedelta(days=1)
        free_count = room.available_rooms_count(curr, next_d)
        is_free = free_count > 0
        events.append({
            'date': curr.strftime('%Y-%m-%d'),
            'free_count': free_count,
            'total_rooms': room.total_rooms,
            'status': 'available' if is_free else 'full',
            'label': f"آزاد ({free_count})" if is_free else "تکمیل ظرفیت",
            'color': '#198754' if is_free else '#dc3545'
        })
        curr += timedelta(days=1)

    return JsonResponse({'room_id': room.id, 'events': events})


@login_required
def add_review_view(request, hotel_id):
    hotel = get_object_or_404(Hotel, id=hotel_id)
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.hotel = hotel
            review.user = request.user
            review.save()
            messages.success(request, "نظر و امتیاز ارزشمند شما با موفقیت ثبت شد.")
        else:
            messages.error(request, "خطایی در ثبت نظر رخ داده است.")
    return redirect('hotels:hotel_detail', hotel_id=hotel.id)
