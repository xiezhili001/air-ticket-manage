<template>
  <div style="height: 100%" class="zl-countryManage" v-loading="loading">
    <div class="header">
      中文名称:
      <input type="text" v-model="name">
      &nbsp;编码:
      <input type="text" v-model="code">
      &nbsp;
      <el-button type="primary" @click="query">查询</el-button>
      <el-button type="success" @click="insert">新增</el-button>
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
        <el-table-column label="编码" prop="CountryCode"></el-table-column>
        <el-table-column prop="CountryName" label="中文名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CountryEnName" label="英文名称"></el-table-column>
        <el-table-column prop="LastUpdateTimeStamp" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer;font-size:15px" @click="fixData(scope.row)">修改</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-input placeholder="请输入国家编码" v-model="CountryCode" clearable :disabled="disabled"></el-input>
       <el-input placeholder="请输入国家名称" v-model="CountryName" clearable></el-input>
      <el-input placeholder="请输入英文名称" v-model="CountryEnName" clearable></el-input>
      <el-input placeholder="请输入Directory" v-model="Directory " clearable></el-input>
      <el-input placeholder="请输入ICAOCountryCode" v-model="ICAOCountryCode " clearable></el-input>
      <el-input placeholder="备注" v-model="Remark" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false; confirm(insertId)">确 定</el-button>
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
  name: "airCompanyManage",
  data() {
    return {
      loading: false,
      disabled: false,
      title: "新增数据",
      name: "",
      code: "",
      tableData3: [],
      multipleSelection: [],
      dialogVisible: false,

      page: 1,
      pagesize: 10,
      total: 1,

      CountryCode: "",
      CountryEnName: "",
      Directory : "",
      CountryName: "",
      ICAOCountryCode : "",
      Remark: "",
      insertId: ""
    };
  },

  methods: {
    // 消息提示
    messagetips(message, type) {
      this.$message({
        duration: 1000,
        message: message,
        type: type
      });
    },
    // 新增数据-----------------------
    insert() {
      this.disabled = false;
      this.title = "新增数据";
      this.dialogVisible = true;
      this.insertId = "";
      this.CountryCode = "";
      this.CountryEnName = "";
      this.Directory  = "";
      this.CountryName = "";
      this.Remark = "";
      this.ICAOCountryCode  = "";
    },
    // 修改数据
    fixData(row) {
      this.disabled = true;
      this.title = "修改数据";
      this.dialogVisible = true;
      this.insertId = row.ID;
      this.CountryCode = row.CountryCode;
      this.CountryEnName = row.CountryEnName;
      this.Directory  = row.Directory ;
      this.CountryName = row.CountryName;
      this.Remark = row.Remark;
      this.ICAOCountryCode  = row.ICAOCountryCode ;
    },
    // 提交新增与修改
    confirm() {
      var that = this;
      if (!(this.disabled == false)) {
        //修改----------------------------------------------
        var obj = {
          CountryCode: that.CountryCode,
          CountryEnName: that.CountryEnName,
          Directory : that.Directory ,
          CountryName: that.CountryName,
          ICAOCountryCode : that.ICAOCountryCode ,
          Remark: that.Remark,
          ID: that.insertId
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/AirCountry/UpdateAirCountryInfo", {
            params: {
              updateCountryInfo: obj
            }
          })
          .then(function(response) {
            if (response.data.Errcode == 0) {
              that.messagetips("修改成功", "success");
              that.getData();
            } else {
              that.messagetips(response.data.Message, "warning");
            }
          })
          .catch(function(error) {
            that.messagetips("网络异常，请稍后重试", "warning");
          });
      } else {
        // 新增-----------------------------------------------
        var obj = {
          CountryCode: that.CountryCode,
          CountryEnName: that.CountryEnName,
          Directory : that.Directory ,
          CountryName: that.CountryName,
          Remark: that.Remark,
          ICAOCountryCode : that.ICAOCountryCode
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/AirCountry/AddAirCountryInfo", {
            params: {
              addCountryInfo: obj
            }
          })
          .then(function(response) {
            if (response.data.Errcode == 0) {
              that.messagetips("新增成功", "success");
              that.getData();
            } else {
              that.messagetips(response.data.Message, "warning");
            }
          })
          .catch(function(error) {
            that.messagetips("网络异常，请稍后重试", "warning");
          });
      }
    },
    // 删除数据
    del() {
      var that = this;
      var delData = this.multipleSelection.map(item => {
        return item.ID;
      });
      console.log(delData);
      if (!(delData == false)) {
        axios
          .get("/api/AirCountry/DeleteAirCountry", {
            params: {
              info: delData + ""
            }
          })
          .then(function(response) {
            if (response.data.Errcode == 0) {
              that.messagetips("删除成功", "success");
              that.getData();
            } else {
              that.messagetips(response.data.Message, "warning");
            }
          })
          .catch(function(error) {
            that.messagetips("网络异常，请稍后重试", "warning");
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
      this.loading = true;
      axios
        .get("/api/AirCountry/GetAirCountryList", {
          params: {
            page: that.page,
            pagesize: that.pagesize,
            countryname: that.name,
            countrycode: that.code
          }
        })
        .then(function(response) {
          console.log(response);
          var data = response.data.Data.list;
          data = data.map(item => {
            var time = new Date(parseInt(item.LastUpdateTimeStamp));
            var timeTrans = that.dateToString(time);
            item.LastUpdateTimeStamp = timeTrans;
            return item;
          });
          that.tableData3 = data;
          that.total = response.data.Data.total;
          that.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 查询
    query() {
      this.getData();
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss">
.zl-countryManage {
  .el-dialog__body .el-input--suffix .el-input__inner {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  display: flex;
  flex-direction: column;

  .el-button {
    width: 60px;
    height: 26px;
    padding: 0;
  }

  .header {
    font-size: 14px;

    .el-input {
      display: inline-block;
      width: auto;
    }
    select {
      width: 110px;
      height: 22px;
      border: 1px solid #ccc;
      border-radius: 2px;
    }

    input {
      width: 110px;
      height: 15px;
      border: 1px solid #ccc;
      border-radius: 2px;
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
