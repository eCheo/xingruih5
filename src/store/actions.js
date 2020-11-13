import { login } from '@/api/user'
export default{
    getToken ({commit}) {
        login().then(res => {
            if (res.status === 200 && res.data.code === '200') {
                commit('userInfo', res.data.data)
            } else {
                console.log("222")
            }
        })
    }
}