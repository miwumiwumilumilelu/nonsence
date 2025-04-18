from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Account, Transaction
from .serializers import (
    AccountSerializer,
    TransactionSerializer,
    RechargeSerializer
)

# Create your views here.

class AccountView(APIView):
    """账户信息视图"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        account, _ = Account.objects.get_or_create(user=request.user)
        serializer = AccountSerializer(account)
        return Response(serializer.data)

class TransactionListView(APIView):
    """交易记录列表视图"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        account, _ = Account.objects.get_or_create(user=request.user)
        transactions = account.transactions.all()
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class RechargeView(APIView):
    """充值视图"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RechargeSerializer(data=request.data)
        if serializer.is_valid():
            account, _ = Account.objects.get_or_create(user=request.user)
            amount = serializer.validated_data['amount']
            description = serializer.validated_data.get('description', '')

            # 创建充值交易记录
            transaction = Transaction.objects.create(
                account=account,
                amount=amount,
                transaction_type='recharge',
                status='completed',  # MVP阶段直接标记为完成
                description=description,
                completed_at=timezone.now()
            )

            # 更新账户余额
            account.balance += amount
            account.save()

            return Response({
                'message': '充值成功',
                'transaction': TransactionSerializer(transaction).data,
                'new_balance': account.balance
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
