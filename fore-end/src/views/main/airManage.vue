<template>
  <div style="height: 100%" class="zl-airManage">
    <div class="header">中文名称:
      <el-input placeholder="请输入名称" v-model="name"></el-input>编码:
      <el-input placeholder="请输入编码" v-model="code"></el-input>&nbsp;
      <el-button type="primary">查询</el-button>
      <el-button type="success">新增</el-button>
      <el-button type="danger">删除</el-button>
    </div>

    <div class="infoList">
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编码" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="zh" label="中文名称" width="120"></el-table-column>
        <el-table-column prop="en" label="英文名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="canUser" label="是否可用" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>

    <div class="block paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage3"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="sizes, prev, pager, next, jumper"
        :total="1000"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "SysRole",
  data() {
    return {
      name: "",
      code: "",
      tableData3: [
        {
          date: "2016-05-03",
          zh: "王小虎",
          en: "wkf",
          canUser: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: [],
      currentPage3: 5
    };
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss">
.zl-airManage {
  display: flex;
  flex-direction: column;

  .el-button {
    width: 50px;
    height: 20px;
    padding: 0;
  }

  .header {
    font-size: 14px;

    .el-input {
      display: inline-block;
      width: auto;
    }

    input {
      width: 120px;
      height: 23px;
    }
  }

  .infoList {
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }

  .infoList::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .infoList::-webkit-scrollbar-track {
    background: #ccc;
    border-radius: 2px;
  }
  .infoList::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 2px;
  }
  .infoList::-webkit-scrollbar-thumb:hover {
    background: #747474;
  }
  .infoList::-webkit-scrollbar-corner {
    background: #f6f6f6;
  }
}
</style>
