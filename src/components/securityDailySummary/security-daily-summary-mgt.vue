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
          <td>LKJ问题数：</td>
          <td v-text="rspData.lkjCnt"></td>
          <td>EOAS问题数：</td>
          <td v-text="rspData.eoasCnt"></td>
        </tr>
        <tr>
          <td>6A报警数：</td>
          <td v-text="rspData.a6AlarmCnt"></td>
          <td>6A故障数：</td>
          <td v-text="rspData.a6ProblemCnt"></td>
        </tr>
        <tr class="complex">
          <td>430报警数：</td>
          <td v-text="rspData.jk11430AlarmCnt"></td>
          <td>TCMS报警数：</td>
          <td v-text="rspData.tcmsAlarmCnt"></td>
        </tr>
        <tr>
          <td>弓网检测报警数：</td>
          <td colspan="3" v-text="rspData.pccAlarmCnt"></td>
        </tr>
        </tbody>
        <tbody v-if="editing" class="mgt-update">
        <tr>
          <td>LKJ问题数：</td>
          <td>
            <input type="number" v-model="rspData.lkjCnt" v-validate="'required'" name="lkjCnt"/><span class="warning"><span class="warning"> *</span></span>
            <span v-show="errors.has('lkjCnt')" class="prompt">不能为空 </span>
          </td>
          <td>EOAS问题数：</td>
          <td>
            <input type="number" v-model="rspData.eoasCnt" v-validate="'required'" name="eoasCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('eoasCnt')" class="prompt">不能为空 </span>
          </td>
        </tr>
        <tr>
          <td>6A报警数：</td>
          <td>
            <input type="number" v-model="rspData.a6AlarmCnt" v-validate="'required'" name="a6AlarmCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('a6AlarmCnt')" class="prompt">不能为空 </span>
          </td>
          <td>6A故障数：</td>
          <td>
            <input type="number" v-model="rspData.a6ProblemCnt" v-validate="'required'" name="a6ProblemCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('a6ProblemCnt')" class="prompt">不能为空 </span>
          </td>
        </tr>
        <tr>
          <td>430报警数：</td>
          <td>
            <input type="number" v-model="rspData.jk11430AlarmCnt" v-validate="'required'" name="jk11430AlarmCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('jk11430AlarmCnt')" class="prompt">不能为空 </span>
          </td>
          <td>TCMS报警数：</td>
          <td>
            <input type="number" v-model="rspData.tcmsAlarmCnt" v-validate="'required'" name="tcmsAlarmCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('tcmsAlarmCnt')" class="prompt">不能为空 </span>
          </td>
        </tr>
        <tr>
          <td>弓网检测报警数：</td>
          <td colspan="3">
            <input type="number" v-model="rspData.pccAlarmCnt" v-validate="'required'" name="pccAlarmCnt"/><span class="warning"> *</span>
            <span v-show="errors.has('pccAlarmCnt')" class="prompt">不能为空 </span>
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
        isAudit: config.containsPrivilege('P-SECURITY-DAILY-SUMMARY-MGT-AUDIT'),
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
        let timeLimit = config.getTimeLimit(rspData.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-11', 15)
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
          url: '/api/security-daily-summary/mgt/get'
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
          'lkjCnt': 'LKJ问题数',
          'eoasCnt': 'EOAS问题数',
          'a6AlarmCnt': '6A报警数',
          'a6ProblemCnt': '6A故障数',
          'jk11430AlarmCnt': '430报警数',
          'tcmsAlarmCnt': 'TCMS报警数',
          'pccAlarmCnt': '弓网检测报警数'
        }
        for (let i in this.rspData) {
          if (this.rspData[i] === '' && cols[i]) {
            this.$message.error('请将表格填写完整')
            return
          } else if (this.rspData[i] < 0) {
            this.$message.error(`${cols[i]}不能填写负数`)
            return
          } else if (this.rspData[i] > 10000) {
            this.$message({
              message: `${cols[i]}的数值太大`,
              type: 'error'
            })
            return
          }
        }
        this.rspData.date = this.reqVo.date
        this.axios({
          method: 'post',
          data: this.rspData,
          url: '/api/security-daily-summary/mgt/upsert'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('更新成功')
            this.editing = false
            this.requestData()
          } else if (data.type === 401) {
            config.gotoLogin()
            self.loginPopup = true
            this.$message.error('登录信息验证失败')
          } else {
            this.$message.error(data.msg)
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
