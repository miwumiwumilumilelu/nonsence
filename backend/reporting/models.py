from django.db import models
from django.conf import settings
from ads.models import Ad
from delivery.models import AdImpression
from django.utils import timezone

class AdClick(models.Model):
    """广告点击记录模型"""
    impression = models.ForeignKey(
        AdImpression,
        on_delete=models.CASCADE,
        related_name='clicks',
        verbose_name='展示记录'
    )
    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='clicks',
        verbose_name='广告'
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
        verbose_name = '广告点击'
        verbose_name_plural = '广告点击'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ad', 'created_at']),
            models.Index(fields=['impression', 'created_at']),
            models.Index(fields=['region']),
            models.Index(fields=['device_type']),
        ]

    def __str__(self):
        return f"{self.ad.title} - {self.created_at}"

    def save(self, *args, **kwargs):
        """保存时更新广告点击计数"""
        super().save(*args, **kwargs)
        # 更新广告点击计数
        self.ad.total_clicks = models.F('total_clicks') + 1
        self.ad.save(update_fields=['total_clicks'])
        # 更新每日统计
        AdDailyStats.record_click(self.ad)
        # 更新地域统计
        AdRegionStats.record_click(self.ad, self.region)
        # 更新设备统计
        AdDeviceStats.record_click(self.ad, self.device_type)

class AdDailyStats(models.Model):
    """广告每日统计数据"""
    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='daily_stats',
        verbose_name='广告'
    )
    date = models.DateField(verbose_name='统计日期')
    impressions = models.PositiveIntegerField(
        default=0,
        verbose_name='展示量'
    )
    clicks = models.PositiveIntegerField(
        default=0,
        verbose_name='点击量'
    )
    spend = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='消耗金额'
    )

    class Meta:
        verbose_name = '广告每日统计'
        verbose_name_plural = '广告每日统计'
        ordering = ['-date']
        unique_together = ['ad', 'date']
        indexes = [
            models.Index(fields=['ad', 'date']),
        ]

    def __str__(self):
        return f"{self.ad.title} - {self.date}"

    @property
    def ctr(self):
        """点击率"""
        return round(self.clicks / self.impressions * 100, 2) if self.impressions > 0 else 0

    @classmethod
    def record_impression(cls, ad, date=None):
        """记录一次展示"""
        if date is None:
            date = timezone.now().date()
        stats, _ = cls.objects.get_or_create(ad=ad, date=date)
        stats.impressions = models.F('impressions') + 1
        stats.save(update_fields=['impressions'])

    @classmethod
    def record_click(cls, ad, date=None):
        """记录一次点击"""
        if date is None:
            date = timezone.now().date()
        stats, _ = cls.objects.get_or_create(ad=ad, date=date)
        stats.clicks = models.F('clicks') + 1
        stats.save(update_fields=['clicks'])

class AdRegionStats(models.Model):
    """广告地域统计数据"""
    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='region_stats',
        verbose_name='广告'
    )
    region = models.CharField(
        max_length=100,
        verbose_name='地区'
    )
    date = models.DateField(verbose_name='统计日期')
    impressions = models.PositiveIntegerField(
        default=0,
        verbose_name='展示量'
    )
    clicks = models.PositiveIntegerField(
        default=0,
        verbose_name='点击量'
    )

    class Meta:
        verbose_name = '广告地域统计'
        verbose_name_plural = '广告地域统计'
        ordering = ['-date']
        unique_together = ['ad', 'region', 'date']
        indexes = [
            models.Index(fields=['ad', 'region', 'date']),
        ]

    def __str__(self):
        return f"{self.ad.title} - {self.region} - {self.date}"

    @property
    def ctr(self):
        """点击率"""
        return round(self.clicks / self.impressions * 100, 2) if self.impressions > 0 else 0

    @classmethod
    def record_impression(cls, ad, region, date=None):
        """记录一次展示"""
        if date is None:
            date = timezone.now().date()
        stats, _ = cls.objects.get_or_create(
            ad=ad,
            region=region or '未知',
            date=date
        )
        stats.impressions = models.F('impressions') + 1
        stats.save(update_fields=['impressions'])

    @classmethod
    def record_click(cls, ad, region, date=None):
        """记录一次点击"""
        if date is None:
            date = timezone.now().date()
        stats, _ = cls.objects.get_or_create(
            ad=ad,
            region=region or '未知',
            date=date
        )
        stats.clicks = models.F('clicks') + 1
        stats.save(update_fields=['clicks'])

class AdDeviceStats(models.Model):
    """广告设备统计数据"""
    DEVICE_CHOICES = (
        ('desktop', '桌面端'),
        ('mobile', '移动端'),
        ('tablet', '平板'),
        ('other', '其他'),
    )

    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='device_stats',
        verbose_name='广告'
    )
    device_type = models.CharField(
        max_length=50,
        choices=DEVICE_CHOICES,
        verbose_name='设备类型'
    )
    date = models.DateField(verbose_name='统计日期')
    impressions = models.PositiveIntegerField(
        default=0,
        verbose_name='展示量'
    )
    clicks = models.PositiveIntegerField(
        default=0,
        verbose_name='点击量'
    )

    class Meta:
        verbose_name = '广告设备统计'
        verbose_name_plural = '广告设备统计'
        ordering = ['-date']
        unique_together = ['ad', 'device_type', 'date']
        indexes = [
            models.Index(fields=['ad', 'device_type', 'date']),
        ]

    def __str__(self):
        return f"{self.ad.title} - {self.get_device_type_display()} - {self.date}"

    @property
    def ctr(self):
        """点击率"""
        return round(self.clicks / self.impressions * 100, 2) if self.impressions > 0 else 0

    @classmethod
    def record_impression(cls, ad, device_type, date=None):
        """记录一次展示"""
        if date is None:
            date = timezone.now().date()
        stats, _ = cls.objects.get_or_create(
            ad=ad,
            device_type=device_type or 'other',
            date=date
        )
        stats.impressions = models.F('impressions') + 1
        stats.save(update_fields=['impressions'])

    @classmethod
    def record_click(cls, ad, device_type, date=None):
        """记录一次点击"""
        if date is None:
            date = timezone.now().date()
        stats, _ = cls.objects.get_or_create(
            ad=ad,
            device_type=device_type or 'other',
            date=date
        )
        stats.clicks = models.F('clicks') + 1
        stats.save(update_fields=['clicks'])
