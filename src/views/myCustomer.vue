<template>
  <div class="analysis" style="margin-bottom:20px;">
    <div style="height:50px;">
      <div class="cs-top">
        <div>
          <span @click="show = !show" :class="{'cu-select':show}">需求区域</span>
        </div>
        <div>
          <span>需求面积</span>
        </div>
        <div>
          <span>客户名称</span>
        </div>
        <div>
          <span>业态</span>
        </div>
      </div>
      <Overlay :show="show" @click.prevent.stop @click="show = false" class-name='cu-over'>
        <TreeSelect
        :items="items"
        :active-id.sync="activeId"
        :main-active-index.sync="activeIndex"
      />
      </Overlay>
    </div>
      <mu-container ref="container" class="demo-loadmore-content">
      <mu-load-more @refresh="getStaff" :refreshing="refreshing" :loading="loading" @load="getStaff">
        <mu-list>
          <div v-if='staffData.length > 0'>
            <template v-for="(item) in staffData">
              <mu-list-item>
                <mu-list-item-title>{{item.name}}</mu-list-item-title>
                <mu-list-item-title>{{item.sex.message}}</mu-list-item-title>
                <mu-list-item-title>{{item.format || '--'}}</mu-list-item-title>
                <mu-list-item-title>{{item.brandName === '' ? '--' : item.brandName}}</mu-list-item-title>
                <mu-list-item-title>{{item.demandArea + ' m²' + '~' + item.deadAreaEnd + ' m²'}}</mu-list-item-title>
                <mu-list-item-title>{{(item.areaName || '--')+ ' ' + (item.streetName || '--')}}</mu-list-item-title>
              </mu-list-item>
              <mu-divider />
            </template>
          </div>
          <div v-else style="text-align:center;">
            暂无数据
          </div>
        </mu-list>
      </mu-load-more>
    </mu-container>
  </div>
</template>

<script>
import {getStaff, findCityAll} from '../api/user'
import { TreeSelect, Overlay  } from 'vant'
export default {
  name: 'customer',
  data () {
    return {
      num: 10,
      refreshing: false,
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
      activeId: 1,
      activeIndex: 0,
      show: false
    }
  },
  components: {TreeSelect, Overlay},
  created() {
    this.getStaff(1)
    this.getAddress()
  },
  methods: {
    getStaff(page, pageSize) {
      this.tabLoading = true
      this.staffFrom.page = page
      this.staffFrom.pageSize = pageSize || 10;
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
          } else {
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
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    onSelectChange(value) {
      this.staffFrom.areaId = value[0];
      this.staffFrom.streetId = value[1];
    },
    onChange(value) {
      this.form.areaId = value[0];
      this.form.streetId = value[1];
    },
    getAddress() {
      findCityAll().then(res => {
        if (res.status === 200 && res.data.code === '200') {
          res.data.data.forEach(item => {
            item.children = item.children.map(it => {return {id:it.id, text: it.name}})
          })
         this.items = res.data.data.map(item => {return {id:item.id, text: item.name,children: item.children}})
        } else {
          this.$message.error(res.data.message);
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
  // color: #999999;
  div {
    width: 33.3%;
  }
}
.cu-over {
  top: 45px;
}
.cu-select {
  color: #333;
  font-weight: bold;
}
</style>
<style lang="less">
.de-left {
  width:200px;
  .ant-col-4 {
    width: 39%;
  }
  .ant-col-14 {
    width: 59%;
  }
}
.de-center {
    display: inline-block;
    margin: 8px 12px 8px 8px;
}
.de-right {
  .ant-col-14 {
    width: 64%;
  }
}
</style>