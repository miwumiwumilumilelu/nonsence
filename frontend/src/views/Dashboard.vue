<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>总广告数</span>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ stats.totalAds }}</div>
            <div class="trend">
              <span>较上月</span>
              <el-tag :type="stats.adsGrowth >= 0 ? 'success' : 'danger'">
                {{ stats.adsGrowth >= 0 ? '+' : '' }}{{ stats.adsGrowth }}%
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>总展示量</span>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ stats.totalImpressions }}</div>
            <div class="trend">
              <span>较上月</span>
              <el-tag :type="stats.impressionsGrowth >= 0 ? 'success' : 'danger'">
                {{ stats.impressionsGrowth >= 0 ? '+' : '' }}{{ stats.impressionsGrowth }}%
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>总点击量</span>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ stats.totalClicks }}</div>
            <div class="trend">
              <span>较上月</span>
              <el-tag :type="stats.clicksGrowth >= 0 ? 'success' : 'danger'">
                {{ stats.clicksGrowth >= 0 ? '+' : '' }}{{ stats.clicksGrowth }}%
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>平均点击率</span>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ stats.avgCtr }}%</div>
            <div class="trend">
              <span>较上月</span>
              <el-tag :type="stats.ctrGrowth >= 0 ? 'success' : 'danger'">
                {{ stats.ctrGrowth >= 0 ? '+' : '' }}{{ stats.ctrGrowth }}%
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>广告数据趋势</span>
            </div>
          </template>
          <div ref="trendChart" class="chart"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>渠道分布</span>
            </div>
          </template>
          <div ref="channelChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>地区分布</span>
            </div>
          </template>
          <div ref="regionChart" class="chart"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>设备分布</span>
            </div>
          </template>
          <div ref="deviceChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

const stats = ref({
  totalAds: 0,
  adsGrowth: 0,
  totalImpressions: 0,
  impressionsGrowth: 0,
  totalClicks: 0,
  clicksGrowth: 0,
  avgCtr: 0,
  ctrGrowth: 0
})

const trendChart = ref(null)
const channelChart = ref(null)
const regionChart = ref(null)
const deviceChart = ref(null)

const initCharts = async () => {
  try {
    const response = await axios.get('/api/reporting/stats/advertiser/charts/')
    const { line_chart, channel_pie, region_map, device_pie } = response.data
    
    // 初始化趋势图
    const trendInstance = echarts.init(trendChart.value)
    trendInstance.setOption(JSON.parse(line_chart))
    
    // 初始化渠道饼图
    const channelInstance = echarts.init(channelChart.value)
    channelInstance.setOption(JSON.parse(channel_pie))
    
    // 初始化地区地图
    const regionInstance = echarts.init(regionChart.value)
    regionInstance.setOption(JSON.parse(region_map))
    
    // 初始化设备饼图
    const deviceInstance = echarts.init(deviceChart.value)
    deviceInstance.setOption(JSON.parse(device_pie))
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      trendInstance.resize()
      channelInstance.resize()
      regionInstance.resize()
      deviceInstance.resize()
    })
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

const loadStats = async () => {
  try {
    const response = await axios.get('/api/reporting/stats/advertiser/')
    stats.value = response.data
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadStats()
  initCharts()
})
</script>

<style lang="scss" scoped>
.dashboard {
  .data-card {
    .card-content {
      .number {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
      }
      
      .trend {
        margin-top: 8px;
        font-size: 14px;
        color: #909399;
        
        span {
          margin-right: 8px;
        }
      }
    }
  }
  
  .chart-row {
    margin-top: 20px;
    
    .chart {
      height: 300px;
    }
  }
}
</style> 