<template>
  <div style="height: 100%" class="zl-login">
    <el-card shadow="always" class="login">
      <div class="header">用户登录</div>
      <div class="main">
        <el-input placeholder="请输入用户名" v-model="userName" clearable></el-input>
        <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
      </div>
      <div class="footer">
        <el-button type="primary" :loading="load" @click="login">{{ state }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      userName: "",
      password: "",
      load: false,
      state: "登录",
      returnPath: ""
    };
  },
  methods: {
    messagetips(message, type) {
      this.$message({
        duration: 1000,
        message: message,
        type: type
      });
    },
    login() {
      var that = this;
      this.load = true;
      this.state = "登录中";
      axios
        .get("/api/user/login", {
          params: {
            userName: that.userName, //admin
            password: that.password //123456
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.data.Errcode == 0) {
            localStorage.setItem("token", response.data.Message);
            console.log(response);
            that.load = false;
            if (that.returnPath) {
              location.href = that.returnPath;
            } else {
              that.$router.push({ name: "sysUser" });
            }
          }else {
            that.messagetips(response.data.Message, 'warning');
            that.load = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    if (this.$route.params.returnPath) {
      this.returnPath = this.$route.params.returnPath;
    }
  }
};
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
