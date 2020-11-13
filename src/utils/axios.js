import axios from 'axios'
import store from '@/store'

const service = axios.create({
    baseURL: 'http://47.56.186.16:8089',
    timeout: 60000
})

// request interceptor
service.interceptors.request.use({

})

// response interceptor
service.interceptors.response.use

export default service;