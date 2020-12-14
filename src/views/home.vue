<template>
  <div>
    <div class="hm-content">
      <keep-alive include="mycustomer,shared,shop">
        <router-view></router-view>
      </keep-alive>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "../components/home/footer.vue"
export default {
  name: "home",
  data() {
    return {
    };
  },
  components: {
    Footer
  }
};
</script>

<style lang="less">
.hm-content {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: calc(100% - 58px);
    overflow: auto;
    background-color: #fff;
}
</style>
<style lang='less'>
.van-card {
  z-index: -1;
}
.van-tag {
  z-index: -1;
}
</style>