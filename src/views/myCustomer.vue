<template>
  <div class="analysis" style="margin-bottom:20px;">
    <div style="height:50px;">
      <div class="cs-top">
        <div>
          <p :class="{'p-select': show}" @click="changeTitle(1)">{{shTextObj.region}}</p>
        </div>
        <div>
          <p @click="changeTitle(2)">{{shTextObj.area}}</p>
        </div>
        <div>
          <p @click="changeTitle(3)">{{shTextObj.name}}</p>
        </div>
        <div>
          <p @click="changeTitle(4)">{{shTextObj.format}}</p>
        </div>
        <div>
          <p @click="$router.push('/addcustomer')">添加</p>
        </div>
      </div>
      <Overlay :show="show" class-name='cu-over'>
        <div>
          <TreeSelect
          v-if="titleShow === 1"
          :items="items"
          :active-id.sync="activeId"
          :main-active-index.sync="activeIndex"
          @click-item='clickItem'
          @click-nav='clickNav'
          />
          <div style="display:flex;" v-if="titleShow === 2">
            <div>
              <Field v-model="staffFrom.areaLarge" label="需求面积"  placeholder='m²'/>
            </div>
            <span style="display:inline-block;background:#fff;padding-top:12px;">~</span>
            <div>
              <Field v-model="staffFrom.areaSmall" placeholder='m²'/>
            </div>
          </div>
          <div v-if="titleShow === 3">
            <Field v-model="staffFrom.name" label="客户名称" placeholder="请输入客户名称" />
          </div>
          <div v-if="titleShow === 4">
            <Field v-model="staffFrom.format" label="业态" placeholder="请输入业态" />
          </div>
          <div class="sh-tree">
            <mu-button @click="selectArea" style="width:50%;" color="success">查询</mu-button>
          </div>
        </div>
        <div style="width:100%;height:100%;z-index:2;" @click="show = false">

        </div>
      </Overlay>
    </div>
        <List v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getStaff">
          <div v-if='staffData.length > 0'>
            <template v-for="(item, index) in staffData">
              <div :key="index" style="padding: 0 12px;">
                <div class="sh-title">
                   <div>
                      客户姓名：{{item.name}}
                   </div>
                    <div>
                      性别：{{item.sex.message}}
                    </div>
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
        </List>
  </div>
</template>

<script>
import {getStaff, findCityAll} from '../api/user'
import { TreeSelect, Overlay, List, Field } from 'vant'
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
        name: '',
        pageSize: 10,
        areaLarge: '',
        areaSmall: '',
        format: '',
        areaId: '',
        streetId: ''
      },
      items: [],
      activeId: '',
      activeIndex: 0,
      show: false,
      shTextObj: {
        region: '需求区域',
        area: '需求面积',
        name: '客户名称',
        format: '业态'
      },
      titleShow: 1
    }
  },
  components: {TreeSelect, Overlay, List, Field},
  created() {
    this.getStaff(1)
    this.getAddress()
  },
  methods: {
    getStaff(page) {
      this.loading = true
      this.staffFrom.page = page
      let params = {
         size: this.staffFrom.pageSize,
          page: this.staffFrom.page,
          GTE_demandArea: this.staffFrom.areaSmall,
          LTE_demandArea: this.staffFrom.areaLarge,
          LIKE_format: this.staffFrom.format,
          LIKE_name: this.staffFrom.name,
          EQ_areaId: this.staffFrom.areaId,
          EQ_streetId: this.staffFrom.streetId,
          sort: 'addDate,desc'
      }
      getStaff(params).then(res => {
          if (res.status === 200 && res.data.code === '200') {
            this.staffData = res.data.data.content
            this.finished = true;
            this.loading = false;
          } else {
            this.finished = true;
            this.loading = false;
            this.$message.error(res.data.message)
          }
        })
    },
    goDetails(data) {
        sessionStorage.setItem('cusId', data.id)
        this.$router.push('/customerdetails')
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
            this.getStaff(this.staffFrom.page)
            this.editModal = false
          } else {
            this.$message.error(res.data.message)
            this.editLoading = false
          }
        })
        }
      })
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
            this.getStaff(1)
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
    changeTitle(val) {
      this.show = !this.show;
      this.titleShow = val;
    },
    selectArea() {
      this.show = false;
      this.staffFrom.areaId = this.items[this.activeIndex].id;
      if (this.activeId === '') {
        this.shTextObj.region = this.activeIndex === 0 ? '需求区域' : this.items[this.activeIndex].text;
      }
      this.getStaff(1);
    },
    clickItem(data) {
      this.shTextObj.region = data.text;
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
    }
  },
  watch: {
    $route: {
      handler() {
        this.getStaff(1)
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
  border-bottom: 1px solid #e9e9e9;
  div {
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
  padding-bottom: 5px;
  text-align: center;
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