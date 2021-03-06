import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant from 'vant'

import 'amfe-flexible'

import './styles/index.less'

import 'vant/lib/index.css'

import './utils/dayjs'

Vue.config.productionTip = false

Vue.use(Vant)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')