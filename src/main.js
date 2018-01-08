// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入静态文件common.js
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ComonJS from './library/common.js'
import LinqJS from './library/linq.js'
// import store from './store'
Vue.prototype.ComonJS = ComonJS
Vue.prototype.LinqJS = LinqJS
Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  /* store, */
  template: '<App/>',
  components: { App }
})
