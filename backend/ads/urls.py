from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .views import AdViewSet

class APIRootView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({
            'message': '欢迎使用广告平台 API',
            'endpoints': {
                'users': '/api/users/',
                'ads': '/api/ads/',
                'accounts': '/api/accounts/',
                'delivery': '/api/delivery/',
                'docs': '/api/docs/'
            }
        })

router = DefaultRouter()
router.register(r'ads', AdViewSet, basename='ad')

urlpatterns = [
    path('', APIRootView.as_view(), name='api-root'),
    path('', include(router.urls)),
] 