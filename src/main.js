import Vue from 'vue'
import App from './App.vue'
// 是否显示生产提示
Vue.config.productionTip = false;

// 导入饿了么ui
import ElementUI from 'element-ui';
// 导入饿了么样式
import 'element-ui/lib/theme-chalk/index.css';
// 插件都要use一下
Vue.use(ElementUI);

// 导入路由
import router from './libs/router.js';
// 导入抽取的aixos插件
import http from './libs/http.js';
Vue.use(http);

new Vue({
  render: h => h(App),
  router
}).$mount('#app')