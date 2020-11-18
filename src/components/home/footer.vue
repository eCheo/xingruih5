<template>
    <div class="footer">
        <mu-container>
        <mu-bottom-nav :value.sync='name'>
            <mu-bottom-nav-item :value='0' title="我的客户" icon="assignment_ind" to='/mycustomer'></mu-bottom-nav-item>
            <mu-bottom-nav-item :value='1' title="共享池" icon="supervisor_account" to='/shared'></mu-bottom-nav-item>
            <mu-bottom-nav-item :value='2' title="铺源" icon="storefront"></mu-bottom-nav-item>
            <mu-bottom-nav-item :value='3' title="设置" icon="settings"></mu-bottom-nav-item>
        </mu-bottom-nav>
        </mu-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            name: 0
        }
    },
    created() {
        if (this.$route.name === '我的客户') {
            this.name = 0;
        } else if (this.$route.name === '共享池') {
            this.name = 1;
        } else if (this.$route.name === '铺源') {
            this.name = 2;
        } else if (this.$route.name === '设置') {
            this.name = 3;
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
</style>