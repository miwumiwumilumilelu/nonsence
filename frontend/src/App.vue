<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app">
    <a-layout class="layout">
      <a-layout-header class="header">
        <div class="header-content">
          <a-menu mode="horizontal" theme="dark" class="menu">
            <a-menu-item key="home">首页</a-menu-item>
            <a-menu-item key="buy">购买广告</a-menu-item>
            <a-menu-item key="recharge">广告充值</a-menu-item>
            <a-menu-item key="history">充值历史</a-menu-item>
            <a-menu-item key="manage">广告管理</a-menu-item>
            <a-menu-item key="stats">广告统计</a-menu-item>
          </a-menu>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.layout {
  min-height: 100vh;
}

.header {
  width: 100%;
  padding: 0;
  background: #001529;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.menu {
  background: transparent;
}

.content {
  background: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
