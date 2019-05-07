// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'
import '../static/validate'
import config from '@/components/config'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts'
// load these modules as your need
import loadStock from 'highcharts/modules/stock'
import loadMap from 'highcharts/modules/map'
import loadDrilldown from 'highcharts/modules/drilldown'
// some charts like solid gauge require `highcharts-more.js`, you can find it in official demo.
import loadHighchartsMore from 'highcharts/highcharts-more'
import loadSolidGauge from 'highcharts/modules/solid-gauge'
import moment from 'moment'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'

Vue.use(Element, { size: 'small' })
Vue.directive('exclude', {
  update: function (el, {value}) {
    try {
      el.value = el.value.replace(new RegExp(value, 'gi'), '')
      el.dispatchEvent(new Event('input'))
    } catch (e) {
      console.log(e)
    }
  }
})
// 注册一个全局自定义用于元素可拖拽的指令
Vue.directive('drag', {
  inserted: function (el) {
    // 聚焦元素
    el.children[0].onmousedown = function (ev) {
      let x = ev.pageX - el.offsetLeft
      let y = ev.pageY - el.offsetTop
      document.onmousemove = function (ev) {
        let l = ev.pageX - x
        let t = ev.pageY - y
        el.style.left = l + 300 + 'px'
        el.style.top = t + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

loadStock(Highcharts)
loadMap(Highcharts)
loadDrilldown(Highcharts)
loadHighchartsMore(Highcharts)
loadSolidGauge(Highcharts)

Vue.use(VueHighcharts, {Highcharts})

Vue.config.productionTip = false
Vue.use(Vuex)

Vue.prototype.moment = moment

Vue.prototype.axios = axios

// 当刷新页面时，这段逻辑在mounted之前执行，能确保mounted中的Ajax请求能正确执行
let loginResult = config.getStorage('loginResult')
if (loginResult) {
  axios.defaults.headers.get['accessToken'] = axios.defaults.headers.post['accessToken'] = loginResult.token
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
