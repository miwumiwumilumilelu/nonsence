from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('advertiser', '广告主'),
        ('admin', '管理员'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='advertiser')
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = '用户'

    def __str__(self):
        return self.username
