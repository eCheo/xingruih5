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
            },
            {
                path: 'addcustomer',
                name: '添加客户',
                component: () => import('@/views/addShared')
            },
            {
                path: 'shareddetails',
                name: '客户详情',
                component: () => import('@/views/sharedDetails')
            },
            {
                path: 'shop',
                name: '铺源',
                component: () => import('@/views/shop')
            },
            {
                path: 'shopdetails',
                name: '铺源详情',
                component: () => import('@/views/shopDetails')
            },
            {
                path: 'addshop',
                name: '铺源详情',
                component: () => import('@/views/shopAdd')
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login')
    }
]