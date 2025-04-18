from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.utils import timezone
from .utils import validate_image, get_upload_path

class Ad(models.Model):
    """广告模型"""
    STATUS_CHOICES = (
        ('pending', '待审核'),
        ('approved', '已通过'),
        ('rejected', '已拒绝'),
        ('running', '投放中'),
        ('paused', '已暂停'),
        ('finished', '已结束'),
    )

    # 基本信息
    title = models.CharField(max_length=100, verbose_name='广告标题')
    advertiser = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ads',
        verbose_name='广告主'
    )
    target_url = models.URLField(verbose_name='目标链接')
    creative_image = models.ImageField(
        upload_to=get_upload_path,
        validators=[validate_image],
        verbose_name='广告素材'
    )

    # 预算与排期
    total_budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='总预算'
    )
    daily_budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='每日预算'
    )
    start_date = models.DateField(verbose_name='开始日期')
    end_date = models.DateField(verbose_name='结束日期')

    # 状态与审核
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='状态'
    )
    reject_reason = models.TextField(
        blank=True,
        null=True,
        verbose_name='拒绝原因'
    )

    # 统计信息
    total_impressions = models.PositiveIntegerField(
        default=0,
        verbose_name='总展示量'
    )
    total_clicks = models.PositiveIntegerField(
        default=0,
        verbose_name='总点击量'
    )

    # 时间戳
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = '广告'
        verbose_name_plural = '广告'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

    def can_be_activated(self):
        """检查广告是否可以激活"""
        return (
            self.status in ['approved', 'paused'] and 
            self.total_budget > 0 and
            self.start_date <= timezone.now().date() <= self.end_date
        )

    def can_be_paused(self):
        """检查广告是否可以暂停"""
        return self.status == 'running'

    def update_status(self):
        """更新广告状态"""
        today = timezone.now().date()
        
        if self.status == 'running':
            if self.total_budget <= 0:
                self.status = 'finished'
            elif today > self.end_date:
                self.status = 'finished'
            elif today < self.start_date:
                self.status = 'approved'
        
        elif self.status == 'approved' and today >= self.start_date:
            self.status = 'running'
        
        self.save()

class AdReviewLog(models.Model):
    """广告审核记录模型"""
    REVIEW_ACTIONS = (
        ('submit', '提交审核'),
        ('approve', '通过'),
        ('reject', '拒绝'),
    )

    ad = models.ForeignKey(
        Ad,
        on_delete=models.CASCADE,
        related_name='review_logs',
        verbose_name='广告'
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviewed_ads',
        verbose_name='审核人'
    )
    action = models.CharField(
        max_length=20,
        choices=REVIEW_ACTIONS,
        verbose_name='审核动作'
    )
    comment = models.TextField(
        blank=True,
        null=True,
        verbose_name='审核意见'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        verbose_name = '广告审核记录'
        verbose_name_plural = '广告审核记录'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ad', 'created_at']),
            models.Index(fields=['reviewer', 'created_at']),
        ]

    def __str__(self):
        return f"{self.ad.title} - {self.get_action_display()} - {self.created_at}"

    @classmethod
    def log_review(cls, ad, reviewer, action, comment=None):
        """记录审核操作"""
        return cls.objects.create(
            ad=ad,
            reviewer=reviewer,
            action=action,
            comment=comment
        )
