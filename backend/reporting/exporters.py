import pandas as pd
from io import BytesIO
from django.http import HttpResponse
from .services import get_ad_stats, get_advertiser_stats

def export_ad_stats(ad, start_date=None, end_date=None, format='excel'):
    """
    导出广告统计数据
    """
    stats = get_ad_stats(ad, start_date, end_date)
    
    # 准备数据
    daily_data = pd.DataFrame(stats['daily_stats'])
    channel_data = pd.DataFrame(stats['channel_stats'])
    
    # 创建Excel文件
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        daily_data.to_excel(writer, sheet_name='每日统计', index=False)
        channel_data.to_excel(writer, sheet_name='渠道统计', index=False)
    
    # 设置响应头
    response = HttpResponse(
        output.getvalue(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename=ad_stats_{ad.id}.xlsx'
    return response

def export_advertiser_stats(advertiser, start_date=None, end_date=None, format='excel'):
    """
    导出广告主统计数据
    """
    stats = get_advertiser_stats(advertiser, start_date, end_date)
    
    # 准备数据
    ad_data = pd.DataFrame(stats['ad_stats'])
    type_data = pd.DataFrame(stats['type_stats'])
    channel_data = pd.DataFrame(stats['channel_stats'])
    
    # 创建Excel文件
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        ad_data.to_excel(writer, sheet_name='广告统计', index=False)
        type_data.to_excel(writer, sheet_name='类型统计', index=False)
        channel_data.to_excel(writer, sheet_name='渠道统计', index=False)
    
    # 设置响应头
    response = HttpResponse(
        output.getvalue(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename=advertiser_stats_{advertiser.id}.xlsx'
    return response 