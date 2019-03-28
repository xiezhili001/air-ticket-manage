import axios from 'axios'

import router from '../router';

// 创建一个 axios 的实例
const instance = axios.create({
  timeout: 5000,
  baseURL: 'http://localhost:3000/'
})

// 处理请求拦截
instance.interceptors.request.use(
  config => {
    console.log(config)
    config.params.token = 'sdfsaf'
    // 加上 token
    // let token = sessionStorage.getItem('token');
    // if (token) {
    //   config.headers['X-Access-Token'] = token;
    // }

    // 对 config 处理之后，记得要 return config
    return config
  },

  error => {
    console.log('发送到服务器失败的话，会进入到这个函数')
  }
)

// 处理响应拦截
instance.interceptors.response.use(
  response => {
    console.log('请求被服务器发送回来，之后，并且是在.then 之前')

    return response.data
  },

  error => {
    console.log('请求响应回来的时候报错了');
    console.log(location.href);
    router.push({name: 'login', params:{
      returnPath: location.href,
   }});
    if (error.response.status === 400 || error.response.status === 401) {
      // 跳转回登录页面

    }

    // 最后记得 再次将错误给 reject 出去，已让具体调用的地方能够使用
    return Promise.reject(error);
  }
)

export default instance
