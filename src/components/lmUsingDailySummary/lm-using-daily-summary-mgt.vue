<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :onlyDate="true" :date="reqVo.date" class="search-child"></date-box>
      <div class="search-child">
        <el-button type="primary" @click="beginEdit" v-if="!editing" class="btn-right" size="medium">编 辑</el-button>
      </div>
      <div class="search-child">
        <el-button type="danger" @click="cancelEdit" v-if="editing" class="btn-right" size="medium">取 消</el-button>
      </div>
      <div class="search-child">
        <el-button type="primary" @click="submit" v-if="editing" class="btn-right" size="medium">提 交</el-button>
      </div>
    </div>
    <div v-if="this.rspData.createdDt" class="info-msg">
      <label v-text="this.rspData.createdByName + '(' + this.rspData.createdByWorkNo + ') 创建于 ' + this.rspData.createdDt"></label>
      <label v-if="this.rspData.updatedDt" v-text="this.rspData.updatedByName + '(' + this.rspData.updatedByWorkNo + ') 修改于 ' + this.rspData.updatedDt"></label>
    </div>
    <div class="table">
      <table>
        <tbody v-if="!editing">
        <tr class="complex">
          <td>日车公里：</td>
          <td v-text="rspData.lmKilo"></td>
          <td>日吨公里：</td>
          <td v-text="rspData.tonKilo"></td>
        </tr>
        <tr>
          <td>机车出库：</td>
          <td v-text="rspData.lmOffDepotCnt"></td>
          <td>机车入库：</td>
          <td v-text="rspData.lmToDepotCnt"></td>
        </tr>
        <tr class="complex">
          <td>客车出勤：</td>
          <td v-text="rspData.passengerTrainOnDutyCnt"></td>
          <td>客车退勤：</td>
          <td v-text="rspData.passengerTrainOffDutyCnt"></td>
        </tr>
        <tr>
          <td>货车出勤：</td>
          <td v-text="rspData.freightTrainOnDutyCnt"></td>
          <td>货车退勤：</td>
          <td v-text="rspData.freightTrainOffDutyCnt"></td>
        </tr>
        <tr class="complex">
          <td>开行对数（图定）：</td>
          <td v-text="rspData.runPairCntPlaned"></td>
          <td>开行对数（实际）：</td>
          <td v-text="rspData.runPairCntActual"></td>
        </tr>
        <tr>
          <td>乘务员上线（图定）：</td>
          <td v-text="rspData.driverOnBoardCntPlaned"></td>
          <td>乘务员上线（实际）：</td>
          <td v-text="rspData.driverOnBoardCntActual"></td>
        </tr>
        </tbody>
        <tbody v-if="editing" class="mgt-update">
        <tr>
          <td>日车公里：</td>
          <td>
            <input type="number" v-model="rspData.lmKilo" v-validate="'required'" name="lmKilo"/><span class="warning"> *</span>
            <span v-show="errors.has('lmKilo')" class="prompt">不能为空 </span>
          </td>
          <td>日吨公里：</td>
          <td>
            <input type="number" v-model="rspData.tonKilo" v-validate="'required'" name="tonKilo"/><span class="warning"> *</span>
            <span v-show="errors.has('tonKilo')" class="prompt">不能为空 </span>
          </td>
        </tr>
        <tr>
          <td>机车出库：</td>
          <td>
            <input type="number" v-model="rspData.lmOffDepotCnt" v-validate="'required'" name="lmOffDepotCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('lmOffDepotCnt')" class="prompt">不能为空 </span>
          </td>
          <td>机车入库：</td>
          <td>
            <input type="number" v-model="rspData.lmToDepotCnt" v-validate="'required'" name="lmToDepotCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('lmToDepotCnt')" class="prompt">不能为空 </span>
          </td>
        </tr>
        <tr>
          <td>客车出勤：</td>
          <td>
            <input type="number" v-model="rspData.passengerTrainOnDutyCnt" v-validate="'required'" name="passengerTrainOnDutyCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('passengerTrainOnDutyCnt')" class="prompt">不能为空 </span>
          </td>
          <td>客车退勤：</td>
          <td>
            <input type="number" v-model="rspData.passengerTrainOffDutyCnt" v-validate="'required'" name="passengerTrainOffDutyCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('passengerTrainOffDutyCnt')" class="prompt">不能为空 </span>
          </td>
        </tr>
        <tr>
          <td>货车出勤：</td>
          <td>
            <input type="number" v-model="rspData.freightTrainOnDutyCnt" v-validate="'required'" name="freightTrainOnDutyCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('freightTrainOnDutyCnt')" class="prompt">不能为空 </span>
          </td>
          <td>货车退勤：</td>
          <td>
            <input type="number" v-model="rspData.freightTrainOffDutyCnt" v-validate="'required'" name="freightTrainOffDutyCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('freightTrainOffDutyCnt')" class="prompt">不能为空 </span>
          </td>
        </tr>
        <tr>
          <td>开行对数（图定）：</td>
          <td>
            <input type="number" v-model="rspData.runPairCntPlaned" v-validate="'required'" name="runPairCntPlaned"/><span class="warning"> *</span>
            <span v-show="errors.has('runPairCntPlaned')" class="prompt">不能为空 </span>
          </td>
          <td>开行对数（实际）：</td>
          <td>
            <input type="number" v-model="rspData.runPairCntActual" v-validate="'required'" name="runPairCntActual"/><span class="warning"> *</span>
            <span v-show="errors.has('runPairCntActual')" class="prompt">不能为空 </span>
          </td>
        </tr>
        <tr>
          <td>乘务员上线（图定）：</td>
          <td>
            <input type="number" v-model="rspData.driverOnBoardCntPlaned" v-validate="'required'" name="driverOnBoardCntPlaned"/><span class="warning"> *</span>
            <span v-show="errors.has('driverOnBoardCntPlaned')" class="prompt">不能为空 </span>
          </td>
          <td>乘务员上线（实际）：</td>
          <td>
            <input type="number" v-model="rspData.driverOnBoardCntActual" v-validate="'required'" name="driverOnBoardCntActual"/><span class="warning"> *</span>
            <span v-show="errors.has('driverOnBoardCntActual')" class="prompt">不能为空 </span>
          </td>
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
        editing: false,
        dataBackup: {}, // 备份编辑前的数据，用于在放弃编辑时恢复
        isAudit: config.containsPrivilege('P-LM-USING-DAILY-SUMMARY-MGT-AUDIT'),
        loading: false
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
      checkTime (rspData) {
        let timeLimit = config.getTimeLimit(rspData.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-09', 15)
        if (!this.isAudit && timeLimit) {
          this.$message.warning('当前用户无权修改创建超过' + timeLimit + '分钟的数据')
          return false
        } else {
          return true
        }
      },
      beginEdit () {
        if (!this.checkTime(this.rspData)) {
          return
        }
        this.dataBackup = JSON.parse(JSON.stringify(this.rspData))
        this.editing = true
      },
      cancelEdit () {
        this.$confirm('是否取消编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.rspData = JSON.parse(JSON.stringify(this.dataBackup))
          this.editing = false
          this.$message({
            type: 'info',
            message: '编辑取消!'
          })
        }).catch(() => {
        })
      },
      requestData () {
        let self = this
        this.editing = false
        this.loading = true
        this.axios({
          method: 'GET',
          params: this.reqVo,
          url: '/api/lm-using-daily-summary/mgt/get'
        }).then((response) => {
          self.loading = false
          var data = response.data
          if (data.type === 1) {
            this.rspData = data.result
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.loginPopup = true
          } else if (data.type === 403) {
            this.$message.error(data.msg)
          } else {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      submit () {
        let cols = {
          'lmKilo': '日车公里',
          'tonKilo': '日吨公里',
          'lmOffDepotCnt': '机车出库',
          'lmToDepotCnt': '机车入库',
          'runPairCntPlaned': '开行对数（图定）',
          'runPairCntActual': '开行对数（实际）',
          'passengerTrainOnDutyCnt': '客车出勤',
          'passengerTrainOffDutyCnt': '客车退勤',
          'freightTrainOnDutyCnt': '货车出勤',
          'freightTrainOffDutyCnt': '货车退勤',
          'driverOnBoardCntPlaned': '乘务员上线（图定）',
          'driverOnBoardCntActual': '乘务员上线（实际）'
        }
        for (let i in this.rspData) {
          if (this.rspData[i] === '' && cols[i]) {
            this.$message.error('请将表格填写完整')
            return
          } else if (this.rspData[i] > 10000) {
            this.$message({
              message: `${cols[i]}的数值太大`,
              type: 'error'
            })
            return
          } else if (this.rspData[i] < 0) {
            this.$message({
              message: `${cols[i]}不能为负数`,
              type: 'error'
            })
            return
          }
        }
        this.rspData.date = this.reqVo.date
        this.axios({
          method: 'post',
          data: this.rspData,
          url: '/api/lm-using-daily-summary/mgt/upsert'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('更新成功')
            this.editing = false
            this.requestData()
          } else if (data.type === 401) {
            config.gotoLogin()
            self.loginPopup = true
            this.$message.success('登录信息验证失败')
          } else {
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
  .prompt {
    position: absolute;
  }
</style>
