<template>
<div>
  <div class="zhezhao" style="z-index: 940;"></div>
  <div class="popup-login">
  	<login @loginSuccess='loginSuccess' popup='true'></login>
  </div>
</div>
</template>

<script>
import login from '@/components/login'
export default { // login弹窗组件，（调用了login组件做的弹窗）
  components: {
    login
  },
  methods: {
    loginSuccess (result) { // 接收并转发登入信息
      this.$emit('loginSuccess', result) // 将登入信息传入非App.vue的父组件内，等待父组件将信息转发给App.vue
      console.log('进入login_popup')
    }
  }
}
</script>

<style scoped>
.popup-login{
  height: 50%;
  width: 500px;
  min-height: 400px;
  display: inline-block;
  z-index: 111111;
  background: #FFFFFF;
  position: fixed;
  text-align: left;
  max-height: 600px;
  margin: 0 0px 0px -300px;
  left: 50%;
  top: 20%;
  box-shadow: 0 3px 10px #101010;
}
.login{
  display: inline-block;
  z-index: 11111;
  background: url(../../static/bj.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 100%;
  height: 94%;
  width: 500px;
  border: 1px solid #fff;
  border-radius: 10px;
  padding-bottom: 30px;
}
</style>
