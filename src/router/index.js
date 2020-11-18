import Vue from 'vue'
import routes from './routes'
import Route from 'vue-router'
// import store from 'vuex'

Vue.use(Route)

const routers = new Route({
    mode: 'history', 
    routes: routes
})

routers.beforeEach((to, from, next) => {
    if (to.name === '首页' && !sessionStorage.getItem('token')) {
        next({name: 'login'})
    } else {
        next()
    }
})


export default routers