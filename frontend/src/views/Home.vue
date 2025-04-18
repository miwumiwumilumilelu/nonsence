<template>
  <div class="home">
    <!-- 顶部横幅 -->
    <div class="banner">
      <div class="banner-content">
        <h1>智能广告投放平台</h1>
        <p>精准触达目标用户，提升广告效果</p>
        <el-button type="primary" size="large" @click="startNow">立即开始</el-button>
      </div>
    </div>

    <!-- 平台优势 -->
    <div class="features">
      <h2>平台优势</h2>
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="feature-item">
            <el-icon size="40"><DataLine /></el-icon>
            <h3>数据驱动</h3>
            <p>实时数据分析，助您做出明智决策</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="feature-item">
            <el-icon size="40"><Aim /></el-icon>
            <h3>精准投放</h3>
            <p>多维度用户画像，精准触达目标受众</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="feature-item">
            <el-icon size="40"><TrendCharts /></el-icon>
            <h3>效果优化</h3>
            <p>智能优化策略，提升广告转化率</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 热门广告 -->
    <div class="popular-ads">
      <h2>热门广告</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="ad in popularAds" :key="ad.id">
          <el-card :body-style="{ padding: '0px' }" class="ad-card">
            <img :src="ad.image" class="ad-image">
            <div class="ad-info">
              <h4>{{ ad.title }}</h4>
              <div class="ad-stats">
                <span>展示量: {{ ad.impressions }}</span>
                <span>点击率: {{ ad.ctr }}%</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DataLine, Aim, TrendCharts } from '@element-plus/icons-vue'

const router = useRouter()

const popularAds = ref([
  {
    id: 1,
    title: '春季新品发布',
    image: 'https://via.placeholder.com/300x200',
    impressions: '1.2万',
    ctr: '2.8'
  },
  {
    id: 2,
    title: '限时特惠活动',
    image: 'https://via.placeholder.com/300x200',
    impressions: '8千',
    ctr: '3.2'
  },
  {
    id: 3,
    title: '品牌推广计划',
    image: 'https://via.placeholder.com/300x200',
    impressions: '1.5万',
    ctr: '2.5'
  },
  {
    id: 4,
    title: '新用户专享',
    image: 'https://via.placeholder.com/300x200',
    impressions: '5千',
    ctr: '4.1'
  }
])

const startNow = () => {
  router.push('/ads')
}
</script>

<style lang="scss" scoped>
.home {
  .banner {
    height: 500px;
    background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: -20px -20px 40px;

    .banner-content {
      h1 {
        font-size: 48px;
        margin-bottom: 20px;
      }

      p {
        font-size: 20px;
        margin-bottom: 30px;
        opacity: 0.9;
      }
    }
  }

  .features {
    margin-bottom: 60px;
    text-align: center;

    h2 {
      font-size: 32px;
      margin-bottom: 40px;
    }

    .feature-item {
      padding: 30px;
      
      .el-icon {
        color: #1890ff;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 15px;
      }

      p {
        color: #666;
        line-height: 1.6;
      }
    }
  }

  .popular-ads {
    h2 {
      font-size: 32px;
      text-align: center;
      margin-bottom: 40px;
    }

    .ad-card {
      margin-bottom: 20px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      }

      .ad-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .ad-info {
        padding: 15px;

        h4 {
          margin: 0 0 10px;
          font-size: 16px;
        }

        .ad-stats {
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 13px;
        }
      }
    }
  }
}
</style> 