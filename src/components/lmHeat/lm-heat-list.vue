<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :onlyDate="true" :date="reqVo.date"></date-box>
    </div>
    <div v-if="this.rspData.createdDt" class="color-white">
      <label v-text="this.rspData.createdByName + '(' + this.rspData.createdByWorkNo + ') 创建于 ' + this.rspData.createdDt"></label>
      <label v-if="this.rspData.updatedDt" v-text="this.rspData.updatedByName + '(' + this.rspData.updatedByWorkNo + ') 修改于 ' + this.rspData.updatedDt"></label>
    </div>
    <div class="table" v-if="!errMsg">
      <table>
        <thead>
          <tr>
            <th>地点</th>
            <th>机车编号</th>
            <th>值班人员</th>
            <th style="width:40%;">备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rspData.list" :class="{complex: index % 2 === 0}">
            <td v-text="item.location"></td>
            <td v-text="item.lmNo"></td>
            <td v-text="item.ownerName"></td>
            <td v-text="item.memo"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import dateBox from '@/components/date-box'

  export default {
    name: 'opVod',
    data () {
      return {
        reqVo: {
          date: this.moment().format('YYYY-MM-DD'),
          rbCode: config.RBCode,
          ldCode: config.deptCode
        },
        loginPopup: false,
        errMsg: false,
        loading: false,
        rspData: {}
      }
    },
    components: {
      loginPopup,
      dateBox
    },
    methods: {
      receiveDate (date) {
        if (date) {
          this.reqVo.date = date
        }
        this.requestData()
      },
      requestData () {
        let self = this
        this.loading = true
        this.errMsg = false
        this.axios({
          method: 'GET',
          params: this.reqVo,
          url: '/api/lm-heat/view/get'
        }).then((response) => {
          self.loading = false
          var data = response.data
          if (data.type === 1) {
            this.rspData = data.result
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.loginPopup = true
          } else {
            self.errMsg = true
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      loginSuccess (result) {
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登录成功')
      }
    }
  }
</script>

<style scoped>
  
</style>
