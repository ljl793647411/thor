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
          <th v-if="editing">行号</th>
          <th>车间</th>
          <th>地点</th>
          <th>应测人数</th>
          <th>实测人数</th>
          <th>正常人数</th>
          <th>异常人数</th>
          <th>情况说明</th>
          <th v-if="editing"></th>
        </tr>
        </thead>
        <tbody v-if="!editing">
        <tr v-for="(item, index) in rspData.list" :class="{complex: index % 2 === 0}">
          <td v-text="item.dept"></td>
          <td v-text="item.location"></td>
          <td v-text="item.planedCnt"></td>
          <td v-text="item.actualCnt"></td>
          <td v-text="item.normalCnt"></td>
          <td v-text="item.abnormalCnt"></td>
          <td v-text="item.memo"></td>
        </tr>
        </tbody>
        <tbody v-if="editing" class="mgt-update mgt-update-wine">
        <tr v-for="(item, index) in rspData.list">
          <td v-text="index + 1"></td>
          <td>
            <input type="text" v-model="item.dept"/>
          </td>
          <td>
            <input type="text" v-model="item.location"/>
          </td>
          <td>
            <input type="number" v-model="item.planedCnt"/>
          </td>
          <td>
            <input type="number" v-model="item.actualCnt"/>
          </td>
          <td>
            <input type="number" v-model="item.normalCnt"/>
          </td>
          <td>
            <input type="number" v-model="item.abnormalCnt"/>
          </td>
          <td>
            <textarea v-model="item.memo"></textarea>
          </td>
          <td>
            <el-button type="danger" @click="deleteLine(index)">删 除</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="add-button">
      <el-button type="success" v-if="editing" @click="addLine">增加一行</el-button>
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
        dataBackup: [], // 备份编辑前的数据，用于在放弃编辑时恢复
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
      deleteLine (index) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.rspData.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      },
      addLine () {
        this.rspData.list.push({
          'dept': '',
          'trainNo': '',
          'name': ''
        })
      },
      checkTime (rspData) {
        let timeLimit = config.getTimeLimit(rspData.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-08', 15)
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
        this.dataBackup = JSON.parse(JSON.stringify(this.rspData.list))
        this.editing = true
      },
      cancelEdit () {
        this.$confirm('是否取消编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.rspData.list = JSON.parse(JSON.stringify(this.dataBackup))
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
          url: '/api/wine-test/mgt/get'
        }).then((response) => {
          var data = response.data
          self.loading = false
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
          'dept': '车间',
          'location': '地点',
          'planedCnt': '应测人数',
          'actualCnt': '实测人数',
          'normalCnt': '正常人数',
          'abnormalCnt': '异常人数'
        }
        for (var i = 0; i < this.rspData.list.length; i++) {
          for (let j in this.rspData.list[i]) {
            if (!this.rspData.list[i][j] && this.rspData.list[i][j] !== 0 && cols[j]) {
              this.$message.error(`请将表格第${i + 1}行的${cols[j]}填写完整`)
              return
            }
            if ((this.rspData.list[i].planedCnt || this.rspData.list[i].actualCnt || this.rspData.list[i].normalCnt || this.rspData.list[i].abnormalCnt) < 0) {
              this.$message.error(`表格第${i + 1}行不能填写负数`)
              return
            }
          }
        }
        this.rspData.date = this.reqVo.date
        let self = this
        this.axios({
          method: 'post',
          data: this.rspData,
          url: '/api/wine-test/mgt/upsert'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('更新成功')
            self.editing = false
            self.requestData()
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
  .mgt-update-wine td input,.mgt-update-wine td textarea{
    width: 120px;
  }
</style>
