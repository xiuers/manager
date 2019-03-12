// 导入Vue
import Vue from 'vue';
// 导入VueRouter
import VueRouter from 'vue-router';
// 脚手架开发，必须use()明确安装路由功能
Vue.use(VueRouter);

// 导入组件
import login from '../components/login.vue';
import index from '../components/index.vue';
import users from '../components/users.vue';

// 实例化路由对象
let router = new VueRouter({
    routes: [{
        path: '/login',
        component: login
    }, {
        path: '/',
        component: index,
        children: [{
            path: 'users',
            component: users
        }]
    }]
});

// 注册导航守卫
router.beforeEach((to, from, next) => {
    // to去哪
    // from从哪来
    if (to.path == '/login') {
        // 直接通过
        next();
        // 如果这里的括号里放了"/",就会陷入类似无限递归的错误
    } else {
        // 不是登录页
        if (window.sessionStorage.getItem('token')) {
            // 登陆了
            next();
        } else {
            // 提示用户
            // this.$message.warning('请先登录')
            // 这里的this指向的不是Vue实例，所以无法访问$message
            Vue.prototype.$message.warning('你不登录，人家不让你过去QAQ');
            // 没有登录回到登录页
            next('/login');
        }
    }
})

// 导出router
export default router;