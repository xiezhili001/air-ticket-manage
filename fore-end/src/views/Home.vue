<template>
  <div class="zl-home">
    <el-container>
      <el-header style="height: 42px">
        <div class="fl tag">JTD.Admin</div>
        <div class="fr user">
          <span>匡珈萱，您好,欢迎登录</span>&nbsp;
          <span>修改密码</span>
        </div>
      </el-header>

      <el-container>
        <el-aside width="210px" class="aside">
          <div class="menu">
            菜单
            <span></span>
          </div>
          <el-collapse accordion class="menu-list">
            <el-collapse-item title="设置" name="1">
              <el-card class="box-card">
                <div v-for="item in setList" :key="item" class="text item list-content">{{'列表内容 ' + item }}</div>
              </el-card>
            </el-collapse-item>
            <el-collapse-item title="管理" name="2">
              <el-card class="box-card">
                <div v-for="item in manageList" :key="item" class="text item list-content">{{'列表内容 ' + item }}</div>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-aside>

        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      setList: ["sdfds", "sfsdf", 'dsf'],
      manageList: ["sdfsdf", "sdfdsf"]
    };
  }
};
</script>

<style lang="scss">
.zl-home {
  height: 100%;
  font-size: 16px;

  .el-collapse-item__content {
    padding: 0;
  }

  .el-card__body {
    padding: 0;
  }

  .el-collapse-item__wrap {
    background-color: #f8f8f8;
  }

  .el-collapse-item__header{
    font-size: 16px;
    padding: 0 20px;
  }

  .el-card {
    background-color: #f8f8f8;
    font-size: 15px;
    padding: 5px 15px;
  }

  .list-content {
    padding: 5px 0
  }

  .el-container {
    height: 100%;
  }

  .el-header {
    line-height: 42px;
    height: 42px;
    padding-left: 60px;
    border-bottom: 1px solid #ccc;
    margin: 0;

    .tag {
      color: green;
    }

    .user {
      font-size: 14px;
    }
  }

  .aside {
    height: 100%;
    border-right: 1px solid #ccc;

    .el-collapse-item__header {
      background: #f8f8f8;
    }
  }
}
</style>
