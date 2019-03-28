import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  // base: process.env.BASE_URL,
  routes: [{
      path: '/home',
      component: () => import('./views/Home.vue'),
      children: [ {
        path: '/',
        redirect: '/sysUser'
      },{
          path: 'sysUser',
          name: 'sysUser',
          component: () => import('./views/main/sysUser.vue'),
        },
        {
          path: 'sysRole',
          name: 'sysRole',
          component: () => import('./views/main/sysRole.vue'),
        },
        {
          path: 'structure',
          name: 'structure',
          component: () => import('./views/main/structure.vue'),
        },
        {
          path: 'airCompanyManage',
          name: 'airCompanyManage',
          component: () => import('./views/main/airCompanyManage.vue'),
        },
        {
          path: 'backManage',
          name: 'backManage',
          component: () => import('./views/main/backManage.vue'),
        }, {
          path: 'airportManage',
          name: 'airportManage',
          component: () => import('./views/main/airportManage.vue'),
        }, {
          path: 'airlineManage',
          name: 'airlineManage',
          component: () => import('./views/main/airlineManage.vue'),
        }, {
          path: 'registerAccount',
          name: 'registerAccount',
          component: () => import('./views/main/registerAccount.vue'),
        }, {
          path: 'platformSet',
          name: 'platformSet',
          component: () => import('./views/main/platformSet.vue'),
        }, {
          path: 'platformOnlineSet',
          name: 'platformOnlineSet',
          component: () => import('./views/main/platformOnlineSet.vue'),
        }, {
          path: 'taxationManage',
          name: 'taxationManage',
          component: () => import('./views/main/taxationManage.vue'),
        }, {
          path: 'taxationControl',
          name: 'taxationControl',
          component: () => import('./views/main/taxationControl.vue'),
        }, {
          path: 'integralAccount',
          name: 'integralAccount',
          component: () => import('./views/main/integralAccount.vue'),
        }, {
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
