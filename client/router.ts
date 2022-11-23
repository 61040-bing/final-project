import Vue from 'vue';
import VueRouter from 'vue-router';
import NotFound from './NotFound.vue';
import NeighborhoodWrapper from './components/neighborhood/NeighborhoodWrapper.vue'
import LoginPage from './components/Login/LoginPage.vue';
import RegisterPage from './components/Login/RegisterPage.vue';
import ProfilePage from './components/Account/ProfilePage.vue';


Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: NeighborhoodWrapper},
  {path: '/neighborhood/:name', name: 'NeighborHood', component: NeighborhoodWrapper},
  {path: '*', name: 'Not Found', component: NotFound},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/register', name: 'Register', component: RegisterPage},
  {path: '/profile', name: 'Profile', component: ProfilePage}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {

    if (to.name === 'Profile' && !router.app.$store.state.userEmail) {
      next({name: 'Login'}); // Go to Login page if user navigates to Profile and are not signed in
      return;
    }
  }
  next();
});

export default router;
