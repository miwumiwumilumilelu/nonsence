from rest_framework import serializers
from .models import Ad, AdReviewLog
from django.utils import timezone

class AdSerializer(serializers.ModelSerializer):
    """广告序列化器"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    advertiser_username = serializers.CharField(source='advertiser.username', read_only=True)
    can_activate = serializers.SerializerMethodField()
    can_pause = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = [
            'id', 'title', 'advertiser', 'advertiser_username', 'target_url',
            'creative_image', 'total_budget', 'daily_budget', 'start_date',
            'end_date', 'status', 'status_display', 'reject_reason',
            'total_impressions', 'total_clicks', 'created_at', 'updated_at',
            'can_activate', 'can_pause'
        ]
        read_only_fields = [
            'advertiser', 'status', 'reject_reason', 'total_impressions',
            'total_clicks', 'created_at', 'updated_at'
        ]

    def get_can_activate(self, obj):
        return obj.can_be_activated()

    def get_can_pause(self, obj):
        return obj.can_be_paused()

    def validate(self, data):
        """验证数据"""
        # 验证开始日期和结束日期
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({
                'end_date': '结束日期不能早于开始日期'
            })
        
        if start_date and start_date < timezone.now().date():
            raise serializers.ValidationError({
                'start_date': '开始日期不能早于今天'
            })

        # 验证预算
        total_budget = data.get('total_budget')
        daily_budget = data.get('daily_budget')
        
        if total_budget and daily_budget and total_budget < daily_budget:
            raise serializers.ValidationError({
                'daily_budget': '每日预算不能大于总预算'
            })

        return data

class AdCreateSerializer(AdSerializer):
    """用于创建广告的序列化器"""
    class Meta(AdSerializer.Meta):
        read_only_fields = [
            'advertiser', 'status', 'reject_reason', 'total_impressions',
            'total_clicks', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        # 设置广告主为当前用户
        validated_data['advertiser'] = self.context['request'].user
        return super().create(validated_data)

class AdUpdateSerializer(AdSerializer):
    """用于更新广告的序列化器"""
    class Meta(AdSerializer.Meta):
        read_only_fields = [
            'advertiser', 'status', 'reject_reason', 'total_impressions',
            'total_clicks', 'created_at', 'updated_at', 'creative_image'
        ]

class AdReviewLogSerializer(serializers.ModelSerializer):
    """广告审核记录序列化器"""
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = AdReviewLog
        fields = [
            'id', 'ad', 'reviewer', 'reviewer_name', 'action',
            'action_display', 'comment', 'created_at'
        ]
        read_only_fields = ['reviewer', 'created_at']

class AdReviewSerializer(serializers.ModelSerializer):
    """广告审核序列化器"""
    review_logs = AdReviewLogSerializer(many=True, read_only=True)
    review_comment = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Ad
        fields = ['status', 'reject_reason', 'review_logs', 'review_comment']

    def validate_status(self, value):
        if value not in ['approved', 'rejected']:
            raise serializers.ValidationError('状态必须是"已通过"或"已拒绝"')
        return value

    def validate(self, data):
        if data.get('status') == 'rejected' and not data.get('reject_reason'):
            raise serializers.ValidationError({
                'reject_reason': '拒绝广告时必须提供拒绝原因'
            })
        return data

    def update(self, instance, validated_data):
        review_comment = validated_data.pop('review_comment', None)
        action = 'approve' if validated_data['status'] == 'approved' else 'reject'
        
        # 更新广告状态
        instance = super().update(instance, validated_data)
        
        # 记录审核日志
        AdReviewLog.log_review(
            ad=instance,
            reviewer=self.context['request'].user,
            action=action,
            comment=review_comment or validated_data.get('reject_reason')
        )
        
        return instance

class AdStatusSerializer(serializers.Serializer):
    """广告状态更新序列化器"""
    action = serializers.ChoiceField(choices=['activate', 'pause'])

    def validate_action(self, value):
        """验证操作是否有效"""
        ad = self.context['ad']
        if value == 'activate' and not ad.can_be_activated():
            raise serializers.ValidationError("广告当前状态不能激活")
        if value == 'pause' and not ad.can_be_paused():
            raise serializers.ValidationError("广告当前状态不能暂停")
        return value

class AdPreviewSerializer(serializers.ModelSerializer):
    """广告预览序列化器"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    creative_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = [
            'id', 'title', 'target_url', 'creative_image',
            'creative_image_url', 'status', 'status_display'
        ]

    def get_creative_image_url(self, obj):
        if obj.creative_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.creative_image.url)
        return None 