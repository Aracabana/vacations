import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import isAuthenticated from '../utils/isAuthenticated';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        layout: 'main'
      },
      component: () => import('@/views/Home')
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        layout: 'auth'
      },
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/registration',
      name: 'Registration',
      meta: {
        layout: 'auth'
      },
      component: () => import('@/views/Registration.vue')
    },
    {
      path: '/create-vacation',
      name: 'CreateVacation',
      meta: {
        layout: 'main'
      },
      component: () => import('@/views/CreateVacation.vue')
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'Registration' && !await isAuthenticated()) {
    next({ name: 'Login' });
    return;
  }
  next();
});


export default router;

