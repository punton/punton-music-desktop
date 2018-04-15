import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'

import App from './App'
import router from './router'
import store from './store'
import 'vue-awesome/icons'
// import 'element-ui/lib/theme-chalk/index.css'

import Icon from 'vue-awesome/components/Icon'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)

// globally (in your main .js file)
Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  store,
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
