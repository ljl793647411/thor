<template>
  <div>
    <div class="search">
      <div class="search-div">
        <label for="time">时间：</label>
        <datepicker :inline="false" v-model="ds.from" language="zh" name="timePick" :format="state.format" :disabled="state.disabled" :highlighted="state.highlighted" @input="formatFrom"></datepicker>
        <p>到</p>
        <datepicker :inline="false" v-model="ds.to" language="zh" name="timePick" :format="state.format" :disabled="state.disabled" :highlighted="state.highlighted" @input="formatTo"></datepicker>
      </div>
      <div class="dri-class search-div">
        <label for="dept">组织：</label>
        <input type="text" name="workshop" id="workshop" v-model="deptCodesName" :title="deptCodesName" @click="selectT"/>
      </div>
      <div class="dri-class search-div">
        <button class="btn-sm btn-default" @click="getDeptList">查 询</button>
      </div>
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
        </colgroup>
        <thead>
        <tr>
          <th style="min-width: 130px;" v-text="deptSummary.deptType"></th>
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
            <td @click="sendParams" v-text="deptSummary.vodCnt"></td>
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
        loginPopup: false,
        msg: '', // 报错信息
        deptSummary: {},
        deptList: [],
        deptCodesName: '',
        state: {
          format: 'yyyy-MM-dd',
          disabled: {
            from: new Date()
          },
          highlighted: {
            dates: [new Date()]
          }
        },
        dsBoxShow: false,
        routeHtml: ''
      }
    },
    components: {
      deptBox,
      loginPopup,
      Datepicker
    },
    mounted () {
      this.$nextTick(() => {
        this.getDsTreeVo()
        this.ds.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
        this.ds.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
        this.formatFrom()
        this.formatTo()
      })
    },
    methods: {
      sendParams () {
        this.$router.push({
          path: '/op-vod-dept-list',
          name: '值乘两违分项点汇总-对比数据',
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
      formatFrom () {
        this.ds.from = this.ds.from ? config.dateToString(this.ds.from, 'yyyy-MM-dd') : ''
      },
      formatTo () {
        this.ds.to = this.ds.to ? config.dateToString(this.ds.to, 'yyyy-MM-dd') : ''
      },
      getDeptList () {
        if (this.ds.deptType === 'TS' && this.ds.deptCodes.length === 0) {
          for (let i in this.dsVo.children) {
            this.ds.deptCodes.push(this.dsVo.children[i].code)
          }
        }
        this.axios({
          method: 'post',
          data: this.ds,
          url: '/api/driver-daily-summary/view/in-dept'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.deptList = data.result.list
            this.deptSummary = data.result.summary
          } else if (data.type === 4001) {
            this.msg = '指定的组织结构数量过多，请缩小范围'
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
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
  .dri-class {
    display: inline-block;
  }

  .vdp-datepicker {
    display: inline-block;
  }

  p {
    display: inline-block;
  }

  table, table tr, table td {
    border: 1px solid #b6caeb;
  }

</style>
