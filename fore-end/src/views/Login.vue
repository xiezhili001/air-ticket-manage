<template>
  <div style="height: 100%" class="zl-login">
      <el-card shadow="always" class="login">
        <div class="header">用户登录</div>
        <div class="main">
          <el-input
                placeholder="请输入用户名" v-model="userName" clearable></el-input>
          <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
        </div>
        <div class="footer">
          <el-button type="primary" :loading="load" @click="login">{{ state }}</el-button>
        </div>
     </el-card>
  </div>
</template>
<script>

export default {
  name: 'App',
  data() {
    return {
      userName: '',
      password: '',
      load: false,
      state: '登录'
    }
  },
  methods: {
    login() {
      this.load = true;
      this.state = '登录中'
    }
  }
}
</script>

<style lang="scss">
  .zl-login {
    display: flex;
    align-items: center;
    justify-content: center;
    .login {
      margin-top: -200px;
      width: 350px;
      height: 300px;

      .header {
        text-align: center;
        font-size: 20px;
        margin-bottom: 10px;
      }

      .main {
        .el-input {
          margin-top: 30px;
        }
      }

      .footer {
        margin-top: 30px;
        text-align: center;

        button {
          width: 300px;
        }
      }
    }
  }
</style>
