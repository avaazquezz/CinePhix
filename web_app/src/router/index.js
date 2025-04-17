import { createRouter, createWebHistory } from 'vue-router';

import MainPage from '@/pages/MainPage.vue';

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainPage,
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetailView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
