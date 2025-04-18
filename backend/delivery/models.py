from django.db import models
from django.conf import settings
from ads.models import Ad

class AdImpression(models.Model):
    """广告展示记录模型"""
    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='impressions',
        verbose_name='广告'
    )
    placement_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='广告位ID'
    )
    ip_address = models.GenericIPAddressField(
        blank=True,
        null=True,
        verbose_name='IP地址'
    )
    user_agent = models.TextField(
        blank=True,
        null=True,
        verbose_name='用户代理'
    )
    channel = models.CharField(
        max_length=50,
        verbose_name='渠道'
    )
    region = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='地区'
    )
    device_type = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name='设备类型'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        verbose_name = '广告展示'
        verbose_name_plural = '广告展示'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ad', 'created_at']),
            models.Index(fields=['placement_id', 'created_at']),
            models.Index(fields=['channel', 'created_at']),
            models.Index(fields=['region', 'created_at']),
            models.Index(fields=['device_type', 'created_at']),
        ]

    def __str__(self):
        return f"{self.ad.title} - {self.created_at}"
