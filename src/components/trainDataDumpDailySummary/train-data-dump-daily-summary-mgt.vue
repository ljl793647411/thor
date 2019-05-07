<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search-div">
      <date-box @sendDate="receiveDate" :onlyDate="true" :date="reqVo.date"></date-box>
      <el-button type="primary" @click="beginEdit" v-if="!editing" class="btn-right" size="medium">编 辑</el-button>
      <el-button type="danger" @click="cancelEdit" v-if="editing" class="btn-right" size="medium">取 消</el-button>
      <el-button type="primary" @click="submit" v-if="editing" class="btn-right" size="medium">提 交</el-button>
    </div>
    <div v-if="this.rspData.createdDt" class="info-msg">
      <label v-text="this.rspData.createdByName + '(' + this.rspData.createdByWorkNo + ') 创建于 ' + this.rspData.createdDt"></label>
      <label v-if="this.rspData.updatedDt" v-text="this.rspData.updatedByName + '(' + this.rspData.updatedByWorkNo + ') 修改于 ' + this.rspData.updatedDt"></label>
    </div>
    <div class="table" style="margin-top: 23px;">
      <table style="width: 800px;overflow-x: scroll;" class="table-hover">
        <thead>
        <tr>
          <th></th>
          <th>应转数</th>
          <th>实转数</th>
          <th v-if="!editing">故障数</th>
          <th>问题说明</th>
        </tr>
        </thead>
        <tbody v-if="!editing">
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
        <tbody v-if="editing">
        <tr>
          <td>LKJ</td>
          <td>
            <input type="text" v-model="rspData.lkjPlanedCnt"/>
          </td>
          <td>
            <input type="text" v-model="rspData.lkjActualCnt"/>
          </td>
          <td>
            <textarea v-model="rspData.lkjMemo"></textarea>
          </td>
        </tr>
        <tr>
          <td>EOAS</td>
          <td>
            <input type="text" v-model="rspData.eoasPlanedCnt"/>
          </td>
          <td>
            <input type="text" v-model="rspData.eoasActualCnt"/>
          </td>
          <td>
            <textarea v-model="rspData.eoasMemo"></textarea>
          </td>
        </tr>
        <tr>
          <td>音频</td>
          <td>
            <input type="text" v-model="rspData.ttdAudioPlanedCnt"/>
          </td>
          <td>
            <input type="text" v-model="rspData.ttdAudioActualCnt"/>
          </td>
          <td>
            <textarea v-model="rspData.ttdAudioMemo"></textarea>
          </td>
        </tr>
        <tr>
          <td>视频</td>
          <td>
            <input type="text" v-model="rspData.ttdVideoPlanedCnt"/>
          </td>
          <td>
            <input type="text" v-model="rspData.ttdVideoActualCnt"/>
          </td>
          <td>
            <textarea v-model="rspData.ttdVideoMemo"></textarea>
          </td>
        </tr>
        <tr>
          <td>摄像手电</td>
          <td>
            <input type="text" v-model="rspData.omVideoPlanedCnt"/>
          </td>
          <td>
            <input type="text" v-model="rspData.omVideoActualCnt"/>
          </td>
          <td>
            <textarea v-model="rspData.omVideoMemo"></textarea>
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
        isAudit: config.containsPrivilege('P-TRAIN-DATA-CHECK-DAILY-SUMMARY-MGT-AUDIT'),
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
        let timeLimit = config.getTimeLimit(rspData.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-12', 15)
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
          url: '/api/dump-daily-summary/mgt/get'
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
          lkjPlanedCnt: 'LKJ应转数',
          lkjActualCnt: 'LKJ实转数',
          eoasPlanedCnt: 'EOAS应转数',
          eoasActualCnt: 'EOAS实转数',
          ttdAudioPlanedCnt: '音频应转数',
          ttdAudioActualCnt: '音频实转数',
          ttdVideoPlanedCnt: '视频应转数',
          ttdVideoActualCnt: '视频实转数',
          omVideoPlanedCnt: '摄像手电应转数',
          omVideoActualCnt: '摄像手电实转数'
        }
        for (let i in this.rspData) {
          if (this.rspData[i] === '' && ['lkjPlanedCnt', 'lkjActualCnt', 'eoasPlanedCnt', 'eoasActualCnt', 'ttdAudioPlanedCnt', 'ttdAudioActualCnt', 'ttdVideoPlanedCnt', 'ttdVideoActualCnt', 'omVideoPlanedCnt', 'omVideoActualCnt'].includes(i)) {
            this.$message.error(`请将表格${cols[i]}填写完整`)
            return
          }
        }
        this.rspData.date = this.reqVo.date
        this.axios({
          method: 'post',
          data: this.rspData,
          url: '/api/dump-daily-summary/mgt/upsert'
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
            this.$message.success(data.msg)
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
