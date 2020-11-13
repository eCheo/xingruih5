<template>
  <div class="lg">
    <header class="top">
      <div class="header">
          <span class="lg-bg" style="font-size:29px">官方快讯</span>
        </div>
    </header>
    <div class="lg-content">
      <div class="lg-box" v-if="showCont">
        <div class="lg-title">
          <div class="lg-fg">
            <span @click="lgColor = true" :class="{'lg-bg' : lgColor}">登录</span>
          </div>
          <div>
            <span :class="{'lg-bg' : !lgColor}" @click="lgColor = false">快速登陆注册</span>
          </div>
        </div>
        <a-form-model
            ref="loginFrom"
            :model="loginFrom"
            :rules="rulesLoginFrom"
            :label-col="labelCol"
            style='margin-top:82px;'
        >
            <a-form-model-item ref="account"  prop="account">
                <p class="lg-label">手机号码</p>
                <a-input v-model="loginFrom.account" class="lg-input" />
            </a-form-model-item>
            <a-form-model-item ref="password"  prop="password" v-if="lgColor">
                <p class="lg-label">密码</p>
                <a-input v-model="loginFrom.password" type='password' class="lg-input" />
            </a-form-model-item>
            <a-form-model-item ref="code"  prop="code" v-if="!lgColor">
                <p class="lg-label">输入验证码</p>
                <a-input v-model="loginFrom.code" class="lg-input"> 
                  <span slot="suffix" v-if="!codeSend" class="lg-vail" @click="getCode">获取验证码</span> 
                  <span slot="suffix" class="lg-sec" v-else>{{count + '秒'}}</span>
                </a-input>
            </a-form-model-item>
            <a-form-model-item style="margin-bottom:14px;">
               <div class="lg-button">登录</div>
            </a-form-model-item>
            <div v-if="lgColor" class="lg-forget">
              <span @click="showCont = false">忘记密码</span>
            </div>
            <div v-else>
               <a-radio :value='agree'></a-radio>已阅读并同意 《柬中资讯用户使用协议》
            </div>
        </a-form-model>
        <div class="lg-other">
            <p>————————第三方账号登录————————</p>
            <img style="margin-right:71px;" src='../assets/images/home/wx.png' />
            <img src='../assets/images/home/qq.png' />
        </div>
      </div>
      <div class="lg-box" v-else>
            <div class="lg-title">
            <div class="lg-fg">
                <span>忘记密码</span>
            </div>
            </div>
            <a-form-model
            ref="resetFrom    "
            :model="resetFrom"
            :rules="rulesResetFrom"
            :label-col="labelCol"
            style="margin-top:82px;"
            >
            <a-form-model-item ref="account" prop="account">
                <p class="lg-label">手机号码</p>
                <a-input v-model="resetFrom.account" class="lg-input" />
            </a-form-model-item>
            <div v-if="!lgNext">
                <a-form-model-item ref="password" prop="password" >
                    <p class="lg-label">设置新密码</p>
                    <a-input v-model="resetFrom.password" type="password" class="lg-input" />
                </a-form-model-item>
                <a-form-model-item ref="password" prop="newPassWord">
                    <p class="lg-label">确认密码</p>
                    <a-input v-model="resetFrom.newPassWord" type="password" class="lg-input" />
                </a-form-model-item>
            </div>
            <a-form-model-item ref="code" prop="code" v-else>
                <p class="lg-label">输入验证码</p>
                <a-input v-model="resetFrom.code" class="lg-input">
                <span slot="suffix" v-if="!codeTo" class="lg-vail" @click="getCode">获取验证码</span>
                <span slot="suffix" class="lg-sec" v-else>{{count + '秒'}}</span>
                </a-input>
            </a-form-model-item>
            <a-form-model-item style="margin-bottom:14px;" v-if="lgNext">
                <div class="lg-button" :class="'lg-button-dis'" @click="lgNext = false">下一步</div>
            </a-form-model-item>
            <a-form-model-item style="margin-bottom:14px;" v-else>
                <div class="lg-button">重置</div>
            </a-form-model-item>
            <div class="lg-forget">
                <span @click="showCont = true">去登陆</span>
            </div>
            </a-form-model>
        </div>
    </div>
    <div class="lg-info">
        <p>版权所有  深圳市百润信息技术有限公司 </p>
        <p>粤ICP备19133653号-1</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      lgColor: true,
      loginFrom: {
          account: '',
          password: '',
          code: ''
      },
      rulesLoginFrom: {
        account: [{required: true, message: "请输入手机号", trigger: 'blur'}]
      },
      labelCol: { span: 3 },
      agree: false,
      count: 120,
      codeSend: false,
      showCont: true,
       lgNext: true,
        resetFrom: {
            account: '',
            code: '',
            password: '',
            newPassWord: ''
        },
        rulesResetFrom: {},
        labelCol: { span: 3 },
        codeTo: false
    }
  },
  methods: {
    getCode () {
      this.count = 120;
      this.codeSend = true;
      let time = setInterval(() => {
        if (this.count !== 0) {
          this.count --
        } else {
          this.codeSend = false;
          clearInterval(time);
        }
      }, 1000)
    },
    showLogin(value) {
        this.showCont = false;
    }
  }
}
</script>

