from pyecharts import options as opts
from pyecharts.charts import Line, Bar, Pie, Map
from pyecharts.commons.utils import JsCode
from .services import get_ad_stats, get_advertiser_stats

def generate_ad_line_chart(stats):
    """生成广告数据折线图"""
    line = Line()
    line.add_xaxis([str(d['created_at__date']) for d in stats['daily_stats']])
    line.add_yaxis("展示量", [d['impressions'] for d in stats['daily_stats']])
    line.add_yaxis("点击量", [d['clicks'] for d in stats['daily_stats']])
    line.add_yaxis("点击率", [d['ctr'] for d in stats['daily_stats']])
    line.set_global_opts(
        title_opts=opts.TitleOpts(title="广告数据趋势"),
        tooltip_opts=opts.TooltipOpts(trigger="axis"),
        legend_opts=opts.LegendOpts(pos_top="5%"),
        datazoom_opts=[opts.DataZoomOpts()],
    )
    return line.dump_options_with_quotes()

def generate_ad_pie_chart(stats):
    """生成广告渠道饼图"""
    pie = Pie()
    pie.add(
        "",
        [list(z) for z in zip(
            [d['channel'] for d in stats['channel_stats']],
            [d['impressions'] for d in stats['channel_stats']]
        )],
        radius=["40%", "75%"],
    )
    pie.set_global_opts(
        title_opts=opts.TitleOpts(title="渠道分布"),
        legend_opts=opts.LegendOpts(orient="vertical", pos_left="left"),
    )
    pie.set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {c} ({d}%)"))
    return pie.dump_options_with_quotes()

def generate_ad_region_map(stats):
    """生成广告地区热力图"""
    map_chart = Map()
    map_chart.add(
        "",
        [list(z) for z in zip(
            [d['region'] for d in stats['region_stats']],
            [d['impressions'] for d in stats['region_stats']]
        )],
        "china",
        is_map_symbol_show=False,
    )
    map_chart.set_global_opts(
        title_opts=opts.TitleOpts(title="地区分布"),
        visualmap_opts=opts.VisualMapOpts(
            min_=0,
            max_=max([d['impressions'] for d in stats['region_stats']], default=100),
            is_piecewise=True,
        ),
    )
    return map_chart.dump_options_with_quotes()

def generate_ad_device_pie(stats):
    """生成广告设备类型饼图"""
    pie = Pie()
    pie.add(
        "",
        [list(z) for z in zip(
            [d['device_type'] for d in stats['device_stats']],
            [d['impressions'] for d in stats['device_stats']]
        )],
        radius=["40%", "75%"],
    )
    pie.set_global_opts(
        title_opts=opts.TitleOpts(title="设备类型分布"),
        legend_opts=opts.LegendOpts(orient="vertical", pos_left="left"),
    )
    pie.set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {c} ({d}%)"))
    return pie.dump_options_with_quotes()

def generate_advertiser_bar_chart(stats):
    """生成广告主数据柱状图"""
    bar = Bar()
    bar.add_xaxis([d['ad_type'] for d in stats['type_stats']])
    bar.add_yaxis("展示量", [d['impressions'] for d in stats['type_stats']])
    bar.add_yaxis("点击量", [d['clicks'] for d in stats['type_stats']])
    bar.set_global_opts(
        title_opts=opts.TitleOpts(title="广告类型数据"),
        tooltip_opts=opts.TooltipOpts(trigger="axis"),
        legend_opts=opts.LegendOpts(pos_top="5%"),
    )
    return bar.dump_options_with_quotes()

def generate_advertiser_pie_chart(stats):
    """生成广告主渠道饼图"""
    pie = Pie()
    pie.add(
        "",
        [list(z) for z in zip(
            [d['channel'] for d in stats['channel_stats']],
            [d['impressions'] for d in stats['channel_stats']]
        )],
        radius=["40%", "75%"],
    )
    pie.set_global_opts(
        title_opts=opts.TitleOpts(title="渠道分布"),
        legend_opts=opts.LegendOpts(orient="vertical", pos_left="left"),
    )
    pie.set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {c} ({d}%)"))
    return pie.dump_options_with_quotes()

def generate_advertiser_region_map(stats):
    """生成广告主地区热力图"""
    map_chart = Map()
    map_chart.add(
        "",
        [list(z) for z in zip(
            [d['region'] for d in stats['region_stats']],
            [d['impressions'] for d in stats['region_stats']]
        )],
        "china",
        is_map_symbol_show=False,
    )
    map_chart.set_global_opts(
        title_opts=opts.TitleOpts(title="地区分布"),
        visualmap_opts=opts.VisualMapOpts(
            min_=0,
            max_=max([d['impressions'] for d in stats['region_stats']], default=100),
            is_piecewise=True,
        ),
    )
    return map_chart.dump_options_with_quotes()

def generate_advertiser_device_pie(stats):
    """生成广告主设备类型饼图"""
    pie = Pie()
    pie.add(
        "",
        [list(z) for z in zip(
            [d['device_type'] for d in stats['device_stats']],
            [d['impressions'] for d in stats['device_stats']]
        )],
        radius=["40%", "75%"],
    )
    pie.set_global_opts(
        title_opts=opts.TitleOpts(title="设备类型分布"),
        legend_opts=opts.LegendOpts(orient="vertical", pos_left="left"),
    )
    pie.set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {c} ({d}%)"))
    return pie.dump_options_with_quotes() 