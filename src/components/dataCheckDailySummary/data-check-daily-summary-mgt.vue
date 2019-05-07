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
          <th></th>
          <th>应转数</th>
          <th>故障数</th>
          <th>问题说明</th>
        </tr>
        </thead>
        <tbody v-if="!editing">
        <tr class="complex">
          <td>LKJ</td>
          <td v-text="rspData.lkjPlanedCnt"></td>
          <td v-text="rspData.lkjMissingCnt"></td>
          <td v-text="rspData.lkjMemo"></td>
        </tr>
        <tr v-for="(item, index) in rspData.eoasMissingItems">
          <template v-if="index == 0">
            <td :rowspan="rspData.eoasMissingItems.length">EOAS</td>
            <td :rowspan="rspData.eoasMissingItems.length" v-text="rspData.eoasPlanedCnt"></td>
          </template>
          <td v-text="item.name + '：' + item.cnt"></td>
          <td v-text="item.memo"></td>
        </tr>
        <tr class="complex">
          <td>音频</td>
          <td v-text="rspData.ttdAudioPlanedCnt"></td>
          <td v-text="rspData.ttdAudioMissingCnt"></td>
          <td v-text="rspData.ttdAudioMemo"></td>
        </tr>
        <tr v-for="(item, index) in rspData.ttdVideoMissingItems">
          <template v-if="index == 0">
            <td :rowspan="rspData.ttdVideoMissingItems.length">视频</td>
            <td :rowspan="rspData.ttdVideoMissingItems.length" v-text="rspData.ttdVideoPlanedCnt"></td>
          </template>
          <td v-text="item.name + '：' + item.cnt"></td>
          <td v-text="item.memo"></td>
        </tr>
        <tr v-for="(item, index) in rspData.omVideoMissingItems" class="complex">
          <template v-if="index == 0">
            <td :rowspan="rspData.omVideoMissingItems.length">摄像手电</td>
            <td :rowspan="rspData.omVideoMissingItems.length" v-text="rspData.omVideoPlanedCnt"></td>
          </template>
          <td v-text="item.name + '：' + item.cnt"></td>
          <td v-text="item.memo"></td>
        </tr>
        <tr>
          <td>合计</td>
          <td v-text="rspData.lkjPlanedCnt + rspData.eoasPlanedCnt + rspData.ttdAudioPlanedCnt + rspData.ttdVideoPlanedCnt + rspData.omVideoPlanedCnt"></td>
          <td v-text="rspData.lkjMissingCnt + rspData.eoasMissingCnt + rspData.ttdAudioMissingCnt + rspData.ttdVideoMissingCnt + rspData.omVideoMissingCnt"></td>
          <td>-</td>
        </tr>
        </tbody>
        <tbody v-if="editing" class="mgt-update">
        <tr>
          <td>LKJ</td>
          <td>
            <input type="number" v-model="rspData.lkjPlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.lkjMissingCnt"/>
          </td>
          <td>
            <textarea v-model="rspData.lkjMemo"></textarea>
          </td>
        </tr>
        <tr v-for="(item, index) in rspData.eoasMissingItems">
          <template v-if="index == 0">
            <td :rowspan="rspData.eoasMissingItems.length">EOAS</td>
            <td :rowspan="rspData.eoasMissingItems.length">
              <input type="number" v-model="rspData.eoasPlanedCnt"/>
            </td>
          </template>
          <td>
            {{ item.name + '：'}}<input type="number" v-model="item.cnt"/>
          </td>
          <td>
            <textarea v-model="item.memo"></textarea>
          </td>
        </tr>
        <tr>
          <td>音频</td>
          <td>
            <input type="number" v-model="rspData.ttdAudioPlanedCnt"/>
          </td>
          <td>
            <input type="number" v-model="rspData.ttdAudioMissingCnt"/>
          </td>
          <td>
            <textarea v-model="rspData.ttdAudioMemo"></textarea>
          </td>
        </tr>
        <tr v-for="(item, index) in rspData.ttdVideoMissingItems">
          <template v-if="index == 0">
            <td :rowspan="rspData.ttdVideoMissingItems.length">视频</td>
            <td :rowspan="rspData.ttdVideoMissingItems.length">
              <input type="number" v-model="rspData.ttdVideoPlanedCnt"/>
            </td>
          </template>
          <td>
            {{ item.name + '：'}}<input type="number" v-model="item.cnt"/>
          </td>
          <td>
            <textarea v-model="item.memo"></textarea>
          </td>
        </tr>
        <tr v-for="(item, index) in rspData.omVideoMissingItems">
          <template v-if="index == 0">
            <td :rowspan="rspData.omVideoMissingItems.length">摄像手电</td>
            <td :rowspan="rspData.omVideoMissingItems.length">
              <input type="number" v-model="rspData.omVideoPlanedCnt"/>
            </td>
          </template>
          <td>
            {{ item.name + '：'}}<input type="number" v-model="item.cnt"/>
          </td>
          <td>
            <textarea v-model="item.memo"></textarea>
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
        loading: false,
        rspData: {},
        editing: false,
        dataBackup: {}, // 备份编辑前的数据，用于在放弃编辑时恢复
        isAudit: config.containsPrivilege('P-TRAIN-DATA-CHECK-DAILY-SUMMARY-MGT-AUDIT')
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
          url: '/api/data-check-daily-summary/mgt/get'
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
          lkjMissingCnt: 'LKJ故障数',
          eoasPlanedCnt: 'EOAS应转数',
          ttdAudioPlanedCnt: '音频应转数',
          ttdAudioMissingCnt: '音频故障数',
          ttdVideoPlanedCnt: '视频应转数',
          omVideoPlanedCnt: '摄像手电应转数'
        }
        let listCols = {
          eoasMissingItems: 'EOAS',
          ttdVideoMissingItems: '视频',
          omVideoMissingItems: '摄像手电'
        }
        for (let i in this.rspData) {
          if (cols[i]) {
            if (this.rspData[i] === '') {
              this.$message.error(`请将${cols[i]}填写完整`)
              return
            } else if (!/^[\d|.]*$/.test(this.rspData[i])) {
              this.$message.error(`${cols[i]}只能填写数字`)
              return
            }
          } else if (listCols[i]) {
            for (let j in this.rspData[i]) {
              if (this.rspData[i][j].cnt === '') {
                this.$message.error(`请将${listCols[i]}的${this.rspData[i][j].name}的故障数填写完整`)
                return
              } else if (!/^[\d|.]*$/.test(this.rspData[i][j].cnt)) {
                this.$message.error(`${listCols[i]}的${this.rspData[i][j].name}的故障数只能填写数字`)
                return
              }
            }
          }
        }
        if (this.rspData.lkjPlanedCnt < this.rspData.lkjMissingCnt) {
          this.$message.error(`LKJ应转数不能少于故障数`)
          return
        }
        if (this.rspData.eoasMissingItems) {
          let sum = 0
          for (let i = 0; i < this.rspData.eoasMissingItems.length; i++) {
            sum += this.rspData.eoasMissingItems[i].cnt
          }
          if (this.rspData.eoasPlanedCnt < sum) {
            this.$message.error(`EOAS应转数不能少于故障数`)
            return
          }
        }
        if (this.rspData.ttdAudioPlanedCnt < this.rspData.ttdAudioMissingCnt) {
          this.$message.error(`音频应转数不能少于故障数`)
          return
        }
        if (this.rspData.ttdVideoMissingItems) {
          let sum = 0
          for (let i = 0; i < this.rspData.ttdVideoMissingItems.length; i++) {
            sum += this.rspData.ttdVideoMissingItems[i].cnt
          }
          if (this.rspData.ttdVideoPlanedCnt < sum) {
            this.$message.error(`视频应转数不能少于故障数`)
            return
          }
        }
        if (this.rspData.omVideoMissingItems) {
          let sum = 0
          for (let i = 0; i < this.rspData.omVideoMissingItems.length; i++) {
            sum += this.rspData.omVideoMissingItems[i].cnt
          }
          if (this.rspData.omVideoPlanedCnt < sum) {
            this.$message.error(`摄像手电应转数不能少于故障数`)
            return
          }
        }
        this.rspData.date = this.reqVo.date
        this.axios({
          method: 'post',
          data: this.rspData,
          url: '/api/data-check-daily-summary/mgt/upsert'
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

  .h-chart {
    overflow: hidden;
    margin-bottom: 50px;
  }

  .table input[type="number"] {
    width: 50px;
  }
</style>
