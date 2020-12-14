<template>
<div>
    <van-nav-bar
    title="客户详情"
    left-text="返回"
    left-arrow
    @click-left="$router.push('/shared')">
    </van-nav-bar>
    <van-form>
        <van-field
            v-model="cusInfo.name"
            :readonly='true'
            name="客户名称"
            label="客户名称"
            placeholder="客户名称"
            :rules="[{ required: true, message: '请填写客户名称' }]"
        />
        <van-field  
            v-model="cusInfo.sex.message" 
            name="性别" 
            label="性别" 
            :readonly='true'
            placeholder="性别">
        </van-field>
        <van-field
            v-model="cusInfo.format"
            name="业态"
            :readonly='true'
            label="业态"
            placeholder="业态"
            :rules="[{ required: true, message: '请填写业态' }]"
        />
        <van-field
            :value="cusInfo.brandName || '--'"
            name="品牌"
            :readonly='true'
            label="品牌"
            placeholder="品牌"
        />
        <div style="display: flex;">
            <van-field style='width: 118%;' :readonly='true' :value="cusInfo.demandArea + 'm²'" label="需求面积"  name="需求面积"  placeholder='m²'/>
            <span style="display:inline-block;background:#fff;padding-top:12px;">~</span>
            <van-field :readonly='true' :value="cusInfo.deadAreaEnd + 'm²'" placeholder='m²' />
        </div>
        <van-field
            readonly
            name="需求区域"
            label="需求区域"
            :value="areaText"
            placeholder="需求区域"
            />
        <van-field
            :value="cusInfo.demandAddress || '--'"
            name="备注"
            label="备注"
            :readonly='true'
            placeholder="备注"
            rows="2"
            autosize
            type="textarea"
            show-word-limit
        />
        <div style="padding:0 16px;margin: 10px 0;height: 41px;">
            <span style="color:#646566;padding-top: 10px;display: inline-block;">电话号码：{{cusInfo.isViewPhone ? cusInfo.hidPhone : cusInfo.phone}}</span>
            <mu-button style="margin-left:15px;float:right;" v-if="cusInfo.isViewPhone" color="success"  @click="viewPhone">查看电话号码</mu-button>
        </div>
    </van-form>
    <div style="padding-left:16px;margin: 10px 0;display:flex;">
              <span style="padding-top: 10px;color:#646566;">备注：</span>
              <van-field v-model="remarks" placeholder="请输入跟踪信息" style="width:60%;margin-right:10px;" />
              <mu-button color='success' @click='addRecord'>添加</mu-button>
    </div>
    <van-divider>跟踪信息</van-divider>
    <mu-list textline="two-line" style="background-color: #fff;">
        <mu-list-item avatar :ripple="false" button v-for="(item, index) in sharedData" :key="index" style="margin-bottom: 10px;">
        <mu-list-item-content>
            <mu-list-item-title>跟进人：{{item.name}}</mu-list-item-title>
            <mu-list-item-sub-title style="color: rgba(0, 0, 0, .87);display:flex;">
                <div>
                    <span style="display:inline-block;width:70px;">跟进记录：</span>
                </div>
                <div>
                    <p style="display:inline-block;margin:0px">{{item.remarks}}</p>
                </div>
            </mu-list-item-sub-title>
            <mu-list-item-sub-title>跟进时间：{{item.followUpDate}}</mu-list-item-sub-title>
            <mu-divider style="margin-top:5px;"></mu-divider>
        </mu-list-item-content>
        </mu-list-item>
        <p style="text-align: center;" v-if="sharedData.length === 0">暂无数据</p>
    </mu-list>
    <van-pagination v-model="staffFrom.page" :page-count="total" @change='getTrackInfo' mode="simple" />
    </div>
</template>

