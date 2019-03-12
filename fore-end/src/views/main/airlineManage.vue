<template>
  <div style="height: 100%" class="zl-airlineManage" v-loading="loading">
    <div class="header">
      航司:
      <input type="text" v-model="cnname">
      &nbsp;出发城市:
      <input type="text" v-model="scity">
      &nbsp;目标城市:
      <input type="text" v-model="ecity">
      &nbsp;是否可用:
      <select name id v-model="value">
        <option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
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
        <el-table-column prop="CNName" label="航司名称" width="auto"></el-table-column>
        <el-table-column prop="SGNAPCityName" label="出发城市"></el-table-column>
        <el-table-column prop="HANAPCityName" label="目标城市" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SGNAPName" label="出发机场" show-overflow-tooltip></el-table-column>
        <el-table-column prop="HANAPName" label="目标机场" show-overflow-tooltip></el-table-column>
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
      <el-select v-model="CNName" filterable placeholder="请选择航司">
        <el-option v-for="item in selectCNName" :key="item.ID" :label="item.CNName" :value="item.ID"></el-option>
      </el-select>
      <br>
      <el-select
        v-model="SGNAPCityName"
        filterable
        remote
        reserve-keyword
        placeholder="请搜索出发城市"
        :remote-method="remoteMethod"
        :loading="loading1"
      >
        <el-option
          v-for="item in selectCity"
          :key="item.CityCode"
          :label="item.AllName"
          :value="item.CityCode"
        ></el-option>
      </el-select>
      <br>
      <el-select
        v-model="HANAPCityName"
        filterable
        remote
        reserve-keyword
        placeholder="请搜索目标城市"
        :remote-method="remoteMethod"
        :loading="loading1"
      >
        <el-option
          v-for="item in selectCity"
          :key="item.CityCode"
          :label="item.AllName"
          :value="item.CityCode"
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
import axios from "axios";
export default {
  name: "airlineManage",
  data() {
    return {
      loading1: false,
      selectCity: '',
      HANAPCityName: "",
      SGNAPCityName: "",
      CNName: "",
      selectCNName: "",
      cnname: "",
      options: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 1,
          label: "是"
        },
        {
          value: 0,
          label: "否"
        }
      ],
      value: -1,

      loading: false,
      disabled: false,
      title: "新增数据",

      tableData3: [],
      multipleSelection: [],
      dialogVisible: false,

      page: 1,
      pagesize: 10,
      total: 1,

      scity: "",
      ecity: "",
      SGNAPCityName: "",
      HANAPCityName: "",
      Remark: ""
    };
  },

  methods: {
    // 获取城市
    remoteMethod(query) {
      this.loading1 = true;
      var that = this;
      console.log(query);
      axios
        .get("/api/AirLine/GetAirportsData", {
          params: {
            str: query
          }
        })
        .then(function(response) {
          if (response.data.Errcode == 0) {
            console.log(response.data.Data);
            that.selectCity = response.data.Data.list;
             that.loading1 = false;
          } else {
             that.messagetips(response.data.Message, "warning");
          }
        })
        .catch(function(error) {
        });
    },
    // 航司的下拉信息
    GetAirWebsiteData() {
      var that = this;
      axios
        .get("/api/AirLine/GetAirWebsiteData?str1=", {})
        .then(function(response) {
          if (response.data.Errcode == 0) {
            that.selectCNName = response.data.Data.list;
          } else {
            that.messagetips(response.data.Message, "warning");
          }
        })
        .catch(function(error) {
          that.messagetips("网络异常，请稍后重试", "warning");
        });
    },
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
      this.GetAirWebsiteData();
      this.disabled = false;
      this.title = "新增数据";
      this.dialogVisible = true;
      this.AirlineCode = "";
      this.SGNAPCityName = "";
      this.HANAPCityName = "";
      this.Remark = "";
      this.CNName = '';
    },
    // 修改数据
    fixData(row) {
      this.GetAirWebsiteData();
      this.disabled = true;
      this.title = "修改数据";
      this.dialogVisible = true;
      this.CNName = parseInt(row.AirWebID);
      this.SGNAPCityName = row.DCity;
      this.HANAPCityName = row.ACity;
      this.remoteMethod(this.SGNAPCityName);
      this.remoteMethod(this.HANAPCityName);
      this.Remark = row.Remark;
      this.ID = row.ID;
    },
    // 提交新增与修改
    confirm() {
      if(this.SGNAPCityName ==this.HANAPCityName){
        this.messagetips("出发地点和目标地点不能相同", "warning");
        this.dialogVisible = true;
        return;
      }
      var that = this;
      if (!(this.disabled == false)) {
        //修改----------------------------------------------
        var obj = {
          DCity: that.SGNAPCityName,
          ACity: that.HANAPCityName,
          Remark: that.Remark,
          ID: that.ID,
          AirWebID: that.CNName
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/AirLine/UpdateAirportsInfo", {
            params: {
              updateALInfo: obj
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
          DCity: that.SGNAPCityName,
          ACity: that.HANAPCityName,
          Remark: that.Remark,
          AirWebID: that.CNName
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/AirLine/AddAirlinesInfo", {
            params: {
              addALInfo: obj
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
          .get("/api/AirLine/DeleteAirlines", {
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
        .get("/api/AirLine/GetAirLineList", {
          params: {
            page: that.page,
            pagesize: that.pagesize,
            cnname: that.cnname,
            scity: that.scity,
            ecity: that.ecity,
            isvalid: that.value
          }
        })
        .then(function(response) {
          console.log(response);
          var data = response.data.Data.list;
          data = data.map(item => {
            var time = new Date(parseInt(item.LastUpdateTimeStamp));
            var timeTrans = that.dateToString(time);
            item.LastUpdateTimeStamp = timeTrans;
            item.IsValid = item.IsValid == 1 ? "是" : "否";
            item.HvFlight = item.HvFlight == true ? "是" : "否";
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
.zl-airlineManage {
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
