from django.db.models import Count, Sum, F, ExpressionWrapper, FloatField, Q
from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache
from django.conf import settings
from ads.models import Ad
from delivery.models import AdImpression
from .models import AdClick

def get_cache_key(prefix, **kwargs):
    """生成缓存键"""
    key_parts = [prefix]
    for k, v in sorted(kwargs.items()):
        key_parts.append(f"{k}:{v}")
    return ":".join(key_parts)

def get_ad_stats(ad, start_date=None, end_date=None):
    """
    获取广告统计数据
    """
    if not start_date:
        start_date = timezone.now().date() - timedelta(days=30)
    if not end_date:
        end_date = timezone.now().date()

    # 生成缓存键
    cache_key = get_cache_key(
        'ad_stats',
        ad_id=ad.id,
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat()
    )

    # 尝试从缓存获取数据
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    # 获取展示数据
    impressions = AdImpression.objects.filter(
        ad=ad,
        created_at__date__range=[start_date, end_date]
    )

    # 获取点击数据
    clicks = AdClick.objects.filter(
        ad=ad,
        created_at__date__range=[start_date, end_date]
    )

    # 计算点击率
    impression_count = impressions.count()
    click_count = clicks.count()
    ctr = (click_count / impression_count * 100) if impression_count > 0 else 0

    # 按日期统计
    daily_stats = AdImpression.objects.filter(
        ad=ad,
        created_at__date__range=[start_date, end_date]
    ).values('created_at__date').annotate(
        impressions=Count('id'),
        clicks=Count('clicks'),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).order_by('created_at__date')

    # 按渠道统计
    channel_stats = AdImpression.objects.filter(
        ad=ad,
        created_at__date__range=[start_date, end_date]
    ).values('channel').annotate(
        impressions=Count('id'),
        clicks=Count('clicks'),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).order_by('-impressions')

    # 按地区统计
    region_stats = AdImpression.objects.filter(
        ad=ad,
        created_at__date__range=[start_date, end_date]
    ).values('region').annotate(
        impressions=Count('id'),
        clicks=Count('clicks'),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).order_by('-impressions')

    # 按设备类型统计
    device_stats = AdImpression.objects.filter(
        ad=ad,
        created_at__date__range=[start_date, end_date]
    ).values('device_type').annotate(
        impressions=Count('id'),
        clicks=Count('clicks'),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).order_by('-impressions')

    result = {
        'impressions': impression_count,
        'clicks': click_count,
        'ctr': round(ctr, 2),
        'period': {
            'start': start_date,
            'end': end_date
        },
        'daily_stats': list(daily_stats),
        'channel_stats': list(channel_stats),
        'region_stats': list(region_stats),
        'device_stats': list(device_stats)
    }

    # 缓存结果
    cache.set(cache_key, result, settings.CACHE_TTL)
    return result

def get_advertiser_stats(advertiser, start_date=None, end_date=None):
    """
    获取广告主统计数据
    """
    if not start_date:
        start_date = timezone.now().date() - timedelta(days=30)
    if not end_date:
        end_date = timezone.now().date()

    # 生成缓存键
    cache_key = get_cache_key(
        'advertiser_stats',
        advertiser_id=advertiser.id,
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat()
    )

    # 尝试从缓存获取数据
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    # 获取广告主的广告
    ads = Ad.objects.filter(advertiser=advertiser)

    # 获取展示数据
    impressions = AdImpression.objects.filter(
        ad__in=ads,
        created_at__date__range=[start_date, end_date]
    )

    # 获取点击数据
    clicks = AdClick.objects.filter(
        ad__in=ads,
        created_at__date__range=[start_date, end_date]
    )

    # 计算点击率
    impression_count = impressions.count()
    click_count = clicks.count()
    ctr = (click_count / impression_count * 100) if impression_count > 0 else 0

    # 按广告统计
    ad_stats = Ad.objects.filter(
        advertiser=advertiser
    ).annotate(
        impressions=Count('impressions', filter=Q(
            impressions__created_at__date__range=[start_date, end_date]
        )),
        clicks=Count('clicks', filter=Q(
            clicks__created_at__date__range=[start_date, end_date]
        )),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).values('id', 'title', 'impressions', 'clicks', 'ctr')

    # 按广告类型统计
    type_stats = Ad.objects.filter(
        advertiser=advertiser
    ).values('ad_type').annotate(
        impressions=Count('impressions', filter=Q(
            impressions__created_at__date__range=[start_date, end_date]
        )),
        clicks=Count('clicks', filter=Q(
            clicks__created_at__date__range=[start_date, end_date]
        )),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).order_by('-impressions')

    # 按渠道统计
    channel_stats = AdImpression.objects.filter(
        ad__in=ads,
        created_at__date__range=[start_date, end_date]
    ).values('channel').annotate(
        impressions=Count('id'),
        clicks=Count('clicks'),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).order_by('-impressions')

    # 按地区统计
    region_stats = AdImpression.objects.filter(
        ad__in=ads,
        created_at__date__range=[start_date, end_date]
    ).values('region').annotate(
        impressions=Count('id'),
        clicks=Count('clicks'),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).order_by('-impressions')

    # 按设备类型统计
    device_stats = AdImpression.objects.filter(
        ad__in=ads,
        created_at__date__range=[start_date, end_date]
    ).values('device_type').annotate(
        impressions=Count('id'),
        clicks=Count('clicks'),
        ctr=ExpressionWrapper(
            F('clicks') * 100.0 / F('impressions'),
            output_field=FloatField()
        )
    ).order_by('-impressions')

    result = {
        'total_ads': ads.count(),
        'impressions': impression_count,
        'clicks': click_count,
        'ctr': round(ctr, 2),
        'period': {
            'start': start_date,
            'end': end_date
        },
        'ad_stats': list(ad_stats),
        'type_stats': list(type_stats),
        'channel_stats': list(channel_stats),
        'region_stats': list(region_stats),
        'device_stats': list(device_stats)
    }

    # 缓存结果
    cache.set(cache_key, result, settings.CACHE_TTL)
    return result 