<template>
  <div>
    <div class="search">
      <date-box @sendDate="receiveDate" :onlyDate="true" :date="date" class="search-child"></date-box>
    </div>
    <div class="h-chart-box">
      <div class="h-chart">
        <highcharts :options="paLevelPercentageOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="dutyTtdVodCntTrendOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="runInfoTypeCntOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="paDeptCntOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="wtRateOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="rcRateOptions"></highcharts>
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
  import dateBox from '@/components/date-box'

  export default {
    name: 'opVod',
    data () {
      return {
        date: this.moment().subtract(1, 'd').format('YYYY-MM-DD'),
        paLevelPercentageOptions: {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'pie' // 什么图，柱状折线这种
          },
          plotOptions: {
            series: {
              allowPointSelect: true,  // 设置点击事件
              cursor: 'pointer', // 设置click events attached to the series
              point: {
                events: {
                  click: this.jumpPa
                }
              }
            }
          },
          tooltip: {
            pointFormat: '{point.name}: <b>{point.percentage:.2f}%</b>'
          },
          title: {
            text: '人员两违考核级别分布',
            style: {
              'font-family': 'microsoft yahei !important',
              'cursor': 'pointer',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true
          },
          colors: config.DASHBOARD_COLOR,
          series: [{
            name: '',
            colorByPoint: true,
            data: []
          }]
        },
        dutyTtdVodCntTrendOptions: {
          chart: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'spline' // 什么图，柱状折线这种
          },
          plotOptions: {
            series: {
              cursor: 'pointer', // 设置click events attached to the series
              point: {
                events: {}
              }
            }
          },
          title: {
            text: '人员两违考核走势',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          xAxis: {
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: [{
            title: {
              text: ''
            },
            labels: {
              format: '{value}',
              style: {
                color: '#fff'
              }
              // format: '{generalValue} 次' 根据series里面的数值大小自动生成
            },
            min: 0
          }],
          colors: config.DASHBOARD_COLOR,
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          series: [{
            name: '值乘',
            data: []
          }, {
            name: '两违',
            data: []
          }, {
            name: '出勤',
            data: []
          }]
        },
        runInfoTypeCntOptions: {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'column' // 什么图，柱状折线这种
          },
          plotOptions: {
            series: {
              cursor: 'pointer', // 设置click events attached to the series
              point: {
                events: {}
              }
            }
          },
          title: {
            text: '非正常行车信息类型分布',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: false
          },
          xAxis: [{
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          }],
          yAxis: [{
            title: {
              text: ''
            },
            labels: {
              format: '{value}',
              style: {
                color: '#fff'
              }
              // format: '{generalValue} 次' 根据series里面的数值大小自动生成
            },
            min: 0
          }],
          colors: config.DASHBOARD_COLOR,
          series: [{
            colorByPoint: true,
            colors: ['#f5a658'],
            data: [],
            dataLabels: {
              format: '{y}%',
              style: {
                color: '#fff'
              }
            }
          }]
        },
        paDeptCntOptions: {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'column' // 什么图，柱状折线这种
          },
          plotOptions: {
            series: {
              cursor: 'pointer', // 设置click events attached to the series
              point: {
                events: {}
              }
            }
          },
          title: {
            text: '人员两违考核部门分布',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: false
          },
          xAxis: [{
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          }],
          yAxis: [{
            title: {
              text: ''
            },
            labels: {
              format: '{value}',
              style: {
                color: '#fff'
              }
              // format: '{generalValue} 次' 根据series里面的数值大小自动生成
            },
            min: 0
          }],
          colors: config.DASHBOARD_COLOR,
          series: [{
            colorByPoint: true,
            colors: ['#53b9fe'],
            data: [],
            dataLabels: {
              format: '{y}%',
              style: {
                color: '#fff'
              }
            }
          }]
        },
        wtRateOptions: {
          chart: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'solidgauge' // 什么图，柱状折线这种
          },
          pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc'
            }
          },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
              }
            }
          },
          title: {
            text: '酒测通过率',
            style: {
              'font-family': 'microsoft yahei !important',
              'font-size': 16,
              'color': '#fff'
            }
          },
          yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
              y: -70
            },
            labels: {
              y: 16,
              style: {
                color: '#fff'
              }
            }
          },
          credits: {
            enabled: false
          },
          colors: config.DASHBOARD_COLOR,
          series: [{
            name: '酒测通过率',
            data: [],
            dataLabels: {
              format: '{y}%',
              style: {
                color: '#fff'
              }
            },
            colorByPoint: true,
            colors: ['#459ae5']
          }]
        },
        rcRateOptions: {
          chart: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'solidgauge' // 什么图，柱状折线这种
          },
          pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc'
            }
          },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
              }
            }
          },
          title: {
            text: '揭示核对执行率',
            style: {
              'font-family': 'microsoft yahei !important',
              'font-size': 16,
              'color': '#fff'
            }
          },
          yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
              y: -70
            },
            labels: {
              y: 16,
              style: {
                color: '#fff'
              }
            }
          },
          credits: {
            enabled: false
          },
          colors: config.DASHBOARD_COLOR,
          series: [{
            name: '揭示核对执行率',
            data: [],
            dataLabels: {
              format: '{y}%',
              style: {
                color: '#fff'
              }
            },
            colorByPoint: true,
            colors: ['#459ae5']
          }]
        },
        loginPopup: false,
        errMsg: '',
        result: {}
      }
    },
    components: {
      loginPopup,
      dateBox
    },
    methods: {
      receiveDate (date) {
        if (date) {
          this.date = date
        }
        this.getPersonDashboard()
      },
      jumpPa (event) {
        let data = event.target.point
        if (!data) {
          return
        }
        let level = data.name.substr(0, 1)
        let query = {
          from: this.date,
          to: this.date,
          level: level
        }
        console.log('jump to pa list: ', query)
        this.$router.push({
          path: '/pa-list',
          query: query
        })
      },
      getPersonDashboard () {
        let self = this
        this.axios({
          method: 'GET',
          params: {'date': this.date},
          url: '/api/person/dashboard'
//          url: '/static/dashboard.json'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            self.result = data.result
            let j = 0
            self.paLevelPercentageOptions.series[0].data = []
            for (let i in self.result.paTypePecentage) {
              self.paLevelPercentageOptions.series[0].data.push({
                name: '',
                y: null
              })
              self.paLevelPercentageOptions.series[0].data[j].name = i
              self.paLevelPercentageOptions.series[0].data[j].y = self.result.paTypePecentage[i]
//            self.$set(self.paLevelPercentageOptions.series.data, j, self.paLevelPercentageOptions.series.data[j])
              j++
            }
            self.wtRateOptions.series[0].data = []
            self.wtRateOptions.series[0].data.push(self.result.wtRate)
            self.rcRateOptions.series[0].data = []
            self.rcRateOptions.series[0].data.push(self.result.rcRate)
            self.runInfoTypeCntOptions.xAxis[0].categories = []
            self.runInfoTypeCntOptions.series[0].data = []
            for (let m in self.result.runInfoTypeCnt) {
              self.runInfoTypeCntOptions.xAxis[0].categories.push(m)
              self.runInfoTypeCntOptions.series[0].data.push(self.result.runInfoTypeCnt[m])
            }
            self.paDeptCntOptions.xAxis[0].categories = []
            self.paDeptCntOptions.series[0].data = []
            for (let m in self.result.paDeptCnt) {
              self.paDeptCntOptions.xAxis[0].categories.push(m)
              self.paDeptCntOptions.series[0].data.push(self.result.paDeptCnt[m])
            }
            self.dutyTtdVodCntTrendOptions.xAxis.categories = []
            self.dutyTtdVodCntTrendOptions.series[0].data = []
            self.dutyTtdVodCntTrendOptions.series[1].data = []
            self.dutyTtdVodCntTrendOptions.series[2].data = []
            for (let n in self.result.dutyTtdVodCntTrend) {
              self.dutyTtdVodCntTrendOptions.xAxis.categories.push(self.result.dutyTtdVodCntTrend[n].date)
              self.dutyTtdVodCntTrendOptions.series[0].data.push(self.result.dutyTtdVodCntTrend[n].ttdCnt)
              self.dutyTtdVodCntTrendOptions.series[1].data.push(self.result.dutyTtdVodCntTrend[n].vodCnt)
              self.dutyTtdVodCntTrendOptions.series[2].data.push(self.result.dutyTtdVodCntTrend[n].onDutyCnt)
            }
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.loginPopup = true
          } else {
            self.errMsg = data.msg
            self.hideMsg()
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      hideMsg () {
        setTimeout(() => {
          this.errMsg = ''
        }, 5000)
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
