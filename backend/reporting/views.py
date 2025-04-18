from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import AdClick, AdDailyStats, AdRegionStats, AdDeviceStats
from .serializers import DateRangeSerializer, AdClickSerializer, AdDailyStatsSerializer, AdRegionStatsSerializer, AdDeviceStatsSerializer, AdStatsOverviewSerializer
from .services import get_ad_stats, get_advertiser_stats
from .exporters import export_ad_stats, export_advertiser_stats
from .charts import (
    generate_ad_line_chart,
    generate_ad_pie_chart,
    generate_ad_region_map,
    generate_ad_device_pie,
    generate_advertiser_bar_chart,
    generate_advertiser_pie_chart,
    generate_advertiser_region_map,
    generate_advertiser_device_pie
)
from ads.models import Ad
from django.db.models import Sum, F, Q
from datetime import timedelta

class AdClickViewSet(viewsets.ModelViewSet):
    """广告点击视图集"""
    serializer_class = AdClickSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """根据用户权限返回不同的查询集"""
        if self.request.user.is_superuser:
            return AdClick.objects.all()
        return AdClick.objects.filter(ad__advertiser=self.request.user)

class StatsViewSet(viewsets.ViewSet):
    """统计数据视图集"""
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def ad_stats(self, request, pk=None):
        """获取单个广告的统计数据"""
        try:
            ad = Ad.objects.get(pk=pk)
            if not request.user.is_superuser and ad.advertiser != request.user:
                return Response(
                    {'message': '无权查看此广告的统计数据'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = DateRangeSerializer(data=request.query_params)
            if serializer.is_valid():
                stats = get_ad_stats(
                    ad,
                    serializer.validated_data.get('start_date'),
                    serializer.validated_data.get('end_date')
                )
                return Response(stats)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Ad.DoesNotExist:
            return Response(
                {'message': '广告不存在'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def export_ad_stats(self, request, pk=None):
        """导出广告统计数据"""
        try:
            ad = Ad.objects.get(pk=pk)
            if not request.user.is_superuser and ad.advertiser != request.user:
                return Response(
                    {'message': '无权导出此广告的统计数据'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = DateRangeSerializer(data=request.query_params)
            if serializer.is_valid():
                return export_ad_stats(
                    ad,
                    serializer.validated_data.get('start_date'),
                    serializer.validated_data.get('end_date')
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Ad.DoesNotExist:
            return Response(
                {'message': '广告不存在'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def ad_charts(self, request, pk=None):
        """获取广告数据图表"""
        try:
            ad = Ad.objects.get(pk=pk)
            if not request.user.is_superuser and ad.advertiser != request.user:
                return Response(
                    {'message': '无权查看此广告的统计数据'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = DateRangeSerializer(data=request.query_params)
            if serializer.is_valid():
                stats = get_ad_stats(
                    ad,
                    serializer.validated_data.get('start_date'),
                    serializer.validated_data.get('end_date')
                )
                return Response({
                    'line_chart': generate_ad_line_chart(stats),
                    'channel_pie': generate_ad_pie_chart(stats),
                    'region_map': generate_ad_region_map(stats),
                    'device_pie': generate_ad_device_pie(stats)
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Ad.DoesNotExist:
            return Response(
                {'message': '广告不存在'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def advertiser_stats(self, request):
        """获取广告主的统计数据"""
        serializer = DateRangeSerializer(data=request.query_params)
        if serializer.is_valid():
            stats = get_advertiser_stats(
                request.user,
                serializer.validated_data.get('start_date'),
                serializer.validated_data.get('end_date')
            )
            return Response(stats)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def export_advertiser_stats(self, request):
        """导出广告主统计数据"""
        serializer = DateRangeSerializer(data=request.query_params)
        if serializer.is_valid():
            return export_advertiser_stats(
                request.user,
                serializer.validated_data.get('start_date'),
                serializer.validated_data.get('end_date')
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def advertiser_charts(self, request):
        """获取广告主数据图表"""
        serializer = DateRangeSerializer(data=request.query_params)
        if serializer.is_valid():
            stats = get_advertiser_stats(
                request.user,
                serializer.validated_data.get('start_date'),
                serializer.validated_data.get('end_date')
            )
            return Response({
                'type_bar': generate_advertiser_bar_chart(stats),
                'channel_pie': generate_advertiser_pie_chart(stats),
                'region_map': generate_advertiser_region_map(stats),
                'device_pie': generate_advertiser_device_pie(stats)
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdStatsViewSet(viewsets.ReadOnlyModelViewSet):
    """广告统计数据视图集"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdDailyStatsSerializer

    def get_queryset(self):
        """获取查询集"""
        # 默认获取最近30天的数据
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=29)
        
        return AdDailyStats.objects.filter(
            ad__advertiser=self.request.user,
            date__range=[start_date, end_date]
        ).order_by('date')

    @action(detail=False, methods=['get'])
    def overview(self, request):
        """获取广告统计概览"""
        # 获取时间范围
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days-1)
        
        # 获取统计数据
        daily_stats = AdDailyStats.objects.filter(
            ad__advertiser=request.user,
            date__range=[start_date, end_date]
        ).order_by('date')
        
        region_stats = AdRegionStats.objects.filter(
            ad__advertiser=request.user,
            date__range=[start_date, end_date]
        ).order_by('region', 'date')
        
        device_stats = AdDeviceStats.objects.filter(
            ad__advertiser=request.user,
            date__range=[start_date, end_date]
        ).order_by('device_type', 'date')
        
        # 计算总计
        totals = daily_stats.aggregate(
            total_impressions=Sum('impressions'),
            total_clicks=Sum('clicks'),
            total_spend=Sum('spend')
        )
        
        # 如果没有数据，设置默认值
        if not totals['total_impressions']:
            totals = {
                'total_impressions': 0,
                'total_clicks': 0,
                'total_spend': 0
            }
        
        # 构造返回数据
        data = {
            **totals,
            'daily_stats': daily_stats,
            'region_stats': region_stats,
            'device_stats': device_stats
        }
        
        serializer = AdStatsOverviewSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_ad(self, request):
        """获取指定广告的统计数据"""
        ad_id = request.query_params.get('ad_id')
        if not ad_id:
            return Response(
                {'error': '必须提供广告ID'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ad = Ad.objects.get(id=ad_id, advertiser=request.user)
        except Ad.DoesNotExist:
            return Response(
                {'error': '广告不存在或无权访问'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # 获取时间范围
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days-1)
        
        # 获取统计数据
        daily_stats = AdDailyStats.objects.filter(
            ad=ad,
            date__range=[start_date, end_date]
        ).order_by('date')
        
        region_stats = AdRegionStats.objects.filter(
            ad=ad,
            date__range=[start_date, end_date]
        ).order_by('region', 'date')
        
        device_stats = AdDeviceStats.objects.filter(
            ad=ad,
            date__range=[start_date, end_date]
        ).order_by('device_type', 'date')
        
        # 计算总计
        totals = daily_stats.aggregate(
            total_impressions=Sum('impressions'),
            total_clicks=Sum('clicks'),
            total_spend=Sum('spend')
        )
        
        # 如果没有数据，设置默认值
        if not totals['total_impressions']:
            totals = {
                'total_impressions': 0,
                'total_clicks': 0,
                'total_spend': 0
            }
        
        # 构造返回数据
        data = {
            **totals,
            'daily_stats': daily_stats,
            'region_stats': region_stats,
            'device_stats': device_stats
        }
        
        serializer = AdStatsOverviewSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_region(self, request):
        """获取地域维度的统计数据"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days-1)
        
        stats = AdRegionStats.objects.filter(
            ad__advertiser=request.user,
            date__range=[start_date, end_date]
        ).values('region').annotate(
            impressions=Sum('impressions'),
            clicks=Sum('clicks'),
            ctr=Sum('clicks') * 100.0 / Sum('impressions')
        ).order_by('-impressions')
        
        return Response(stats)

    @action(detail=False, methods=['get'])
    def by_device(self, request):
        """获取设备维度的统计数据"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days-1)
        
        stats = AdDeviceStats.objects.filter(
            ad__advertiser=request.user,
            date__range=[start_date, end_date]
        ).values('device_type').annotate(
            impressions=Sum('impressions'),
            clicks=Sum('clicks'),
            ctr=Sum('clicks') * 100.0 / Sum('impressions')
        ).order_by('-impressions')
        
        return Response(stats)
