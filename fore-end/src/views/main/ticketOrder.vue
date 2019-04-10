<template>
  <div style="height: 100%" class="zl-order" v-loading="loading">
    <div class="header">
      联系人:
      <input type="text" v-model="contacts">
      &nbsp;电话:
      <input type="text" v-model="mobile">
      &nbsp;
      支付渠道:
      <el-select v-model="channelID" placeholder="请选择">
        <el-option
          v-for="item in channelIDOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>&nbsp;
      支付类型:
      <el-select v-model="payType" placeholder="请选择">
        <el-option
          v-for="item in payTypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>&nbsp;
      支付状态:
      <el-select v-model="payStatus" placeholder="请选择">
        <el-option
          v-for="item in payStatusOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>&nbsp;
      <el-button type="primary" @click="query">查询</el-button>
      <!-- <el-button type="success" @click="insert">新增</el-button> -->
      <!-- <el-button type="danger" @click="del">删除</el-button> -->
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
        <el-table-column width="70" show-overflow-tooltip label="渠道" prop="CID"></el-table-column>
        <el-table-column prop="OrderNo" label="订单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OtherOrderID" label="第三方订单" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" prop="Paytype" label="支付类型" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" prop="Paystatus" label="支付状态" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" prop="TotalPrice" label="总金额" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" prop="ActualPrice" label="实际价格" show-overflow-tooltip></el-table-column>
        <el-table-column width="70" prop="Tax" label="税收" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Name" label="联系人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Mobile" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" prop="PassengerCount" label="乘机人数" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" prop="Remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Addtime" label="下单时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="130">
          <template slot-scope="scope">
            <div class="operation" @click="fixData(scope.row)">修改</div>&nbsp;
            <div class="operation" @click="showDetail(scope.row)">查看详情</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      订单ID
      <el-input placeholder="订单ID" v-model="id" clearable :disabled="disabled"></el-input>
      支付类型
      <br>
      <el-select v-model="paytype" placeholder="请选择">
        <el-option
          v-for="item in paytypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br>
      支付状态
      <br>
      <el-select v-model="paystatus" placeholder="请选择">
        <el-option
          v-for="item in paystatusOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br>
      支付成功的code
      <el-input placeholder="请输入支付成功的code" v-model="paycode " clearable v-show="paystatus == 1"></el-input>
      备注
      <el-input placeholder="备注" v-model="remark" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false; confirm()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="订单详情" :visible.sync="detailSwitch">
      <div style="font-size:16px;color: #000;margin: 5px 0">行程</div>
      <el-table :data="trip">
        <el-table-column property="Carrier" label="航司" width="50"></el-table-column>
        <el-table-column property="DepAirport" label="出发地" width="80"></el-table-column>
        <el-table-column property="ArrAirport" label="目的地" width="80"></el-table-column>
        <el-table-column property="DepTime" label="出发时间"></el-table-column>
        <el-table-column property="ArrTime" label="到达时间"></el-table-column>
        <el-table-column property="Cabin" label="舱位" width="60"></el-table-column>
        <el-table-column property="FlightNumber" label="飞机编号"></el-table-column>
      </el-table>
      <div style="font-size:16px;color: #000;margin: 5px 0">乘机人</div>
      <el-table :data="passenger">
        <el-table-column property="Name" label="名字"></el-table-column>
        <el-table-column property="AgeType" label="类型"
        width="50"></el-table-column>
        <el-table-column width="50" property="Gender" label="性别"></el-table-column>
        <el-table-column property="Birthday" label="生日"></el-table-column>
        <el-table-column property="CardNum" label="证件号"></el-table-column>
        <el-table-column property="CardType" label="证件类型"  width="80"></el-table-column>
        <el-table-column property="CardIssuePlace" label="证件发行国家"></el-table-column>
        <el-table-column property="CardExpired" label="证件有效时间"></el-table-column>
        <el-table-column property="Nationality" label="国籍"  width="50"></el-table-column>
        <el-table-column property="FFPCardNo" label="常旅客NO"></el-table-column>
        <el-table-column property="FFPCarrier" label="常旅客卡航司"></el-table-column>
      </el-table>
      <div style="font-size:16px;color: #000;margin: 5px 0">行李信息</div>
      <el-table :data="luggage">
        <el-table-column property="Name" label="姓名"></el-table-column>
        <el-table-column property="Flight" label="航班"></el-table-column>
        <el-table-column property="FromAirport" label="出发地"></el-table-column>
        <el-table-column property="ToAirport" label="到达地"></el-table-column>
        <el-table-column property="Weight" label="weight"></el-table-column>
        <el-table-column property="BookSalePrice" label="bookSalePrice"></el-table-column>
        <el-table-column property="TicketSalePrice" label="ticketSalePrice"></el-table-column>
        <el-table-column property="RefundFee" label="RefundFee"></el-table-column>
      </el-table>
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
      channelID: 0,
      dateflag: "",
      contacts: "",
      mobile: "",
      payType: -100,
      payStatus: -100,

      detailSwitch: false,
      trip: [],
      passenger: [],
      luggage: [],

      payTypeOption: [
        {
          value: -100,
          label: "全部"
        },
        {
          value: 0,
          label: "其它"
        },
        {
          value: 1,
          label: "微信"
        },
        {
          value: 2,
          label: "支付宝"
        }
      ],
      channelIDOption: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "携程"
        },
        {
          value: 2,
          label: "去哪儿"
        }
      ],
      payStatusOption: [
        {
          value: -100,
          label: "全部"
        },
        {
          value: 0,
          label: "待支付"
        },
        {
          value: 1,
          label: "支付成功"
        },
        {
          value: -1,
          label: "支付失败"
        }
      ],

      paytypeOption: [
        {
          value: 0,
          label: "其它"
        },
        {
          value: 1,
          label: "微信"
        },
        {
          value: 2,
          label: "支付宝"
        }
      ],

      paystatusOption: [
        {
          value: 0,
          label: "待支付"
        },
        {
          value: 1,
          label: "支付成功"
        },
        {
          value: -1,
          label: "支付失败"
        }
      ],

      id: "",
      paytype: 1,
      paystatus: -1,
      paycode: "",
      remark: ""
    };
  },

  methods: {
    // 展示详细信息
    showDetail(row) {
      var that = this;
      this.detailSwitch = true;
      axios
        .get("/api/PlaneTicketOrder/GetTicketOrderDetail", {
          params: {
            id: row.ID
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.data.Errcode == 0) {
            var data = response.data.Data;
            that.luggage = data.luggage;
            that.trip = data.trip;
            that.passenger = data.passenger.map(function(item) {
              item.Gender = item.Gender == 'M' ? '男' : '女';
              item.AgeType = item.AgeType == '0' ? '成人' : item.AgeType == '1' ? '儿童' : '婴儿';
              return item
            });
          }
        })
        .catch(function(error) {
          console.log(error);
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
    // 修改数据
    fixData(row) {
      this.disabled = true;
      this.title = "修改数据";
      this.dialogVisible = true;
      this.id = row.ID;
      this.paytype = row.Paytype == "其它" ? 0 : row.Paytype == "微信" ? 1 : 2;
      this.paystatus =
        row.Paystatus == "支付成功" ? 1 : row.Paystatus == "支付失败" ? -1 : 0;
      this.paycode = row.Paycode;
      this.remark = row.Remark;
    },
    // 提交新增与修改
    confirm() {
      var that = this;
      if (!(this.disabled == false)) {
        //修改----------------------------------------------
        if (that.paycode == "" && that.paystatus == 1) {
          that.dialogVisible = true;
          that.messagetips("请输入成功的code", "warning");
          return;
        }
        var obj = {
          id: that.id,
          paytype: that.paytype,
          paystatus: that.paystatus,
          paycode: that.paycode,
          remark: that.remark
        };
        var arr = [];
        arr.push(obj);
        axios
          .get("/api/PlaneTicketOrder/DealTicketOrderInfo", {
            params: obj
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
        .get("/api/PlaneTicketOrder/GetTicketOrder", {
          params: {
            page: that.page,
            pagesize: that.pagesize,
            page: that.page,
            pagesize: that.pagesize,
            channelID: that.channelID,
            dateflag: that.dateflag,
            contacts: that.contacts,
            mobile: that.mobile,
            payType: that.payType,
            payStatus: that.payStatus
          }
        })
        .then(function(response) {
          if (response.data.Errcode == 0) {
            var data = response.data.Data.list;
            data = data.map(function(item) {
              item.Addtime = item.Addtime.split("T").join(" ");
              item.CID =
                item.CID == "7B139F27460F4D689234241EB4193586"
                  ? "携程"
                  : item.CID == "5E177EDB5F484565B533"
                  ? "去哪儿"
                  : "其它";
              item.Paystatus =
                item.Paystatus == 0
                  ? "待支付"
                  : item.Paystatus == 1
                  ? "支付成功"
                  : "支付失败";
              item.Paytype =
                item.Paytype == 0
                  ? "其它"
                  : item.Paytype == 1
                  ? "微信"
                  : "支付宝";
              if (!(item.Paystatus == "支付成功")) {
                item.Paytype = "";
              }
              return item;
            });
            console.log(data);
            that.tableData3 = data;
            that.total = response.data.Data.total;
            that.loading = false;
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
.zl-order {
  .el-dialog {
    width: 70%
  }
  .operation {
    display: inline-block;
    color: #409eff;
    cursor: pointer;
    font-size: 15px;
    text-align: center;
  }
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
    .el-input__suffix-inner {
      display: inline-block;
      margin-top: -2px;
    }
    .el-input__icon {
      line-height: 10px;
    }
    .el-input__inner {
      height: 22px !important;
      margin-top: -1px;
    }
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
