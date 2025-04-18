from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from ads.models import Ad
from reporting.models import AdDailyStats, AdRegionStats, AdDeviceStats
from datetime import timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = '创建测试数据'

    def handle(self, *args, **kwargs):
        # 确保有一个测试用户
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'test@example.com',
                'is_staff': True
            }
        )
        if created:
            user.set_password('testpass123')
            user.save()
            self.stdout.write(self.style.SUCCESS('创建测试用户成功'))

        # 创建测试广告
        ad, created = Ad.objects.get_or_create(
            title='测试广告',
            defaults={
                'advertiser': user,
                'target_url': 'http://example.com',
                'total_budget': 1000.00,
                'daily_budget': 100.00,
                'start_date': timezone.now().date(),
                'end_date': timezone.now().date() + timedelta(days=30),
                'status': 'approved'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('创建测试广告成功'))

        # 生成过去30天的统计数据
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=29)
        current_date = start_date

        regions = ['北京', '上海', '广州', '深圳', '杭州']
        devices = ['desktop', 'mobile', 'tablet']

        while current_date <= end_date:
            # 每日统计
            daily_stats, created = AdDailyStats.objects.get_or_create(
                ad=ad,
                date=current_date,
                defaults={
                    'impressions': random.randint(1000, 5000),
                    'clicks': random.randint(50, 200),
                    'spend': random.uniform(50.0, 200.0)
                }
            )

            # 地域统计
            for region in regions:
                AdRegionStats.objects.get_or_create(
                    ad=ad,
                    region=region,
                    date=current_date,
                    defaults={
                        'impressions': random.randint(100, 1000),
                        'clicks': random.randint(5, 50)
                    }
                )

            # 设备统计
            for device in devices:
                AdDeviceStats.objects.get_or_create(
                    ad=ad,
                    device_type=device,
                    date=current_date,
                    defaults={
                        'impressions': random.randint(100, 1000),
                        'clicks': random.randint(5, 50)
                    }
                )

            current_date += timedelta(days=1)

        self.stdout.write(self.style.SUCCESS('生成测试数据成功')) 