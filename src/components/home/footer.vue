<template>
    <div class="footer">
        <mu-container>
        <mu-bottom-nav :value.sync='name'>
            <mu-bottom-nav-item :value='0' title="我的客户" icon="assignment_ind" to='/mycustomer'></mu-bottom-nav-item>
            <mu-bottom-nav-item :value='1' title="共享池" icon="supervisor_account" to='/shared'></mu-bottom-nav-item>
            <div class='ft-add' @click="show = true"><van-icon name="plus" size="36" color="#fff" /></div>
            <mu-bottom-nav-item :value='2' title="铺源" icon="storefront" to='/shop'></mu-bottom-nav-item>
            <mu-bottom-nav-item :value='3' title="我的" icon="settings" to='/setpassword'></mu-bottom-nav-item>
        </mu-bottom-nav>
        </mu-container>
        <van-popup v-model="show">
            <div class="ft-box">
                <div>
                    <div class="ft-bor" @click="$router.push('/addcustomer'), show = false">
                        <mu-icon value="person_pin"></mu-icon>
                    </div>
                    <p style="line-height:1;color:#999;">添加客户</p>
                </div>
                <div>
                    <div class="ft-bor" @click="$router.push('/addshop'), show = false">
                        <mu-icon value="store"></mu-icon>
                    </div>
                    <p style="line-height:1;color:#999;">添加店铺</p>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Popup, Icon} from "vant";
export default {
    data () {
        return {
            name: 0,
            show: false
        }
    },
    components: { 'van-popup': Popup, 'van-icon': Icon},
    created() {
        // if (this.$route.name === '我的客户') {
        //     this.name = 0;
        // } else if (this.$route.name === '共享池') {
        //     this.name = 1;
        // } else if (this.$route.name === '铺源') {
        //     this.name = 2;
        // } else if (this.$route.name === '我的') {
        //     this.name = 3;
        // }
    },
    watch: {
        $route: {
            handler() {
                if (this.$route.path.indexOf('customer') > -1) {
                    this.name = 0;
                } else if (this.$route.path.indexOf('shared') > -1) {
                    this.name = 1;
                } else if (this.$route.name === '铺源' || this.$route.path.indexOf('shop') > -1) {
                    this.name = 2;
                } else if (this.$route.name === '我的') {
                    this.name = 3;
                }
            }, deep: true, immediate: true
        }
    }
}
</script>

<style lang="less" scoped>
.footer {
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
}
.ft-add {
    width: 50px;
    height: 41px;
    padding-top: 2px;
    background-color: #2196f3;
    border-radius: 50%;
}
.ft-box {
    width: 250px;
    padding: 30px 12px;
    display: flex;
    justify-content: space-around;
}
.ft-bor {
    height: 53px;
    background-color: #2196f3;
    border-radius: 50%;
    line-height: 67px;
    color: #fff;
    padding: 0 12px;
    text-align: center;
}
</style>
<style lang="less">
.footer .van-overlay{
    top: -59px;
}
.footer .van-popup--center {
border-radius: 5px;
}
</style>