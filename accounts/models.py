from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'مشتری / مسافر'),
        ('manager', 'مدیر هتل'),
    )
    
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='customer',
        verbose_name="نقش کاربری"
    )
    phone = models.CharField(
        max_length=20, 
        blank=True, 
        null=True, 
        verbose_name="شماره همراه"
    )
    favorite_city = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        verbose_name="شهر مورد علاقه (جهت پیشنهاد هوشمند)"
    )
    preferred_min_price = models.DecimalField(
        max_digits=12, 
        decimal_places=0, 
        null=True, 
        blank=True, 
        verbose_name="حداقل بودجه پیشنهادی (تومان)"
    )
    preferred_max_price = models.DecimalField(
        max_digits=12, 
        decimal_places=0, 
        null=True, 
        blank=True, 
        verbose_name="حداکثر بودجه پیشنهادی (تومان)"
    )

    @property
    def is_hotel_manager(self):
        return self.role == 'manager' or self.is_superuser

    @property
    def display_name(self):
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name}".strip()
        return self.username

    def __str__(self):
        return f"{self.display_name} ({self.get_role_display()})"
