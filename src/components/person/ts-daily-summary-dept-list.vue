<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :type="true" :from="ds.from" :to="ds.to" class="search-child"></date-box>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getDeptList">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table">
      <table style="width: 100%;overflow-x: scroll;" class="">
        <colgroup>
          <col/>
          <col/>
          <col/>
          <col/>
          <col/>
          <col/>
          <col/>
          <col/>
        </colgroup>
        <thead>
        <tr>
          <th style="min-width: 130px;" v-text="deptSummary.deptType"></th>
          <th>出勤</th>
          <th>值乘</th>
          <th>酒测通过率</th>
          <th>揭示核对执行率</th>
          <th>两违</th>
          <th>非正常运行信息</th>
          <th>五色图分析评分</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(dept, index) in deptList" :class="{'complex': index % 2 === 0}">
            <td v-text="dept.name"></td>
            <td v-text="dept.onDutyCnt"></td>
            <td v-text="dept.ttdCnt"></td>
            <td v-text="dept.wtRate + '%'"></td>
            <td v-text="dept.rcRate + '%'"></td>
            <td v-text="dept.vodCnt"></td>
            <td v-text="dept.runInfoCnt"></td>
            <td v-text="dept.ccaScore + '%'"></td>
          </tr>
          <tr v-if="deptSummary.onDutyCnt || deptSummary.onDutyCnt === 0">
            <td style="width: 5.26%">合计</td>
            <td v-text="deptSummary.onDutyCnt"></td>
            <td v-text="deptSummary.ttdCnt"></td>
            <td v-text="deptSummary.wtRate + '%'"></td>
            <td v-text="deptSummary.rcRate + '%'"></td>
            <td @click="sendParams" v-text="deptSummary.vodCnt" class="cursor"></td>
            <td v-text="deptSummary.runInfoCnt"></td>
            <td v-text="deptSummary.ccaScore + '%'"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="dri-choose" v-if="dsBoxShow">
      <dept-box @getDeptCode='deptBoxClose'></dept-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import deptBox from '@/components/dept-box'
  import Datepicker from 'vuejs-datepicker'
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import dateBox from '@/components/date-box'

  export default {
    name: 'dsVodDeptList',
    data () {
      return {
        ds: {
          deptType: 'TS',
          from: '',
          to: '',
          deptCodes: []
        },
        dsVo: {},
        loginPopup: false,
        loading: false,
        deptSummary: {},
        deptList: [],
        deptCodesName: '',
        dsBoxShow: false,
        routeHtml: '',
        message: ''
      }
    },
    components: {
      deptBox,
      loginPopup,
      Datepicker,
      dateBox
    },
    created () {
      this.ds.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
      this.ds.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
    },
    mounted () {
      this.$nextTick(() => {
        this.getDsTreeVo()
      })
    },
    methods: {
      receiveDate (date) {
        this.ds.from = date.from
        this.ds.to = date.to
      },
      sendParams () {
        this.$router.push({
          path: '/driver-vod-cnt-by-type-in-dept-list',
          name: '人员 > 值乘两违 > 分项点汇总对比数据',
          params: {
            queryVo: this.ds
          }
        })
      },
      getDsTreeVo () { // 获取this.dsVo
        this.axios({
          method: 'get',
          params: {'type': 1},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.dsVo = data.result.tree
            this.getDeptList()
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getDeptList () {
        this.message = ''
        this.loading = true
        if (this.ds.deptType === 'TS' && this.ds.deptCodes.length === 0) {
          for (let i in this.dsVo.children) {
            this.ds.deptCodes.push(this.dsVo.children[i].code)
          }
        }
        this.axios({
          method: 'post',
          data: this.ds,
          url: '/api/ts-daily-summary/view/in-dept'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            if (data.result.list.length !== 0) {
              this.deptList = data.result.list
              this.deptSummary = data.result.summary
            } else {
              this.message = config.LIST_NO_DATA_TEXT
            }
          } else if (data.type === 4001) {
            this.$message.error('指定的组织结构数量过多，请缩小范围')
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          } else {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      deptBoxClose (result) {
        this.ds.deptCodes = []
        let deptCodesName = []
        this.ds.deptType = result.deptType
        if (this.ds.deptType === 'DR') {
          for (let i in result.depts) {
            this.ds.deptCodes.push(result.depts[i].workNo)
            deptCodesName.push(result.depts[i].name)
          }
        } else {
          for (let i in result.depts) {
            this.ds.deptCodes.push(result.depts[i].code)
            deptCodesName.push(result.depts[i].name)
          }
        }
        this.deptCodesName = deptCodesName.join(',')
        this.dsBoxShow = false
      },
      selectT () {
        this.dsBoxShow = true
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
