import { Dialog } from 'vant'
import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store/'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: () =>
            import ('@/views/layout'),
        children: [{
                path: '',
                name: 'home',
                component: () =>
                    import ('@/views/home'),
                meta: {
                    requiresAuth: false
                }
            },
            {
                path: 'qa',
                name: 'qa',
                component: () =>
                    import ('@/views/qa'),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'video',
                name: 'video',
                component: () =>
                    import ('@/views/video'),
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'my',
                name: 'my',
                component: () =>
                    import ('@/views/my'),
                meta: {
                    requiresAuth: false
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login'),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search'),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('@/views/article'),
        props: true, // 开启 Props 传参，说白了就是把路由参数映射到组件的 props 数据中
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/user/profile',
        name: 'user-profile',
        component: () =>
            import ('@/views/user-profile'),
        meta: {
            requiresAuth: false
        }
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (store.state.user) {
            return next()
        }

        Dialog.confirm({
            title: '访问提示',
            message: '该功能需要登录！'
        }).then(() => {
            router.replace({
                name: 'login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            })
        }).catch(() => {
            next(false)
        })
    } else {
        next()
    }
})

export default router