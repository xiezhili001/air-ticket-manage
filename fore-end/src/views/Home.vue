<template>
  <div class="zl-home">
    <el-container>
      <el-header style="height: 42px">
        <div class="fl tag">JTD.Admin</div>
        <div class="fr user">
          <span>{{user}} 您好,欢迎登录</span>&nbsp;
          <span style="display: inline-block;">
            <SetPassword></SetPassword>
          </span>
          <span style="color: #3a8ee6; cursor: pointer; margin-left: 5px" @click="dropOut">退出</span>
        </div>
      </el-header>

      <el-container>
        <el-aside width="230px" class="aside" @click="hideMenu" id="menu">
          <div class="menu">
            菜单
            <i :class="[iconToggle,'iconStyle']" @click="hideMenu"></i>
          </div>

          <el-collapse accordion class="menu-list" v-model="activeNames">

            <el-collapse-item title="订单信息" name="1">
              <el-card class="box-card">
                <div
                  v-for="item in orderList"
                  :key="item.name"
                  :class="['text', 'item', 'list-content', item.id == isActive ? 'isActive' : '']"
                  @click="goDetail(item.id)"
                >
                  {{ item.name }}
                  <span class="el-icon-arrow-right showDetail"></span>
                </div>
              </el-card>
            </el-collapse-item>

            <el-collapse-item title="系统设置" name="2">
              <el-card class="box-card">
                <div
                  v-for="item in setList"
                  :key="item.name"
                  :class="['text', 'item', 'list-content', item.id == isActive ? 'isActive' : '']"
                  @click="goDetail(item.id)"
                >
                  {{ item.name }}
                  <span class="el-icon-arrow-right showDetail"></span>
                </div>
              </el-card>
            </el-collapse-item>

            <el-collapse-item title="用户管理" name="3">
              <el-card class="box-card">
                <div
                  v-for="item in manageList"
                  :key="item.name"
                  :class="['text', 'item', 'list-content', item.id == isActive ? 'isActive' : '']"
                  @click="goDetail(item.id)"
                >
                  {{ item.name }}
                  <span class="el-icon-arrow-right showDetail"></span>
                </div>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-aside>

        <el-main>
          <Main></Main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Main from "./main";
