import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-panel',
      component: require('@/components/MainPanel').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
