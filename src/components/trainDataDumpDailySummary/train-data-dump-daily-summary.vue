<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search-div">
      <date-box @sendDate="receiveDate" :onlyDate="true" :date="reqVo.date"></date-box>
    </div>
    <div v-if="this.rspData.createdDt" class="info-msg">
      <label v-text="this.rspData.createdByName + '(' + this.rspData.createdByWorkNo + ') 创建于 ' + this.rspData.createdDt"></label>
      <label v-if="this.rspData.updatedDt" v-text="this.rspData.updatedByName + '(' + this.rspData.updatedByWorkNo + ') 修改于 ' + this.rspData.updatedDt"></label>
    </div>
    <div class="table" style="margin-top: 23px;" v-if="!errMsg">
      <table style="width: 800px;overflow-x: scroll;" class="table-hover">
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
            <td v-text="rspData.lkjActualCnt"></td>
            <td v-text="rspData.lkjPlanedCnt - rspData.lkjActualCnt"></td>
            <td v-text="rspData.lkjMemo"></td>
          </tr>
          <tr>
            <td>EOAS</td>
            <td v-text="rspData.eoasPlanedCnt"></td>
            <td v-text="rspData.eoasActualCnt"></td>
            <td v-text="rspData.eoasPlanedCnt - rspData.eoasActualCnt"></td>
            <td v-text="rspData.eoasMemo"></td>
          </tr>
          <tr>
            <td>音频</td>
            <td v-text="rspData.ttdAudioPlanedCnt"></td>
            <td v-text="rspData.ttdAudioActualCnt"></td>
            <td v-text="rspData.ttdAudioPlanedCnt - rspData.ttdAudioActualCnt"></td>
            <td v-text="rspData.ttdAudioMemo"></td>
          </tr>
          <tr>
            <td>视频</td>
            <td v-text="rspData.ttdVideoPlanedCnt"></td>
            <td v-text="rspData.ttdVideoActualCnt"></td>
            <td v-text="rspData.ttdVideoPlanedCnt - rspData.ttdVideoActualCnt"></td>
            <td v-text="rspData.ttdVideoMemo"></td>
          </tr>
          <tr>
            <td>摄像手电</td>
            <td v-text="rspData.omVideoPlanedCnt"></td>
            <td v-text="rspData.omVideoActualCnt"></td>
            <td v-text="rspData.omVideoPlanedCnt - rspData.omVideoActualCnt"></td>
            <td v-text="rspData.omVideoMemo"></td>
          </tr>
          <tr>
            <td>合计</td>
            <td v-text="rspData.lkjPlanedCnt + rspData.eoasPlanedCnt + rspData.ttdAudioPlanedCnt + rspData.ttdVideoPlanedCnt + rspData.omVideoPlanedCnt"></td>
            <td v-text="rspData.lkjActualCnt + rspData.eoasActualCnt + rspData.ttdAudioActualCnt + rspData.ttdVideoActualCnt + rspData.omVideoActualCnt"></td>
            <td v-text="(rspData.lkjPlanedCnt + rspData.eoasPlanedCnt + rspData.ttdAudioPlanedCnt + rspData.ttdVideoPlanedCnt + rspData.omVideoPlanedCnt) - (rspData.lkjActualCnt + rspData.eoasActualCnt + rspData.ttdAudioActualCnt + rspData.ttdVideoActualCnt + rspData.omVideoActualCnt)"></td>
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
        errMsg: false,
        laoding: false
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
        this.loading = true
        let self = this
        this.axios({
          method: 'GET',
          params: this.reqVo,
          url: '/api/dump-daily-summary/view/get'
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
  .search-div {
    width: 100%;
  }
  .h-chart {
    overflow: hidden;
    margin-bottom: 50px;
  }
  .table input[type="text"] {
    width: 50px;
  }
</style>
