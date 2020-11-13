import Vue from 'vue'
import App from './App.vue'
import axios from '@/utils/axios'
import router from '@/router/index'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './assets/css/overview.css'

Vue.config.productionTip = false
Vue.use(Antd);

Vue.config.productionTip = false
new Vue({
  axios,
  router,
  render: h => h(App),
}).$mount('#app')
