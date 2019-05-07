<template>
  <div>
    <input type="text" v-model="driver" name="reqVo" @focus="respBoxChange" @blur="respBoxClose" v-validate=" 'required'"/>
    <span class="warning" v-if="!work2 && !work3 && !work4"> *</span>
    <span v-show="errors.has('reqVo')" class="prompt dri" v-if="!work2 && !work3 && !work4">不能为空 </span>
    <ul v-if="respWorkNoList.length !== 0 && respBox" class="search-box cursor">
      <li v-for="resp in respWorkNoList" :key="resp.sid" @click="getResp(resp)">{{ resp.name + '（' + resp.workNo + '）' }}</li>
    </ul>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  export default {
    data () {
      return {
        driver: '',
        respWorkNoList: [],
        respBox: false,
        loginPopup: false
      }
    },
    watch: {
      driver: 'changeRespWorkNos'
    },
    mounted () {
      this.$nextTick(() => {
        console.log('司机模糊查询')
        if (this.people) {
          this.driver = this.people
        }
      })
    },
    components: {
      loginPopup
    },
    props: ['reqVo', 'people', 'work2', 'work3', 'work4'],
    methods: {
      changeRespWorkNos () {
        if (encodeURI(this.driver).length < 2) {
          return
        }
        if (this.driver.length === 0) {
          this.respWorkNoList = []
        }
        this.reqVo.deptCode = config.deptCode
        this.reqVo.deptType = config.deptType
        this.reqVo.searchStr = this.driver
        setTimeout(() => {
          this.axios({
            method: 'get',
            params: this.reqVo,
            url: '/api/op/driver/view/search-by-name-work-no'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.respWorkNoList = data.result.list
            } else if (data.type === 401) { // 登入信息验证失败
              config.gotoLogin()
              this.loginPopup = true
            }
          }).catch((error) => {
            console.log(error)
          })
        }, 500)
      },
      getResp (resp) {
        this.driver = `${resp.name} （${resp.workNo}）`
        console.log(this.$el.textContent)
        this.$nextTick(function () {
          console.log(this.$el.textContent) // => '更新完成'
        })
        if (this.work4) {
          this.$emit('getDriver4', resp)
        } else if (this.work3) {
          this.$emit('getDriver3', resp)
        } else if (this.work2) {
          this.$emit('getDriver2', resp)
        } else {
          this.$emit('getDriver', resp)
        }
        this.respWorkNoList = []
        this.respBox = false
      },
      respBoxChange () {
        this.respBox = true
      },
      respBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = []
          this.respBox = false
        }, 500)
      }
    },
    loginSuccess (result) { // 登入成功（从弹窗登入成功）
      this.loginPopup = false
      this.$emit('setLoginInfo', result)
      console.log('弹窗登入成功')
    }
  }
</script>

<style scoped>
  .prompt.dri{
    margin-left: 140px;
  }
  .search-box {
    width: 170px;
  }
</style>
