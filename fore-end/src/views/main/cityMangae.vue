<template>
  <div style="height: 100%" class="zl-cityManage" v-loading="loading">
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
        <el-table-column label="编码" prop="CityCode"></el-table-column>
        <el-table-column prop="CityName" label="中文名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CityEnName" label="英文名称"></el-table-column>
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
      编码
      <el-input placeholder="请输入编码" v-model="CityCode" clearable :disabled="disabled"></el-input>城市名称
      <el-input placeholder="请输入城市名称" v-model="CityName" clearable></el-input>英文名称
      <el-input placeholder="请输入英文名称" v-model="CityEnName" clearable></el-input>省份ID
      <el-input placeholder="请输入省份ID" v-model="ProvinceID" clearable></el-input>国家ID
      <el-input placeholder="请输入国家" v-model="CountryID" clearable></el-input>备注
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
import axios from "../../static/axios.js";

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

      CityCode: "",
      CityEnName: "",
      ProvinceID: "",
      CityName: "",
      CountryID: "",
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
      this.CityCode = "";
      this.CityEnName = "";
      this.ProvinceID = "";
      this.CityName = "";
      this.Remark = "";
      this.CountryID = "";
    },
    // 修改数据
    fixData(row) {
      this.disabled = true;
      this.title = "修改数据";
      this.dialogVisible = true;
      this.insertId = row.ID;
      this.CityCode = row.CityCode;
      this.CityEnName = row.CityEnName;
      this.ProvinceID = row.ProvinceID;
      this.CityName = row.CityName;
      this.Remark = row.Remark;
      this.CountryID = row.CountryID;
    },
    // 提交新增与修改
    confirm() {
      var that = this;
      if (!(this.insertId == false)) {
        //修改----------------------------------------------
        var obj = {
          CityCode: that.CityCode,
          CityEnName: that.CityEnName,
          ProvinceID: that.ProvinceID,
          CityName: that.CityName,
          CountryID: that.CountryID,
          Remark: that.Remark,
          ID: that.insertId
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/AirCity/UpdateAirCityInfo", {
            params: {
              updateCityInfo: obj
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
          CityCode: that.CityCode,
          CityEnName: that.CityEnName,
          ProvinceID: that.ProvinceID,
          CityName: that.CityName,
          Remark: that.Remark,
          CountryID: that.CountryID
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/AirCity/AddAirCityInfo", {
            params: {
              addCityInfo: obj
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
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (!(delData == false)) {
            axios
              .get("/api/AirCity/DeleteAirports", {
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
        })
        .catch(() => {
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
      var that = this;
      this.loading = true;
      axios
        .get("/api/AirCity/GetAirCityList", {
          params: {
            page: that.page,
            pagesize: that.pagesize,
            cityname: that.name,
            citycode: that.code
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
.zl-cityManage {
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
