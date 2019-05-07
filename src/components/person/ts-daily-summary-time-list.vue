<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :from="from" :to="to" class="float-left"></date-box>
      <div class="search-child">
        <label>组织：</label>
        <select v-model="dsVodTimeVo.deptCode" class="select-class">
          <option v-for="dept in tsCodeList" :value="dept[0]">{{ dept[1] }}</option>
        </select>
      </div>
      <div class="search-child ts-query-button">
        <el-button type="primary" icon="el-icon-search" @click="getDsVodTimeList">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="message"></h4>
    <div class="table" style="margin-top: 23px;" v-if="!message">
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
          <col/>
        </colgroup>
        <thead>
        <tr>
          <th style="min-width: 110px;" v-text="'时间（' + deptSummary.timeUnit + '）'"></th>
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
        <tr v-for="(dept, index) in deptList" :class="{complex: index % 2 === 0}">
          <td v-text="dept.time"></td>
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
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import dateBox from '@/components/date-box'

  export default {
    name: 'dsVodDeptList',
    data () {
      return {
        dsVodTimeVo: {},
        dsVo: {},
        deptList: [],
        deptSummary: '',
        loginPopup: false,
        loading: false,
        omType: {
          ts: true,
          omt: true,
          omp: true
        },
        from: '',
        to: '',
        tsCodeList: [],
        message: ''
      }
    },
    components: {
      loginPopup,
      dateBox
    },
    created () {
      this.dsVodTimeVo.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
      this.dsVodTimeVo.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
      this.dsVodTimeVo.timeUnit = 'D'
      this.to = this.dsVodTimeVo.to
      this.from = this.dsVodTimeVo.from
      this.tsCodeList = config.getStorage('TS_CODES')
    },
    mounted () {
      this.$nextTick(() => {
        this.getDsTreeVo()
      })
    },
    methods: {
      receiveDate (date) {
        this.dsVodTimeVo.from = date.from
        this.dsVodTimeVo.to = date.to
        this.dsVodTimeVo.timeUnit = date.timeUnit
      },
      sendParams () {
        this.$router.push({
          path: '/driver-vod-cnt-by-type-trend-in-time-list',
          name: '人员 > 值乘两违 > 分项点汇总趋势数据',
          params: {
            queryVo: {
              from: this.from,
              to: this.to
            }
          }
        })
      },
      getDsVodTimeList () {
        this.message = ''
        this.loading = true
        if (this.dsVodTimeVo.deptCode === 'XAJWD') {
          this.dsVodTimeVo.deptType = 'LD'
        } else {
          this.dsVodTimeVo.deptType = 'TS'
        }
        this.axios({
          method: 'post',
          data: this.dsVodTimeVo,
          url: '/api/ts-daily-summary/view/trend-in-time'
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
      getDsTreeVo () { // 获取this.dsVo
        this.axios({
          method: 'get',
          params: {'type': 1},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.dsVo = data.result.tree
            this.dsVodTimeVo.deptCode = this.dsVo.code
            this.getDsVodTimeList('init')
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
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
  .vdp-datepicker {
    display: inline-block;
  }


  .err-msg {
    font-size: 16px;
    left: 12px;
  }
  .ts-query-button {
    margin-left: 20px;
  }
</style>