<style lang="scss" scoped>
html {
  font-family: Microsoft YaHei Bold, Microsoft YaHei Bold-Bold;
}
.lg {
    height: 100%;
}
.lg-bg {
  background: linear-gradient(90deg, #fdd936, #fd604a);
  -webkit-background-clip: text;
  color: transparent;
}
.top {
  margin-bottom: 44px;
  box-shadow: 0px 3px 21px 0px rgba(143, 117, 0, 0.1);
  .header {
    position: relative;
    width: 1366px;
    height: 68px;
    background: #ffffff;
    margin: 0 auto;
    height: 68px;
    line-height: 68px;
  }
}
.lg-content {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 224px);
  .lg-box {
    width: 600px;
    height: 544px;
    padding: 35px 62px 22px 78px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0px 3px 21px 0px rgba(143, 117, 0, 0.1);
    user-select: none;
    .lg-title {
      font-size: 24px;
      font-weight: bold;
      height: 26px;
      line-height: 26px;
      box-sizing: border-box;
      div {
        cursor: pointer;
        display: inline-block;
        line-height: 26px;
        span {
          display: inline-block;
        }
      }
      .lg-fg {
        position: relative;
        width: 81px;
        margin-right: 19px;
      }
      .lg-fg::after {
        content: "";
        position: absolute;
        right: 0;
        width: 4px;
        height: 26px;
        background: #000;
      }
    }
  }
  .lg-label {
    font-size: 14px;
    color: #ABABAB;
    line-height: 12px;
    margin-bottom: 0;
    }
    .lg-button {
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #fff;
        text-align: center;
        background: linear-gradient(to right, rgba(253,217,54,0.8), rgba(253,96,74,0.8));
        box-shadow: 0px 3px 9px 0px rgba(217,208,168,0.1); 
        border-radius: 20px;
        cursor: pointer;
        margin-top: 14px;
    }
    .lg-button-dis {
         height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #fff;
        text-align: center;
        background: #edf1f4;
        box-shadow: 0px 3px 9px 0px rgba(217,208,168,0.1); 
        border-radius: 20px;
        cursor: pointer;
        margin-top: 14px;
    }
    .lg-forget {
        text-align: right;
        color: #ABABAB;
        font-size: 14px;
        cursor: pointer;
    }
    .lg-other {
      margin-top: 44px;
      text-align: center;
      color: #ABABAB;
      img {
        cursor: pointer;
      }
    }
    .lg-vail {
      font-size: 14px;
      color: #FDD004;
      cursor: pointer;
    }
    .lg-sec {
      font-size: 14px;
      color: #ABABAB;
    }
}
.lg-info {
    // position: absolute;
    // bottom: 0;
    // left: 40%;
    margin-top: 40px;
    font-size: 14px;
    color: #ABABAB;
    text-align: center;
}
</style>