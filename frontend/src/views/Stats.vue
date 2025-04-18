<template>
  <div class="stats">
    <div class="header">
      <h2>数据统计</h2>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="dateShortcuts"
        @change="handleDateChange"
      />
    </div>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>总展示量</span>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ stats.impressions }}</div>
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
            <div class="number">{{ stats.clicks }}</div>
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
            <div class="number">{{ stats.ctr }}%</div>
            <div class="trend">
              <span>较上月</span>
              <el-tag :type="stats.ctrGrowth >= 0 ? 'success' : 'danger'">
                {{ stats.ctrGrowth >= 0 ? '+' : '' }}{{ stats.ctrGrowth }}%
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="data-card">
          <template #header>
            <div class="card-header">
              <span>总消耗</span>
            </div>
          </template>
          <div class="card-content">
            <div class="number">¥{{ stats.spent }}</div>
            <div class="trend">
              <span>较上月</span>
              <el-tag :type="stats.spentGrowth >= 0 ? 'success' : 'danger'">
                {{ stats.spentGrowth >= 0 ? '+' : '' }}{{ stats.spentGrowth }}%
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
              <span>广告类型分布</span>
            </div>
          </template>
          <div ref="typeChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
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
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
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
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>广告排名</span>
            </div>
          </template>
          <el-table :data="adRanking" style="width: 100%">
            <el-table-column prop="title" label="广告标题" />
            <el-table-column prop="impressions" label="展示量" />
            <el-table-column prop="clicks" label="点击量" />
            <el-table-column prop="ctr" label="点击率">
              <template #default="{ row }">
                {{ row.ctr }}%
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import dayjs from 'dayjs'

const dateRange = ref([
  dayjs().subtract(30, 'day').toDate(),
  dayjs().toDate()
])

const dateShortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

const stats = ref({
  impressions: 0,
  impressionsGrowth: 0,
  clicks: 0,
  clicksGrowth: 0,
  ctr: 0,
  ctrGrowth: 0,
  spent: 0,
  spentGrowth: 0
})

const adRanking = ref([])
const trendChart = ref(null)
const typeChart = ref(null)
const channelChart = ref(null)
const regionChart = ref(null)
const deviceChart = ref(null)

const loadStats = async () => {
  try {
    const [startDate, endDate] = dateRange.value
    const response = await axios.get('/api/reporting/stats/advertiser/', {
      params: {
        start_date: dayjs(startDate).format('YYYY-MM-DD'),
        end_date: dayjs(endDate).format('YYYY-MM-DD')
      }
    })
    stats.value = response.data
    adRanking.value = response.data.ad_stats
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const initCharts = async () => {
  try {
    const [startDate, endDate] = dateRange.value
    const response = await axios.get('/api/reporting/stats/advertiser/charts/', {
      params: {
        start_date: dayjs(startDate).format('YYYY-MM-DD'),
        end_date: dayjs(endDate).format('YYYY-MM-DD')
      }
    })
    const { line_chart, type_bar, channel_pie, region_map, device_pie } = response.data
    
    // 初始化趋势图
    const trendInstance = echarts.init(trendChart.value)
    trendInstance.setOption(JSON.parse(line_chart))
    
    // 初始化类型柱状图
    const typeInstance = echarts.init(typeChart.value)
    typeInstance.setOption(JSON.parse(type_bar))
    
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
      typeInstance.resize()
      channelInstance.resize()
      regionInstance.resize()
      deviceInstance.resize()
    })
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

const handleDateChange = () => {
  loadStats()
  initCharts()
}

onMounted(() => {
  loadStats()
  initCharts()
})
</script>

<style lang="scss" scoped>
.stats {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
    }
  }
  
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