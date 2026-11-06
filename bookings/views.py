import json
from datetime import datetime, timedelta
from decimal import Decimal
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse, HttpResponseForbidden
from django.utils import timezone
from django.db.models import Sum, Q, Count

from hotels.models import Hotel, RoomType, Amenity
from hotels.forms import HotelForm, RoomTypeForm
from .models import Booking, DiscountCode, NotificationLog
from .forms import BookingForm, DiscountCodeForm
from .services import send_booking_confirmation

def is_manager(user):
    return user.is_authenticated and (user.is_hotel_manager or user.is_superuser)


# ==========================================
# بخش امکانات کاربر (Customer Booking Views)
# ==========================================

@login_required
def book_room_view(request, room_id):
    room = get_object_or_404(RoomType, id=room_id)
    hotel = room.hotel

    # مقادیر اولیه از پارامترهای GET
    initial_check_in = request.GET.get('check_in') or timezone.localdate().strftime('%Y-%m-%d')
    initial_check_out = request.GET.get('check_out') or (timezone.localdate() + timedelta(days=1)).strftime('%Y-%m-%d')
    initial_rooms_count = request.GET.get('rooms_count', 1)

    initial_data = {
        'check_in': initial_check_in,
        'check_out': initial_check_out,
        'rooms_count': initial_rooms_count,
        'guest_name': request.user.display_name,
        'guest_phone': request.user.phone or '',
    }

    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            booking = form.save(commit=False)
            booking.user = request.user
            booking.room_type = room
            
            check_in = form.cleaned_data['check_in']
            check_out = form.cleaned_data['check_out']
            rooms_count = form.cleaned_data['rooms_count']

            # ۱. بررسی ظرفیت آزاد اتاق در این بازه زمانی
            available_rooms = room.available_rooms_count(check_in, check_out)
            if available_rooms < rooms_count:
                messages.error(request, f"متأسفانه در این تاریخ تنها {available_rooms} اتاق خالی از این نوع وجود دارد.")
                return render(request, 'bookings/book_room.html', {'form': form, 'room': room, 'hotel': hotel})

            # ۲. محاسبه تعداد شب‌ها و مبلغ کل
            nights_count = (check_out - check_in).days
            if nights_count < 1:
                nights_count = 1
            
            booking.nights_count = nights_count
            booking.price_per_night = room.price_per_night
            total_price = room.price_per_night * nights_count * rooms_count
            booking.total_price = total_price

            # ۳. بررسی و اعمال کد تخفیف
            discount_code_str = form.cleaned_data.get('discount_code_input', '').strip()
            discount_amount = Decimal(0)
            if discount_code_str:
                try:
                    discount_obj = DiscountCode.objects.get(code__iexact=discount_code_str)
                    is_valid, msg = discount_obj.validate_for_booking(total_price, hotel=hotel, current_date=timezone.localdate())
                    if is_valid:
                        discount_amount = discount_obj.calculate_discount(total_price)
                        booking.discount_code = discount_obj
                        booking.discount_amount = discount_amount
                        discount_obj.times_used += 1
                        discount_obj.save()
                        messages.success(request, f"کد تخفیف «{discount_obj.code}» با موفقیت اعمال شد.")
                    else:
                        messages.warning(request, f"کد تخفیف نامعتبر بود ({msg})، رزرو با قیمت عادی ثبت می‌شود.")
                except DiscountCode.DoesNotExist:
                    messages.warning(request, "کد تخفیف وارد شده وجود ندارد، رزرو با قیمت عادی ثبت می‌شود.")

            booking.final_price = max(Decimal(0), total_price - discount_amount)
            booking.status = 'confirmed'
            booking.save()

            # ۴. ارسال ایمیل و پیامک تأیید رزرو
            send_booking_confirmation(booking)
            messages.success(request, f"رزرو شما با موفقیت تأیید شد! کد رهگیری: {booking.tracking_code}")
            return redirect('bookings:booking_detail', tracking_code=booking.tracking_code)
    else:
        form = BookingForm(initial=initial_data)

    context = {
        'form': form,
        'room': room,
        'hotel': hotel,
        'initial_check_in': initial_check_in,
        'initial_check_out': initial_check_out,
    }
    return render(request, 'bookings/book_room.html', context)


