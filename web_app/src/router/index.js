import { createRouter, createWebHistory } from 'vue-router';

import MainPage from '@/pages/MainPage.vue';
import HomePage from '@/pages/HomePage.vue';
import MoviesPage from '@/pages/MoviesPage.vue';
import SeriesPage from '@/pages/SeriesPage.vue';

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
  {
    path: '/movies',
    name: 'Movies',
    component: MoviesPage,
  },
  {
    path: '/series',
    name: 'Series',
    component: SeriesPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
