from django.urls import path
from .views import AccountView, TransactionListView, RechargeView

urlpatterns = [
    path('account/', AccountView.as_view(), name='account-detail'),
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('recharge/', RechargeView.as_view(), name='recharge'),
] 