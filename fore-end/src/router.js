import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  // base: process.env.BASE_URL,
  routes: [{
      path: '/home',
      component: () => import('./views/Home.vue'),
      children: [{
          path: '/',
          redirect: '/sysUser'
        }, {
          path: 'sysUser',
          name: 'sysUser',
          component: () => import('./views/main/sysUser.vue'),
        },
        {
          path: 'PTPConfig',
          name: 'PTPConfig',
          component: () => import('./views/main/PTPConfig.vue'),
        },
        {
          path: 'airCompanyManage',
          name: 'airCompanyManage',
          component: () => import('./views/main/airCompanyManage.vue'),
        },
        {
          path: 'airportManage',
          name: 'airportManage',
          component: () => import('./views/main/airportManage.vue'),
        }, {
          path: 'airlineManage',
          name: 'airlineManage',
          component: () => import('./views/main/airlineManage.vue'),
        },
        {
          path: 'ticketOrder',
          name: 'ticketOrder',
          component: () => import('./views/main/ticketOrder.vue'),
        }, {
          path: 'cityMangae',
          name: 'cityMangae',
          component: () => import('./views/main/cityMangae.vue'),
        }, {
          path: 'countryManage',
          name: 'countryManage',
          component: () => import('./views/main/countryManage.vue'),
        }, {
          path: 'webSiteManage',
          name: 'webSiteManage',
          component: () => import('./views/main/webSiteManage.vue'),
        },
        {
          path: 'ExchangeRateManager',
          name: 'ExchangeRateManager',
          component: () => import('./views/main/ExchangeRateManager.vue'),
        },
        {
          path: 'flightManagement',
          name: 'flightManagement',
          component: () => import('./views/main/flightManagement.vue'),
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '*',
      redirect: '/home/sysUser'
    }
  ]
});
