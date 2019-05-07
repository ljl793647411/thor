<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :from="infoVodTimeVo.from" :to="infoVodTimeVo.to" class="search-child"></date-box>
      <div class="search-child">
        <label>组织：</label>
        <input type="text" v-model="deptName" @click="changeBox" class="search-input-class">
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getInfoVodTimeList">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table">
      <table>
        <thead>
        <tr>
          <th style="min-width: 110px;" v-text="'时间（' + deptSummary.timeUnitName + '）'"></th>
          <th>问题合计</th>
          <th v-for="(t1, i) in deptSummary.t1" v-text="t1.name"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(dept, index) in deptList" :class="{complex: index % 2 === 0}">
          <td v-text="dept.time"></td>
          <td @click="jumpDetailList(dept.from, dept.to)" v-text="dept.total" class="cursor"></td>
          <td @click="jumpDetailList(dept.from, dept.to, t1.name)" v-for="(t1, j) in dept.t1" v-text="t1.cnt" class="cursor"></td>
        </tr>
        <tr v-if="deptSummary.total || deptSummary.total === 0">
          <td style="width: 5.26%">合计</td>
          <td @click="jumpDetailList()" v-text="deptSummary.total" class="cursor"></td>
          <td @click="jumpDetailList(null, null, t1.name)" v-for="(t1, i) in deptSummary.t1" v-text="t1.cnt" class="cursor"></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="infoBox">
      <dept-radio-box @getDeptCode="getDeptCode" :driver="true"></dept-radio-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import deptRadioBox from '@/components/dept-radio-box'
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import dateBox from '@/components/date-box'

  export default {
    name: 'dsVodDeptList',
    data () {
      return {
        infoVodTimeVo: {},
        deptName: '',
        infoBox: false,
        infoVo: {},
        deptList: [],
        deptSummary: '',
        loginPopup: false,
        loading: false,
        omType: {
          ts: true,
          omt: true,
          omp: true
        },
        message: ''
      }
    },
    components: {
      loginPopup,
      deptRadioBox,
      dateBox
    },
    watch: {
      timeType: 'timeTypeChange'
    },
    created () {
      this.infoVodTimeVo.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
      this.infoVodTimeVo.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
      this.infoVodTimeVo.timeUnit = 'D'
      this.getInfoVo()
    },
    methods: {
      receiveDate (date) {
        this.infoVodTimeVo.from = date.from
        this.infoVodTimeVo.to = date.to
        this.infoVodTimeVo.timeUnit = date.timeUnit
      },
      jumpDetailList (from, to, vodType) {
        let query = {
          deptType: this.infoVodTimeVo.deptType,
          deptCode: this.infoVodTimeVo.deptCode,
          deptNames: this.deptName,
          from: from,
          to: to,
          vodType: vodType
        }
        // 合计行的单元格无from与to，取请求的from与to
        if (!from || !to) {
          query['from'] = config.dateToString(this.infoVodTimeVo.from, 'yyyy-MM-dd')
          query['to'] = config.dateToString(this.infoVodTimeVo.to, 'yyyy-MM-dd')
        }
        console.log('jump to run info detail list: ', query)
        this.$router.push({
          path: '/run-info-detailed',
          query: query
        })
      },
      getInfoVodTimeList () {
        this.message = ''
        this.loading = true
        this.axios({
          method: 'post',
          data: this.infoVodTimeVo,
          url: '/api/run-info/view/info-cnt-by-type-trend-in-time'
        }).then((response) => {
          this.loading = false
          let data = response.data
          if (data.type === 1) {
            if (data.result.list.length !== 0) {
              this.deptList = data.result.list
              this.deptSummary = data.result.summary
            } else {
              this.message = config.LIST_NO_DATA_TEXT
            }
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
            this.$message.error(data.msg)
          } else if (data.type === 4001) {
            this.$message.error(data.msg)
          } else {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getInfoVo () { // 获取this.dsVo
        this.axios({
          method: 'get',
          params: {'type': 1},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          let data = response.data
          if (data.type === 1) {
            this.infoVo = data.result.tree
            this.infoVodTimeVo.deptCode = this.infoVo.code
            this.deptName = this.infoVo.name
            this.infoVodTimeVo.deptType = 'LD'
            this.getInfoVodTimeList('init')
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getDeptCode (result) {
        this.infoBox = false
        if (!result.sid) {
          return
        }
        this.deptName = result.name
        this.infoVodTimeVo.deptCode = result.code
        this.infoVodTimeVo.deptType = result.type
      },
      changeBox () {
        this.infoBox = true
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

</style>
