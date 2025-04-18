from rest_framework import serializers
from .models import AdClick, AdDailyStats, AdRegionStats, AdDeviceStats

class DateRangeSerializer(serializers.Serializer):
    """日期范围序列化器"""
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)

    def validate(self, data):
        """验证日期范围"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError("开始日期不能晚于结束日期")

        return data

class AdClickSerializer(serializers.ModelSerializer):
    """广告点击序列化器"""
    class Meta:
        model = AdClick
        fields = [
            'id', 'ad', 'impression', 'ip_address',
            'region', 'device_type', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class DailyStatsSerializer(serializers.Serializer):
    """每日统计数据序列化器"""
    created_at__date = serializers.DateField()
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    ctr = serializers.FloatField()

class ChannelStatsSerializer(serializers.Serializer):
    """渠道统计数据序列化器"""
    channel = serializers.CharField()
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    ctr = serializers.FloatField()

class RegionStatsSerializer(serializers.Serializer):
    """地区统计数据序列化器"""
    region = serializers.CharField()
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    ctr = serializers.FloatField()

class DeviceStatsSerializer(serializers.Serializer):
    """设备类型统计数据序列化器"""
    device_type = serializers.CharField()
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    ctr = serializers.FloatField()

class TypeStatsSerializer(serializers.Serializer):
    """广告类型统计数据序列化器"""
    ad_type = serializers.CharField()
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    ctr = serializers.FloatField()

class AdStatsSerializer(serializers.Serializer):
    """广告统计数据序列化器"""
    id = serializers.IntegerField()
    title = serializers.CharField()
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    ctr = serializers.FloatField()

class AdStatsResponseSerializer(serializers.Serializer):
    """广告统计响应序列化器"""
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    ctr = serializers.FloatField()
    period = serializers.DictField()
    daily_stats = DailyStatsSerializer(many=True)
    channel_stats = ChannelStatsSerializer(many=True)
    region_stats = RegionStatsSerializer(many=True)
    device_stats = DeviceStatsSerializer(many=True)

class AdvertiserStatsResponseSerializer(serializers.Serializer):
    """广告主统计响应序列化器"""
    total_ads = serializers.IntegerField()
    impressions = serializers.IntegerField()
    clicks = serializers.IntegerField()
    ctr = serializers.FloatField()
    period = serializers.DictField()
    ad_stats = AdStatsSerializer(many=True)
    type_stats = TypeStatsSerializer(many=True)
    channel_stats = ChannelStatsSerializer(many=True)
    region_stats = RegionStatsSerializer(many=True)
    device_stats = DeviceStatsSerializer(many=True)

class AdDailyStatsSerializer(serializers.ModelSerializer):
    """广告每日统计数据序列化器"""
    ctr = serializers.FloatField(read_only=True)
    
    class Meta:
        model = AdDailyStats
        fields = [
            'date', 'impressions', 'clicks', 'spend', 'ctr'
        ]
        read_only_fields = ['impressions', 'clicks', 'spend']

class AdRegionStatsSerializer(serializers.ModelSerializer):
    """广告地域统计数据序列化器"""
    ctr = serializers.FloatField(read_only=True)
    
    class Meta:
        model = AdRegionStats
        fields = [
            'region', 'date', 'impressions', 'clicks', 'ctr'
        ]
        read_only_fields = ['impressions', 'clicks']

class AdDeviceStatsSerializer(serializers.ModelSerializer):
    """广告设备统计数据序列化器"""
    ctr = serializers.FloatField(read_only=True)
    device_type_display = serializers.CharField(source='get_device_type_display', read_only=True)
    
    class Meta:
        model = AdDeviceStats
        fields = [
            'device_type', 'device_type_display', 'date',
            'impressions', 'clicks', 'ctr'
        ]
        read_only_fields = ['impressions', 'clicks']

class AdStatsOverviewSerializer(serializers.Serializer):
    """广告统计概览序列化器"""
    total_impressions = serializers.IntegerField()
    total_clicks = serializers.IntegerField()
    total_spend = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_ctr = serializers.FloatField()
    daily_stats = AdDailyStatsSerializer(many=True)
    region_stats = AdRegionStatsSerializer(many=True)
    device_stats = AdDeviceStatsSerializer(many=True)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # 计算平均点击率
        if data['total_impressions'] > 0:
            data['average_ctr'] = round(
                data['total_clicks'] / data['total_impressions'] * 100,
                2
            )
        else:
            data['average_ctr'] = 0
        return data 