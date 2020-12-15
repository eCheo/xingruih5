<template>
  <div class="analysis" style="margin-bottom:20px; height: calc(100% - 36px);overflow: auto;">
    <div style="height:99px;">
      <div class="cs-top">
        <van-search
          v-model="staffFrom.queryValue"
          shape="round"
          background="#4caf50"
          placeholder="请输入业主姓名/电话"
          @search="getStaff(1)"
        />
        <div class="cs-box">
          <div v-for="(item, index) in shTextList" :key="index">
            <p :class="{'p-select': item.show}" @click="changeTitle(item, index)">{{item.name}}</p>
            <Overlay :show="item.show" class-name="cu-over" style="z-index: 9999">
              <div>
                <TreeSelect
                  v-if="index === 0"
                  :items="items"
                  :active-id.sync="activeId"
                  :main-active-index.sync="activeIndex"
                  @click-item="clickItem"
                  @click-nav="clickNav"
                />
                <div v-if="index === 1">
                    <div style="padding: 9px 34px; margin-bottom: -1px;background-color:#fff;">
                    <p
                      style="text-align: center;"
                    >{{areaValue[0]+"m²-"}}{{ areaValue[1] === 10000 ? '无限' : areaValue[1] +'m²'}}</p>
                    <van-slider
                      button-size="20"
                      v-model="areaValue"
                      :range="true"
                      @change="onAreaChange"
                      :min="0"
                      :max="10000"
                      :step="1000"
                      active-color="#4caf50"
                    />
                  </div>
                </div>
                <div v-if="index === 2">
                  <div style="padding: 9px 34px; margin-bottom: -1px;background-color:#fff;">
                    <p
                      style="text-align: center;"
                    >{{moneyValue[0]+"元-"}}{{ moneyValue[1] === 10000 ? '无限' : moneyValue[1] +'元'}}</p>
                    <van-slider
                      button-size="20"
                      v-model="moneyValue"
                      :range="true"
                      @change="onMoneyChange"
                      :min="0"
                      :max="10000"
                      :step="1000"
                      active-color="#4caf50"
                    />
                  </div>
                </div>
                <div v-if="index === 3">
                  <Field v-model="staffFrom.format" label="业态" placeholder="请输入业态" />
                  <Field v-model="staffFrom.name" label="业主名称" placeholder="请输入业主名称" />
                  <Field v-model="staffFrom.EQ_phone" label="电话号码" placeholder="请输入电话号码" />
                </div>
                <div class="sh-tree">
                  <mu-button @click="selectArea" style="width:50%;" color="success">查询</mu-button>
                </div>
              </div>
              <div style="width:100%;height:100%;z-index:2;" @click="item.show = false"></div>
            </Overlay>
          </div>
        </div>
      </div>
    </div>
    <Overlay :show="loading">
            <div class="ft-box">
                <van-loading vertical>加载中..</van-loading>
            </div>
      </Overlay>
    <div v-if="staffData.length > 0" style="position: static;">
      <Card
        v-for="(item, index) in staffData"
        :key="index"
        :lazy-load="true"
        class="sh-card"
        @click="goDetails(item)"
      >
        <template #thumb>
          <img style="width: 88px;height:88px" :src="item.imagePaths[0]" />
        </template>
        <template #title>
          <p>{{item.name + "·"+ item.sex.message}}</p>
        </template>
        <template #desc>
          <p>{{item.areaSize +'m²'}}/{{(item.areaName || '--')+'·'+(item.streetName || '--')}}</p>
          <p>{{item.paymentMethod || '--'}}</p>
          <span class="sh-tag">{{item.isRent ? '已租':'未租'}}</span>
          <p style="color:#ff624b;">{{item.money+'元'}}</p>
        </template>
      </Card>
    </div>
    <van-empty
            v-else
            class="custom-image"
            image="https://img.yzcdn.cn/vant/custom-empty-image.png"
            description="暂无数据"
    />
    <div
      style="position: fixed;
            bottom: 59px;background: #fff;width:100%;display: flex;
    justify-content: space-between;z-index:-1;"
    >
      <van-pagination
        style="
            width: 70%;
            "
        v-model="staffFrom.page"
        :page-count="total"
        @change="getShop"
        mode="simple"
      />
      <div style="width:24%;padding-top: 7px;">
        <input type="text" style="width: 50%;" v-model="page" @input="changeNumber" />
        <span @click="getShop(page)" style="margin-left: 5px;">跳转</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getShop, findCityAll} from "../api/user";
