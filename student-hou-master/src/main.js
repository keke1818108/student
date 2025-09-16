import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/assets/main.css'

import util from "@/js/util";
import storage from './js/storage'


axios.defaults.baseURL = 'http://127.0.0.1:8888';
Vue.prototype.$util = util;
Vue.prototype.$storage = storage;
Vue.prototype.$store = store;
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
