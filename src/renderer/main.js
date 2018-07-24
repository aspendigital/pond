import Vue from 'vue';
import axios from 'axios';
import VueI18n from 'vue-i18n';
import $ from 'jquery';
import _ from 'lodash';

import App from './App';
import router from './router';
import store from './store';
import messages from './i18n/messages';

window.$ = $;
window._ = _;

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  messages,
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>',
}).$mount('#app');