import SetPassword from "./component/SetPassword.vue";
export default {
  name: "Home",
  components: {
    Main,
    SetPassword
  },
  data() {
    return {
      user: '',
      activeNames: "1",
      isActive: "",
      orderList: [
        {
          name: "机票订单",
          id: "ticketOrder"
        },
        {
          name: "汇率管理",
          id: "ExchangeRateManager"
        },
        {
          name: "机票价格比值配置",
          id: "PTPConfig"
        }
      ],
      setList: [
        {
          name: "网站管理",
          id: "webSiteManage"
        },
        {
          name: "航司管理",
          id: "airCompanyManage"
        },

        {
          name: "机场管理",
          id: "airportManage"
        },
        {
          name: "航线管理",
          id: "airlineManage"
        },
        {
          name: "城市管理",
          id: "cityMangae"
        },
        {
          name: "国家管理",
          id: "countryManage"
        }
      ],
      manageList: [
        {
          name: "系统用户",
          id: "sysUser"
        }
      ],
      iconToggle: "el-icon-d-arrow-left"
    };
  },
  computed: {

  },
  methods: {
    // 退出
    dropOut() {
      this.$confirm("确认退出?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem("token");
          this.$router.push({name: 'login'});
        })
        .catch(() => {});
    },
    // 切换菜单隐藏
    hideMenu() {
      var space = null;
      if (this.iconToggle == "el-icon-d-arrow-left") {
        this.iconToggle = "el-icon-d-arrow-right";
        space = -200;
      } else {
        this.iconToggle = "el-icon-d-arrow-left";
        space = 0;
      }
      //获取任意一个元素的任意一个属性的当前的值---当前属性的位置值
      function getStyle(element, attr) {
        return window.getComputedStyle
          ? window.getComputedStyle(element, null)[attr]
          : element.currentStyle[attr] || 0;
      }
      function animate(element, json, fn) {
        clearInterval(element.timeId); //清理定时器
        //定时器,返回的是定时器的id
        element.timeId = setInterval(function() {
          var flag = true; //默认,假设,全部到达目标
          //遍历json对象中的每个属性还有属性对应的目标值
          for (var attr in json) {
            //判断这个属性attr中是不是opacity
            if (attr == "opacity") {
              //获取元素的当前的透明度,当前的透明度放大100倍
              var current = getStyle(element, attr) * 100;
              //目标的透明度放大100倍
              var target = json[attr] * 100;
              var step = (target - current) / 10;
              step = step > 0 ? Math.ceil(step) : Math.floor(step);
              current += step; //移动后的值
              element.style[attr] = current / 100;
            } else if (attr == "zIndex") {
              //判断这个属性attr中是不是zIndex
              //层级改变就是直接改变这个属性的值
              element.style[attr] = json[attr];
            } else {
              //普通的属性
              //获取元素这个属性的当前的值
              var current = parseInt(getStyle(element, attr));
              //当前的属性对应的目标值
              var target = json[attr];
              //移动的步数
              var step = (target - current) / 10;
              step = step > 0 ? Math.ceil(step) : Math.floor(step);
              current += step; //移动后的值
              element.style[attr] = current + "px";
            }
            //是否到达目标
            if (current != target) {
              flag = false;
            }
          }
          if (flag) {
            //清理定时器
            clearInterval(element.timeId);
            //所有的属性到达目标才能使用这个函数,前提是用户传入了这个函数
            if (fn) {
              fn();
            }
          }
        }, 20);
      }
      var menu = document.getElementById("menu");
      animate(menu, {
        marginLeft: space
      });
    },
    // main 页面跳转
    goDetail(id) {
      this.isActive = id;
      this.$router.push({ name: id });
    }
  },
  created() {
    this.isActive = this.$route.name;
    if(localStorage.getItem('username')) {
      this.user = localStorage.getItem('username');
    }
  }
};
</script>

<style lang="scss">
.zl-home {
  height: 100%;
  font-size: 16px;
  .isActive {
    color: #66b1ff;
  }
  .list-content {
    cursor: pointer;

    &:visited {
      color: red;
    }
    &:hover {
      color: #409eff;
    }

    &:active {
      color: blue;
    }
  }
  .el-collapse-item__header {
    background: rgb(246, 246, 246);
  }

  #menu::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  #menu::-webkit-scrollbar-track {
    background: #ccc;
    border-radius: 2px;
  }
  #menu::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 2px;
  }
  #menu::-webkit-scrollbar-thumb:hover {
    background: #747474;
  }
  #menu::-webkit-scrollbar-corner {
    background: #f6f6f6;
  }

  .el-table td,
  .el-table th {
    padding: 8px 0;
  }

  .el-main {
    background-color: #fff;
  }

  .showDetail {
    float: right;
    margin-right: 15px;
    margin-top: 6px;
  }

  .iconStyle {
    float: right;
    margin-right: 5px;
    margin-top: 5px;
    cursor: pointer;
  }

  .menu {
    padding-left: 20px;
  }

  .active {
    display: none;
  }

  .el-collapse-item__content {
    padding: 0;
  }

  .el-card__body {
    padding: 0;
  }

  .el-collapse-item__wrap {
    background-color: #f8f8f8;
  }

  .el-collapse-item__header {
    font-size: 16px;
    padding: 0 20px;
  }

  .el-card {
    background-color: #f8f8f8;
    font-size: 15px;
    padding: 5px 15px;
  }

  .list-content {
    padding: 5px 0;
  }

  .el-container {
    height: 100%;
  }

  .el-header {
    line-height: 42px;
    height: 42px;
    padding-left: 60px;
    border-bottom: 1px solid #ccc;
    margin: 0;

    .tag {
      color: green;
    }

    .user {
      font-size: 14px;
    }
  }

  .aside {
    height: 100%;
    border-right: 1px solid #ccc;

    .el-collapse-item__header {
      background: #f8f8f8;
    }
  }
}
</style>
