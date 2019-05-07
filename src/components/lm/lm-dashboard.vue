<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :onlyDate="true" :date="date" class="search-child"></date-box>
    </div>
    <div class="h-chart-box">
      <div class="h-chart">
        <highcharts :options="kiloOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="lmOdOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="runPairOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="securityOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="driverOnBoardOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="pomOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="uomOptions"></highcharts>
      </div>
      <div class="h-chart">
        <highcharts :options="romOptions"></highcharts>
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
        loading: false,
        kiloOptions: {
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
            text: '机车运用',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#fff'
            }
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
            }
          }],
          colors: config.DASHBOARD_COLOR,
          series: [{
            name: '日车公里',
            colors: ['#71ace9'],
            data: []
          }, {
            name: '日吨公里',
            colors: ['#85ea72'],
            data: []
          }]
        },
        securityOptions: {
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
            text: '机车安全',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#fff'
            }
          },
          xAxis: [{
            categories: ['安全数据'],
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
            }
          }],
          colors: config.DASHBOARD_COLOR,
          series: [{
            data: [],
            colors: ['#8fbeef'],
            name: 'LKJ问题数'
          }, {
            data: [],
            colors: ['#333'],
            name: 'EOAS问题数'
          }, {
            data: [],
            colors: ['#85ea72'],
            name: '6A报警数'
          }, {
            data: [],
            colors: ['#f9c194'],
            name: '6A故障数'
          }, {
            data: [],
            colors: ['#747ae6'],
            name: '430报警数'
          }, {
            data: [],
            colors: ['#ef5175'],
            name: 'TCMS报警数'
          }, {
            data: [],
            colors: ['#e0cd49'],
            name: '弓网检测报警数'
          }, {
            data: [],
            colors: ['#268584'],
            name: '值乘两违音频问题数'
          }, {
            data: [],
            colors: ['#f25051'],
            name: '值乘两违视频问题数'
          }, {
            data: [],
            colors: ['#86e5dd'],
            name: '检修两违问题数'
          }]
        },
        runPairOptions: {
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
            text: '开行对数',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#fff'
            }
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
            }
          }],
          colors: config.DASHBOARD_COLOR,
          series: [{
            data: [],
            colors: ['#71ace9'],
            name: '图定'
          }, {
            data: [],
            colors: ['#333'],
            name: '实际'
          }]
        },
        pomOptions: {
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
                events: {}
              }
            }
          },
          title: {
            text: '定修',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#fff'
            }
          },
          colors: config.DASHBOARD_COLOR,
          series: [{
            data: [{
              name: '交流机车大中修',
              y: 0
            }, {
              name: '交流机车小修',
              y: 0
            }, {
              name: '直流机车大中修',
              y: 0
            }, {
              name: '直流机车小修',
              y: 0
            }, {
              name: '内燃机车大中修',
              y: 0
            }, {
              name: '内燃机车小修',
              y: 0
            }]
          }]
        },
        uomOptions: {
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
                events: {}
              }
            }
          },
          title: {
            text: '临修',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#fff'
            }
          },
          colors: config.DASHBOARD_COLOR,
          series: [{
            data: [{
              name: '交流机车',
              y: 0
            }, {
              name: '直流机车',
              y: 0
            }, {
              name: '内燃机车',
              y: 0
            }]
          }]
        },
        driverOnBoardOptions: {
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
          xAxis: [{
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          }],
          title: {
            text: '乘务员上线',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#fff'
            }
          },
          colors: config.DASHBOARD_COLOR,
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
            }
          }],
          series: [{
            data: [],
            name: '图定'
          }, {
            data: [],
            name: '实际'
          }, {
            data: [],
            name: '增减'
          }]
        },
        lmOdOptions: {
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
            text: '机车出退勤',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#fff'
            }
          },
          xAxis: [{
            categories: ['货车', '客车'],
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
            }
          }],
          colors: config.DASHBOARD_COLOR,
          series: [{
            data: [],
            name: '出勤'
          }, {
            data: [],
            name: '退勤'
          }]
        },
        romOptions: {
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
                events: {}
              }
            }
          },
          title: {
            text: '专修',
            style: {
              'font-family': 'microsoft yahei !important',
              'color': '#fff'
            }
          },
          legend: {
            enabled: true,
            itemStyle: {
              color: '#fff'
            }
          },
          colors: config.DASHBOARD_COLOR,
          series: [{
            data: [{
              name: '交流机车',
              y: 0
            }, {
              name: '直流机车',
              y: 0
            }, {
              name: '内燃机车',
              y: 0
            }]
          }]
        },
        loginPopup: false,
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
      getPersonDashboard () {
        this.loading = true
        let self = this
        this.axios({
          method: 'GET',
          params: {'date': this.date},
          url: '/api/lm/dashboard'
        }).then((response) => {
          self.loading = false
          var data = response.data
          if (data.type === 1) {
            self.result = data.result
            self.romOptions.series[0].data[0].y = self.result.rom.aclmActualCnt
            self.romOptions.series[0].data[1].y = self.result.rom.dclmActualCnt
            self.romOptions.series[0].data[2].y = self.result.rom.dlmActualCnt
            self.uomOptions.series[0].data[0].y = self.result.uom.aclmCnt
            self.uomOptions.series[0].data[1].y = self.result.uom.dclmCnt
            self.uomOptions.series[0].data[2].y = self.result.uom.dlmCnt
            self.pomOptions.series[0].data[0].y = self.result.pom.aclmL23Actual
            self.pomOptions.series[0].data[1].y = self.result.pom.aclmL1Actual
            self.pomOptions.series[0].data[2].y = self.result.pom.dclmL23Actual
            self.pomOptions.series[0].data[3].y = self.result.pom.dclmL1Actual
            self.pomOptions.series[0].data[4].y = self.result.pom.dlmL23Actual
            self.pomOptions.series[0].data[5].y = self.result.pom.dlmL1Actual
            self.kiloOptions.xAxis[0].categories[0] = self.date
            self.kiloOptions.series[0].data = [self.result.lmUsing.lmKilo]
            self.kiloOptions.series[1].data = [self.result.lmUsing.tonKilo]
            self.runPairOptions.xAxis[0].categories[0] = self.date
            self.runPairOptions.series[0].data = [self.result.lmUsing.runPairCntPlaned]
            self.runPairOptions.series[1].data = [self.result.lmUsing.runPairCntActual]
            self.securityOptions.series[0].data = [self.result.lmSecurity.lkjCnt]
            self.securityOptions.series[1].data = [self.result.lmSecurity.eoasCnt]
            self.securityOptions.series[2].data = [self.result.lmSecurity.a6AlarmCnt]
            self.securityOptions.series[3].data = [self.result.lmSecurity.a6ProblemCnt]
            self.securityOptions.series[4].data = [self.result.lmSecurity.jk11430AlarmCnt]
            self.securityOptions.series[5].data = [self.result.lmSecurity.tcmsAlarmCnt]
            self.securityOptions.series[6].data = [self.result.lmSecurity.pccAlarmCnt]
            self.securityOptions.series[7].data = [self.result.lmSecurity.ttdVodAudioCnt]
            self.securityOptions.series[8].data = [self.result.lmSecurity.ttdVodVideoCnt]
            self.securityOptions.series[9].data = [self.result.lmSecurity.omVodCnt]
            self.lmOdOptions.series[0].data = [self.result.lmUsing.freightTrainOnDutyCnt, self.result.lmUsing.passengerTrainOnDutyCnt]
            self.lmOdOptions.series[1].data = [self.result.lmUsing.freightTrainOffDutyCnt, self.result.lmUsing.passengerTrainOffDutyCnt]
            self.driverOnBoardOptions.xAxis[0].categories[0] = self.date
            self.driverOnBoardOptions.series[0].data = [self.result.lmUsing.driverOnBoardCntPlaned]
            self.driverOnBoardOptions.series[1].data = [self.result.lmUsing.driverOnBoardCntActual]
            let ii = self.result.lmUsing.driverOnBoardCntActual - self.result.lmUsing.driverOnBoardCntPlaned
            self.driverOnBoardOptions.series[2].data = [ii]
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.loginPopup = true
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
      }
    }
  }
</script>

<style scoped>
  .h-chart{
    margin-bottom: 50px;
  }

</style>
