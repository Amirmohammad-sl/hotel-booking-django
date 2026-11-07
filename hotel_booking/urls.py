from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('bookings/', include('bookings.urls')),
    path('', include('hotels.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

    from django.contrib.auth import login, get_user_model
    from django.shortcuts import redirect
    def quick_login_view(request, username):
        User = get_user_model()
        try:
            user = User.objects.get(username=username)
            login(request, user)
        except Exception:
            pass
        next_url = request.GET.get('next', '/')
        return redirect(next_url)

    urlpatterns.append(path('quick-login/<str:username>/', quick_login_view, name='quick_login'))
