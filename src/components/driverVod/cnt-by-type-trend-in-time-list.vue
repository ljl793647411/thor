<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search" style="margin-bottom: 0;">
      <date-box @sendDate="receiveDate" :from="vodCntTimeVo.from" :to="vodCntTimeVo.to" class="search-child"></date-box>
      <div class="search-child">
        <label for="createdBy">来源：</label>
        <el-select v-model="sources" multiple collapse-tags placeholder="请选择">
          <el-option
            v-for="item in VOD_SOURCES"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="search-child">
        <label>组织：</label>
        <input type="text" v-model="deptName" @click="changeBox" class="search-input-class">
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getDriVodMgtList">查 询</el-button>
      </div>
    </div>
    <div class="search-switch">
      <div class="search-switch-child">
        <label for="showType2s">显示二级项点：</label>
        <el-switch
          v-model="showType2s"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :disabled="switchShow">
        </el-switch>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div class="table" v-if="!message">
      <table>
        <thead>
        <tr>
          <th :rowspan="showType2s ? 2 : 1" style="min-width: 110px;" v-text="'时间（' + deptSummary.timeUnitName + '）'"></th>
          <th :rowspan="showType2s ? 2 : 1">问题合计</th>
          <th v-for="(t1, i) in deptSummary.t1" :colspan="showType2s ? t1.t2.length : 1" v-text="t1.name"></th>
        </tr>
        <tr v-if="showType2s">
          <template v-for="(t1, i) in deptSummary.t1">
            <th v-for="(t2, j) in t1.t2" v-text="t2.name"></th>
          </template>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(dept, index) in deptList" :class="{trbg: index % 2 === 0}">
          <td v-text="dept.time" :title="dept.from + ' 到 ' + dept.to"></td>
          <td @click="jumpDetailList(dept.from, dept.to)" v-text="dept.total" class="cursor"></td>
          <template v-if="showType2s" v-for="(t1, i) in dept.t1">
            <td @click="jumpDetailList(dept.from, dept.to, t1.name, t2.name)" v-for="(t2, j) in t1.t2" v-text="t2.cnt" class="cursor"></td>
          </template>
          <td v-if="!showType2s" @click="jumpDetailList(dept.from, dept.to, t1.name)" v-for="(t1, i) in dept.t1" v-text="t1.cnt" class="cursor"></td>
        </tr>
        <tr v-if="deptSummary.total || deptSummary.total === 0">
          <td :rowspan="showType2s ? 2 : 1">合计</td>
          <td @click="jumpDetailList()" rowspan="2" v-text="deptSummary.total" class="cursor"></td>
          <template v-if="showType2s" v-for="(t1, i) in deptSummary.t1">
            <td @click="jumpDetailList(null, null, t1.name, t2.name)" v-for="(t2, j) in t1.t2" v-text="t2.cnt" class="cursor"></td>
          </template>
          <td v-if="!showType2s" @click="jumpDetailList(null, null, t1.name)" v-for="(t1, i) in deptSummary.t1" v-text="t1.cnt" class="cursor"></td>
        </tr>
        <tr v-if="showType2s">
          <td @click="jumpDetailList(null, null, t1.name)" v-for="(t1, i) in deptSummary.t1" :colspan="t1.t2.length" v-text="t1.cnt" class="cursor"></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="deptBox">
      <dept-radio-box @getDeptCode="getDeptCode"></dept-radio-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import deptRadioBox from '@/components/dept-radio-box'
  import loginPopup from '@/components/login-popup'
  import dateBox from '@/components/date-box'

  export default {
    name: 'opVodTimeList',
    data () {
      return {
        vodCntTimeVo: {
          vodType1: '',
          vodType2: ''
        },
        loginPopup: false,
        loading: false,
        deptName: '',
        deptBox: false,
        ldVo: {},
        deptList: [],
        VOD_SOURCES: config.VOD_SOURCES,
        sources: ['A', 'V'],
        deptSummary: '',
        showType2s: false,
        switchShow: false,
        message: ''
      }
    },
    components: {
      loginPopup,
      dateBox,
      deptRadioBox
    },
    created () {
      this.vodCntTimeVo.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
      this.vodCntTimeVo.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
      this.vodCntTimeVo.timeUnit = 'D'
    },
    mounted () {
      this.$nextTick(() => {
        this.getLdVo()
      })
    },
    watch: {
      sources: 'changeSwitch'
    },
    methods: {
      changeSwitch () {
        if (this.sources.length === 1 && this.sources.includes('EOAS')) {
          this.switchShow = true
        } else {
          this.switchShow = true
        }
      },
      receiveDate (date) {
        this.vodCntTimeVo.from = date.from
        this.vodCntTimeVo.to = date.to
        this.vodCntTimeVo.timeUnit = date.timeUnit
      },
      jumpDetailList (from, to, vodType1, vodType2) {
        let query = {
          deptType: this.vodCntTimeVo.deptType,
          deptCode: this.vodCntTimeVo.deptCode,
          deptNames: this.deptName,
          from: from,
          to: to,
          vodType1: vodType1,
          vodType2: vodType2,
          sources: this.sources
        }
        // 合计行的单元格无from与to，取请求的from与to
        if (!from || !to) {
          query['from'] = config.dateToString(this.vodCntTimeVo.from, 'yyyy-MM-dd')
          query['to'] = config.dateToString(this.vodCntTimeVo.to, 'yyyy-MM-dd')
        }
        console.log('jump to driver vod detail list: ', query)
        this.$router.push({
          path: '/driver-vod-list',
          query: query
        })
      },
      getDriVodMgtList () {
        this.message = ''
        if (this.sources && this.sources.length !== 0) {
          if (this.sources.length <= 2) {
            if (this.sources.length === 2) {
              if (this.sources.includes('A') && this.sources.includes('V')) {
                this.vodCntTimeVo.sources = this.sources
              } else {
                this.$message.error('如果选中两项，只能同时选中音频和视频')
                return
              }
            } else {
              this.vodCntTimeVo.sources = this.sources
            }
          } else {
            this.$message.error('来源项点不能多于两项')
            return
          }
        } else {
          this.$message.error('请选择来源')
          return
        }
        if (this.sources.length === 1 && this.sources.includes('LKJ')) {
          this.switchShow = false
          this.showType2s = true
        }
        if (this.sources.length === 1 && this.sources.includes('EOAS')) {
          this.switchShow = true
          this.showType2s = false
        }
        this.loading = true
        this.axios({
          method: 'post',
          data: this.vodCntTimeVo,
          url: '/api/driver-vod/view/vod-cnt-by-type-trend-in-time'
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
      getLdVo () { // 获取this.ldVo
        this.axios({
          method: 'get',
          params: {'type': 1},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.ldVo = data.result.tree
            this.vodCntTimeVo.deptCode = this.ldVo.code
            this.deptName = this.ldVo.name
            this.vodCntTimeVo.deptType = 'LD'
            this.getDriVodMgtList('init')
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getDeptCode (result) {
        this.deptBox = false
        if (!result.sid) {
          return
        }
        this.deptName = result.name
        if (result.type) {
          this.vodCntTimeVo.deptCode = result.code
          this.vodCntTimeVo.deptType = result.type
        } else {
          this.vodCntTimeVo.deptType = 'DR'
          this.vodCntTimeVo.deptCode = result.workNo
        }
      },
      changeBox () {
        this.deptBox = true
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
</style>
