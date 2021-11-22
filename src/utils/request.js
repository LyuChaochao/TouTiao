import axios from 'axios'
import store from '@/store'

import JSONBig from 'json-bigint'

import { Toast } from 'vant'

import router from '@/router/'

const refreshTokenReq = axios.create({
    baseURL: 'http://toutiao-app.itheima.net/'
})

const request = axios.create({
    // baseURL: 'http://ttapi.research.itcast.cn/'
    baseURL: 'http://toutiao-app.itheima.net/',
    transformResponse: [function(data) {
        try {
            return JSONBig.parse(data)
        } catch (err) {
            return data
        }

        // axios 默认会在内部这样来处理后端返回的数据
        // return JSON.parse(data)
    }]
})


// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function(config) {
    // 请求发起会经过这里
    // config：本次请求的请求配置对象
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }

    // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    return config
}, function(error) {
    // 如果请求出错了（还没有发出去）会进入这里
    return Promise.reject(error)
})


request.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    return response;
}, async function(error) {

    const status = error.response.status

    if (status === 400) {
        Toast.fail('客户端请求参数异常')
    } else if (status === 401) {
        const { user } = store.state

        if (!user || !user.token) {
            return redirectLogin()
        }

        try {
            const { data } = await refreshTokenReq({
                method: 'PUT',
                url: '/v1_0/authorizations',
                headers: {
                    Authorization: `Bearer ${user.refresh_token}`
                }
            })

            user.token = data.data.token
            store.commit('setUser', user)

            return request(error.config)

        } catch (error) {
            redirectLogin()
        }

    } else if (status === 403) {
        Toast.fail('没有权限操作')
    } else if (status >= 500) {
        Toast.fail('服务端异常，请稍后重试')
    }
    // 对响应错误做点什么
    return Promise.reject(error);
});

function redirectLogin() {
    router.replace({
        name: 'login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

export default request