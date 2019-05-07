<template>
  <div>
    <div class="search">
      <div class="search-div">
        <div class="time-type">
          <input type="radio" name="time" id="timeW" value="W" v-model="timeType"/>
          <label for="timeW">周</label>
        </div>
        <div class="time-type">
          <input type="radio" name="time" id="timeM" value="M" v-model="timeType"/>
          <label for="timeM">月</label>
        </div>
        <div class="time-type">
          <input type="radio" name="time" id="timeQ" value="Q" v-model="timeType"/>
          <label for="timeQ">季</label>
        </div>
        <div style="display: inline-block;">
          <input type="radio" name="time" id="timeC" value="C" v-model="timeType"/>
          <label for="timeC">自定义：</label>
          <datepicker :inline="false" v-model="from" language="zh" name="timePick" :format="state.format" :disabled="state.disabled" :highlighted="state.highlighted" @input="formatFrom"></datepicker>
          <p>到</p>
          <datepicker :inline="false" v-model="to" language="zh" name="timePick" :format="state.format" :disabled="state.disabled" :highlighted="state.highlighted" @input="formatTo"></datepicker>
        </div>
      </div>
      <div class="search-div">
        <label for="workNo">司机：</label>
        <input type="text" name="workNo" v-model="dsVodMgtVo.workNo"/>
      </div>
      <button class="btn-sm btn-default" @click="getDsVodMgtList('query')">查 询</button>
      <button class="btn-sm btn-default" @click="createDsVodMgt">新 增</button>
    </div>
    <div class="table" style="margin-top: 23px;">
      <table style="min-width: 1300px;width: 100%;overflow-x: scroll;" class="table-hover">
        <colgroup>
          <col/>
          <col/>
          <col/>
          <col/>
          <col/>
          <col/>
          <col/>
        </colgroup>
        <thead>
          <th>司机</th>
          <th>发生时间</th>
          <th>指导组</th>
          <th>出勤次数</th>
          <th>值勤次数</th>
          <th>酒测通过率</th>
          <th>揭示核对执行率</th>
          <th>五色图分析评分</th>
          <th>操作</th>
        </thead>
        <tbody>
          <tr v-for="(dsMgt, index) in dsVodMgtList" :class="{trbg: index % 2 === 0}">
            <td>
              <div v-text="dsMgt.workNo"></div>
            </td>
            <td>
              <div v-text="dsMgt.date"></div>
            </td>
            <td>
              <div :title="dsMgt.tsName + '>' + dsMgt.ttName + '>' + dsMgt.ctName">{{ dsMgt.ctName }}</div>
            </td>
            <td>
              <div v-text="dsMgt.onDutyCnt"></div>
            </td>
            <td>
              <div v-text="dsMgt.ttdCnt"></div>
            </td>
            <td>
              <div v-text="dsMgt.wtRate + '%'"></div>
            </td>
            <td>
              <div v-text="dsMgt.rcRate + '%'"></div>
            </td>
            <td>
              <div v-text="dsMgt.ccaScore + '%'"></div>
            </td>
            <td>
              <div class="btn-sm btn-primary" @click="updateOmVod(dsMgt)">修 改</div>
              <div class="btn-sm btn-primary" @click="delDetailed(dsMgt)">删 除</div>
            </td>
          </tr>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div v-if="editing">
      <driver-daily-summary-mgt-add @closeBox='closeBox' :dsVoMgt="dsVoMgt"></driver-daily-summary-mgt-add>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker'
  import config from '@/components/config'
  import paginate from '@/components/paginate'
  import driverDailySummaryMgtAdd from '@/components/person/driver-daily-summary-mgt-add'
  import loginPopup from '@/components/login-popup'
  export default {
    name: 'dsVodMgtList',
    data () {
      return {
        currentPage: 1,
        loginPopup: false,
        count: 0,
        totalRecs: '',
        pageSize: 10,
        pageVo: {
          'prevText': '<<',
          'nextText': '>>'
        },
        dsVodMgtVo: {},
        dsVodMgtList: [],
        from: '', // 用于接收自定义的时间
        to: '',
        msg: '', // 报错信息
        state: {
          format: 'yyyy-MM-dd',
          disabled: {
            from: new Date()
          },
          highlighted: {
            dates: [new Date()]
          }
        },
        timeType: 'W',
        editing: false,
        dsVoMgt: {}
      }
    },
    components: {
      Datepicker,
      paginate,
      loginPopup,
      driverDailySummaryMgtAdd
    },
    watch: {
      timeType: 'timeTypeChange'
    },
    mounted () {
      this.$nextTick(() => {
        this.to = this.moment().format('YYYY-MM-DD')
        this.from = new Date(new Date().getTime() - 6 * config.oneDayMs)
        this.getDsVodMgtList('init')
        this.formatTo()
        this.formatFrom()
      })
    },
    methods: {
      timeTypeChange () {
        if (this.timeType === 'W') {
          this.dsVodMgtVo.dateTo = this.moment().format('YYYY-MM-DD')
          this.dsVodMgtVo.dateFrom = this.moment().subtract(6, 'd').format('YYYY-MM-DD')
        } else if (this.timeType === 'M') {
          this.dsVodMgtVo.dateTo = this.moment().format('YYYY-MM-DD')
          this.dsVodMgtVo.dateFrom = config.dateToString(new Date(new Date().getTime() - 29 * config.oneDayMs), 'yyyy-MM-dd')
        } else if (this.timeType === 'Q') {
          this.dsVodMgtVo.dateTo = this.moment().format('YYYY-MM-DD')
          this.dsVodMgtVo.dateFrom = config.dateToString(new Date(new Date().getTime() - 89 * config.oneDayMs), 'yyyy-MM-dd')
        } else if (this.timeType === 'C') {
          this.dsVodMgtVo.dateTo = this.to
          this.dsVodMgtVo.dateFrom = this.from
        }
      },
      formatTo () {
        this.to = config.dateToString(this.to, 'yyyy-MM-dd')
        if (this.timeType === 'C') {
          this.dsVodMgtVo.dateTo = this.to
        }
      },
      formatFrom () {
        this.from = config.dateToString(this.from, 'yyyy-MM-dd')
        if (this.timeType === 'C') {
          this.dsVodMgtVo.dateFrom = this.from
        }
      },
      getDsVodMgtList (approach) {
        if (approach === 'init') {
          this.timeTypeChange()
        }
        this.axios({
          method: 'post',
          data: this.dsVodMgtVo,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/driver-daily-summary/mgt/list'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            this.dsVodMgtList = data.result.resultList
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      deptBoxClose (result) {
        this.dsVodMgtVo.deptCodes = []
        let deptCodesName = []
        this.dsVodMgtVo.deptType = result.deptType
        if (this.dsVodMgtVo.deptType === 'DR') {
          for (let i in result.depts) {
            this.dsVodMgtVo.deptCodes.push(result.depts[i].workNo)
            deptCodesName.push(result.depts[i].name)
          }
        } else {
          for (let i in result.depts) {
            this.dsVodMgtVo.deptCodes.push(result.depts[i].code)
            deptCodesName.push(result.depts[i].name)
          }
        }
        this.deptCodesName = deptCodesName.join(',')
        this.deptBoxShow = false
      },
      delDetailed (dsMgt) {
        this.axios({
          method: 'get',
          params: {'sid': dsMgt.sid},
          url: '/api/driver-daily-summary/mgt/delete'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            console.log('删除成功')
            this.getDsVodMgtList('q')
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      createDsVodMgt () {
        this.dsVoMgt = {
          workNo: '',
          date: '',
          onDutyCnt: '',
          ttdCnt: '',
          wtRate: '',
          rcRate: '',
          ccaScore: ''
        }
        this.editing = true
      },
      updateOmVod (dsMgt) {
        this.dsVoMgt = dsMgt
        this.editing = true
      },
      closeBox () {
        this.editing = false
        this.getDsVodMgtList('query')
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getDsVodMgtList('q')
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
</style>
