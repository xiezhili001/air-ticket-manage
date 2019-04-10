<template>
  <div style="height: 100%" class="zl-countryManage" v-loading="loading">
    <div class="header">
      配置key:
      <input type="text" v-model="configkey">
      &nbsp;
      <el-button type="primary" @click="query">查询</el-button>
      <el-button type="success" @click="insert">新增</el-button>
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
        <el-table-column label="配置key" prop="ConfigKey"></el-table-column>
        <el-table-column prop="MarkupType" label="当前加价类型"></el-table-column>
        <el-table-column prop="OrdinaryMarkup" label="普通加价额度" show-overflow-tooltip></el-table-column>
        <el-table-column prop="MarkupPercentage" label="加价百分比"></el-table-column>
        <el-table-column prop="ParityDownRegulation" label="比价下调额度"></el-table-column>
        <el-table-column prop="OnlyTicketPercentage" label="唯一票价百分比"></el-table-column>
        <el-table-column prop="LastUpdateAdmin" label="更新者" show-overflow-tooltip></el-table-column>
        <el-table-column prop="LastUpdateTime" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer;font-size:15px" @click="fixData(scope.row)">修改</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      配置key
      <el-input placeholder="请输入配置key" v-model="ConfigKey" clearable :disabled="disabled"></el-input>加价类型
      <br>
      <el-select v-model="MarkupType" placeholder="请选择">
        <el-option
          v-for="item in MarkupTypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br>
      <div v-show="MarkupType==0">
        普通加价额度
        <el-input placeholder="请输入普通加价额度" v-model="OrdinaryMarkup" clearable></el-input>
      </div>
      <div v-show="MarkupType==1">
        加价百分比
        <el-input placeholder="请输入加价百分比" v-model="MarkupPercentage" clearable></el-input>
      </div>比价下调额度
      <el-input placeholder="请输入比价下调额度" v-model="ParityDownRegulation" clearable></el-input>唯一票加价百分比
      <el-input placeholder="请输入唯一票加价百分比" v-model="OnlyTicketPercentage" clearable></el-input>备注
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
      configkey: "",
      tableData3: [],
      multipleSelection: [],
      dialogVisible: false,

      MarkupTypeOption: [
        {
          value: 0,
          label: "普通加价额度"
        },
        {
          value: 1,
          label: "加价百分比"
        }
      ],

      page: 1,
      pagesize: 10,
      total: 1,

      ConfigKey: "",
      MarkupType: 0,
      OrdinaryMarkup: "",
      MarkupPercentage: "",
      ParityDownRegulation: "",
      Remark: "",
      OnlyTicketPercentage: 0,
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
      this.ConfigKey = "";
      this.MarkupType = 0;
      this.OrdinaryMarkup = "";
      this.MarkupPercentage = "";
      this.Remark = "";
      this.ParityDownRegulation = "";
      this.OnlyTicketPercentage = "";
    },
    // 修改数据
    fixData(row) {
      this.disabled = true;
      this.title = "修改数据";
      this.dialogVisible = true;
      this.insertId = row.ID;
      this.ConfigKey = row.ConfigKey;
      this.MarkupType = row.MarkupType;
      this.OrdinaryMarkup = row.OrdinaryMarkup;
      this.MarkupPercentage = row.MarkupPercentage;
      this.Remark = row.Remark;
      this.ParityDownRegulation = row.ParityDownRegulation;
      this.OnlyTicketPercentage = row.OnlyTicketPercentage;
    },
    // 提交新增与修改
    confirm() {
      var that = this;
      if (
        isNaN(that.OnlyTicketPercentage) ||
        isNaN(that.ParityDownRegulation)
      ) {
        that.dialogVisible = true;
        that.messagetips("请输入正确的数字", "warning");
        return;
      }
      if (!(this.disabled == false)) {
        //修改----------------------------------------------

        var obj = {
          ConfigKey: that.ConfigKey,
          MarkupType: that.MarkupType,
          OrdinaryMarkup: that.OrdinaryMarkup == "" ? 0 : that.OrdinaryMarkup,
          MarkupPercentage:
            that.MarkupPercentage == "" ? 0 : that.MarkupPercentage,
          ParityDownRegulation:
            that.ParityDownRegulation == "" ? 0 : that.ParityDownRegulation,
          Remark: that.Remark,
          ID: that.insertId,
          OnlyTicketPercentage:
            that.OnlyTicketPercentage == "" ? 0 : that.OnlyTicketPercentage
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/PTPConfig/UpdatePTPConfig", {
            params: {
              configinfo: obj
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
          ConfigKey: that.ConfigKey,
          MarkupType: that.MarkupType,
          OrdinaryMarkup: that.OrdinaryMarkup == "" ? 0 : that.OrdinaryMarkup,
          MarkupPercentage:
            that.MarkupPercentage == "" ? 0 : that.MarkupPercentage,
          ParityDownRegulation:
            that.ParityDownRegulation == "" ? 0 : that.ParityDownRegulation,
          Remark: that.Remark,
          OnlyTicketPercentage:
            that.OnlyTicketPercentage == "" ? 0 : that.OnlyTicketPercentage
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/PTPConfig/UpdatePTPConfig", {
            params: {
              configinfo: obj
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
    // del() {
    //   var that = this;
    //   var delData = this.multipleSelection.map(item => {
    //     return item.ID;
    //   });
    //   console.log(delData);
    //   this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       if (!(delData == false)) {
    //         axios
    //           .get("/api/PTPConfig/DeletePTPConfig", {
    //             params: {
    //               info: delData + ""
    //             }
    //           })
    //           .then(function(response) {
    //             if (response.data.Errcode == 0) {
    //               that.messagetips("删除成功", "success");
    //               that.getData();
    //             } else {
    //               that.messagetips(response.data.Message, "warning");
    //             }
    //           })
    //           .catch(function(error) {
    //             that.messagetips("网络异常，请稍后重试", "warning");
    //           });
    //       }
    //     })
    //     .catch(() => {
    //       that.messagetips("取消删除", "info");
    //     });
    // },
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
        .get("/api/PTPConfig/GetPTPConfigList", {
          params: {
            page: that.page,
            pagesize: that.pagesize,
            configkey: that.configkey
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.data.Errcode == 0) {
            that.loading = false;
            if (response.data.Data) {
              var data = response.data.Data.list;
              that.tableData3 = data.map(function(item) {
                item.LastUpdateTime = item.LastUpdateTime.split("T")[0];
                item.MarkupType = item.MarkupType == 0 ? '普通加价额度' : '加价百分比'
                return item;
              });
              that.total = response.data.Data.total;
            }else {
              that.tableData3 = [];
            }
          }
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
