<template>
  <div class="analysis" style="margin-bottom:20px;">
    <div style="height:50px;">
      <div class="cs-top">
        <div v-for="(item, index) in shTextList" :key="index">
          <p :class="{'p-select': item.show}" @click="changeTitle(item, index)">{{item.name}}</p>
          <Overlay :show="item.show" class-name='cu-over'>
            <div>
              <TreeSelect
              v-if="index === 0"
              :items="items"
              :active-id.sync="activeId"
              :main-active-index.sync="activeIndex"
              @click-item='clickItem'
              @click-nav='clickNav'
              />
              <div style="display:flex;" v-if="index === 1">
                <div>
                  <Field v-model="staffFrom.areaLarge" label="需求面积"  placeholder='m²'/>
                </div>
                <span style="display:inline-block;background:#fff;padding-top:12px;">~</span>
                <div>
                  <Field v-model="staffFrom.areaSmall" placeholder='m²'/>
                </div>
              </div>
              <div v-if="index === 2">
                <div style="padding: 9px 34px; margin-bottom: -1px;background-color:#fff;">
                  <p style="text-align: center;">{{moneyValue[0]+"元-"}}{{ moneyValue[1] === 10000 ? '无限' : moneyValue[1] +'元'}}</p>
                  <van-slider button-size='20' v-model="moneyValue" :range='true' @change="onMoneyChange" :min="0" :max="9999" :step='100' active-color="#4caf50"/>
                </div>
              </div>
              <div v-if="index === 3">
                <Field v-model="staffFrom.format" label="业态" placeholder="请输入业态" />
                <Field v-model="staffFrom.name" label="业主名称" placeholder="请输入业主名称" />
                <Field v-model="staffFrom.EQ_phone" label="电话号码" placeholder="请输入电话号码" />
                <Field name="radio" label="是否已租">
                  <template #input>
                      <van-radio-group v-model="staffFrom.EQ_isRent" direction="horizontal">
                          <van-radio :name="null">全部</van-radio>
                          <van-radio :name="true">已租</van-radio>
                          <van-radio :name="false">未租</van-radio>
                      </van-radio-group>
                  </template>
              </Field>
              </div>
              <div class="sh-tree">
                <mu-button @click="selectArea" style="width:50%;" color="success">查询</mu-button>
              </div>
            </div>
            <div style="width:100%;height:100%;z-index:2;" @click="item.show = false">

            </div>
          </Overlay>
        </div>
        <div>
          <p @click="$router.push('/addshop')">添加</p>
        </div>
      </div>
    </div>
      <PullRefresh v-model="refreshing" @refresh="onRefresh">
        <List v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getShop">
          <div v-if='staffData.length > 0'>
              <Card v-for="(item, index) in staffData" :key="index" :lazy-load='true' class="sh-card" @click="goDetails(item)">
                <template #thumb>
                  <img style="width: 88px;height:88px" :src="item.imagePaths[0]">
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
                <template #footer>
                  <Button size="mini" type="primary" @click.stop="setIsRent(item)">{{item.isRent ? '设为未租':'设为已租'}}</Button>
                </template>
              </Card>
          </div>
          <!-- <div v-else>
            暂无数据
          </div> -->
        </List>
      </PullRefresh>
  </div>
</template>