import {
  TreeSelect,
  Overlay,
  Field,
  Card,
  Dialog,
  Slider,
  Search,
  Pagination,
  Empty,
  Loading
} from "vant";
export default {
  name: "shop",
  data() {
    return {
      num: 10,
      finished: false,
      loading: false,
      text: "List",
      staffData: [],
      staffFrom: {
        page: "1",
        queryValue: "",
        size: 10,
        areaSizeStart: "",
        areaSizeEnd: "",
        moneyStart: "",
        moneyEnd: "",
        areaId: "",
        streetId: ""
      },
      items: [],
      activeId: "",
      activeIndex: 0,
      show: false,
      shTextList: [
        {
          name: "需求区域",
          show: false
        },
        {
          name: "需求面积",
          show: false
        },
        {
          name: "租金",
          show: false
        }
      ],
      total: 10,
      refreshing: false,
      moneyValue: [0, 10000],
      areaValue: [0, 10000],
      page: 1
    };
  },
  components: {
    TreeSelect,
    Overlay,
    Field,
    Card,
    [Dialog.Component.name]: Dialog.Component,
    "van-slider": Slider,
    "van-search": Search,
    "van-pagination": Pagination,
    'van-empty': Empty,
    'van-loading': Loading
  },
  created() {
    this.getShop(1);
    this.getAddress();
  },
  methods: {
    getShop(page) {
      this.loading = true;
      this.staffFrom.page = page;
        getShop(this.staffFrom).then(res => {
          if (res.status === 200 && res.data.code === "200") {
            this.staffData = res.data.data.content;
            this.finished = true;
            this.loading = false;
            this.total =
              res.data.data.totalElements === 0
                ? 1
                : res.data.data.totalElements;
          } else {
            this.finished = true;
            this.loading = false;
            this.$message.error(res.data.message);
          }
        });
    },
    changeNumber() {
      if (this.page !== "") {
        this.page = Number(this.page);
      }
    },
    goDetails(data) {
      sessionStorage.setItem("shopid", data.id);
      this.$router.push("/shopdetails");
    },
    claerStaffInfo() {
      this.editType = "add";
      this.editModal = true;
      this.areaDefaultList = [];
      for (let key in this.form) {
        if (key !== "sex") this.form[key] = "";
        if (key === "id") delete this.form[key];
      }
    },
    setStaffInfo(data) {
      this.editType = "edit";
      this.editModal = true;
      this.form.name = data.name;
      this.form.phone = data.phone;
      this.form.sex = data.sex.name;
      this.form.format = data.format;
      this.form.demandArea = data.demandArea;
      this.form.demandAddress = data.demandAddress;
      this.form.brandName = data.brandName;
      this.form.id = data.id;
      this.form.deadAreaEnd = data.deadAreaEnd;
      this.areaDefaultList[0] = data.areaId;
      this.areaDefaultList[1] = data.streetId;
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getShop(this.staffFrom.page);
    },
    changeTitle(item, index) {
      this.shTextList.forEach(data => {
        data.show = false;
      });
      this.shTextList[index].show = !item.show;
    },
    selectArea() {
      this.shTextList.forEach(data => {
        data.show = false;
      });
      this.staffFrom.areaId = this.items[this.activeIndex].id;
      if (this.activeId === "") {
        this.shTextList[0].name =
          this.activeIndex === 0
            ? "需求区域"
            : this.items[this.activeIndex].text;
      }
      this.getShop(1);
    },
    clickItem(data) {
      this.shTextList[0].name = data.text;
      this.staffFrom.streetId = data.id;
    },
    clickNav() {
      this.activeId = "";
      this.staffFrom.streetId = "";
    },
    getAddress() {
      findCityAll().then(res => {
        if (res.status === 200 && res.data.code === "200") {
          res.data.data.forEach(item => {
            item.children = item.children.map(it => {
              return { id: it.id, text: it.name };
            });
          });
          this.items = res.data.data.map(item => {
            return { id: item.id, text: item.name, children: item.children };
          });
          this.items.unshift({ id: "", text: "全部" });
        } else {
          this.$toast.error(res.data.message);
        }
      });
    },
    onMoneyChange(val) {
      this.staffFrom.moneyStart = val[0];
      this.staffFrom.moneyEnd = val[1] === 10000 ? '' : val[1];
    },
    onAreaChange(val) {
      this.staffFrom.areaSizeStart = val[0];
      this.staffFrom.areaSizeEnd = val[1] === 10000 ? '' : val[1];
    }
  },
  watch: {
    $route: {
      handler() {
        this.getShop(this.staffFrom.page);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cs-top {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 0;
  background-color: #fff;
  .cs-box {
    display: flex;
    font-size: 14px;
    justify-content: space-around;
    text-align: center;
    padding: 12px;
    > div {
      width: 33.3%;
      p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0;
      }
    }
  }
}
.cs-seach {
  background: #fff;
}
.p-select {
  color: #333;
  font-weight: bold;
}
.cu-over {
  top: 100px;
  z-index: 9999;
}
.sh-title {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.sh-ind {
  display: flex;
  justify-content: space-between;
}
.sh-tree {
  width: 100%;
  background-color: #fff;
  padding: 10px 0 5px 0;
  text-align: center;
}
.sh-card p:first-child {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.sh-card p {
  margin: 0;
  padding: 0;
}
.sh-tag {
  display: inline-block;
  padding: 4px;
  background-color: wheat;
  color: #966915;
  border-radius: 4px;
}
.ft-box {
  position: absolute;
    left: 50%;
    top: 37%;
    transform: translate(-50%, -50%);
}
</style>
<style lang="less">
.analysis .mu-item {
  height: auto;
}
</style>