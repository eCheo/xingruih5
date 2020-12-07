<template>
<div>
    <van-nav-bar
    title="铺源详情"
    left-text="返回"
    left-arrow
    @click-left="$router.push('/shop')">
    </van-nav-bar>
    <van-swipe @change="onChange">
        <van-swipe-item v-for="(item, index) in shopDetails.imagePaths" :key="index" @click="imgView(index)">
            <img style="width:100%;height:200px;" :src="item">
        </van-swipe-item>
        <template #indicator>
            <div class="custom-indicator">
            {{ current + 1 }}/{{shopDetails.imagePaths.length}}
            </div>
        </template>
    </van-swipe>
    <van-divider>铺源信息</van-divider>
    <p style="padding-left: 12px;">区域位置：{{shopDetails.area || '--'}}</p>
    <div class="cus-box" style="padding: 12px;">
      <div>
        <span>业主姓名</span>
        <span>{{shopDetails.name}}</span>
      </div>
      <div>
        <span>性别</span>
        <span>{{shopDetails.sex.message}}</span>
      </div>
      <div>
        <span>电话号码</span>
        <span>{{shopDetails.phone}}</span>
      </div>
      <div>
        <span>区域街道</span>
        <span>{{(shopDetails.areaName || '--')+''+(shopDetails.streetName || '--')}}</span>
      </div>
      <div>
        <span>楼层</span>
        <span>第{{shopDetails.floorHeight}}层</span>
      </div>
      <div>
        <span>层高</span>
        <span>{{shopDetails.buildingHeight}}米</span>
      </div>
      <div>
        <span>开间</span>
        <span>{{shopDetails.openRoom}}米</span>
      </div>
      <div>
        <span>进深</span>
        <span>{{shopDetails.deepening}}米</span>
      </div>
      <div>
        <span>面积大小</span>
        <span>{{shopDetails.areaSize}}m²</span>
      </div>
      <div>
        <span>租金</span>
        <span>{{shopDetails.money}}元</span>
      </div>
      <div>
        <span>付款方式</span>
        <span>{{shopDetails.paymentMethod}}</span>
      </div>
      <div>
        <span>是否已租</span>
        <span>{{!shopDetails.isRent ? '未租' : '已租'}}</span>
      </div>
      <div>
        <span>备注</span>
        <span>{{shopDetails.remarks}}</span>
      </div>
    </div>
    </div>
</template>

<script>
import {getShopDetails} from '../api/user'
import { Swipe, SwipeItem, NavBar, Divider, ImagePreview } from 'vant';
export default {
    data() {
        return {
            shopid: sessionStorage.getItem('shopid'),
            shopDetails: {},
            current: 0
        }
    },
    components: {
        'van-nav-bar': NavBar, 
        'van-divider': Divider,
        'van-swipe': Swipe,
        'van-swipe-item': SwipeItem,
        [ImagePreview.Component.name]: ImagePreview.Component
    },
    created() {
        this.getShopDetails()
    },
    methods: {
        getShopDetails() {
            let params = {
                id: this.shopid
            }
            getShopDetails(params).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.shopDetails = res.data.data;
                } else {
                    this.$toast.error(res.data.message)
                }
            })
        },
        onChange(index) {
            this.current = index
        },
        imgView(index){
            ImagePreview({
            images: this.shopDetails.imagePaths,
            startPosition: index,
            });
        }
    }
}
</script>

<style lang="less" scoped>
    .custom-indicator {
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 2px 5px;
        font-size: 12px;
        background: #fff;
    }
    .cus-box {
      div {
        height: 30px;
      }
      span:first-child {
        color: #646566;
        width: 86px;
        display: inline-block;
      }
    }
</style>