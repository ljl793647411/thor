<template>
  <div class="login">
    <div :class="{'login-header': !popup, 'login-header-is': popup}">数据综合运用平台</div>
    <div class="login-icon" v-if="!popup"></div>
    <div class="login-div">
      <p>
        <span class="loginName-icon login-loginName"></span>
        <input placeholder="请输入登入账号" type="text" name="loginName" id="loginName" v-model="loginVo.loginName" />
      </p>
      <p>
        <span class="password-icon login-password"></span>
        <input placeholder="请输入密码" type="text" name="password" v-model="password" v-show="eyesOpen" />
        <input placeholder="请输入密码" type="password" name="password" v-model="password" v-show="!eyesOpen" />
        <span class="password-eyes" :class="{ passwordIconEyesOpen: eyesOpen, passwordIconEyesClose: !eyesOpen }" @click="eyesToggle"></span>
      </p>
      <div class="login-btn-box">
        <el-button type="primary" @click="login" class="login-btn">登 录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import md5 from 'js-md5'
  export default {
    name: 'login',
    data () {
      return {
        msg: 'login!!!',
        imageUrl: '',
        eyesOpen: false,
        imgOnerror: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504762603437&di=60a979d4c5169ecf9309b63fd63fa870&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D1002907359%2C3496940718%26fm%3D214%26gp%3D0.jpg',
        imgOnload: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504762603437&di=60a979d4c5169ecf9309b63fd63fa870&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D1002907359%2C3496940718%26fm%3D214%26gp%3D0.jpg',
        loginVo: {},
        password: ''
      }
    },
    props: ['popup'],
    mounted () {
      this.$nextTick(() => {
        console.log(this.pupup)
        let loginResult = config.getStorage('loginResult')
        if (loginResult && !this.popup) {
          this.$emit('initialize')
          let path = this.getFirstVisitableMenu(loginResult.menus)
          if (path) {
            this.$router.push({'path': path})
          }
        }
        this.eyesOpen = false // 默认状态，密码不显示
        document.onkeydown = (evt) => {
          let key
          if (window.event) { // IE/Chrome/Opera(新版本)
            key = evt.keyCode
          } else if (evt.which) { // Netscape/Firefox/Opera/Chrome/IE（新版本）
            key = evt.which
          }
          if (key === 13) {
            this.login()
          }
        }
      })
    },
    methods: {
      login () { // 登入
        if (!this.loginVo.loginName) {
          this.$message.error('请输入登入账号')
          return null
        } else if (!this.password) {
          this.$message.error('请输入密码')
          return null
        }
        const loginVo = this.loginVo
        //    var md5 = crypto.createHash("md5")
        loginVo.password = md5.hex(this.password)
        this.axios({
          method: 'post',
          url: '/api/user/login',
          data: loginVo
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.loginVo.loginName = ''
            this.loginVo.password = ''
            this.$emit('setLoginInfo', data.result) // 将loginInfo传给App.vue
            if (!this.popup) {
              let path = this.getFirstVisitableMenu(data.result.menus)
              if (path) {
                this.$router.push({
                  path: path
                }) // 如果不是弹框的登入框
                this.$emit('changeRoute', this.$router)
              }
            } else {
              console.log('准备将result传入父组件')
              this.$emit('loginSuccess', data.result) // 将登入信息传入login-popup组件内，等待父组件将信息转发出去
            }
          } else {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          this.$message.error(error.msg)
        })
      },
      eyesToggle () { // 账号密码显示隐藏
        this.eyesOpen = !this.eyesOpen
      },
      getFirstVisitableMenu (menus) {
        for (let i in menus) {
          let stack = []
          stack.push(menus[i])
          while (stack.length) {
            let menu = stack.pop()
            if (menu.path && menu.path.startsWith('#')) {
              return menu.path.substr(1)
            }
            if (menu.children) {
              for (let j = menu.children.length - 1; j >= 0; j--) {
                stack.push(menu.children[j])
              }
            }
          }
        }
        console.log('no visitable menu found, return empty')
        return ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  body {
    margin:0;
  }
  h1,h2 {
    font-weight: normal;
  }
  p {
    margin: 0;
  }
  .login {
    height: 100vh;
    text-align: center;
    background: url(../../static/bj.png);
    overflow: hidden;
  }
  .login-header {
    font-family: simsun;
    font-size: 66px;
    color: #fff;
    margin-top:10.7%;
    margin-bottom: 8%;
    font-family: '宋体';
  }
  .login-header-is {
    font-family: simsun;
    font-size: 44px;
    color: #fff;
    margin-top:10.7%;
    margin-bottom: 8%;
    font-family: '宋体';
  }
  .login-div {
    display: inline-block;
    text-align: left;
    position: relative;
  }
  .login-div input[type='text'], .login-div input[type='password']{
    width: 288px !important;
    height: 48px !important;
    font-size: 16px;
    margin-top: 10px;
    padding: 0 0 0 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    color: #fff;
    background: #152c38 !important;
    font-family: '微软雅黑';
  }
  .login-div p {
    position: relative;
  }
  .loginName-icon {
    /*background: url(../../static/login_icon.png) -5px -6px no-repeat;*/
    width: 25px;
    height: 35px;
  }
  .login-loginName {
    display: inline-block;
    position: absolute;
    top: 21px;
    left: 1px;
  }
  .password-icon {
    /*background: url(../../static/login_icon.png) -31px -6px no-repeat;*/
    width: 25px;
    height: 35px;
  }
  .login-password {
    display: inline-block;
    position: absolute;
    top: 21px;
    left: 1px;
    z-index: 2;
  }
  .password-eyes {
    display: inline-block;
    position: absolute;
    top: 21px;
    right: 1px;
  }
  .passwordIconEyesOpen {
    background: url(../../static/login-icon.png) -236px -99px no-repeat;
    width: 25px;
    height: 35px;
  }
  .passwordIconEyesClose {
    background: url(../../static/login-icon.png) -236px -132px no-repeat;
    width: 25px;
    height: 35px;
  }
  .img-identify {
    position: relative;
  }
  .img-identify img {
    display: inline-block;
    position: absolute;
    right: 3px;
    top: 26px;
    cursor: pointer;
  }
  .login-div .btn {
    height: 40px;
    width: 100%;
    margin-top: 40px;
    border-radius: 0;
    line-height: 40px;
    font-size: 18px;
    font-family: "微软雅黑", Arial;
  }
  .login-btn-box {
    margin-top: 30px;
  }
  .login-btn {
    width: 300px;
    height: 40px;
    border-radius: 6px;
    text-align: center;
    font-family: "微软雅黑";
    font-size: 18px;
  }
  img {
    margin: 0;
  }
  .login-icon {
    width: 150px;
    height: 150px;
    background-image: url(../../static/login-bg1.png);
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    top:40px;
    right:20px;
  }
</style>
