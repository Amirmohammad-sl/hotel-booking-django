from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import UserRegistrationForm, UserLoginForm, UserProfileForm
from bookings.models import Booking

def register_view(request):
    if request.user.is_authenticated:
        return redirect('hotels:home')
    
    initial_role = request.GET.get('role', 'customer')
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"خوش آمدید {user.display_name}! حساب کاربری شما با موفقیت ایجاد شد.")
            if user.is_hotel_manager:
                return redirect('bookings:manager_dashboard')
            return redirect('hotels:home')
    else:
        form = UserRegistrationForm(initial={'role': initial_role})
        
    return render(request, 'accounts/register.html', {'form': form, 'role': initial_role})


def login_view(request):
    if request.user.is_authenticated:
        if request.user.is_hotel_manager:
            return redirect('bookings:manager_dashboard')
        return redirect('hotels:home')
        
    if request.method == 'POST':
        form = UserLoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"خوش آمدید {user.display_name}!")
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            if user.is_hotel_manager:
                return redirect('bookings:manager_dashboard')
            return redirect('hotels:home')
        else:
            messages.error(request, "نام کاربری یا رمز عبور اشتباه است.")
    else:
        form = UserLoginForm()
        
    return render(request, 'accounts/login.html', {'form': form})


def logout_view(request):
    logout(request)
    messages.info(request, "شما با موفقیت از سیستم خارج شدید.")
    return redirect('hotels:home')


@login_required
def profile_view(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "اطلاعات حساب کاربری شما با موفقیت به‌روزرسانی شد.")
            return redirect('accounts:profile')
    else:
        form = UserProfileForm(instance=request.user)
        
    user_bookings = Booking.objects.filter(user=request.user).order_by('-created_at')[:5]
    
    return render(request, 'accounts/profile.html', {
        'form': form,
        'user_bookings': user_bookings
    })
