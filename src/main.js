import Vue from 'vue'
import App from './App.vue'
import axios from '@/utils/axios'
import router from '@/router/index'
import MuseUI from 'muse-ui';
import Toast from 'muse-ui-toast';
import {options} from './utils/toast'
import 'muse-ui/dist/muse-ui.css';
import '@/assets/css/iconfont.css';
import 'typeface-roboto'
Vue.use(MuseUI);
Vue.use(Toast, options)
Vue.config.productionTip = false
new Vue({
  axios,
  router,
  render: h => h(App),
}).$mount('#app')
