<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-view @sendDate="receiveDate" :to="to" class="search-child"></date-view>
      <dashboard-view :titleList="titleList" @getType="getType" class="search-child"></dashboard-view>
    </div>
    <div class="tacData">
      <div class="h-chart" v-show="dashboardType === '0'">
        <h3 class="h3">总问题数</h3>
        <div class="table h-chart">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>问题件数</th>
                <th>环比</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td v-text="time2"></td>
              <td v-text="summary.problemCount2"></td>
              <td rowspan="2" v-text="summary.vslp"></td>
            </tr>
            <tr>
              <td v-text="time1"></td>
              <td v-text="summary.problemCount1"></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="h-chart" v-show="dashboardType === '1'">
        <h3 class="h3">按车队分布</h3>
        <el-button type="primary" @click="jumpDept('tt')">查看车队分项点汇总对比</el-button>
        <div class="table h-chart">
          <table>
            <thead>
            <tr>
              <th rowspan="2">排名</th>
              <th rowspan="2">车队</th>
              <th colspan="2">问题件数</th>
              <th colspan="3">问题数占比</th>
            </tr>
            <tr>
              <th v-text="time2"></th>
              <th v-text="time1"></th>
              <th v-text="time2"></th>
              <th v-text="time1"></th>
              <th>环比</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(val, index) in ttList">
              <td v-text="index + 1"></td>
              <td v-text="val.name"></td>
              <td v-text="val.problemCount2"></td>
              <td v-text="val.problemCount1"></td>
              <td v-text="val.problemRate2"></td>
              <td v-text="val.problemRate1"></td>
              <td v-text="val.vslp"></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="h-chart">
          <highcharts :options="vodEOASTtPie"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="vodEOASTtRate"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="vodEOASTtRateTrend"></highcharts>
        </div>
      </div>
      <div class="h-chart" v-show="dashboardType === '2'">
        <h3 class="h3">按项点分布</h3>
        <el-button type="primary" @click="jumpDept('tt')">查看分项点汇总对比</el-button>
        <div class="table h-chart">
          <table>
            <thead>
            <tr>
              <th rowspan="2">排名</th>
              <th rowspan="2">项点</th>
              <th colspan="2">问题件数</th>
              <th colspan="3">占比</th>
            </tr>
            <tr>
              <th v-text="time2"></th>
              <th v-text="time1"></th>
              <th v-text="time2"></th>
              <th v-text="time1"></th>
              <th>环比</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
            <tbody>
            <tr v-for="(val, index) in typeList">
              <td v-text="index + 1"></td>
              <td v-text="val.name"></td>
              <td v-text="val.problemCount2"></td>
              <td v-text="val.problemCount1"></td>
              <td v-text="val.problemRate2"></td>
              <td v-text="val.problemRate1"></td>
              <td v-text="val.vslp"></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="h-chart">
          <highcharts :options="vodEOASTypePie"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="vodEOASTypeRate"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="vodEOASTypeRateTrend"></highcharts>
        </div>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import dateView from '@/components/date-view'
  import dashboardView from '@/components/dashboard-view'

  export default {
    name: 'opVod',
    data () {
      return {
        to: '',
        titleList: ['概要', '按车队', '按项点'],
        dashboardType: '0',
        date: {
          from: '',
          to: '',
          timeUnit: ''
        },
        key: 1,
        num: 0,
        flag: true,
        loading: true,
        loginPopup: false,
        time1: '',
        time2: '',
        summary: {},
        ttList: [],
        typeList: [],
        ttCodes: [],
        vodEOASTtPie: {
          chart: {
            type: 'pie',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '各车队问题数占比'
          },
          tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.2f} %'
              },
              enableMouseTracking: true
            }
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          series: [{
            name: '各车队问题数占比',
            data: []
          }],
          colors: ['#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1']
        },
        vodEOASTtRate: {
          chart: {
            type: 'column',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '各车队问题数'
          },
          xAxis: {
            categories: [],
            crosshair: true,
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          tooltip: {
            shared: true
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              dataLabels: {
                enabled: true            // 开启数据标签
              }
            }
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          colors: config.DASHBOARD_COLOR,
          series: []
        },
        vodEOASTtRateTrend: {
          title: {
            style: {
              color: '#fff'
            },
            text: '各车队问题数占比环比'
          },
          xAxis: {
            categories: [],
            crosshair: true,
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            title: {
              text: ''
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          chart: {
            style: {
              fontFamily: '\'微软雅黑\', Arial, Helvetica, sans-serif',
              color: '#333',
              fontSize: '12px',
              fontWeight: 'normal',
              fontStyle: 'normal'
            },
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'column',
            inverted: false,
            width: 900
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormatter: function () {
              let text = this.y > 0 ? ('上升' + this.y.toFixed(2) + '%') : (this.y < 0 ? ('下降' + (this.y.toFixed(2) * -1) + '%') : '持平')
              return '<tr><td style="color:' + this.series.color + ';padding:0">' + this.series.name + '</td><td style="padding:0"><b>' + text + '</b></td></tr>'
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              dataLabels: {
                enabled: true            // 开启数据标签
              }
            },
            series: {
              dataLabels: {
                format: '{y:.2f}%'
              }
            }
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          colors: config.DASHBOARD_COLOR,
          series: [{
            data: [],
            name: ''
          }]
        },
        vodEOASTypePie: {
          chart: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'pie',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '各项点问题数占比'
          },
          tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.2f} %'
              },
              enableMouseTracking: true
            }
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          series: [{
            name: '各项点问题数占比',
            data: []
          }],
          colors: ['#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1']
        },
        vodEOASTypeRate: {
          chart: {
            type: 'column',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '各项点问题数'
          },
          xAxis: {
            categories: [],
            crosshair: true,
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          tooltip: {
            shared: true
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              dataLabels: {
                enabled: true            // 开启数据标签
              }
            }
          },
          colors: config.DASHBOARD_COLOR,
          series: []
        },
        vodEOASTypeRateTrend: {
          title: {
            style: {
              color: '#fff'
            },
            text: '各项点占比环比'
          },
          xAxis: {
            categories: [],
            crosshair: true,
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            title: {
              text: ''
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          chart: {
            style: {
              fontFamily: '\'微软雅黑\', Arial, Helvetica, sans-serif',
              color: '#333',
              fontSize: '12px',
              fontWeight: 'normal',
              fontStyle: 'normal'
            },
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'column',
            inverted: false,
            width: 900
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormatter: function () {
              let text = this.y > 0 ? ('上升' + this.y.toFixed(2) + '%') : (this.y < 0 ? ('下降' + (this.y.toFixed(2) * -1) + '%') : '持平')
              return '<tr><td style="color:' + this.series.color + ';padding:0">' + this.series.name + '</td><td style="padding:0"><b>' + text + '</b></td></tr>'
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              dataLabels: {
                enabled: true            // 开启数据标签
              }
            },
            series: {
              dataLabels: {
                format: '{y:.2f}%'
              }
            }
          },
          colors: config.DASHBOARD_COLOR,
          series: [{
            data: [],
            name: ''
          }]
        }
      }
    },
    components: {
      loginPopup,
      dateView,
      dashboardView,
      config
    },
    created () {
      if (!this.date.to) {
        this.to = new Date()
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.setScrollTop('1')
      })
    },
    methods: {
      getType (num) {
        if (this.dashboardType === num) {
          return
        }
        this.dashboardType = num
      },
      jumpDept (val) {
        let query = {
          from: this.date.from,
          to: this.date.to,
          deptType: 'TT',
          deptCodes: this.ttCodes,
          sources: ['EOAS']
        }
        console.log('jump to driVoDept list: ', query)
        this.$router.push({
          path: '/driver-vod-cnt-by-type-in-dept-list',
          query: query
        })
      },
      receiveDate (date) {
        if (date) {
          if (date !== this.date) {
            this.date.from = date.from
            this.date.to = date.to
            this.date.timeUnit = date.timeUnit
            this.getPersonDashboard()
          } else {
            return false
          }
        }
      },
      getPersonDashboard () {
        this.loading = true
        let self = this
        this.axios({
          method: 'GET',
          params: {'to': this.date.to, 'timeUnit': this.date.timeUnit},
          url: '/api/data-analysis/eoas'
        }).then((response) => {
          self.loading = false
          var data = response.data
          if (data.type === 1) {
            self.time1 = data.result.time1
            self.time2 = data.result.time2
            self.ttCodes = data.result.trainTeamCharts.codes
            // 图表数据
            self.vodEOASTtPie.series[0].data = data.result.trainTeamCharts.chart3
            self.vodEOASTtRate.xAxis.categories = data.result.trainTeamCharts.categories
            self.vodEOASTtRate.series = data.result.trainTeamCharts.chart2
            self.vodEOASTtRateTrend.xAxis.categories = data.result.trainTeamCharts.categories
            self.vodEOASTtRateTrend.series[0].data = data.result.trainTeamCharts.chart1
            self.vodEOASTypePie.series[0].data = data.result.typeCharts.chart3
            self.vodEOASTypeRate.xAxis.categories = data.result.typeCharts.categories
            self.vodEOASTypeRate.series = data.result.typeCharts.chart2
            self.vodEOASTypeRateTrend.xAxis.categories = data.result.typeCharts.categories
            self.vodEOASTypeRateTrend.series[0].data = data.result.typeCharts.chart1
            if (self.date.timeUnit === 'W') {
              self.vodEOASTtRateTrend.series[0].name = '较前一周环比'
              self.vodEOASTypeRateTrend.series[0].name = '较前一周环比'
            } else if (self.date.timeUnit === 'M') {
              self.vodEOASTtRateTrend.series[0].name = '较前一月环比'
              self.vodEOASTypeRateTrend.series[0].name = '较前一月环比'
            }
            // 表格数据
            self.ttList = data.result.trainTeamCharts.table
            self.typeList = data.result.typeCharts.table
            self.summary = data.result.summary
          } else {
            this.$message.error(data.msg)
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
      setScrollTop (index) {
        if (!this.flag) {
          return
        }
        if (index === '1') {
          this.scrlloTo(0, index)
        } else if (index === '2') {
          this.scrlloTo(350, index)
        } else if (index === '3') {
          this.scrlloTo(1850, index)
        }
      },
      scrlloTo (to, index) {
        this.flag = false
        let self = this
        let roll = setInterval(function () {
          if (index > self.key) {
            self.num += 50
          } else if (index < self.key) {
            self.num -= 50
          }
          window.scrollTo(0, self.num)
          if (self.num === to) {
            self.key = index
            self.num = to
            clearInterval(roll)
            self.flag = true
          }
        }, 10)
      }
    }
  }
</script>
<style scoped>
  .search-div {
    width: 100%;
  }
  .btn {
    float: right;
    margin-right: 60px;
    width: 118px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #b1b1b1;
    text-align: center;
    line-height: 30px;;
  }
  .table th, .table td {
    padding: 0 0.5em;
  }
</style>
