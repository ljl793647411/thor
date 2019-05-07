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
        <thead>
        <tr>
          <th rowspan="2" colspan="2">机车类型</th>
          <th rowspan="2">专修</th>
          <th colspan="3">定修</th>
          <th rowspan="2">临修</th>
        </tr>
        <tr>
          <th>小修 / C1</th>
          <th>中修 / C2</th>
          <th>大修 / C3</th>
        </tr>
        </thead>
        <tbody v-if="!editing">
        <tr class="complex">
          <td rowspan="2">内燃机车</td>
          <td>计划</td>
          <td v-text="rspData.dlmRomPlanedCnt"></td>
          <td v-text="rspData.dlmPomL1PlanedCnt"></td>
          <td v-text="rspData.dlmPomL2PlanedCnt"></td>
          <td v-text="rspData.dlmPomL3PlanedCnt"></td>
          <td rowspan="2" v-text="rspData.dlmUomCnt"></td>
        </tr>
        <tr class="complex">
          <td>实际</td>
          <td v-text="rspData.dlmRomActualCnt"></td>
          <td v-text="rspData.dlmPomL1ActualCnt"></td>
          <td v-text="rspData.dlmPomL2ActualCnt"></td>
          <td v-text="rspData.dlmPomL3ActualCnt"></td>
        </tr>
        <tr>
          <td rowspan="2">直流机车</td>
          <td>计划</td>
          <td v-text="rspData.dclmRomPlanedCnt"></td>
          <td v-text="rspData.dclmPomL1PlanedCnt"></td>
          <td v-text="rspData.dclmPomL2PlanedCnt"></td>
          <td v-text="rspData.dclmPomL3PlanedCnt"></td>
          <td rowspan="2" v-text="rspData.dclmUomCnt"></td>
        </tr>
        <tr>
          <td>实际</td>
          <td v-text="rspData.dclmRomActualCnt"></td>
          <td v-text="rspData.dclmPomL1ActualCnt"></td>
          <td v-text="rspData.dclmPomL2ActualCnt"></td>
          <td v-text="rspData.dclmPomL3ActualCnt"></td>
        </tr>
        <tr class="complex">
          <td rowspan="2">交流机车</td>
          <td>计划</td>
          <td v-text="rspData.aclmRomPlanedCnt"></td>
          <td v-text="rspData.aclmPomL1PlanedCnt"></td>
          <td v-text="rspData.aclmPomL2PlanedCnt"></td>
          <td v-text="rspData.aclmPomL3PlanedCnt"></td>
          <td rowspan="2" v-text="rspData.aclmUomCnt"></td>
        </tr>
        <tr class="complex">
          <td>实际</td>
          <td v-text="rspData.aclmRomActualCnt"></td>
          <td v-text="rspData.aclmPomL1ActualCnt"></td>
          <td v-text="rspData.aclmPomL2ActualCnt"></td>
          <td v-text="rspData.aclmPomL3ActualCnt"></td>
        </tr>
        </tbody>
        <tbody v-if="editing" class="mgt-update">
        <tr>
          <td rowspan="2">内燃机车</td>
          <td>计划</td>
          <td>
            <input type="number" v-model="rspData.dlmRomPlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dlmPomL1PlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dlmPomL2PlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dlmPomL3PlanedCnt"/>
          </td>
          <td rowspan="2">
            <input type="number" v-model="rspData.dlmUomCnt"/>
          </td>
        </tr>
        <tr>
          <td>实际</td>
          <td>
            <input type="number" v-model="rspData.dlmRomActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dlmPomL1ActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dlmPomL2ActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dlmPomL3ActualCnt"/>
          </td>
        </tr>
        <tr>
          <td rowspan="2">直流机车</td>
          <td>计划</td>
          <td>
            <input type="number" v-model="rspData.dclmRomPlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dclmPomL1PlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dclmPomL2PlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dclmPomL3PlanedCnt"/>
          </td>
          <td rowspan="2">
            <input type="number" v-model="rspData.dclmUomCnt"/>
          </td>
        </tr>
        <tr>
          <td>实际</td>
          <td>
            <input type="number" v-model="rspData.dclmRomActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dclmPomL1ActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dclmPomL2ActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.dclmPomL3ActualCnt"/>
          </td>
        </tr>
        <tr>
          <td rowspan="2">交流机车</td>
          <td>计划</td>
          <td>
            <input type="number" v-model="rspData.aclmRomPlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.aclmPomL1PlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.aclmPomL2PlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.aclmPomL3PlanedCnt"/>
          </td>
          <td rowspan="2">
            <input type="number" v-model="rspData.aclmUomCnt"/>
          </td>
        </tr>
        <tr>
          <td>实际</td>
          <td>
            <input type="number" v-model="rspData.aclmRomActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.aclmPomL1ActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.aclmPomL2ActualCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.aclmPomL3ActualCnt"/>
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
        isAudit: config.containsPrivilege('P-LM-OM-DAILY-SUMMARY-MGT-AUDIT'),
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
        let timeLimit = config.getTimeLimit(rspData.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-10', 15)
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
          url: '/api/lm-om-daily-summary/mgt/get'
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
          'dlmRomPlanedCnt': '内燃机车计划专修',
          'dlmRomActualCnt': '内燃机车实际专修',
          'dlmPomL1PlanedCnt': '内燃机车计划小修 / C1',
          'dlmPomL1ActualCnt': '内燃机车实际小修 / C1',
          'dlmPomL2PlanedCnt': '内燃机车计划中修 / C2',
          'dlmPomL2ActualCnt': '内燃机车实际中修 / C2',
          'dlmPomL3PlanedCnt': '内燃机车计划大修 / C3',
          'dlmPomL3ActualCnt': '内燃机车实际大修 / C3',
          'dlmUomCnt': '内燃机车临修',
          'dclmRomPlanedCnt': '直流机车计划专修',
          'dclmRomActualCnt': '直流机车实际专修',
          'dclmPomL1PlanedCnt': '直流机车计划小修 / C1',
          'dclmPomL1ActualCnt': '直流机车实际小修 / C1',
          'dclmPomL2PlanedCnt': '直流机车计划中修 / C2',
          'dclmPomL2ActualCnt': '直流机车实际中修 / C2',
          'dclmPomL3PlanedCnt': '直流机车计划大修 / C3',
          'dclmPomL3ActualCnt': '直流机车实际大修 / C3',
          'dclmUomCnt': '直流机车临修',
          'aclmRomPlanedCnt': '交流机车计划专修',
          'aclmRomActualCnt': '交流机车实际专修',
          'aclmPomL1PlanedCnt': '交流机车计划小修 / C1',
          'aclmPomL1ActualCnt': '交流机车实际小修 / C1',
          'aclmPomL2PlanedCnt': '交流机车计划中修 / C2',
          'aclmPomL2ActualCnt': '交流机车实际中修 / C2',
          'aclmPomL3PlanedCnt': '交流机车计划大修 / C3',
          'aclmPomL3ActualCnt': '交流机车实际大修 / C3',
          'aclmUomCnt': '交流机车临修'
        }
        for (let i in this.rspData) {
          if (this.rspData[i] === '' && cols[i]) {
            this.$message.error(`请将${cols[i]}填写完整`)
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
          url: '/api/lm-om-daily-summary/mgt/upsert'
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
  .search-div {
    width: 100%;
  }

  .h-chart {
    overflow: hidden;
    margin-bottom: 50px;
  }

  .table input[type="text"], input[type="number"] {
    width: 50px;
  }
</style>
