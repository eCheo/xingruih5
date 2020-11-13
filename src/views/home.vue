<template>
  <div>
    <Header />
    <div class="hm-content">
      <div class="ct-left">

      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/home/header.vue";
import Footer from "../components/home/footer.vue"
export default {
  name: "home",
  data() {
    return {
      menuList: [
        {
          name: '首页',
          list: []
        },
        {
          name: '资讯',
          list: [
            {
              name: '娱乐',
              
            }
          ]
        }
      ]
    };
  },
  components: {
    Header,
    Footer
  }
};
</script>

<style lang="scss">
.hm-content {
  width: 1366px;
  margin: 0 auto;

}
</style>