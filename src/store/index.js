import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
    state: {
        user: getItem(TOKEN_KEY),
        cachePages: ['LayoutIndex']
    },
    mutations: {
        setUser(state, data) {
            state.user = data

            // 为了防止刷新丢失，我们需要把数据备份到本地存储
            setItem(TOKEN_KEY, state.user)
        },
        addCachePage(state, pageName) {
            if (!state.cachePages.includes(pageName)) {
                state.cachePages.push(pageName)
            }
        },
        removeCachePage(state, pageName) {
            const index = state.cachePages.indexOf(pageName)
            if (index !== -1) {
                state.cachePages.splice(index, 1)
            }
        }
    },
    actions: {},
    modules: {}
})