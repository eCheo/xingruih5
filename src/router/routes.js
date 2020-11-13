export default [
    {
        path: '/',
        component: () => import('@/views/home')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login')
    }
]