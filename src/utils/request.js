import axios from 'axios'
import store from '@/store'

import JSONBig from 'json-bigint'

import { Toast } from 'vant'

import router from '@/router/'

const refreshTokenReq = axios.create({
    baseURL: 'http://toutiao-app.itheima.net/'
})

const request = axios.create({
    baseURL: 'http://toutiao-app.itheima.net/',
    transformResponse: [function(data) {
        try {
            return JSONBig.parse(data)
        } catch (err) {
            return data
        }
    }]
})


// 请求拦截器
request.interceptors.request.use(function(config) {
    // 请求发起会经过这里
    // config：本次请求的请求配置对象
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }

    return config
}, function(error) {
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function(response) {
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