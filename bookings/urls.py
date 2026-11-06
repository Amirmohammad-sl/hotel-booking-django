from django.urls import path
from . import views

app_name = 'bookings'

urlpatterns = [
    # Customer booking URLs
    path('rooms/<int:room_id>/book/', views.book_room_view, name='book_room'),
    path('api/apply-coupon/', views.apply_coupon_ajax_view, name='apply_coupon_ajax'),
    path('voucher/<str:tracking_code>/', views.booking_detail_view, name='booking_detail'),
    path('my-bookings/', views.my_bookings_view, name='my_bookings'),
    path('cancel/<int:booking_id>/', views.cancel_booking_view, name='cancel_booking'),

    # Hotel Manager URLs
    path('manager/', views.manager_dashboard_view, name='manager_dashboard'),
    path('manager/hotels/', views.manager_hotels_view, name='manager_hotels'),
    path('manager/hotels/create/', views.manager_hotel_create_view, name='manager_hotel_create'),
    path('manager/hotels/<int:hotel_id>/edit/', views.manager_hotel_edit_view, name='manager_hotel_edit'),
    path('manager/hotels/<int:hotel_id>/rooms/', views.manager_rooms_view, name='manager_rooms'),
    path('manager/hotels/<int:hotel_id>/rooms/create/', views.manager_room_create_view, name='manager_room_create'),
    path('manager/rooms/<int:room_id>/edit/', views.manager_room_edit_view, name='manager_room_edit'),
    path('manager/bookings/', views.manager_bookings_view, name='manager_bookings'),
    path('manager/room-status/', views.manager_room_status_view, name='manager_room_status'),
    path('manager/discounts/', views.manager_discounts_view, name='manager_discounts'),
    path('manager/discounts/create/', views.manager_discount_create_view, name='manager_discount_create'),
    path('manager/discounts/<int:discount_id>/toggle/', views.manager_discount_toggle_view, name='manager_discount_toggle'),
]
