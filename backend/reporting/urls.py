from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'stats', views.AdStatsViewSet, basename='ad-stats')
router.register(r'clicks', views.AdClickViewSet, basename='ad-clicks')

urlpatterns = [
    path('', include(router.urls)),
] 