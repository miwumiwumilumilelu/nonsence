from rest_framework import serializers
from .models import Account, Transaction

class AccountSerializer(serializers.ModelSerializer):
    """账户序列化器"""
    class Meta:
        model = Account
        fields = ['balance', 'created_at', 'updated_at']
        read_only_fields = ['balance', 'created_at', 'updated_at']

class TransactionSerializer(serializers.ModelSerializer):
    """交易记录序列化器"""
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'transaction_type', 'status', 
                 'description', 'created_at', 'completed_at']
        read_only_fields = ['id', 'status', 'created_at', 'completed_at']

class RechargeSerializer(serializers.Serializer):
    """充值请求序列化器"""
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0.01
    )
    description = serializers.CharField(max_length=200, required=False)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("充值金额必须大于0")
        return value 