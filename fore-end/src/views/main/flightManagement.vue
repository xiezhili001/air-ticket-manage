<template>
  <div style="height: 100%" class="zl-order" v-loading="loading">
    <div class="header">
      航司编码:
      <el-select v-model="carriercode" filterable placeholder="选择航司">
        <el-option
          v-for="item in selectCNName"
          :key="item.ID"
          :label="item.CNName"
          :value="item.AirlineCode"
        ></el-option>
      </el-select>
      <!-- <input type="text" v-model=""> -->
      出发城市:
      <input type="text" v-model="dcity">
      目的城市
      <input type="text" v-model="acity">
      出发时间:
      <input type="text" v-model="flydate">
      &nbsp;
      网站ID:
      <input type="text" v-model="websiteid">
      航班状态:
      <el-select v-model="status" placeholder="请选择">
        <el-option
          v-for="item in statusOption"
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
        @row-click="showDetail"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="85" prop="CarrierCode" label="航司code" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" show-overflow-tooltip label="出发机场" prop="DepartureStation"></el-table-column>
        <el-table-column width="80" prop="ArrivalStation" label="目的机场" show-overflow-tooltip></el-table-column>
        <el-table-column width="165" prop="STD" label="出发时间" show-overflow-tooltip></el-table-column>
        <el-table-column width="165" prop="STA" label="到达时间" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" prop="FlightNumber" label="飞机编号" show-overflow-tooltip></el-table-column>
        <el-table-column width="80" prop="EquipmentType" label="飞机型号" show-overflow-tooltip></el-table-column>
        <el-table-column width="90" prop="EquipmentTypeSuffix" label="飞机尾编号" show-overflow-tooltip></el-table-column>
        <el-table-column width="60" prop="Status" label="状态" show-overflow-tooltip></el-table-column>
        <el-table-column width="165" prop="LastUpdateTime" label="最后更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" prop="IsTransfExRate" label="是否成功转换汇率" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="130">
          <template slot-scope="scope">
            <!-- <div
              class="operation"
              @click="fixData(scope.row)"
            >{{scope.row.status == '待支付' ? '修改' : '查看'}}</div>&nbsp;-->
            <div class="operation" @click="showDetail(scope.row)">查看详情</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!-- 订单ID
      <el-input placeholder="订单号" v-model="OrderNo" clearable :disabled="disabled"></el-input>
      支付类型
      <br>
      <el-select v-model="websiteid" placeholder="请选择">
        <el-option
          v-for="item in websiteidOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br>
      支付状态
      <br>
      <el-select v-model="status" placeholder="请选择">
        <el-option
          v-for="item in statusOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br>
      支付成功的code
      <el-input placeholder="请输入支付成功的code" v-model="paycode " clearable v-show="status == 1"></el-input>
      备注
      <el-input placeholder="备注" v-model="remark" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-show="confirmSwitch"  @click="dialogVisible = false; confirm()">确 定</el-button>
      </span>-->
    </el-dialog>

    <el-dialog title="订单详情" :visible.sync="detailSwitch">
      <div style="font-size:16px;color: #000;margin: 5px 0">航班基本信息</div>
      <el-table :data="PTFInfo">
        <el-table-column property="PTFID" label="航班ID" width="78"></el-table-column>
        <el-table-column property="DepartureStation" label="出发机场" width="80"></el-table-column>
        <el-table-column property="DepartureAddress" label="出发地址" width="80"></el-table-column>
        <el-table-column property="ArrivalStation" label="目的机场" width="80"></el-table-column>
        <el-table-column property="ArrivalAddress" label="目的地址" width="80"></el-table-column>
        <el-table-column width="165" property="STD" label="出发时间"></el-table-column>
        <el-table-column property="STA" label="到达时间" width="165"></el-table-column>
        <el-table-column property="HasFlatBed" label="是否可以平躺"></el-table-column>
        <el-table-column property="IsTransit" label="是否需要转机"></el-table-column>
        <el-table-column property="SubjectToGovtApproval" label="是否需要政府审批"></el-table-column>
        <el-table-column property="TotalDurationMinute" label="工期飞行时长"></el-table-column>
        <el-table-column property="TransitStationList" label="转机中转站"></el-table-column>
        <el-table-column property="CarrierCode" label="航司code"></el-table-column>
        <el-table-column property="FlightNumber" label="飞机编号"></el-table-column>
        <el-table-column property="EquipmentType" label="飞机型号"></el-table-column>
        <el-table-column property="EquipmentTypeSuffix" label="飞机尾编号"></el-table-column>
        <el-table-column property="Status" label="状态"></el-table-column>
        <el-table-column property="LastUpdateTime" width="190" label="最后更新时间"></el-table-column>
        <el-table-column property="IsTransfExRate" label="是否成功转换汇率"></el-table-column>
      </el-table>
      <div style="font-size:16px;color: #000;margin: 5px 0">航班的舱位信息--集合（经济舱，商务舱）</div>
      <el-table :data="seatList">
        <el-table-column width="100" property="FareType" label="票类型"></el-table-column>
        <el-table-column width="80" property="FareClassOfServic" label="票价服务"></el-table-column>
        <el-table-column property="FareDiscountCode" label="票价售出优惠Code" width="150"></el-table-column>
        <el-table-column width="150" property="FareSellKey" label="票价售出Key"></el-table-column>
        <el-table-column width="170" property="PaxDiscountCode" label="生PaxDiscountCode日"></el-table-column>
        <el-table-column property="ProductClass" label="产品类型"></el-table-column>
        <el-table-column property="FarePriceNoTransf" label="机票价格（转汇率）" width="150"></el-table-column>
        <el-table-column property="FarePrice" label="机票价格"></el-table-column>
        <el-table-column width="150" property="TaxNoTransf" label="税收（转换汇率前）"></el-table-column>
        <el-table-column property="Tax" label="税收" width="80"></el-table-column>
        <el-table-column property="TotalPrice" label="总价格"></el-table-column>
        <el-table-column width="100" property="CurrencyCode" label="货币Code"></el-table-column>
        <el-table-column width="100" property="AvailableCount" label="当前剩余票数"></el-table-column>
        <el-table-column width="100" property="Status" label="是否可用"></el-table-column>
        <el-table-column width="190" property="LastUpdateTime" label="最后更新时间"></el-table-column>
        <el-table-column width="100" property="NowExchangeRate" label="当前汇率"></el-table-column>
        <el-table-column width="100" property="MarkupPrice" label="加价价格"></el-table-column>
        <el-table-column width="100" property="IsTransfExRate" label="是否成功转换汇率"></el-table-column>
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
      selectCNName: [],
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
      carriercode: "",
      dcity: "",
      acity: "",
      flydate: "",
      websiteid: "",
      status: -100,

      detailSwitch: false,
      PTFInfo: [],
      seatList: [],

      statusOption: [
        {
          value: -100,
          label: "全部"
        },
        {
          value: 0,
          label: "可用"
        },
        {
          value: 1,
          label: "售完"
        },
        {
          value: -1,
          label: "不可用"
        }
      ],

      id: "",
      OrderNo: "",
      paycode: "",
      confirmSwitch: false
    };
  },

  methods: {
    // 航司的下拉信息
    GetAirWebsiteData() {
      console.log(1);
      var that = this;
      axios
        .get("/api/AirLine/GetAirWebsiteData?str1=", {
          params: {}
        })
        .then(function(response) {
          console.log(response);
          if (response.data.Errcode == 0) {
            that.selectCNName = response.data.Data.list;
          } else {
            that.messagetips(response.data.Message, "warning");
          }
        })
        .catch(function(error) {
          console.log(error);
          that.messagetips("sdf");
        });
    },
    // 展示详细信息
    showDetail(row) {
      console.log(row);
      var that = this;
      this.detailSwitch = true;
      axios
        .get("/api/PlaneTicketFlight/GetPFTInfo", {
          params: {
            id: row.ID
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.data.Errcode == 0) {
            var data = response.data.Data;
            var arr = [];
            arr.push(data.PTFInfo);
            that.PTFInfo = arr.map(function(item) {
              item.STD = item.STD.split("T").join(" ");
              item.STA = item.STA.split("T").join(" ");
              item.LastUpdateTime = item.LastUpdateTime.split("T").join(" ");
              item.Status =
                item.Status == 0
                  ? "可用"
                  : item.Status == -1
                  ? "不可用"
                  : "售完";
              item.HasFlatBed = item.HasFlatBed == 1 ? "是" : "否";
              item.IsTransit = item.IsTransit == 1 ? "是" : "否";
              item.SubjectToGovtApproval =
                item.SubjectToGovtApproval == 1 ? "是" : "否";
              item.IsTransfExRate = item.IsTransfExRate == 0 ? "是" : "否";
              return item;
            });
            that.seatList = data.seatList.map(function(item) {
              item.IsTransfExRate = item.IsTransfExRate == 0 ? "成功" : "失败";
              item.Status = item.Status == 0 ? "可用" : "暂无售票";
              if (item.AvailableCount == -1) {
                item.AvailableCount = "充足";
              }
              switch (item.FareType) {
                case 1:
                  item.FareType = "头等舱";
                  break;
                case 2:
                  item.FareType = "商务舱";
                  break;
                case 3:
                  item.FareType = "经济舱";
                  break;

                default:
                  item.FareType = "超经济舱";
                  break;
              }
              item.LastUpdateTime = item.LastUpdateTime.split("T").join(" ");
              return item;
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
      if (row.status == "待支付") {
        this.confirmSwitch = true;
      } else {
        this.confirmSwitch = false;
      }
      this.disabled = true;
      this.title = "修改数据";
      this.dialogVisible = true;
      this.id = row.ID;
      this.websiteid =
        row.websiteid == "其它" ? 0 : row.websiteid == "微信" ? 1 : 2;
      this.status =
        row.status == "支付成功" ? 1 : row.status == "支付失败" ? -1 : 0;
      this.paycode = row.Paycode;
      this.OrderNo = row.OrderNo;
    },
    // 提交新增与修改
    confirm() {
      var that = this;
      if (!(this.disabled == false)) {
        //修改----------------------------------------------
        if (that.paycode == "" && that.status == 1) {
          that.dialogVisible = true;
          that.messagetips("请输入成功的code", "warning");
          return;
        }
        var obj = {
          id: that.id,
          websiteid: that.websiteid,
          status: that.status,
          paycode: that.paycode
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
        .get("/api/PlaneTicketFlight/GetPFTList", {
          params: {
            page: that.page,
            pagesize: that.pagesize,
            carriercode: that.carriercode,
            dcity: that.dcity,
            acity: that.acity,
            flydate: that.flydate,
            websiteid: that.websiteid,
            status: that.status
          }
        })
        .then(function(response) {
          if (response.data.Errcode == 0) {
            if (response.data.Data) {
              var data = response.data.Data.list;
              data = data.map(function(item) {
                item.STD = item.STD.split("T").join(" ");
                item.STA = item.STA.split("T").join(" ");
                item.LastUpdateTime = item.LastUpdateTime.split("T").join(" ");
                item.Status =
                  item.Status == 0
                    ? "可用"
                    : item.Status == -1
                    ? "不可用"
                    : "售完";
                item.IsTransfExRate = item.IsTransfExRate == 0 ? "是" : "否";

                return item;
              });
              console.log(data);
              that.tableData3 = data;
              that.total = response.data.Data.total;
            } else {
              that.tableData3 = [];
              that.total = 0;
            }

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
    this.GetAirWebsiteData();
    this.getData();
  }
};
</script>

<style lang="scss">
.zl-order {
  .el-dialog {
    width: 70%;
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
