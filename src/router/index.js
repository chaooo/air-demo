import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import AirHome from '@/components/AirHome'
import AirList from '@/components/AirList'
import BookPage from '@/components/BookPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/air',
      name: 'AirHome',
      component: AirHome
    },
    {
      path: '/airs',
      name: 'AirList',
      component: AirList
    },
    {
      path: '/booking',
      name: 'BookPage',
      component: BookPage
    }
  ]
})
