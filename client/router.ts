import Vue from 'vue';
import VueRouter from 'vue-router';
import NotFound from './NotFound.vue';
import NeighborhoodWrapper from './components/neighborhood/NeighborhoodWrapper.vue'

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: NeighborhoodWrapper},
  {path: '/neighborhood/:name', name: 'Home', component: NeighborhoodWrapper},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {


  next();
});

export default router;