<script>
import {findCityAll, getTrackInfo, findById, viewPhone, createRecord} from '../api/user'
import { Form, Field, RadioGroup, Radio, NavBar, Pagination, Divider } from 'vant';
export default {
    data() {
        return {
            form: {
                name: '',
                phone: '',
                sex: 'Man',
                format: '',
                demandArea: '',
                demandAddress: '',
                brandName: '',
                deadAreaEnd: '',
                areaId: '',
                streetId: ''
            },
            showPicker: false,
            columns: [],
            activeId: '',
            activeIndex: 0,
            areaText: '',
            street: '',
            sharedData: [],
            sharedList: [
                {
                    title: '跟进人',
                    key: 'name',
                    width: 95
                },
                {
                    title: '跟进时间',
                    key: 'followUpDate'
                },
                {
                    title: '跟进记录',
                    key: 'remarks'
                }
            ],
            staffFrom: {
                page: 1,
                pageSize: 5
            },
            total: 0,
            cusInfo: {
                sex: {}
            },
            remarks: ''
        }
    },
    components: {
        'van-form': Form,
        'van-field': Field,
        'van-radio-group': RadioGroup,
        'van-radio': Radio,
        'van-nav-bar':NavBar,
        'van-pagination': Pagination,
        'van-divider': Divider
    },
    created() {
        this.getAddress();
        this.findById();
        this.getTrackInfo(1);
    },
    methods: {
        areadCancel() {
            this.showPicker = false;
            this.form.streetId = '';
            this.form.areaId = '';
        },
        areadConfirm() {
            this.form.areaId = this.columns[this.activeIndex].id;
            this.showPicker = false;
            if (this.activeId === '') {
                this.areaText = this.columns[this.activeIndex].text;
            } else {
                this.areaText = this.columns[this.activeIndex].text + '/' + this.street;
            }
        },
        clickItem(data) {
            this.form.streetId = data.id;
            this.street = data.text;
        },
        clickNav() {
            this.activeId = ''
            this.form.streetId = ''
        },
        getAddress() {
            findCityAll().then(res => {
                if (res.status === 200 && res.data.code === '200') {
                res.data.data.forEach(item => {
                    item.children = item.children.map(it => {return {id:it.id, text: it.name}})
                })
                this.columns = res.data.data.map(item => {return {id:item.id, text: item.name,children: item.children}})
                } else {
                this.$toast.error(res.data.message);
                }
            })
        },
        getTrackInfo(page) {
            this.staffFrom.page = page;
            let params = {
                EQ_customerId: sessionStorage.getItem('cusId'),
                page: this.staffFrom.page,
                size: this.staffFrom.pageSize,
                sort:"followUpDate,desc"
            }
            getTrackInfo(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.sharedData = res.data.data.content;
                    this.total = res.data.data.totalPages
                } else {
                    this.$toast.error(res.data.message);
                }
            })
        },
        findById() {
            let params = {
                id: sessionStorage.getItem('cusId')
            }
            findById(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    let reg = /^(\d{3})\d{4}(\d{4})$/
                    this.cusInfo = res.data.data
                    this.cusInfo.hidPhone = this.cusInfo.phone.replace(reg, '$1****$2')
                    this.areaText = (this.cusInfo.areaName || '--')+ ' ' + (this.cusInfo.streetName || '--')
                    this.tabLoading = false
                } else {
                    this.$toast.error(res.data.message)
                }
            })
        },
        viewPhone() {
            let params = {
                id: sessionStorage.getItem('cusId')
            }
            viewPhone(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.getTrackInfo(1);
                }
            })
        },
        addRecord() {
            let params = {
                customerId: sessionStorage.getItem('cusId'),
                remarks: this.remarks
            }
            createRecord(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                this.$toast.success('添加跟踪信息成功');
                this.remarks = ''
                this.getTrackInfo(1)
                } else {
                this.$toast.error(res.data.message);
                }
            })
        },
    }
}
</script>

<style lang="less">
.mu-item-sub-title {
    overflow: visible;
    white-space: normal; 
}
</style>