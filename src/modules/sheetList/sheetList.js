import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './sheetList.vue';
import routes from './routers'
import store from '../../store/'

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
    routes
});

new Vue({
    el: "#app",
    store,
    render: h => h(App),
    router
});