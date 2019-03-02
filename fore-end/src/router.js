import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
});
