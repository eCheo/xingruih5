<template>
  <div>
    <div class="hm-content">
      <router-view></router-view>
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
    width: 100%;
    height: calc(100% - 67px);
    overflow: auto;
    background-color: #fff;
}
</style>