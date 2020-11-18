export default [
    {
        path: '/',
        name: '首页',
        component: () => import('@/views/home'),
        redirect: '/mycustomer',
        children: [
            {
                path: 'mycustomer',
                name: '员工管理',
                component: () => import('@/views/myCustomer')
            },
            {
                path: 'shared',
                name: '共享池',
                component: () => import('@/views/shared')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login')
    }
]