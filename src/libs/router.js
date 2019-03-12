// 导入Vue
import Vue from 'vue';
// 导入VueRouter
import VueRouter from 'vue-router';
// 脚手架开发，必须use()明确安装路由功能
Vue.use(VueRouter);

// 导入组件
import login from '../components/login.vue';
import index from '../components/index.vue';

// 实例化路由对象
let router = new VueRouter({
    routes: [{
        // 重定向登录页
        path: '/',
        redirect: login
    },{
        path: '/login',
        component: login
    },{
        path: '/index',
        component: index
    }]
});

// 导出router
export default router;