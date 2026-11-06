from django.contrib import admin
from .models import Amenity, Hotel, RoomType, Review

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name',)

class RoomTypeInline(admin.TabularInline):
    model = RoomType
    extra = 1

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'stars', 'manager', 'phone', 'created_at')
    list_filter = ('city', 'stars', 'created_at')
    search_fields = ('name', 'city', 'address', 'phone')
    inlines = [RoomTypeInline]

@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    list_display = ('title', 'hotel', 'capacity', 'price_per_night', 'total_rooms')
    list_filter = ('hotel__city', 'hotel', 'capacity')
    search_fields = ('title', 'hotel__name')
    filter_horizontal = ('amenities',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('hotel', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('hotel__name', 'user__username', 'comment')
