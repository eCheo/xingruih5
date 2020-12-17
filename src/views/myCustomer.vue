<template>
  <div class="analysis" style="margin-bottom:20px;height: calc(100% - 36px);overflow: auto;">
    <div style="height:99px;">
      <div class="cs-top">
        <van-search
          v-model="staffFrom.queryValue"
          shape="round"
          background="#4caf50"
          placeholder="请输入客户姓名/电话/跟踪信息/业态"
          @search='getStaff(1)'
        />
        <div class="cs-box">
          <div v-for="(item, index) in shTextList" :key="index">
            <p :class="{'p-select': item.show}" @click="changeTitle(item, index)">{{item.name}}</p>
            <Overlay :show="item.show" class-name="cu-over">
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
      <div v-if="staffData.length > 0">
        <template v-for="(item, index) in staffData">
          <div :key="index" style="padding: 0 12px;" @click="goDetails(item)">
            <div class="sh-title">
              <div>客户姓名：{{item.name}}</div>
              <div>性别：{{item.sex.message}}</div>
            </div>
            <div style="margin-top:10px;">
              <div class="sh-ind">
                <div>业态：{{item.format || '--'}}</div>
                <div>录入人: {{item.memberName === '' ? '--' : item.memberName}}</div>
              </div>
              <div>
                <div>需求面积：{{item.demandArea + ' m²' + '~' + item.deadAreaEnd + ' m²'}}</div>
                <div>需求区域：{{(item.areaName || '--')+ ' ' + (item.streetName || '--')}}</div>
                <div>备注：{{item.demandAddress}}</div>
              </div>
            </div>
            <mu-divider style="margin:12px 0;" />
          </div>
        </template>
      </div>
      <div v-else>
      <van-empty
          class="custom-image"
          image="https://img.yzcdn.cn/vant/custom-empty-image.png"
          description="暂无数据"
        />
        <p v-if="loadingFail" style="text-align:center;">加载失败，点击<span @click="getStaff(1)" style="color:rgb(76, 175, 80);">重新加载</span></p>
      </div>
    <div style="position: fixed;
            bottom: 59px;background: #fff;width:100%;display: flex;
    justify-content: space-between;z-index:-1;">
          <van-pagination style="
            width: 70%;
            " v-model="staffFrom.page" :page-count="total" @change='getStaff' mode="simple" />
            <div style="width:24%;padding-top: 7px;">
              <input type="text" style="width: 50%;" v-model="page" @input="changeNumber"/>
              <span @click="getStaff(page)" style="margin-left: 5px;">跳转</span>
            </div>
    </div>
  </div>
</template>

<script>
import { getStaff, findCityAll } from "../api/user";
import { TreeSelect, Overlay, Search, Pagination, Slider, Empty, Icon, Loading} from "vant";
export default {
  name: "mycustomer",
  data() {
    return {
      num: 10,
      loading: false,
      text: "List",
      staffData: [],
      staffFrom: {
        page: "1",
        queryValue: "",
        size: 10,
        demandArea: "",
        deadAreaEnd: "",
        format: "",
        areaId: "",
        streetId: "",
        customerStatus: "NoShare"
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
        }
      ],
      page: 1,
      total: 0,
      areaValue: [0, 10000],
      loadingFail: false
    };
  },
  components: { TreeSelect, Overlay, "van-search": Search, 'van-pagination': Pagination, "van-slider": Slider, 'van-empty': Empty, 'van-icon': Icon, 'van-loading': Loading},
  created() {
    this.getStaff(1);
    this.getAddress();
  },
  methods: {
    getStaff(page) {
      this.loading = true;
      this.staffFrom.page = page;
      let params = {
        size: this.staffFrom.size,
        page: this.staffFrom.page,
        deadAreaEnd: this.staffFrom.deadAreaEnd,
        demandArea: this.staffFrom.demandArea,
        areaId: this.staffFrom.areaId,
        streetId: this.staffFrom.streetId,
        queryValue: this.staffFrom.queryValue,
        customerStatus: "NoShare"
      };
      getStaff(params).then(res => {
        if (res.status === 200 && res.data.code === "200") {
          this.staffData = res.data.data.content;
          this.loading = false;
          this.loadingFail = false;
        } else {
          this.loading = false;
          this.loadingFail = true;
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
      sessionStorage.setItem("cusId", data.id);
      this.$router.push("/customerdetails");
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
    changeTitle(item, index) {
      this.shTextList.forEach(data => {
        data.show = false;
      })
      this.shTextList[index].show = !item.show;
    },
    selectArea() {
     this.shTextList.forEach(data => {
        data.show = false;
      })
      this.staffFrom.areaId = this.items[this.activeIndex].id;
      if (this.activeId === '') {
        this.shTextList[0].name = this.activeIndex === 0 ? '需求区域' : this.items[this.activeIndex].text;
      }
      this.getStaff(1);
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
          this.$toast.fail(res.data.message);
        }
      });
    },
    onAreaChange(val) {
      this.staffFrom.demandArea = val[0];
      this.staffFrom.deadAreaEnd = val[1] === 10000 ? '' : val[1];
    }
  },
  watch: {
    $route: {
      handler() {
        this.getStaff(this.staffFrom.page);
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
.p-select {
  color: #333;
  font-weight: bold;
}
.cu-over {
  top: 100px;
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
  padding-bottom: 5px;
  text-align: center;
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
.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
}
</style>