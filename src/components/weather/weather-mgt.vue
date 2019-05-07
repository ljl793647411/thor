<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :onlyDate="true" :date="reqVo.date" class="search-child"></date-box>
      <div class="search-child upload-class">
        <form @submit.prevent="submit($event)">
          <el-button type="primary">从Excel导入</el-button>
          <input ref="file" class="fileBtn" type="file" name="file" @change="getFile($event)">
        </form>
      </div>
      <div class="search-child">
        <a href="/static/tpls/外寓各点天气统计.xls" class="color-white">下载Excel模板</a>
      </div>
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
          <th rowspan="2" v-if="editing">行号</th>
          <th rowspan="2">地点</th>
          <th colspan="5">白班</th>
          <th colspan="5">夜班</th>
          <th rowspan="2" v-if="editing">操作</th>
        </tr>
        <tr>
          <th>天气情况</th>
          <th>值班人员</th>
          <th>联系电话</th>
          <th>提报时刻</th>
          <th>备注</th>
          <th>天气情况</th>
          <th>值班人员</th>
          <th>联系电话</th>
          <th>提报时刻</th>
          <th>备注</th>
        </tr>
        </thead>
        <tbody v-if="!editing">
        <tr v-for="(item, index) in rspData.list" :class="{complex: index % 2 === 0}">
          <td v-text="item.location"></td>
          <td v-text="item.dayWeather"></td>
          <td v-text="item.dayOwnerName"></td>
          <td v-text="item.dayOwnerTel"></td>
          <td v-text="item.dayTime"></td>
          <td v-text="item.dayMemo"></td>
          <td v-text="item.nightWeather"></td>
          <td v-text="item.nightOwnerName"></td>
          <td v-text="item.nightOwnerTel"></td>
          <td v-text="item.nightTime"></td>
          <td v-text="item.nightMemo"></td>
        </tr>
        </tbody>
        <tbody v-if="editing" class="mgt-update mgt-update-weather">
        <tr v-for="(item, index) in rspData.list">
          <td v-text="index + 1"></td>
          <td>
            <input type="text" v-model="item.location"/>
          </td>
          <td>
            <input type="text" v-model="item.dayWeather"/>
          </td>
          <td>
            <input type="text" v-model="item.dayOwnerName"/>
          </td>
          <td>
            <input type="text" v-model="item.dayOwnerTel"/>
          </td>
          <td>
            <input type="time" v-model="item.dayTime"/>
          </td>
          <td>
            <input type="text" v-model="item.dayMemo"/>
          </td>
          <td>
            <input type="text" v-model="item.nightWeather"/>
          </td>
          <td>
            <input type="text" v-model="item.nightOwnerName"/>
          </td>
          <td>
            <input type="text" v-model="item.nightOwnerTel"/>
          </td>
          <td>
            <input type="time" v-model="item.nightTime"/>
          </td>
          <td>
            <input type="text" v-model="item.nightMemo"/>
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
        file: '',
        isAudit: config.containsPrivilege('P-WEATHER-MGT-AUDIT'),
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
      getFile (event) {
        if (!this.checkTime(this.rspData)) {
          return
        }
        this.file = event.target.files[0]
        console.log(this.file)
        event.preventDefault()
        let formData = new FormData()
        formData.append('file', this.file)
        return this.axios({
          method: 'post',
          data: formData,
          url: '/api/weather/mgt/read-excel',
          headers: {'appType': 'web', 'appid': 'thor'}
        }).then((response) => {
          var data = response.data
          console.log(data)
          this.$refs.file.value = ''
          if (data.type === 1) {
            this.rspData = data.result
            this.beginEdit()
          } else if (data.type === 403) {
            this.$message.error(data.msg)
          } else {
            this.$message.error('请选择正确的文件')
          }
        }).catch((error) => {
          this.$refs.file.value = ''
          this.$message.error(error)
        })
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
          'location': '',
          'dayTime': '',
          'dayWeather': '',
          'dayOwnerName': '',
          'dayOwnerTel': '',
          'dayMemo': '',
          'nightTime': '',
          'nightWeather': '',
          'nightOwnerName': '',
          'nightOwnerTel': '',
          'nightMemo': ''
        })
      },
      checkTime (rspData) {
        let timeLimit = config.getTimeLimit(rspData.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-05', 15)
        if (!this.isAudit && timeLimit) {
          this.msgBox = true
          this.message = '当前用户无权修改创建<br>' + '超过' + timeLimit + '分钟的数据'
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
          url: '/api/weather/mgt/get'
        }).then((response) => {
          var data = response.data
          self.loading = false
          if (data.type === 1) {
            this.rspData = data.result
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.loginPopup = true
          } else {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      submit () {
        let cols = {
          'location': '地点',
          'dayTime': '白班提报时刻',
          'dayWeather': '白班天气情况',
          'dayOwnerName': '白班值班人员姓名',
          'dayOwnerTel': '白班联系电话',
          'nightTime': '夜班提报时刻',
          'nightWeather': '夜班天气情况',
          'nightOwnerName': '夜班值班人员姓名',
          'nightOwnerTel': '夜班联系电话'
        }

        for (var i = 0; i < this.rspData.list.length; i++) {
          for (let j in this.rspData.list[i]) {
            if (!this.rspData.list[i][j] && cols[j]) {
              this.$message.error(`请将表格第${i + 1}行的${cols[j]}填写完整`)
              return
            }
          }
        }
        if (this.rspData.rbCode === null || this.rspData.ldCode === null) {
          this.rspData.rbCode = this.reqVo.rbCode
          this.rspData.ldCode = this.reqVo.ldCode
        }
        this.rspData.date = this.reqVo.date
        let self = this
        this.axios({
          method: 'post',
          data: this.rspData,
          url: '/api/weather/mgt/upsert'
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
 .mgt-update-weather td input,.mgt-update-weather td textarea{
    width: 80px;
  }
</style>
