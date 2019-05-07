<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :from="omVodTimeVo.from" :to="omVodTimeVo.to" class="search-child"></date-box>
      <div class="search-child">
      	<label>组织：</label>
        <input type="text" v-model="deptName" @click="changeBox" class="search-input-class">
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getOmVodTimeList">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table">
      <table>
        <thead>
        <tr>
          <th style="min-width: 110px;" v-text="'时间（' + (deptSummary.timeUnitName ? deptSummary.timeUnitName : '') + '）'"></th>
          <th>问题合计</th>
          <th v-for="(t1, i) in deptSummary.t1" v-text="t1.name"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(dept, index) in deptList" :class="{complex: index % 2 === 0}">
          <td v-text="dept.time"></td>
          <td @click="jumpDetailList(dept.from,dept.to)" v-text="dept.total" class="cursor"></td>
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
    <div v-if="omBox">
      <ts-overhaul-radio-box @getOmCode="getOmCode" :omType="omType"></ts-overhaul-radio-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import tsOverhaulRadioBox from '@/components/ts-overhaul-radio-box'
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import dateBox from '@/components/date-box'

  export default {
    name: 'omVodTimeList',
    data () {
      return {
        omVodTimeVo: {},
        deptName: '',
        omBox: false,
        omVo: {},
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
      tsOverhaulRadioBox,
      dateBox
    },
    created () {
      this.omVodTimeVo.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
      this.omVodTimeVo.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
      this.omVodTimeVo.timeUnit = 'D'
      this.getOmTreeVo()
    },
    methods: {
      receiveDate (date) {
        this.omVodTimeVo.from = date.from
        this.omVodTimeVo.to = date.to
        this.omVodTimeVo.timeUnit = date.timeUnit
      },
      jumpDetailList (from, to, vodType) {
        let query = {
          deptType: this.omVodTimeVo.deptType,
          deptCode: this.omVodTimeVo.deptCode,
          deptNames: this.deptName,
          from: from,
          to: to,
          vodType: vodType
        }
        // 合计行的单元格无from与to，取请求的from与to
        if (!from || !to) {
          query['from'] = config.dateToString(this.omVodTimeVo.from, 'yyyy-MM-dd')
          query['to'] = config.dateToString(this.omVodTimeVo.to, 'yyyy-MM-dd')
        }
        console.log('jump to om vod detail list: ', query)
        this.$router.push({
          path: '/om-vod-detailed',
          query: query
        })
      },
      getOmVodTimeList () {
        this.message = ''
        this.loading = true
        this.axios({
          method: 'post',
          data: this.omVodTimeVo,
          url: '/api/om-vod/view/vod-cnt-by-type-trend-in-time'
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
      getOmTreeVo () { // 获取this.omVo
        this.axios({
          method: 'get',
          params: {'type': 2},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.omVo = data.result.tree
            this.omVodTimeVo.deptCode = this.omVo.children[0].code
            this.deptName = this.omVo.name
            this.omVodTimeVo.deptType = 'OMTS'
            this.getOmVodTimeList('init')
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getOmCode (result) {
        this.omBox = false
        if (!result.sid) {
          return
        }
        this.deptName = result.name
        this.omVodTimeVo.deptCode = result.code
        this.omVodTimeVo.deptType = result.type
      },
      changeBox () {
        this.omBox = true
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
