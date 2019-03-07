<template>
  <div style="height: 100%" class="zl-airManage">
    <div class="header">中文名称:
      <el-input placeholder="请输入名称" v-model="name"></el-input>&nbsp;编码:
      <el-input placeholder="请输入编码" v-model="code"></el-input>&nbsp;
      <el-button type="primary" @click="query">查询</el-button>
      <el-button type="success">新增</el-button>
      <el-button type="danger" @click="del">删除</el-button>
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
        <el-table-column label="编码" prop="ACICAO"></el-table-column>
        <el-table-column prop="ACName" label="公司名称"></el-table-column>
        <el-table-column prop="ACNameShort" label="中文名称"></el-table-column>
        <el-table-column prop="ACEnName" label="英文名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="LastUpdateTimeStamp" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer;font-size:15px" @click="fixData(scope.row)">修改</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <div class="block paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "SysRole",
  data() {
    return {
      name: "",
      code: "",
      tableData3: [],
      multipleSelection: [],
      dialogVisible: false,
      page: 2,
      pagesize: 10,
      total: 1
    };
  },

  methods: {
    // 修改数据
    fixData(row) {
      console.log(row);
      this.dialogVisible = true;
    },
    // 删除数据
    del() {
      var delData = this.multipleSelection.map(item => {
        return item.ID
      })
      console.log(delData[0]);
      if(true){
        axios
        .get("/api/navigation/DeleteAirCompany", {
          params: {
            sdfs: delData
          }
        })
        .then(function(response) {

        })
        .catch(function(error) {
          console.log(error);
        });
      } else {

      }
    },
    // 表格
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
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    // 时间处理
    dateToString(date) {
      function getDB(num) {
        return num < 10 ? "0" + num : num;
      }
      function getTimeDif(startTime, endTime) {
        return (endTime.getTime() - startTime.getTime()) / 1000;
      }
      var dateStr = "";
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      dateStr += y + "/" + getDB(m) + "/" + getDB(d);
      return dateStr;
    },
    // 无用 关闭修改
    handleClose(done) {
      done();
    },
    // 获取数据
    getData() {
      var that = this;
      axios
        .get("/api/navigation/GetAirCompanyList", {
          params: {
            page: that.page,
            pagesize: that.pagesize,
            acname: that.name,
            acicao: that.code
          }
        })
        .then(function(response) {
          var data = response.data.Data.list;
          data = data.map(item => {
            var time= new Date(
              parseInt(item.LastUpdateTimeStamp)
            );
            var timeTrans = that.dateToString(time);
            item.LastUpdateTimeStamp = timeTrans;
            return item;
          });
          that.tableData3 = data;
          that.total = response.data.Data.total;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 查询
    query() {
      this.getData();
    },
  },
  created() {
    this.getData();
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
    width: 5px;
    height: 5px;
  }
  .infoList::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 3px;
  }
  .infoList::-webkit-scrollbar-thumb {
    background: #ededed;
    border-radius: 3px;
  }
  .infoList::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
  .infoList::-webkit-scrollbar-corner {
    background: #fff;
  }
}
</style>
