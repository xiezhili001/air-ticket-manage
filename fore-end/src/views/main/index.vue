<template>
  <div style="height: 100%" class="zl-mian">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "Main"
};
</script>

<style lang="scss">
.zl-mian {
  .el-pagination {
    border-top: 1px solid #ededed;
    padding-top: 8px;
  }
  .header {
    border-bottom: 1px solid #ededed;
    padding-bottom: 13px;
  }
}
</style>
