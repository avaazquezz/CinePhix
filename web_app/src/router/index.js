import { createRouter, createWebHistory } from 'vue-router';

import MainPage from '@/pages/MainPage.vue';
import HomePage from '@/pages/HomePage.vue';
import MoviesPage from '@/pages/MoviesPage.vue';
import SeriesPage from '@/pages/SeriesPage.vue';
import ActorsPage from '@/pages/ActorsPage.vue';

const routes = [
  {
    path: '/CinePhix/',
    name: 'Main',
    component: MainPage,
  },
  {
    path: '/CinePhix/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/CinePhix/movies',
    name: 'Movies',
    component: MoviesPage,
  },
  {
    path: '/CinePhix/series',
    name: 'Series',
    component: SeriesPage,
  },
  {
    path: '/CinePhix/actores',
    name: 'Actors',
    component: ActorsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
