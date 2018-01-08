import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//创建Store实例
export default new Vuex.Store({
  // 存储状态值
  state: { 
    airAPI: {
      searchType: '2',
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      adult: '1',
      child: '0',
      cabin: 'y',
      currency: 'HK$'
    }
  },
  // 状态值的改变方法,操作状态值
  // 提交mutations是更改Vuex状态的唯一方法
  mutations: { 
    changeAirAPI (state, newState) {
      state.airAPI = newState
    }
  },
  // 在store中定义getters（可以认为是store的计算属性）。Getters接收state作为其第一个函数
  getters: { },
  actions: { }
})