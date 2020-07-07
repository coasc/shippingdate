import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
  config: {
    "tabBar": {},
    "navigationBarTitleText": "商品详情"
  }
}
