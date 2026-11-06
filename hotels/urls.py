from django.urls import path
from . import views

app_name = 'hotels'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('hotels/', views.hotel_list_view, name='hotel_list'),
    path('hotels/<int:hotel_id>/', views.hotel_detail_view, name='hotel_detail'),
    path('hotels/<int:hotel_id>/add-review/', views.add_review_view, name='add_review'),
    path('rooms/<int:room_id>/', views.room_detail_view, name='room_detail'),
    path('api/rooms/<int:room_id>/calendar/', views.room_calendar_api, name='room_calendar_api'),
]
