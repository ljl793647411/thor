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
      <table class="">
        <thead>
          <tr>
            <th></th>
            <th>应转数</th>
            <th>实转数</th>
            <th>故障数</th>
            <th>问题说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>LKJ</td>
            <td v-text="rspData.lkjPlanedCnt"></td>
            <td v-text="rspData.lkjMissingCnt"></td>
            <td v-text="rspData.lkjPlanedCnt - rspData.lkjMissingCnt"></td>
            <td v-text="rspData.lkjMemo"></td>
          </tr>
          <tr v-for="(item, index) in rspData.eoasMissingItems" class="complex">
            <template v-if="index == 0">
            <td :rowspan="rspData.eoasMissingItems.length">EOAS</td>
            <td :rowspan="rspData.eoasMissingItems.length" v-text="rspData.eoasPlanedCnt"></td>
            <td :rowspan="rspData.eoasMissingItems.length" v-text="rspData.eoasPlanedCnt - rspData.eoasMissingCnt"></td>
            </template>
            <td v-text="item.name + '：' + item.cnt"></td>
            <td v-text="item.memo"></td>
          </tr>
          <tr>
            <td>音频</td>
            <td v-text="rspData.ttdAudioPlanedCnt"></td>
            <td v-text="rspData.ttdAudioMissingCnt"></td>
            <td v-text="rspData.ttdAudioPlanedCnt - rspData.ttdAudioMissingCnt"></td>
            <td v-text="rspData.ttdAudioMemo"></td>
          </tr>
          <tr v-for="(item, index) in rspData.ttdVideoMissingItems" class="complex">
            <template v-if="index == 0">
            <td :rowspan="rspData.ttdVideoMissingItems.length">视频</td>
            <td :rowspan="rspData.ttdVideoMissingItems.length" v-text="rspData.ttdVideoPlanedCnt"></td>
            <td :rowspan="rspData.ttdVideoMissingItems.length" v-text="rspData.ttdVideoPlanedCnt - rspData.ttdVideoMissingCnt"></td>
            </template>
            <td v-text="item.name + '：' + item.cnt"></td>
            <td v-text="item.memo"></td>
          </tr>
          <tr v-for="(item, index) in rspData.omVideoMissingItems">
            <template v-if="index == 0">
            <td :rowspan="rspData.omVideoMissingItems.length">摄像手电</td>
            <td :rowspan="rspData.omVideoMissingItems.length" v-text="rspData.omVideoPlanedCnt"></td>
            <td :rowspan="rspData.omVideoMissingItems.length" v-text="rspData.omVideoPlanedCnt - rspData.omVideoMissingCnt"></td>
            </template>
            <td v-text="item.name + '：' + item.cnt"></td>
            <td v-text="item.memo"></td>
          </tr>
          <tr class="complex">
            <td>合计</td>
            <td v-text="rspData.lkjPlanedCnt + rspData.eoasPlanedCnt + rspData.ttdAudioPlanedCnt + rspData.ttdVideoPlanedCnt + rspData.omVideoPlanedCnt"></td>
            <td v-text="rspData.lkjMissingCnt + rspData.eoasMissingCnt + rspData.ttdAudioMissingCnt + rspData.ttdVideoMissingCnt + rspData.omVideoMissingCnt"></td>
            <td v-text="(rspData.lkjPlanedCnt + rspData.eoasPlanedCnt + rspData.ttdAudioPlanedCnt + rspData.ttdVideoPlanedCnt + rspData.omVideoPlanedCnt) - (rspData.lkjMissingCnt + rspData.eoasMissingCnt + rspData.ttdAudioMissingCnt + rspData.ttdVideoMissingCnt + rspData.omVideoMissingCnt)"></td>
            <td>-</td>
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
        rspData: {},
        errMsg: '',
        loading: false
      }
    },
    components: {
      loginPopup,
      dateBox
    },
    created () {
      if (this.$route.query.date) {
        this.reqVo.date = this.$route.query.date
        this.requestData()
      } else {
        this.receiveDate()
      }
    },
    methods: {
      receiveDate (date) {
        if (date) {
          this.reqVo.date = date
        }
        this.requestData()
      },
      requestData () {
        this.errMsg = false
        let self = this
        this.loading = true
        this.axios({
          method: 'GET',
          params: this.reqVo,
          url: '/api/data-check-daily-summary/view/get'
        }).then((response) => {
          self.loading = false
          var data = response.data
          if (data.type === 1) {
            this.rspData = data.result
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.$message.error('登录信息验证失败')
            self.loginPopup = true
          } else {
            self.errMsg = true
            self.$message.error(data.msg)
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
