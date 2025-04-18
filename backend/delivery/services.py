from django.utils import timezone
from django.db.models import F
from ads.models import Ad
from .models import AdImpression

def select_ad(placement_id=None):
    """
    选择要投放的广告
    简化版：随机选择一个状态为running且预算充足的广告
    """
    # 获取当前可投放的广告
    ads = Ad.objects.filter(
        status='running',
        total_budget__gt=0,
        start_date__lte=timezone.now().date(),
        end_date__gte=timezone.now().date()
    )

    if not ads.exists():
        return None

    # 随机选择一个广告
    ad = ads.order_by('?').first()
    return ad

def record_impression(ad, request):
    """
    记录广告展示
    """
    # 创建展示记录
    impression = AdImpression.objects.create(
        ad=ad,
        placement_id=request.GET.get('placement_id'),
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT')
    )

    # 更新广告展示计数
    ad.total_impressions = F('total_impressions') + 1
    ad.save(update_fields=['total_impressions'])

    return impression 