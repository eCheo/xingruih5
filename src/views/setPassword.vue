<template>
  <div class="analysis">
      <p class="se-title">修改密码</p>
      <van-form @submit="onSubmit">
      <van-field
      v-model="oldPassWord"
      type="password"
      name="原密码"
      label="原密码"
      placeholder="原密码"
      :rules="[{ required: true, message: '请填写原密码' }]"
    />
    <van-field
      v-model="newPassWord"
      type="password"
      name="新密码"
      label="新密码"
      placeholder="新密码"
      :rules="[{ required: true, message: '请填写新密码' }]"
    />
    <van-field
      v-model="cifPassWord"
      type="password"
      name="确认密码"
      label="确认密码"
      placeholder="确认密码"
      :rules="[{ validator, message: message }]"
    />
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">提交</van-button>
    </div>
    </van-form>
  </div>
</template>

<script>
import {resetPassword} from "../api/user";
import { Form, Field, Button } from "vant";
export default {
  name: "customer",
  data() {
    return {
        oldPassWord: '',
        newPassWord: '',
        cifPassWord: '',
        message: ''
    };
  },
  components: {
    "van-form": Form,
    "van-field": Field,
    "van-button": Button
  },
  created() {
  },
  methods: {
      validator(val) {
          if (val === '') {
              this.message = '请填写确认密码'
              return false
          } else if (val !== this.newPassWord) {
              this.message = '密码不一致'
              return false
          } else {
              return true
          }
      },
      onSubmit() {
          let params = {
               oldPassWord: this.oldPassWord,
               newPassWord: this.newPassWord,
          }
          resetPassword(params).then(res => {
              if (res.status === 200 && res.data.code === '200') {
                  this.$toast.success('修改成功')
                  sessionStorage.removeItem('token')
                  this.$router.push('/login')
              } else {
                  this.$toast.fail(res.data.message)
              }
          })
      }
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.se-title {
    text-align: center;
    margin: 12px 0;
    color: #646566;
    font-size: 16px;
}
</style>
