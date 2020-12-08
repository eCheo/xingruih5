<template>
  <div class="lg-box">
    <div class="lg">
      <h2 style="text-align:center;">星浩伟业客户管理系统</h2>
      <mu-container>
        <mu-form ref="form" :model="validateForm" class="mu-demo-form">
          <mu-form-item label="用户名" prop="account" :rules="accountRules">
            <mu-text-field v-model="validateForm.account" prop="account"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="密码" prop="passWord" :rules="passWordRules">
              <mu-text-field type="passWord" v-model="validateForm.passWord" prop="passWord"></mu-text-field>
          </mu-form-item>
          <mu-form-item class="lg-bt">
            <mu-button full-width style="margin:0"  color="primary" @click="submit">登录</mu-button>
          </mu-form-item>
        </mu-form>
      </mu-container>
    </div>
  </div>
</template>

<script>
import {login} from '../api/user'
export default {
  name: "login",
  data() {
    return {
      accountRules: [
        { validate: (val) => !!val, message: '必须填写用户名'},
        { validate: (val) => val.length >= 3, message: '用户名长度大于3'}
      ],
      passWordRules: [
        { validate: (val) => !!val, message: '必须填写密码'},
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
      ],
      validateForm: {
        account: '',
        passWord: '',
        loginType: "PASSWORD"
      }
    }
  },
  methods: {
     submit () {
      this.$refs.form.validate().then((result) => {
        if (result) {
          login(this.validateForm).then(res => {
            if (res.status === 200 && res.data.code === '200') {
              // this.$toast.success('登录成功');
              sessionStorage.setItem('token', res.data.data.accessToken)
              sessionStorage.setItem('tokenType', 'bearer')
              this.$router.push({name: '首页'})
            } else {
              this.$toast.error(res.data.message);
            }
          })
        }
      });
    },
    clear () {
      this.$refs.form.clear();
      this.validateForm = {
        username: '',
        password: '',
        isAgree: false
      };
    }
  }
}
</script>

<style lang="less" scoped>
html {
  font-family: Microsoft YaHei Bold, Microsoft YaHei Bold-Bold;
}
.lg-box {
    position: relative;
    height: 100vh;
    overflow: auto;
    background-color: #f0f2f5;
    background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: 110px;
    background-size: 100%;
}
.lg {
  position: absolute;
  top: 22%;
  width: 93%;
  left: 3%;
}
.mu-demo-form {
  width: 100%;
  max-width: 460px;
}

</style>

<style lang="less">
.lg-bt .mu-form-item-content {
  display: block;
  text-align: center;
}
</style>