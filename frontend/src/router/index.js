import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'ads',
        name: 'Ads',
        component: () => import('@/views/Ads.vue')
      },
      {
        path: 'ads/:id',
        name: 'AdDetail',
        component: () => import('@/views/AdDetail.vue')
      },
      {
        path: 'stats',
        name: 'Stats',
        meta: { requiresAuth: true },
        component: () => import('@/views/Stats.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        meta: { requiresAuth: true },
        component: () => import('@/views/Profile.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router 