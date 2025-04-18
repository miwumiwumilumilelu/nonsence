<template>
  <div class="ad-detail">
    <div class="header">
      <h2>广告详情</h2>
      <el-button-group>
        <el-button
          type="primary"
          @click="handleEdit"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-button-group>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="广告标题">
              {{ ad.title }}
            </el-descriptions-item>
            <el-descriptions-item label="广告类型">
              {{ getAdTypeText(ad.ad_type) }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(ad.status)">
                {{ getStatusText(ad.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(ad.created_at) }}
            </el-descriptions-item>
            <el-descriptions-item label="目标链接">
              <el-link :href="ad.target_url" target="_blank">
                {{ ad.target_url }}
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item label="预算">
              ¥{{ ad.budget }}
            </el-descriptions-item>
          </el-descriptions>
          
          <div class="content-section">
            <h3>广告内容</h3>
            <div class="content">
              {{ ad.content }}
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>数据统计</span>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item label="展示量">
              {{ ad.impressions }}
            </el-descriptions-item>
            <el-descriptions-item label="点击量">
              {{ ad.clicks }}
            </el-descriptions-item>
            <el-descriptions-item label="点击率">
              {{ ad.ctr }}%
            </el-descriptions-item>
            <el-descriptions-item label="消耗">
              ¥{{ ad.spent }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>数据趋势</span>
            </div>
          </template>
          <div ref="trendChart" class="chart"></div>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import axios from 'axios'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const ad = ref({})
const trendChart = ref(null)
const channelChart = ref(null)
const regionChart = ref(null)

const getAdTypeText = (type) => {
  const types = {
    image: '图片广告',
    video: '视频广告',
    text: '文字广告'
  }
  return types[type] || type
}

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    active: 'success',
    paused: 'info',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待审核',
    active: '投放中',
    paused: '已暂停',
    rejected: '已拒绝'
  }
  return texts[status] || status
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const loadAd = async () => {
  try {
    const response = await axios.get(`/api/ads/${route.params.id}/`)
    ad.value = response.data
  } catch (error) {
    console.error('加载广告详情失败:', error)
  }
}

const initCharts = async () => {
  try {
    const response = await axios.get(`/api/reporting/stats/ad/${route.params.id}/charts/`)
    const { line_chart, channel_pie, region_map } = response.data
    
    // 初始化趋势图
    const trendInstance = echarts.init(trendChart.value)
    trendInstance.setOption(JSON.parse(line_chart))
    
    // 初始化渠道饼图
    const channelInstance = echarts.init(channelChart.value)
    channelInstance.setOption(JSON.parse(channel_pie))
    
    // 初始化地区地图
    const regionInstance = echarts.init(regionChart.value)
    regionInstance.setOption(JSON.parse(region_map))
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      trendInstance.resize()
      channelInstance.resize()
      regionInstance.resize()
    })
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

const handleEdit = () => {
  router.push(`/ads/${route.params.id}/edit`)
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这个广告吗？', '提示', {
      type: 'warning'
    })
    await axios.delete(`/api/ads/${route.params.id}/`)
    ElMessage.success('删除成功')
    router.push('/ads')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除广告失败:', error)
    }
  }
}

onMounted(() => {
  loadAd()
  initCharts()
})
</script>

<style lang="scss" scoped>
.ad-detail {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
    }
  }
  
  .content-section {
    margin-top: 20px;
    
    h3 {
      margin: 0 0 10px;
      font-size: 16px;
      color: #303133;
    }
    
    .content {
      padding: 10px;
      background-color: #f5f7fa;
      border-radius: 4px;
    }
  }
  
  .chart-card {
    margin-top: 20px;
  }
  
  .chart-row {
    margin-top: 20px;
    
    .chart {
      height: 300px;
    }
  }
}
</style> 