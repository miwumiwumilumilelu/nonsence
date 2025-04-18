from django.urls import path
from .views import AdDeliveryView

urlpatterns = [
    path('deliver/', AdDeliveryView.as_view(), name='ad-delivery'),
] 