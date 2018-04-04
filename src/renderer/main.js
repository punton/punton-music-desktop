import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import 'vue-awesome/icons'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'vue-material-design-icons/styles.css'

import Icon from 'vue-awesome/components/Icon'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(BootstrapVue)

// globally (in your main .js file)
Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
