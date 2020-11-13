import Vue from 'vue'
import routes from './routes'
import Route from 'vue-router'
// import store from 'vuex'

Vue.use(Route)

const routers = new Route({
    mode: 'history', 
    routes: routes
})

// routers.beforeEach((to, from, next) => {
//         next({name: 'login'})
// })

export default routers