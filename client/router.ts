import Vue from 'vue';
import VueRouter from 'vue-router';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
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
