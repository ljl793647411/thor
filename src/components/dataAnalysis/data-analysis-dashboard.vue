<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <dashboard-view :titleList="titleList" @getType="getType" class="search-child"></dashboard-view>
    </div>
    <div class="tacData">
      <div class="h-chart" v-show="dashboardType === '0'">
        <h3 class="h3">概要</h3>
        <p v-text="'两违问题发生率（%）：较前一年环比' + vslp" class="h-chart-title"></p>
        <div class="h-chart">
          <highcharts :options="allRateTrend"></highcharts>
        </div>
      </div>
      <div class="h-chart" v-show="dashboardType === '1'">
        <h3 class="h3">车载音频分析</h3>
        <el-button type="primary" @click="jump('a')">查看车载音频分析明细</el-button>
        <p v-text="'车载音频分析发现的两违问题发生率（%）：较前一年环比' + vslpTtdAudio" class="h-chart-title"></p>
        <div class="h-chart">
          <highcharts :options="vodAudioRateTrend"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="vodAudioTsRate"></highcharts>
        </div>
      </div>
      <div class="h-chart" v-show="dashboardType === '2'">
        <h3 class="h3">车载视频分析</h3>
        <el-button type="primary" @click="jump('v')">查看车载视频分析明细</el-button>
        <p v-text="'车载视频分析发现的两违问题发生率（%）：较前一年环比' + vslpTtdVideo" class="h-chart-title"></p>
        <div class="h-chart">
          <highcharts :options="vodVideoRateTrend"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="vodVideoTsRate"></highcharts>
        </div>
      </div>
      <div class="h-chart" v-show="dashboardType === '3'">
        <h3 class="h3">LKJ分析</h3>
        <el-button type="primary" @click="jump('lkj')">查看LKJ分析明细</el-button>
        <p v-text="'LKJ分析发现的两违问题发生率（%）：较前一年环比' + vslpLkj" class="h-chart-title"></p>
        <div class="h-chart">
          <highcharts :options="lkjRateTrend"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="lkjTsRate2"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="lkjTsRate3"></highcharts>
        </div>
      </div>
      <div class="h-chart" v-show="dashboardType === '4'">
        <h3 class="h3">EOAS分析</h3>
        <el-button type="primary" @click="jump('eoas')">查看EOAS分析明细</el-button>
        <p v-text="'EOAS分析发现的两违问题发生率（%）：较前一年环比' + vslpEoas" class="h-chart-title"></p>
        <div class="h-chart">
          <highcharts :options="eoasRateTrend"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="eoasTtRate2"></highcharts>
        </div>
        <div class="h-chart">
          <highcharts :options="eoasTtRate3"></highcharts>
        </div>
      </div>
      <div class="h-chart" v-show="dashboardType === '5'">
        <h3 class="h3">检修视频分析</h3>
        <el-button type="primary" @click="jump('om')">查看检修视频分析明细</el-button>
        <p v-text="'检修视频分析发现的两违问题发生率（%）：较前一年环比' + vslpOmVideo" class="h-chart-title"></p>
        <div class="h-chart">
          <highcharts :options="omVideoRateTrend"></highcharts>
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
  import dashboardView from '@/components/dashboard-view'

  export default {
    name: 'opVod',
    data () {
      return {
        key: 1,
        dashboardType: '0',
        num: 0,
        titleList: ['概要', '车载音频分析', '车载视频分析', 'LKJ分析', 'EOAS分析', '检修视频分析'],
        flag: true,
        loginPopup: false,
        loading: false,
        vslp: '',
        vslpTtdAudio: '',
        vslpTtdVideo: '',
        vslpLkj: '',
        vslpEoas: '',
        vslpOmVideo: '',
        date: 'yiyue',
        allRateTrend: {
          chart: {
            type: 'line',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: ''
          },
          xAxis: {
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            title: {
              text: '两违问题发生率'
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          colors: config.DASHBOARD_COLOR,
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table><br>',
            pointFormatter: function () {
              let y = this.y.toFixed(2)
              let year = this.series.name.substring(0, 4)
              let month = this.category.substring(0, this.category.indexOf('月'))
              let firstMonth = this.series.xAxis.categories[0].substring(0, this.series.xAxis.categories[0].indexOf('月'))
              if (parseInt(month) < parseInt(firstMonth)) {
                year++
              }
              return `<tr><td style="color:${this.series.color};padding:0">${year}年${month}月: </td><td style="padding:0"><b>${y}%</b></td></tr>`
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true // 开启数据标签
              },
              enableMouseTracking: true, // 关闭鼠标跟踪，对应的提示框、点击事件会失效
              events: {
                click: function (event) {
                  console.log('event', event)
                }
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
          series: [{
            data: []
          }, {
            data: [],
            _colorIndex: 3
          }]
        },
        vodAudioRateTrend: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            type: 'line',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: ''
          },
          xAxis: {
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            title: {
              text: '车载音频分析发现的两违问题发生率'
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormatter: function () {
              let y = this.y.toFixed(2)
              let year = this.series.name.substring(0, 4)
              let month = this.category.substring(0, this.category.indexOf('月'))
              let firstMonth = this.series.xAxis.categories[0].substring(0, this.series.xAxis.categories[0].indexOf('月'))
              if (parseInt(month) < parseInt(firstMonth)) {
                year++
              }
              return `<tr><td style="color:${this.series.color};padding:0">${year}年${month}月: </td><td style="padding:0"><b>${y}%</b></td></tr>`
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
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
          series: [{
            data: []
          }, {
            data: [],
            _colorIndex: 3
          }]
        },
        vodAudioTsRate: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            type: 'column',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '各车间问题发生率'
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
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f}%</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            },
            series: {
              dataLabels: {
                enabled: true,
                format: '{y:.2f}%'
              },
              animation: false
            }
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          series: [{
            name: '',
            data: []
          }, {
            name: '',
            data: [],
            _colorIndex: 3
          }]
        },
        vodVideoRateTrend: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            type: 'line',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: ''
          },
          xAxis: {
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            title: {
              text: '车载视频分析发现的两违问题发生率'
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormatter: function () {
              let y = this.y.toFixed(2)
              let year = this.series.name.substring(0, 4)
              let month = this.category.substring(0, this.category.indexOf('月'))
              let firstMonth = this.series.xAxis.categories[0].substring(0, this.series.xAxis.categories[0].indexOf('月'))
              if (parseInt(month) < parseInt(firstMonth)) {
                year++
              }
              return `<tr><td style="color:${this.series.color};padding:0">${year}年${month}月: </td><td style="padding:0"><b>${y}%</b></td></tr>`
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
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
          series: [{
            data: []
          }, {
            data: [],
            _colorIndex: 3
          }]
        },
        vodVideoTsRate: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            type: 'column',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '各车间问题发生率'
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
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f}%</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            },
            series: {
              dataLabels: {
                enabled: true,
                format: '{y:.2f}%'
              },
              animation: false
            }
          },
          series: [{
            name: '',
            data: []
          }, {
            name: '',
            data: [],
            _colorIndex: 3
          }]
        },
        lkjRateTrend: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            type: 'line',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: ''
          },
          xAxis: {
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            title: {
              text: 'LKJ分析发现的两违问题发生率'
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormatter: function () {
              let y = this.y.toFixed(2)
              let year = this.series.name.substring(0, 4)
              let month = this.category.substring(0, this.category.indexOf('月'))
              let firstMonth = this.series.xAxis.categories[0].substring(0, this.series.xAxis.categories[0].indexOf('月'))
              if (parseInt(month) < parseInt(firstMonth)) {
                year++
              }
              return `<tr><td style="color:${this.series.color};padding:0">${year}年${month}月: </td><td style="padding:0"><b>${y}%</b></td></tr>`
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
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
          series: [{
            data: []
          }, {
            data: [],
            _colorIndex: 3
          }]
        },
        lkjTsRate2: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '本月各车间问题数占比'
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
          series: [{
            type: 'pie',
            name: '各车间问题数占比',
            data: []
          }],
          legend: {
            itemStyle: {
              color: '#fff'
            }
          }
        },
        lkjTsRate3: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'column',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '各车间问题数占比较上月环比'
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
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            },
            series: {
              dataLabels: {
                enabled: true,
                format: '{y:.2f}%'
              },
              animation: false
            }
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          series: [{
            name: '较上月环比',
            data: [],
            _colorIndex: 3
          }]
        },
        eoasRateTrend: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            type: 'line',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: ''
          },
          xAxis: {
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            title: {
              text: 'EOAS分析发现的两违问题发生率'
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
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormatter: function () {
              let y = this.y.toFixed(2)
              let year = this.series.name.substring(0, 4)
              let month = this.category.substring(0, this.category.indexOf('月'))
              let firstMonth = this.series.xAxis.categories[0].substring(0, this.series.xAxis.categories[0].indexOf('月'))
              if (parseInt(month) < parseInt(firstMonth)) {
                year++
              }
              return `<tr><td style="color:${this.series.color};padding:0">${year}年${month}月: </td><td style="padding:0"><b>${y}%</b></td></tr>`
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            },
            series: {
              dataLabels: {
                format: '{y:.2f}%'
              }
            }
          },
          series: [{
            data: []
          }, {
            data: [],
            _colorIndex: 3
          }]
        },
        eoasTtRate2: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '本月各车队问题数占比'
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
              }
            }
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          series: [{
            type: 'pie',
            name: '各车间问题数占比',
            data: []
          }]
        },
        eoasTtRate3: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            type: 'column',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: '各车队问题数占比较上月环比'
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
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            },
            series: {
              dataLabels: {
                enabled: true,
                format: '{y:.2f}%'
              },
              animation: false
            }
          },
          series: [{
            name: '较上月环比',
            data: [],
            _colorIndex: 3
          }]
        },
        omVideoRateTrend: {
          colors: config.DASHBOARD_COLOR,
          chart: {
            type: 'line',
            backgroundColor: 'rgba(255,255,255,0.2)',
            width: 900
          },
          title: {
            style: {
              color: '#fff'
            },
            text: ''
          },
          xAxis: {
            categories: [],
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            title: {
              text: '检修视频分析发现的两违问题发生率'
            },
            labels: {
              style: {
                color: '#fff'
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormatter: function () {
              let y = this.y.toFixed(2)
              let year = this.series.name.substring(0, 4)
              let month = this.category.substring(0, this.category.indexOf('月'))
              let firstMonth = this.series.xAxis.categories[0].substring(0, this.series.xAxis.categories[0].indexOf('月'))
              if (parseInt(month) < parseInt(firstMonth)) {
                year++
              }
              return `<tr><td style="color:${this.series.color};padding:0">${year}年${month}月: </td><td style="padding:0"><b>${y}%</b></td></tr>`
            },
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          legend: {
            itemStyle: {
              color: '#fff'
            }
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true            // 开启数据标签
              },
              enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            },
            series: {
              dataLabels: {
                enabled: true,
                format: '{y:.2f}%'
              },
              animation: false
            }
          },
          series: [{
            data: []
          }, {
            data: [],
            _colorIndex: 3
          }]
        }
      }
    },
    components: {
      loginPopup,
      dashboardView,
      config
    },
    mounted () {
      this.$nextTick(() => {
        this.getPersonDashboard()
        console.log(this.allRateTrend)
      })
    },
    methods: {
      getType (num) {
        if (this.dashboardType === num) {
          return
        }
        this.dashboardType = num
      },
      jump (val) {
        let url
        if (val === 'a') {
          url = '/data-analysis-audio'
        } else if (val === 'v') {
          url = '/data-analysis-video'
        } else if (val === 'lkj') {
          url = '/data-analysis-lkj'
        } else if (val === 'eoas') {
          url = '/data-analysis-eoas'
        } else if (val === 'om') {
          url = '/data-analysis-om-video'
        }
        this.$router.push({
          path: url,
          query: {
            scorllTo: 'top'
          }
        })
      },
      jumpPa (event) {
        console.log(event)
      },
      getPersonDashboard () {
        let self = this
        this.loading = true
        this.axios({
          method: 'GET',
          params: '',
          url: '/api/data-analysis/dashboard'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            // 所有年份数据
            self.allRateTrend.xAxis.categories = data.result.vodRate2Years.categories
            self.allRateTrend.series = data.result.vodRate2Years.summary
            self.vodAudioRateTrend.xAxis.categories = data.result.vodRate2Years.categories
            self.vodAudioRateTrend.series = data.result.vodRate2Years.ttdAudio
            self.vodVideoRateTrend.xAxis.categories = data.result.vodRate2Years.categories
            self.vodVideoRateTrend.series = data.result.vodRate2Years.ttdVideo
            self.lkjRateTrend.xAxis.categories = data.result.vodRate2Years.categories
            self.lkjRateTrend.series = data.result.vodRate2Years.lkj
            self.eoasRateTrend.xAxis.categories = data.result.vodRate2Years.categories
            self.eoasRateTrend.series = data.result.vodRate2Years.eoas
            self.omVideoRateTrend.xAxis.categories = data.result.vodRate2Years.categories
            self.omVideoRateTrend.series = data.result.vodRate2Years.omVideo
            // 环比
            self.vslp = data.result.vodRate2Years.vslp
            self.vslpTtdAudio = data.result.vodRate2Years.vslpTtdAudio
            self.vslpTtdVideo = data.result.vodRate2Years.vslpTtdVideo
            self.vslpLkj = data.result.vodRate2Years.vslpLkj
            self.vslpEoas = data.result.vodRate2Years.vslpEoas
            self.vslpOmVideo = data.result.vodRate2Years.vslpOmVideo
            // 音视频月份数据
            self.vodAudioTsRate.xAxis.categories = data.result.ttdAudio.categories
            self.vodAudioTsRate.series = data.result.ttdAudio.series
            self.vodVideoTsRate.xAxis.categories = data.result.ttdVideo.categories
            self.vodVideoTsRate.series = data.result.ttdVideo.series
            // 饼状柱状数据
            self.lkjTsRate2.series[0].data = data.result.lkj.pieData
            self.lkjTsRate3.xAxis.categories = data.result.lkj.categories
            self.lkjTsRate3.series[0].data = data.result.lkj.columnData
            self.eoasTtRate2.series[0].data = data.result.eoas.pieData
            self.eoasTtRate3.xAxis.categories = data.result.eoas.categories
            self.eoasTtRate3.series[0].data = data.result.eoas.columnData
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.loginPopup = true
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
          this.scrollTo(0, index)
        } else if (index === '2') {
          this.scrollTo(700, index)
        } else if (index === '3') {
          this.scrollTo(1600, index)
        } else if (index === '4') {
          this.scrollTo(2550, index)
        } else if (index === '5') {
          this.scrollTo(3450, index)
        } else if (index === '6') {
          this.scrollTo(4300, index)
        }
      },
      scrollTo (to, index) {
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

  .h-chart-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .h-chart {
    overflow: hidden;
    margin-bottom: 50px;
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

</style>
