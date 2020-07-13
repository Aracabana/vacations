import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      meta: {
        layout: 'main'
      }
    },
    {
      path: '/login',
      meta: {
        layout: 'auth'
      },
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/registration',
      meta: {
        layout: 'auth'
      },
      component: () => import('@/views/Registration.vue')
    },
    {
      path: '/create-vacation',
      meta: {
        layout: 'main'
      },
      component: () => import('@/views/CreateVacation.vue')
    }
  ]
})
