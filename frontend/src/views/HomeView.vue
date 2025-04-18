<template>
  <div class="home">
    <a-space direction="vertical" size="large">
      <a-typography-title :heading="4">欢迎来到广告平台</a-typography-title>
      <a-card>
        <a-space direction="vertical" size="large">
          <a-typography-text>快速开始</a-typography-text>
          <a-space>
            <a-button type="primary" @click="$router.push('/buy')">购买广告</a-button>
            <a-button @click="$router.push('/recharge')">广告充值</a-button>
          </a-space>
        </a-space>
      </a-card>
      
      <a-row :gutter="16">
        <a-col :span="8">
          <a-card title="广告统计">
            <a-statistic :value="0" title="今日展示" />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="账户状态">
            <a-statistic :value="0" title="账户余额" />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="最近活动">
            <a-empty description="暂无活动" />
          </a-card>
        </a-col>
      </a-row>
    </a-space>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 