import { createRouter, createWebHistory } from 'vue-router'
import LogInPage from '../components/LogInPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LogInPage
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('../components/SignInPage.vue')
    },
    {
      path: '/forgetpw',
      name: 'ForgetPassword',
      component: () => import('../components/ForgetPassword.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    }
  ]
})

export default router
