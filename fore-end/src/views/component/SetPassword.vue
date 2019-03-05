<template>
  <div class="zl-Setpassword">
    <el-button type="text" @click="dialogFormVisible = true">修改密码</el-button>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      原密码<el-input placeholder="请输入密码" v-model="oldPassword" show-password></el-input>
      新密码<el-input placeholder="请输入密码" v-model="newPassword" show-password></el-input>
      确认密码<el-input placeholder="请输入密码" v-model="confirmPassword" show-password></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; cancle()">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false;confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "SetPassword",
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      dialogTableVisible: false,
      dialogFormVisible: false
    };
  },
  methods: {
    cancle() {
      console.log('1');
    },
    confirm() {
      console.log('2');
    }
  }
};
</script>

<style lang="scss">
.zl-Setpassword {
  .el-dialog__body {
    padding: 0 20px 20px 20px
  }
}
</style>
