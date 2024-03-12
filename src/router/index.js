import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("@/views/HomeView.vue")
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: "/:pathMatch(.*)*", // 必备
      component: () => import("@/views/HomeView.vue"),
    },
  ]
})

export default router
