from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .services import select_ad, record_impression

# Create your views here.

class AdDeliveryView(APIView):
    """
    广告投放接口
    简化版：直接返回广告信息和素材URL
    """
    authentication_classes = []  # 不需要认证
    permission_classes = []     # 不需要权限

    def get(self, request):
        # 选择广告
        ad = select_ad(request.GET.get('placement_id'))
        if not ad:
            return Response(
                {'message': '没有可投放的广告'},
                status=status.HTTP_404_NOT_FOUND
            )

        # 记录展示
        record_impression(ad, request)

        # 返回广告信息
        return Response({
            'ad_id': ad.id,
            'title': ad.title,
            'target_url': ad.target_url,
            'creative_url': request.build_absolute_uri(ad.creative_image.url),
        })
