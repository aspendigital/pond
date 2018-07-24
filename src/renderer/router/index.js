import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: require('@/components/projects-view').default,
    },
    {
      path: '/new-project',
      name: 'new-project',
      component: require('@/components/new-project/index').default
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
