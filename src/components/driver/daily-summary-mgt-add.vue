<template>
  <div>
    <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 920;"></div>
    <div class="popup" style="height: 500px;">
      <div class="head" style="text-align: center;">
        <p style="font-weight: bold;">每日汇总</p>
        <i class="icon-remove icon-white" @click="boxClose"></i>
      </div>
      <div>
        <table style="margin-top: 30px;">
          <tr>
            <td class="td-right">司机:</td>
            <td class="td-left">
              <input type="text" v-model="dsVoMgt.workNo" v-validate="'required'" name="workNo"/><span class="warning"> *</span>
              <span v-show="errors.has('workNo')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">发生时间:</td>
            <td class="td-left">
              <datepicker :inline="false" v-model="dsVoMgt.date" language="zh" name="trainDt" :format="state.format" :disabled="state.disabled" :highlighted="state.highlighted" @input="formatTrainDt" class="calendarColor"></datepicker><span class="warning"> *</span>
              <span v-show="errors.has('date')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">出勤次数:</td>
            <td class="td-left">
              <input type="text" v-model="dsVoMgt.onDutyCnt" v-validate="'required'" name="onDutyCnt"/><span class="warning"> *</span>
              <span v-show="errors.has('onDutyCnt')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">值乘趟数:</td>
            <td class="td-left">
              <input type="text" v-model="dsVoMgt.ttdCnt" v-validate="'required'" name="ttdCnt"/><span class="warning"> *</span>
              <span v-show="errors.has('ttdCnt')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">酒测通过率,0-100:</td>
            <td class="td-left">
              <input type="text" v-model="dsVoMgt.wtRate" v-validate="'required'" name="wtRate"/><span class="warning"> *</span>
              <span v-show="errors.has('wtRate')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">揭示核对执行率:</td>
            <td class="td-left">
              <input type="text" v-model="dsVoMgt.rcRate" v-validate="'required'" name="rcRate"/><span class="warning"> *</span>
              <span v-show="errors.has('rcRate')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">五色图分析评分,0-100:</td>
            <td class="td-left">
              <input type="text" v-model="dsVoMgt.ccaScore" v-validate="'required'" name="ccaScore"/><span class="warning"> *</span>
              <span v-show="errors.has('ccaScore')" class="prompt">不能为空 </span>
            </td>
          </tr>
        </table>
      </div>
      <div class="err-msg" v-text="errMsg"></div>
      <div class="popup-submit">
        <div class="btn-primary btn-md dept-box-btn" @click="createDsVodMgtBox">提交</div>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import Datepicker from 'vuejs-datepicker'
  export default {
    name: 'dsVodMgtAddBox',
    data () {
      return {
        state: {
          format: 'yyyy-MM-dd',
          disabled: {
            from: new Date()
          },
          highlighted: {
            dates: [new Date()]
          }
        },
        loginPopup: false,
        errMsg: ''
      }
    },
    mounted () {
      this.$nextTick(() => {

      })
    },
    components: {
      loginPopup,
      Datepicker
    },
    props: ['dsVoMgt'],
    methods: {
      formatTrainDt () {
        this.dsVoMgt.date = config.dateToString(this.dsVoMgt.date, 'yyyy-MM-dd')
      },
      createDsVodMgtBox () {
        let url = this.dsVoMgt.sid ? '/api/driver-daily-summary/mgt/update' : '/api/driver-daily-summary/mgt/create'
        for (let i in this.dsVoMgt) {
          if (this.dsVoMgt[i] === '' && i !== 'createdByName' && i !== 'updatedByName' && i !== 'updatedByWorkNo' && i !== 'updatedDt') {
            return
          }
        }
        this.dsVoMgt.onDutyCnt = parseInt(this.dsVoMgt.onDutyCnt)
        this.dsVoMgt.ttdCnt = parseInt(this.dsVoMgt.ttdCnt)
        this.dsVoMgt.wtRate = parseInt(this.dsVoMgt.wtRate)
        this.dsVoMgt.rcRate = parseInt(this.dsVoMgt.rcRate)
        this.dsVoMgt.ccaScore = parseInt(this.dsVoMgt.ccaScore)
        if (this.dsVoMgt.wtRate > 100) {
          this.errMsg = '酒测通过率不大于100!'
          this.hideMsg()
          return
        } else if (this.dsVoMgt.ccaScore > 100) {
          this.errMsg = '五色图分析评分不大于100!'
          this.hideMsg()
          return
        }
        this.axios({
          method: 'post',
          data: this.dsVoMgt,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            console.log('操作成功')
            this.$emit('closeBox')
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      hideMsg () {
        setTimeout(() => {
          this.errMsg = ''
        }, 5000)
      },
      boxClose () {
        this.$emit('closeBox')
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      }
    }
  }
</script>

<style scoped>
  .popup .dri-box {
    margin: 0 auto;
    margin-top: 50px;
  }
  .calendarColor{
    color: #000;
  }
  .popup {
    z-index:920;
  }
</style>