def apply_coupon_ajax_view(request):
    """
    بررسی اعتبارسنجی آنی کد تخفیف توسط جاوا اسکریپت در صفحه رزرو
    """
    if request.method != 'POST':
        return JsonResponse({'valid': False, 'message': 'درخواست نامعتبر است.'})

    try:
        data = json.loads(request.body)
        code_str = data.get('code', '').strip()
        room_id = data.get('room_id')
        check_in_str = data.get('check_in')
        check_out_str = data.get('check_out')
        rooms_count = int(data.get('rooms_count', 1))

        if not code_str:
            return JsonResponse({'valid': False, 'message': 'لطفاً کد تخفیف را وارد کنید.'})

        room = get_object_or_404(RoomType, id=room_id)
        check_in = datetime.strptime(check_in_str, '%Y-%m-%d').date()
        check_out = datetime.strptime(check_out_str, '%Y-%m-%d').date()
        nights = max(1, (check_out - check_in).days)
        total_price = room.price_per_night * nights * rooms_count

        discount = DiscountCode.objects.get(code__iexact=code_str)
        is_valid, msg = discount.validate_for_booking(total_price, hotel=room.hotel, current_date=timezone.localdate())

        if not is_valid:
            return JsonResponse({'valid': False, 'message': msg})

        discount_amount = discount.calculate_discount(total_price)
        final_price = max(Decimal(0), total_price - discount_amount)

        return JsonResponse({
            'valid': True,
            'message': f"کد تخفیف {discount.discount_percent}٪ با موفقیت اعمال شد.",
            'discount_amount': float(discount_amount),
            'final_price': float(final_price),
            'discount_amount_formatted': f"{discount_amount:,.0f} تومان",
            'final_price_formatted': f"{final_price:,.0f} تومان"
        })

    except DiscountCode.DoesNotExist:
        return JsonResponse({'valid': False, 'message': 'کد تخفیف وارد شده یافت نشد.'})
    except Exception as e:
        return JsonResponse({'valid': False, 'message': f'خطا در پردازش: {str(e)}'})


@login_required
def booking_detail_view(request, tracking_code):
    booking = get_object_or_404(Booking, tracking_code=tracking_code)
    
    # اجازه دسترسی برای صاحب رزرو یا مدیر هتل
    if booking.user != request.user and not request.user.is_hotel_manager and not request.user.is_superuser:
        return HttpResponseForbidden("شما اجازه دسترسی به این فاکتور را ندارید.")

    notifications = booking.notifications.all()

    context = {
        'booking': booking,
        'notifications': notifications,
    }
    return render(request, 'bookings/booking_detail.html', context)


@login_required
def my_bookings_view(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'bookings/my_bookings.html', {'bookings': bookings})


