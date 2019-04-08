<template>
  <div style="height: 100%" class="zl-airportManage" v-loading="loading">
    <div class="header">
      机场中文名称:
      <input type="text" v-model="name">
      &nbsp;机场编码:
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
        <el-table-column label="编码" prop="APCode"></el-table-column>
        <el-table-column prop="APName" label="机场名称"></el-table-column>
        <el-table-column prop="APNameShortest" label="中文简称"></el-table-column>
        <el-table-column prop="APEnName" label="英文名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="APNameShortest" label="英文简称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="IsValid" label="是否可用" show-overflow-tooltip></el-table-column>
        <el-table-column prop="HvFlight" label="是否国际" show-overflow-tooltip></el-table-column>
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
      <el-input placeholder="请输入编码" v-model="APCode" clearable :disabled="disabled"></el-input>
      <el-input placeholder="请输入航司名称" v-model="APName" clearable></el-input>
      <el-input placeholder="请输入中文简称" v-model="APNameShort" clearable></el-input>
      <el-input placeholder="请输入英文名称" v-model="APEnName" clearable></el-input>
      <el-input placeholder="请输入英文简称" v-model="APEnNameShort" clearable></el-input>
      <el-select v-model="IsValid" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="HvFlight" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input placeholder="备注" v-model="Remark" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false; confirm()">确 定</el-button>
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
import axios from "../../static/axios.js";

export default {
  name: "airportManage",
  data() {
    return {
      title: "",
      disabled: false,
      loading: false,
      name: "",
      code: "",
      tableData3: [],
      multipleSelection: [],
      dialogVisible: false,
      page: 1,
      pagesize: 10,
      total: 1,
      APCode: "",
      APName: "",
      APNameShort: "",
      APEnName: "",
      APEnNameShort: "",
      IsValid: "",
      HvFlight: "",
      Remark: "",
      options: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ]
    };
  },

  methods: {
    // 新增数据-----------------------
    insert() {
      this.title = "新增数据";
      this.dialogVisible = true;
      this.disabled = false;
      this.APCode = "";
      this.APName = "";
      this.APNameShort = "";
      this.APEnName = "";
      this.Remark = "";
      this.APEnNameShort = "";
      this.IsValid = "";
      this.HvFlight = "";
    },
    // 修改数据
    fixData(row) {
      this.title = "修改数据";
      this.disabled = true;
      this.dialogVisible = true;
      this.APCode = row.APCode;
      this.APName = row.APName;
      this.APNameShort = row.APNameShort;
      this.APEnName = row.APEnName;
      this.Remark = row.Remark;
      this.APEnNameShort = row.APEnNameShort;
      this.IsValid = row.IsValid;
      this.HvFlight = row.HvFlight;
    },
    // 提交新增与修改
    confirm() {
      var that = this;
      if (!(this.disabled == false)) {
        //修改----------------------------------------------
        var obj = {
          APCode: that.APCode,
          APName: that.APName,
          APNameShort: that.APNameShort,
          APEnName: that.APEnName,
          APEnNameShort: that.APEnNameShort,
          Remark: that.Remark,
          IsValid: that.IsValid == "是" ? 1 : 0,
          HvFlight: that.HvFlight == "是" ? 1 : 0
        };
        axios
          .get("/api/airports/UpdateAirportsInfo", {
            params: {
              updateAPInfo: obj
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
          APCode: that.APCode,
          APName: that.APName,
          APNameShort: that.APNameShort,
          APEnName: that.APEnName,
          Remark: that.Remark,
          APEnNameShort: that.APEnNameShort,
          sValid: that.IsValid == "是" ? 1 : 0,
          HvFlight: that.HvFlight == "是" ? 1 : 0
        };
        axios
          .get("/api/airports/AddAirportsInfo", {
            params: {
              addAPInfo: obj
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
    messagetips(message, type) {
      this.$message({
        duration: 1000,
        message: message,
        type: type
      });
    },
    // 删除数据
    del() {
      var that = this;
      var delData = this.multipleSelection.map(item => {
        return item.APCode;
      });
      console.log(delData);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           if (!(delData == false)) {
        axios
          .get("/api/airports/DeleteAirports", {
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
        }).catch(() => {
          that.messagetips("取消删除", "info");
        });

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
      this.loading = true;
      var that = this;
      axios
        .get("/api/Airports/GetAirportsList", {
          params: {
            page: that.page,
            pagesize: that.pagesize,
            apname: that.name,
            apcode: that.code
          }
        })
        .then(function(response) {
          console.log(response);
          var data = response.data.Data.list;
          data = data.map(item => {
            var time = new Date(parseInt(item.LastUpdateTimeStamp));
            var timeTrans = that.dateToString(time);
            item.LastUpdateTimeStamp = timeTrans;
            var IsValid = item.IsValid ? "是" : "否";
            item.IsValid = IsValid;
            var HvFlight = item.HvFlight ? "是" : "否";
            item.HvFlight = HvFlight;
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
.zl-airportManage {
  display: flex;
  flex-direction: column;

  .el-dialog__body .el-input--suffix .el-input__inner {
    margin-top: 10px;
    margin-bottom: 10px;
  }

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
