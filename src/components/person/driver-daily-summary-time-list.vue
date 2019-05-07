<template>
  <div>
    <div class="search">
      <div class="search-div">
        <div>
          <label for="range">时间范围：</label>
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
        <div>
          <label for="range">时间单位：</label>
	        <div class="time-type">
	          <input type="radio" name="unit" id="unitD" value="D" :disabled="timeType === 'Q'" v-model="dsVodTimeVo.timeUnit"/>
	          <label for="unitD">日</label>
	        </div>
	        <div class="time-type">
	          <input type="radio" name="unit" id="unitW" value="W" :disabled="timeType === 'W'" v-model="dsVodTimeVo.timeUnit"/>
	          <label for="unitW">周</label>
	        </div>
	        <div class="time-type">
	          <input type="radio" name="unit" id="unitM" value="M" :disabled="timeType === 'W' || timeType === 'M'" v-model="dsVodTimeVo.timeUnit"/>
	          <label for="unitM">月</label>
	        </div>
        </div>
      </div>
      <div class="search-div">
        <label>组织：</label>
        <!--<input type="text" v-model="deptName">//-->
        <select v-model="dsVodTimeVo.deptCode">
          <option v-for="(dept,code) in tsCodeList" :value="code">{{ dept }}</option>
        </select>
      </div>
      <div class="search-div">
        <div class="btn-sm btn-default" @click="getDsVodTimeList('query')">查 询</div>
      </div>
      <div class="err-msg" v-text="msg"></div>
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
          <col/>
          <col/>
        </colgroup>
        <thead>
        <tr>
          <th></th>
          <th style="min-width: 110px;" v-text="'时间（' + deptSummary.timeUnit + '）'"></th>
          <th>出勤次数</th>
          <th>值勤次数</th>
          <th>酒测通过率</th>
          <th>揭示核对执行率</th>
          <th>两违次数</th>
          <th>非正常次数</th>
          <th>五色图分析评分</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(dept, index) in deptList" :class="{trbg: index % 2 === 0}">
          <td v-text="index + 1"></td>
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
          <td v-text="deptList.length + 1"></td>
          <td style="width: 5.26%">合计</td>
          <td v-text="deptSummary.onDutyCnt"></td>
          <td v-text="deptSummary.ttdCnt"></td>
          <td v-text="deptSummary.wtRate + '%'"></td>
          <td v-text="deptSummary.rcRate + '%'"></td>
          <td @click="sendParams" v-text="deptSummary.vodCnt"></td>
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
  import Datepicker from 'vuejs-datepicker'
  import deptRadioBox from '@/components/dept-radio-box'
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  export default {
    name: 'dsVodDeptList',
    data () {
      return {
        dsVodTimeVo: {},
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
        deptName: '',
        dsVo: {},
        deptList: [],
        deptSummary: '',
        loginPopup: false,
        omType: {
          ts: true,
          omt: true,
          omp: true
        },
        tsCodeList: {},
        tsCode: ''
      }
    },
    components: {
      Datepicker,
      loginPopup,
      deptRadioBox
    },
    watch: {
      timeType: 'timeTypeChange'
    },
    mounted () {
      this.$nextTick(() => {
        this.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
        this.from = new Date(new Date().getTime() - 7 * config.oneDayMs)
        this.tsCodeList = config.getStorage('TS_CODES')
        this.getDsTreeVo()
      })
    },
    methods: {
      sendParams () {
        this.$router.push({
          path: '/op-vod-time-list',
          name: '值乘两违分项点汇总-趋势数据',
          params: {
            queryVo: {
              from: this.from,
              to: this.to
            }
          }
        })
      },
      timeTypeChange () {
        if (this.timeType === 'W') {
          this.dsVodTimeVo.timeUnit = 'D'
          this.dsVodTimeVo.to = config.dateToString(this.moment().subtract(1, 'd').format('YYYY-MM-DD'), 'yyyy-MM-dd')
          this.dsVodTimeVo.from = config.dateToString(new Date(new Date().getTime() - 7 * config.oneDayMs), 'yyyy-MM-dd')
        } else if (this.timeType === 'M') {
          this.dsVodTimeVo.timeUnit = 'D'
          this.dsVodTimeVo.to = config.dateToString(this.moment().subtract(1, 'd').format('YYYY-MM-DD'), 'yyyy-MM-dd')
          this.dsVodTimeVo.from = config.dateToString(new Date(new Date().getTime() - 30 * config.oneDayMs), 'yyyy-MM-dd')
        } else if (this.timeType === 'Q') {
          this.dsVodTimeVo.timeUnit = 'W'
          this.dsVodTimeVo.to = config.dateToString(this.moment().subtract(1, 'd').format('YYYY-MM-DD'), 'yyyy-MM-dd')
          this.dsVodTimeVo.from = config.dateToString(new Date(new Date().getTime() - 90 * config.oneDayMs), 'yyyy-MM-dd')
        } else if (this.timeType === 'C') {
          this.dsVodTimeVo.to = this.to
          this.dsVodTimeVo.from = this.from
        }
      },
      formatTo () {
        this.to = config.dateToString(this.to, 'yyyy-MM-dd')
        if (this.timeType === 'C') {
          this.dsVodTimeVo.to = this.to
        }
      },
      formatFrom () {
        this.from = config.dateToString(this.from, 'yyyy-MM-dd')
        if (this.timeType === 'C') {
          this.dsVodTimeVo.from = this.from
        }
      },
      getDsVodTimeList (approach) {
        if (approach === 'init') {
          this.timeTypeChange()
        }
        this.axios({
          method: 'post',
          data: this.dsVodTimeVo,
          url: '/api/driver-daily-summary/view/trend-in-time'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.deptList = data.result.list
            this.deptSummary = data.result.summary
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
            this.msg = data.msg
            this.errorRefresh()
          } else if (data.type === 4001) {
            this.msg = data.msg
            this.errorRefresh()
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
            this.deptName = this.dsVo.name
            this.dsVodTimeVo.deptType = 'LD'
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
      },
      errorRefresh () {
        setTimeout(() => {
          this.msg = ''
        }, 3000)
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
