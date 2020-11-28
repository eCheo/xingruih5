import axios from 'axios'
import router from '../router/index'
import Toast from 'muse-ui-toast';
const service = axios.create({
    baseURL: 'http://47.108.133.94:8080',
    timeout: 60000
})

service.interceptors.request.use(function(config){        //添加一个请求拦截器
    if (config.url.indexOf('login.json') > -1) {
      config.headers = {
        Authorization: 'Basic cGM6ME5SMXB4M2pjYTA9',
        'Content-Type': 'application/json'
      }
    } else {
      config.headers = {
        Authorization: sessionStorage.getItem('tokenType') + ' ' + sessionStorage.getItem('token')
      }
    }
    return config;
})

// response interceptor
service.interceptors.response.use(response => {
    if (response.data.code === '209' || response.data.code === '208') {
        router.push('/login')
      }
      const url = router.history.current
      if (response.data.code === '777') {
        if (url.name !== '客户详情') {
          sessionStorage.setItem('cusId', response.data.data.id)
          Toast.error(`您还没有添加客户【${response.data.data.name}】的跟踪信息`);
        }
        router.push({path: '/customerdetails'})
        return 
      }
      if (response.data.code === '778') { 
        router.push({path: '/login'});
      }
      return response
}, err => {
    return Promise.reject(err.response.status)
})

export default service;