<script>
import {getShop, findCityAll, rented} from '../api/user'
import { TreeSelect, Overlay, List, Field, PullRefresh, Card, Button, Dialog, Slider, RadioGroup, Radio} from 'vant'
export default {
  name: 'customer',
  data () {
    return {
      num: 10,
      finished: false,
      loading: false,
      text: 'List',
      staffData: [],
      staffFrom: {
        page: '1',
        LIKE_name: '',
        pageSize: 10,
        EQ_phone: '',
        LIKE_area: '',
        GTE_areaSize: '',
        LTE_areaSize: '',
        EQ_isRent: '',
        GTE_money: "",
        LTE_money: "",
        EQ_areaId: '',
        EQ_streetId: '',
        sort: 'addDate,desc'
      },
      items: [],
      activeId: '',
      activeIndex: 0,
      show: false,
      shTextList: [{
        name: '需求区域',
        show: false
      }, 
      {
        name: '需求面积',
        show: false
      },
      {
        name: '租金',
        show: false
      },
      {
        name: '更多',
        show: false
      }],
      total: 10,
      refreshing: false,
      moneyValue: [0, 1000]
    }
  },
  components: {TreeSelect, Overlay, List, Field, PullRefresh, Card, Button, [Dialog.Component.name]: Dialog.Component, 'van-slider': Slider, 'van-radio-group': RadioGroup,
        'van-radio': Radio},
  created() {
    this.getShop(1)
    this.getAddress()
  },
  methods: {
    getShop(page) {
      this.loading = true
      this.staffFrom.page = page
      if (this.refreshing) {
          this.refreshing = false;
        }
      if (this.staffFrom.page <= this.total) {
        getShop(this.staffFrom).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.staffData = res.data.data.content
            this.finished = true;
            this.loading = false;
            this.total = res.data.data.totalElements === 0 ? 1 : res.data.data.totalElements
          } else {
            this.finished = true;
            this.loading = false;
            this.$message.error(res.data.message)
          }
        })
      }
      if (this.staffFrom.page >= this.total) {
          this.finished = true;
      }
    },
    goDetails(data) {
        sessionStorage.setItem('shopid', data.id)
        this.$router.push('/shopdetails')
    },
    changeStaff() {
      if (this.editType === 'edit') {
        this.updataStaff()
      } else {
        this.createStaff()
      }
    },
    createStaff() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
      this.editLoading = true
      request('/api/backend/customer/create.json', METHOD.POST, this.form).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.editLoading = false
            this.$message.success('添加成功')
            this.getShop(this.staffFrom.page)
            this.editModal = false
          } else {
            this.$message.error(res.data.message)
            this.editLoading = false
          }
        })
        }
      })
    },
    setIsRent(data) {
      const self = this;
      Dialog.confirm({
        title: '设置',
        message: `是否设置当前铺源为${data.isRent ? '未租': '已租'}`,
        theme: 'round-button'
      }).then(() => {
        rented({id: data.id, isRent: !data.isRent}).then(res => {
            if(res.status === 200 && res.data.code === '200') {
              self.getShop(self.staffFrom.page)
              self.$toast.success('设置成功')
            } else {
              self.$toast.error(res.data.message)
            }
          })
      });
    },
    updataStaff() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
      this.editLoading = true
      request('/api/backend/customer/update.json', METHOD.POST, this.form).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.editLoading = false
            this.$message.success('修改成功')
            this.editModal = false
            this.getShop(1)
          } else {
            this.$message.error(res.data.message)
            this.editLoading = false
          }
        })
        }
      })
    },
    claerStaffInfo(){
      this.editType = 'add'
      this.editModal = true
      this.areaDefaultList = [];
      for(let key in this.form) {
        if (key !== 'sex')
        this.form[key] = ''
        if (key === 'id')
        delete this.form[key]
      }
    },
    setStaffInfo(data) {
      this.editType = 'edit'
      this.editModal = true
      this.form.name = data.name
      this.form.phone = data.phone
      this.form.sex = data.sex.name
      this.form.format = data.format
      this.form.demandArea = data.demandArea
      this.form.demandAddress = data.demandAddress
      this.form.brandName = data.brandName
      this.form.id = data.id
      this.form.deadAreaEnd = data.deadAreaEnd
      this.areaDefaultList[0] = data.areaId
      this.areaDefaultList[1] = data.streetId
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
      this.getShop(1);
    },
    clickItem(data) {
      this.shTextList[0].name = data.text;
      this.staffFrom.streetId = data.id;
    },
    clickNav() {
      this.activeId = ''
      this.staffFrom.streetId = ''
    },
    getAddress() {
      findCityAll().then(res => {
        if (res.status === 200 && res.data.code === '200') {
          res.data.data.forEach(item => {
            item.children = item.children.map(it => {return {id:it.id, text: it.name}})
          })
         this.items = res.data.data.map(item => {return {id:item.id, text: item.name,children: item.children}})
         this.items.unshift({id: '', text: '全部'})
        } else {
          this.$toast.error(res.data.message);
        }
      })
    },
    onMoneyChange(val) {
      this.staffFrom.GTE_money = val[0];
      this.staffFrom.LTE_money = val[1] === 10000 ? 99999 : val[1];
    }
  },
  watch: {
    $route: {
      handler() {
        this.getShop(1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cs-top {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
  display: flex;
  font-size: 14px;
  justify-content: space-around;
  text-align: center;
  padding: 12px;
  background-color: #fff;
  >div {
    width: 33.3%;
    p {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin: 0;
    }
  }
}
.p-select {
  color: #333;
  font-weight: bold;
}
.cu-over {
  top: 45px;
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
  padding:10px 0 5px 0;
  text-align: center;
}
.sh-card p:first-child {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.sh-card p{
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
</style>
<style lang="less">
.analysis .mu-item {
  height: auto;
}
</style>