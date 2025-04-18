from django.contrib import admin
from .models import Ad

@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    """广告管理界面"""
    list_display = ('title', 'advertiser', 'status', 'total_budget', 
                   'start_date', 'end_date', 'created_at')
    list_filter = ('status', 'created_at', 'start_date', 'end_date')
    search_fields = ('title', 'advertiser__username')
    readonly_fields = ('total_impressions', 'total_clicks', 'created_at', 'updated_at')
    fieldsets = (
        ('基本信息', {
            'fields': ('title', 'advertiser', 'target_url', 'creative_image')
        }),
        ('预算与排期', {
            'fields': ('total_budget', 'daily_budget', 'start_date', 'end_date')
        }),
        ('状态与审核', {
            'fields': ('status', 'reject_reason')
        }),
        ('统计信息', {
            'fields': ('total_impressions', 'total_clicks'),
            'classes': ('collapse',)
        }),
        ('时间信息', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        """根据用户权限返回不同的查询集"""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(advertiser=request.user)

    def has_change_permission(self, request, obj=None):
        """控制修改权限"""
        if obj is None:
            return True
        return request.user.is_superuser or obj.advertiser == request.user

    def has_delete_permission(self, request, obj=None):
        """控制删除权限"""
        if obj is None:
            return True
        return request.user.is_superuser or obj.advertiser == request.user

    def save_model(self, request, obj, form, change):
        """保存模型时的处理"""
        if not change:  # 新建广告
            obj.advertiser = request.user
        super().save_model(request, obj, form, change)
