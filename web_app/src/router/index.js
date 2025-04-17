import { createRouter, createWebHistory } from 'vue-router';

import MainPage from '@/pages/MainPage.vue';
import HomePage from '@/pages/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainPage,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