@login_required
def cancel_booking_view(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    if booking.user != request.user and not request.user.is_hotel_manager:
        return HttpResponseForbidden("اجازه لغو این رزرو را ندارید.")

    if booking.status == 'cancelled':
        messages.warning(request, "این رزرو قبلاً لغو شده است.")
    else:
        booking.status = 'cancelled'
        booking.save()
        messages.success(request, f"رزرو با کد رهگیری {booking.tracking_code} لغو شد.")

    if request.user.is_hotel_manager and booking.user != request.user:
        return redirect('bookings:manager_bookings')
    return redirect('bookings:my_bookings')


# ==========================================
# بخش امکانات مدیر هتل (Manager Features)
# ==========================================

@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_dashboard_view(request):
    hotels = Hotel.objects.filter(manager=request.user) if not request.user.is_superuser else Hotel.objects.all()
    hotel_ids = hotels.values_list('id', flat=True)

    rooms_count = RoomType.objects.filter(hotel_id__in=hotel_ids).count()
    all_bookings = Booking.objects.filter(room_type__hotel_id__in=hotel_ids)
    
    active_bookings_count = all_bookings.filter(status='confirmed').count()
    total_income = all_bookings.filter(status='confirmed').aggregate(Sum('final_price'))['final_price__sum'] or 0

    recent_bookings = all_bookings.order_by('-created_at')[:6]

    # محاسبه اتاق‌های پر و خالی امروز
    today = timezone.localdate()
    tomorrow = today + timedelta(days=1)
    
    total_rooms_capacity = RoomType.objects.filter(hotel_id__in=hotel_ids).aggregate(Sum('total_rooms'))['total_rooms__sum'] or 0
    today_booked_count = all_bookings.filter(
        status='confirmed',
        check_in__lte=today,
        check_out__gt=today
    ).aggregate(Sum('rooms_count'))['rooms_count__sum'] or 0
    
    today_free_count = max(0, total_rooms_capacity - today_booked_count)
    occupancy_rate = round((today_booked_count / total_rooms_capacity) * 100, 1) if total_rooms_capacity > 0 else 0

    context = {
        'hotels': hotels,
        'hotels_count': hotels.count(),
        'rooms_count': rooms_count,
        'active_bookings_count': active_bookings_count,
        'total_income': total_income,
        'today_booked_count': today_booked_count,
        'today_free_count': today_free_count,
        'total_rooms_capacity': total_rooms_capacity,
        'occupancy_rate': occupancy_rate,
        'recent_bookings': recent_bookings,
        'today': today,
    }
    return render(request, 'bookings/manager/dashboard.html', context)


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_hotels_view(request):
    hotels = Hotel.objects.filter(manager=request.user) if not request.user.is_superuser else Hotel.objects.all()
    return render(request, 'bookings/manager/hotel_list.html', {'hotels': hotels})


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_hotel_create_view(request):
    if request.method == 'POST':
        form = HotelForm(request.POST, request.FILES)
        if form.is_valid():
            hotel = form.save(commit=False)
            hotel.manager = request.user
            hotel.save()
            messages.success(request, f"هتل «{hotel.name}» با موفقیت ثبت شد.")
            return redirect('bookings:manager_hotels')
    else:
        form = HotelForm(initial={'latitude': 35.6892, 'longitude': 51.3890})

    return render(request, 'bookings/manager/hotel_form.html', {'form': form, 'title': 'تعریف هتل جدید'})


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_hotel_edit_view(request, hotel_id):
    hotel = get_object_or_404(Hotel, id=hotel_id)
    if hotel.manager != request.user and not request.user.is_superuser:
        return HttpResponseForbidden()

    if request.method == 'POST':
        form = HotelForm(request.POST, request.FILES, instance=hotel)
        if form.is_valid():
            form.save()
            messages.success(request, f"اطلاعات هتل «{hotel.name}» به‌روزرسانی شد.")
            return redirect('bookings:manager_hotels')
    else:
        form = HotelForm(instance=hotel)

    return render(request, 'bookings/manager/hotel_form.html', {'form': form, 'hotel': hotel, 'title': f'ویرایش هتل {hotel.name}'})


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_rooms_view(request, hotel_id):
    hotel = get_object_or_404(Hotel, id=hotel_id)
    if hotel.manager != request.user and not request.user.is_superuser:
        return HttpResponseForbidden()

    rooms = hotel.rooms.all()
    return render(request, 'bookings/manager/room_list.html', {'hotel': hotel, 'rooms': rooms})


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_room_create_view(request, hotel_id):
    hotel = get_object_or_404(Hotel, id=hotel_id)
    if hotel.manager != request.user and not request.user.is_superuser:
        return HttpResponseForbidden()

    if request.method == 'POST':
        form = RoomTypeForm(request.POST, request.FILES)
        if form.is_valid():
            room = form.save(commit=False)
            room.hotel = hotel
            room.save()
            form.save_m2m()
            messages.success(request, f"اتاق «{room.title}» به هتل افزوده شد.")
            return redirect('bookings:manager_rooms', hotel_id=hotel.id)
    else:
        form = RoomTypeForm()

    return render(request, 'bookings/manager/room_form.html', {'form': form, 'hotel': hotel, 'title': f'تعریف نوع اتاق جدید برای {hotel.name}'})


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_room_edit_view(request, room_id):
    room = get_object_or_404(RoomType, id=room_id)
    if room.hotel.manager != request.user and not request.user.is_superuser:
        return HttpResponseForbidden()

    if request.method == 'POST':
        form = RoomTypeForm(request.POST, request.FILES, instance=room)
        if form.is_valid():
            form.save()
            messages.success(request, f"اطلاعات اتاق «{room.title}» ذخیره شد.")
            return redirect('bookings:manager_rooms', hotel_id=room.hotel.id)
    else:
        form = RoomTypeForm(instance=room)

    return render(request, 'bookings/manager/room_form.html', {'form': form, 'hotel': room.hotel, 'room': room, 'title': f'ویرایش اتاق {room.title}'})


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_bookings_view(request):
    """
    امکان مشاهده رزروهای انجام شده توسط مدیر هتل با فیلتر هتل و وضعیت
    """
    hotels = Hotel.objects.filter(manager=request.user) if not request.user.is_superuser else Hotel.objects.all()
    hotel_ids = hotels.values_list('id', flat=True)

    bookings_qs = Booking.objects.filter(room_type__hotel_id__in=hotel_ids).select_related('room_type', 'room_type__hotel', 'user')

    hotel_filter = request.GET.get('hotel')
    status_filter = request.GET.get('status')
    search_q = request.GET.get('q', '').strip()

    if hotel_filter and hotel_filter.isdigit():
        bookings_qs = bookings_qs.filter(room_type__hotel_id=int(hotel_filter))
    if status_filter:
        bookings_qs = bookings_qs.filter(status=status_filter)
    if search_q:
        bookings_qs = bookings_qs.filter(
            Q(tracking_code__icontains=search_q) |
            Q(guest_name__icontains=search_q) |
            Q(guest_phone__icontains=search_q)
        )

    context = {
        'bookings': bookings_qs,
        'hotels': hotels,
        'selected_hotel': hotel_filter,
        'selected_status': status_filter,
        'search_q': search_q,
    }
    return render(request, 'bookings/manager/booking_list.html', context)


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_room_status_view(request):
    """
    امکان مشاهده اتاق‌های رزروشده و آزاد در یک تاریخ مشخص توسط مدیر هتل
    """
    hotels = Hotel.objects.filter(manager=request.user) if not request.user.is_superuser else Hotel.objects.all()
    hotel_ids = hotels.values_list('id', flat=True)

    date_str = request.GET.get('date')
    if date_str:
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            target_date = timezone.localdate()
    else:
        target_date = timezone.localdate()

    next_date = target_date + timedelta(days=1)

    room_status_data = []
    for h in hotels:
        for room in h.rooms.all():
            free_count = room.available_rooms_count(target_date, next_date)
            booked_count = room.total_rooms - free_count
            occupancy_pct = round((booked_count / room.total_rooms) * 100) if room.total_rooms > 0 else 0
            
            # مهمانان مقیم این اتاق در تاریخ جاری
            active_bookings = Booking.objects.filter(
                room_type=room,
                status='confirmed',
                check_in__lte=target_date,
                check_out__gt=target_date
            )

            room_status_data.append({
                'hotel': h,
                'room': room,
                'total_rooms': room.total_rooms,
                'booked_count': booked_count,
                'free_count': free_count,
                'occupancy_pct': occupancy_pct,
                'active_bookings': active_bookings,
            })

    context = {
        'target_date': target_date.strftime('%Y-%m-%d'),
        'room_status_data': room_status_data,
        'hotels': hotels,
    }
    return render(request, 'bookings/manager/room_status.html', context)


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_discounts_view(request):
    """
    مشاهده کدهای تخفیف تعریف شده توسط مدیر هتل
    """
    discounts = DiscountCode.objects.filter(created_by=request.user) if not request.user.is_superuser else DiscountCode.objects.all()
    return render(request, 'bookings/manager/discount_list.html', {'discounts': discounts})


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_discount_create_view(request):
    """
    تعریف کد تخفیف جدید توسط مدیر هتل
    """
    if request.method == 'POST':
        form = DiscountCodeForm(request.POST, manager=request.user)
        if form.is_valid():
            discount = form.save(commit=False)
            discount.created_by = request.user
            discount.save()
            messages.success(request, f"کد تخفیف «{discount.code}» با موفقیت تعریف شد.")
            return redirect('bookings:manager_discounts')
    else:
        initial_from = timezone.localdate().strftime('%Y-%m-%d')
        initial_to = (timezone.localdate() + timedelta(days=30)).strftime('%Y-%m-%d')
        form = DiscountCodeForm(manager=request.user, initial={'valid_from': initial_from, 'valid_to': initial_to})

    return render(request, 'bookings/manager/discount_form.html', {'form': form, 'title': 'تعریف کد تخفیف جدید'})


@login_required
@user_passes_test(is_manager, login_url='accounts:login')
def manager_discount_toggle_view(request, discount_id):
    discount = get_object_or_404(DiscountCode, id=discount_id)
    if discount.created_by != request.user and not request.user.is_superuser:
        return HttpResponseForbidden()

    discount.is_active = not discount.is_active
    discount.save()
    messages.info(request, f"وضعیت کد تخفیف «{discount.code}» به {'فعال' if discount.is_active else 'غیرفعال'} تغییر یافت.")
    return redirect('bookings:manager_discounts')
