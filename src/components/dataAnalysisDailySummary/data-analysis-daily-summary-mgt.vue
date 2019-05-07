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
            <th>车载音频分析班数</th>
            <th>车载视频分析班数</th>
            <th>检修音频分析班数</th>
          </tr>
        </thead>
        <tbody v-if="!editing">
        <tr>
         <td>
          <tr v-for="val in rspData.ttdAudioItems">
          <td v-text="val.deptName" class="data-analysis-td"></td>
          <td v-text="val.cnt" class="data-analysis-td"></td>
        </tr>
        </td>
        <td>
          <tr v-for="val in rspData.ttdVideoItems">
            <td v-text="val.deptName" class="data-analysis-td"></td>
            <td v-text="val.cnt" class="data-analysis-td"></td>
          </tr>
        </td>
        <td v-text="rspData.ttdAudioCnt" style="line-height: 30px"></td>
        </tr>
        </tbody>
        <tbody v-if="editing" class="mgt-update">
        <tr>
          <td>
        <tr v-for="val in rspData.ttdAudioItems">
          <td v-text="val.deptName" class="data-analysis-td1"></td>
          <input type="number" v-model="val.cnt" class="data-analysis-td1">
        </tr>
        </td>
        <td>
          <tr v-for="val in rspData.ttdVideoItems">
            <td v-text="val.deptName" class="data-analysis-td1"></td>
            <input type="number" v-model="val.cnt" class="data-analysis-td1">
          </tr>
        </td>
        <td>
          <input type="number" v-model="rspData.ttdAudioCnt" class="data-analysis-td1">
        </td>
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
        isAudit: config.containsPrivilege('P-TRAIN-DATA-ANALYSIS-DAILY-SUMMARY-MGT-AUDIT'),
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
        let timeLimit = config.getTimeLimit(rspData.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-16', 15)
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
          url: '/api/data-analysis-daily-summary/mgt/get'
        }).then((response) => {
          self.loading = false
          var data = response.data
          if (data.type === 1) {
            self.rspData = data.result
            let ttdAudioItems = []
            let ttdVideoItems = []
            for (let i in self.rspData.ttdAudioItems) {
              if (self.rspData.ttdAudioItems[i].deptType === 'TT') {
                ttdAudioItems.push(self.rspData.ttdAudioItems[i])
              }
            }
            for (let i in self.rspData.ttdVideoItems) {
              if (self.rspData.ttdVideoItems[i].deptType === 'TT') {
                ttdVideoItems.push(self.rspData.ttdVideoItems[i])
              }
            }
            self.rspData.ttdAudioItems = ttdAudioItems
            self.rspData.ttdVideoItems = ttdVideoItems
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.loginPopup = true
          } else if (data.type === 403) {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      submit () {
        for (let i in this.rspData.ttdAudioItems) {
          if (this.rspData.ttdAudioItems[i].cnt === '') {
            this.$message({
              message: '请将车载音频分析班数的' + this.rspData.ttdAudioItems[i].deptName + '填写完整',
              type: 'error'
            })
            return
          } else if (this.rspData.ttdAudioItems[i].cnt > 10000) {
            this.$message({
              message: '请将车载音频分析班数的' + this.rspData.ttdAudioItems[i].deptName + '数值太大',
              type: 'error'
            })
            return
          } else if (this.rspData.ttdAudioItems[i].cnt < 0) {
            this.$message({
              message: '请将车载音频分析班数的' + this.rspData.ttdAudioItems[i].deptName + '不能为负数',
              type: 'error'
            })
            return
          }
        }
        for (let i in this.rspData.ttdVideoItems) {
          if (this.rspData.ttdVideoItems[i].cnt === '') {
            this.$message({
              message: '请将车载视频分析班数的' + this.rspData.ttdVideoItems[i].deptName + '填写完整',
              type: 'error'
            })
            return
          } else if (this.rspData.ttdVideoItems[i].cnt > 10000) {
            this.$message({
              message: '请将车载视频分析班数的' + this.rspData.ttdVideoItems[i].deptName + '数值太大',
              type: 'error'
            })
            return
          } else if (this.rspData.ttdVideoItems[i].cnt < 0) {
            this.$message({
              message: '请将车载视频分析班数的' + this.rspData.ttdVideoItems[i].deptName + '不能为负数',
              type: 'error'
            })
            return
          }
        }
        if (this.rspData.ttdAudioCnt === '') {
          this.$message({
            message: '请将检修音频分析班数的填写完整',
            type: 'error'
          })
          return
        } else if (this.rspData.ttdAudioCnt > 10000) {
          this.$message({
            message: '请将检修音频分析班数的数值太大',
            type: 'error'
          })
          return
        } else if (this.rspData.ttdAudioCnt < 0) {
          this.$message({
            message: '请将检修音频分析班数的不能为负数',
            type: 'error'
          })
          return
        }
        this.rspData.date = this.reqVo.date
        this.axios({
          method: 'post',
          data: this.rspData,
          url: '/api/data-analysis-daily-summary/mgt/upsert'
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
  .data-analysis-td {
    width: 24%;
    /*border: none;*/
  }
  .data-analysis-td1 {
    width: 50%;
    /*border: none;*/
  }
</style>
