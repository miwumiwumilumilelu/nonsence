from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Ad, AdReviewLog
from .serializers import (
    AdSerializer, AdCreateSerializer, AdUpdateSerializer,
    AdReviewSerializer, AdPreviewSerializer, AdReviewLogSerializer
)

class IsAdvertiserOrAdmin(permissions.BasePermission):
    """只允许广告主或管理员访问"""
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or obj.advertiser == request.user

class AdViewSet(viewsets.ModelViewSet):
    """广告视图集"""
    def get_permissions(self):
        """根据不同的操作返回不同的权限"""
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsAdvertiserOrAdmin]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'create':
            return AdCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AdUpdateSerializer
        elif self.action == 'review':
            return AdReviewSerializer
        elif self.action == 'preview':
            return AdPreviewSerializer
        elif self.action == 'review_logs':
            return AdReviewLogSerializer
        return AdSerializer

    def get_queryset(self):
        """根据用户权限返回不同的查询集"""
        user = self.request.user
        if user.is_superuser:
            return Ad.objects.all()
        return Ad.objects.filter(advertiser=user)

    def perform_create(self, serializer):
        """创建广告时记录提交审核日志"""
        ad = serializer.save(advertiser=self.request.user)
        AdReviewLog.log_review(
            ad=ad,
            reviewer=self.request.user,
            action='submit'
        )

    @action(detail=True, methods=['post'])
    def submit_review(self, request, pk=None):
        """提交广告审核"""
        ad = self.get_object()
        if ad.status != 'pending':
            return Response(
                {'error': '只有待审核状态的广告可以提交审核'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        AdReviewLog.log_review(
            ad=ad,
            reviewer=request.user,
            action='submit',
            comment=request.data.get('comment')
        )
        
        return Response({'message': '广告已提交审核'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def review(self, request, pk=None):
        """审核广告（仅管理员）"""
        ad = self.get_object()
        if ad.status != 'pending':
            return Response(
                {'error': '只能审核待审核状态的广告'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(ad, data=request.data)
        if serializer.is_valid():
            ad = serializer.save()
            return Response(AdSerializer(ad).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def review_logs(self, request, pk=None):
        """获取广告审核记录"""
        ad = self.get_object()
        logs = ad.review_logs.all()
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """激活广告"""
        ad = self.get_object()
        if not ad.can_be_activated():
            return Response(
                {'error': '广告无法激活。请确保广告已审核通过且在有效期内。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ad.status = 'running'
        ad.save()
        serializer = self.get_serializer(ad)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """暂停广告"""
        ad = self.get_object()
        if not ad.can_be_paused():
            return Response(
                {'error': '只有正在运行的广告可以暂停'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ad.status = 'paused'
        ad.save()
        serializer = self.get_serializer(ad)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def preview(self, request, pk=None):
        """预览广告素材"""
        ad = self.get_object()
        serializer = self.get_serializer(ad)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """获取广告统计数据"""
        ad = self.get_object()
        data = {
            'total_impressions': ad.total_impressions,
            'total_clicks': ad.total_clicks,
            'ctr': round(ad.total_clicks / ad.total_impressions * 100, 2) if ad.total_impressions > 0 else 0,
            'status': ad.status,
            'remaining_budget': float(ad.total_budget),
            'start_date': ad.start_date,
            'end_date': ad.end_date,
        }
        return Response(data)
