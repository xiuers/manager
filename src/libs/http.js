// 导入axios
import axios from 'axios';
// 导入vue
import Vue from 'vue';
// 设置基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 设置拦截器
// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前获取到请求的设置，然后进行人为的修改 
    // config  这次请求的各项设置
    if (config.url.indexOf('/login')==-1) {
        // 基于token的网站调用需要的接口时，必须额外的携带token给服务器
        // token不是cookie 不会自动携带
        // 携带方式后台会给的
        config.headers.Authorization = window.sessionStorage.getItem('token');
        // 如果不是登录页,就统一在请求头添加token
    }
    return config;
  }, function (error) {
    // 处理请求错误
    return Promise.reject(error);
  });

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
    // 在数据响应回来的时候获取到数据，然后添加自己的逻辑
    // response 返回的数据
    // 把弹框统一挂载到Vue原型上
    Vue.prototype.$message.success(response.data.meta.msg);
    return response;
  }, function (error) {
    // 处理响应错误
    return Promise.reject(error);
  });



// 暴露出去
export default {
    // 实现install方法
    install( ) {
        // 把axios挂载到Vue原型上
        Vue.prototype.$http = axios;
    }
}