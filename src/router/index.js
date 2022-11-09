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
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
