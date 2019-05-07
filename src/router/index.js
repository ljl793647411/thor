import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import personDashboard from '@/components/person/dashboard'
import lmDashboard from '@/components/lm/lm-dashboard'
import dailyReport from '@/components/dailyReport/daily-report'
import home from '@/components/home/home'
import driverVodCntByTypeInDeptList from '@/components/driverVod/cnt-by-type-in-dept-list'
import driverVodCntByTypeTrendInTimeList from '@/components/driverVod/cnt-by-type-trend-in-time-list'
import driverVodMgtList from '@/components/driverVod/driver-vod-mgt-list'
import driverVodList from '@/components/driverVod/driver-vod-list'
import omVodCntByTypeInDeptList from '@/components/omVod/cnt-by-type-in-dept-list'
import omVodCntByTypeTrendInTimeList from '@/components/omVod/cnt-by-type-trend-in-time-list'
import omVodDetailed from '@/components/omVod/om-vod-detailed'
import omVodMgtList from '@/components/omVod/om-vod-mgt-list'
// import driverDailySummaryDeptList from '@/components/person/driver-daily-summary-dept-list'
// import driverDailySummaryTimeList from '@/components/person/driver-daily-summary-time-list'
import driverDailySummaryMgtList from '@/components/person/driver-daily-summary-mgt-list'
import tsDailySummaryDeptList from '@/components/person/ts-daily-summary-dept-list'
import tsDailySummaryTimeList from '@/components/person/ts-daily-summary-time-list'
import tsDailySummaryMgt from '@/components/person/ts-daily-summary-mgt'
import runInfoCntByTypeInDeptList from '@/components/runInfo/cnt-by-type-in-dept-list'
import runInfoCntByTypeTrendInTimeList from '@/components/runInfo/cnt-by-type-trend-in-time-list'
import runInfoDetailed from '@/components/runInfo/run-info-detailed'
import runInfoMgtList from '@/components/runInfo/run-info-mgt-list'
import weatherMgt from '@/components/weather/weather-mgt'
import ttaMgt from '@/components/tta/tta-mgt'
import lmHeatMgt from '@/components/lmHeat/lm-heat-mgt'
import lmHeatList from '@/components/lmHeat/lm-heat-list'
import wineTestMgt from '@/components/wineTest/wine-test-mgt'
import lmUsingDailySummaryMgt from '@/components/lmUsingDailySummary/lm-using-daily-summary-mgt'
import lmOmDailySummaryMgt from '@/components/lmOmDailySummary/lm-om-daily-summary-mgt'
import securityDailySummaryMgt from '@/components/securityDailySummary/security-daily-summary-mgt'
import dataCheckDailySummary from '@/components/dataCheckDailySummary/data-check-daily-summary'
import dataCheckDailySummaryMgt from '@/components/dataCheckDailySummary/data-check-daily-summary-mgt'
import dataAnalysisDailySummaryMgt from '@/components/dataAnalysisDailySummary/data-analysis-daily-summary-mgt'
import floodCtrlMgtList from '@/components/floodCtrl/flood-ctrl-mgt-list'
import floodCtrlList from '@/components/floodCtrl/flood-ctrl-list'
import paMgtList from '@/components/pa/pa-mgt-list'
import paList from '@/components/pa/pa-list'
import typicalProblemMgt from '@/components/typicalProblem/typical-problem-mgt'
import role from '@/components/role/role-mgt-list'
import user from '@/components/user/user-mgt-list'
import sysConfig from '@/components/sysConfig/sys-config-mgt-list'
import sysConfigGroup from '@/components/sysConfigGroup/sys-config-group-mgt-list'
import lmMgtList from '@/components/lm/lm-mgt-list'
import driverMgtList from '@/components/driver/driver-mgt-list'
import deptMgtList from '@/components/dept/dept-mgt-list'
import dataAnalysis from '@/components/dataAnalysis/data-analysis-dashboard'
import dataAnalysisAudio from '@/components/dataAnalysis/data-analysis-audio'
import dataAnalysisVideo from '@/components/dataAnalysis/data-analysis-video'
import dataAnalysisLkj from '@/components/dataAnalysis/data-analysis-lkj'
import dataAnalysisEoas from '@/components/dataAnalysis/data-analysis-eoas'
import dataAnalysisOmVideo from '@/components/dataAnalysis/data-analysis-om-video'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    }, {
      path: '/home',
      name: '首页',
      component: home
    }, {
      path: '/person-dashboard',
      name: '综合应用 > 人员首页',
      component: personDashboard
    }, {
      path: '/lm-dashboard',
      name: '综合应用 > 机车首页',
      component: lmDashboard
    }, {
      path: '/daily-report',
      name: '综合日报',
      component: dailyReport
    }, {
      path: '/driver-vod-cnt-by-type-in-dept-list',
      name: '数据分析 > 值乘两违 > 分项点汇总对比数据',
      component: driverVodCntByTypeInDeptList
    }, {
      path: '/driver-vod-cnt-by-type-trend-in-time-list',
      name: '数据分析 > 值乘两违 > 分项点汇总趋势数据',
      component: driverVodCntByTypeTrendInTimeList
    }, {
      path: '/driver-vod-list',
      name: '数据分析 > 值乘两违 > 明细列表',
      component: driverVodList
    }, {
      path: '/driver-vod-mgt-list',
      name: '数据管理 > 值乘两违',
      component: driverVodMgtList
    }, {
      path: '/om-vod-cnt-by-type-in-dept-list',
      name: '数据分析 > 检修车间两违 > 分项点汇总对比数据',
      component: omVodCntByTypeInDeptList
    }, {
      path: '/om-vod-cnt-by-type-trend-in-time-list',
      name: '数据分析 > 检修车间两违 > 分项点汇总趋势数据',
      component: omVodCntByTypeTrendInTimeList
    }, {
      path: '/om-vod-detailed',
      name: '数据分析 > 检修车间两违-明细列表',
      component: omVodDetailed
    }, {
      path: '/om-vod-mgt-list',
      name: '数据管理 > 检修车间两违',
      component: omVodMgtList
    }, {
      path: '/driver-daily-summary-mgt-list',
      name: '综合应用 > 人员 > 每日司机信息汇总',
      component: driverDailySummaryMgtList
    }, {
      path: '/ts-daily-summary-time-list',
      name: '综合应用 > 人员 > 每日司机信息汇总 > 趋势数据',
      component: tsDailySummaryTimeList
    }, {
      path: '/ts-daily-summary-dept-list',
      name: '综合应用 > 人员 > 每日司机信息汇总 > 对比数据',
      component: tsDailySummaryDeptList
    }, {
      path: '/ts-daily-summary-mgt',
      name: '数据管理 > 每日司机信息汇总',
      component: tsDailySummaryMgt
    }, {
      path: '/run-info-cnt-by-type-in-dept-list',
      name: '数据分析 > 非正常运行信息 > 分类别汇总对比数据',
      component: runInfoCntByTypeInDeptList
    }, {
      path: '/run-info-cnt-by-type-trend-in-time-list',
      name: '数据分析 > 非正常运行信息 > 分类别汇总趋势数据',
      component: runInfoCntByTypeTrendInTimeList
    }, {
      path: '/run-info-detailed',
      name: '数据分析 > 非正常运行信息 > 明细列表',
      component: runInfoDetailed
    }, {
      path: '/run-info-mgt-list',
      name: '数据管理 > 非正常运行信息',
      component: runInfoMgtList
    }, {
      path: '/weather-mgt',
      name: '数据管理 > 每日天气情况管理',
      component: weatherMgt
    }, {
      path: '/tta-mgt',
      name: '数据管理 > 添乘每日汇总管理',
      component: ttaMgt
    }, {
      path: '/lm-heat-mgt',
      name: '数据管理 > 机车打温每日汇总管理',
      component: lmHeatMgt
    }, {
      path: '/wine-test-mgt',
      name: '数据管理 > 测酒每日汇总管理',
      component: wineTestMgt
    }, {
      path: '/lm-using-daily-summary-mgt',
      name: '数据管理 > 机车运用每日汇总管理',
      component: lmUsingDailySummaryMgt
    }, {
      path: '/lm-om-daily-summary-mgt',
      name: '数据管理 > 机车维修每日汇总管理',
      component: lmOmDailySummaryMgt
    }, {
      path: '/security-daily-summary-mgt',
      name: '数据管理 > 安全数据每日汇总管理',
      component: securityDailySummaryMgt
    }, {
      path: '/data-check-daily-summary',
      name: '综合应用 > 信息 > 车载数据转储核对每日汇总',
      component: dataCheckDailySummary
    }, {
      path: '/data-check-daily-summary-mgt',
      name: '数据管理 > 车载数据转储与核对每日汇总',
      component: dataCheckDailySummaryMgt
    }, {
      path: '/data-analysis-daily-summary-mgt',
      name: '数据管理 > 车载数据分析班数每日汇总',
      component: dataAnalysisDailySummaryMgt
    }, {
      path: '/pa-mgt-list',
      name: '数据管理 > 人员考核管理',
      component: paMgtList
    }, {
      path: '/flood-ctrl-mgt-list',
      name: '数据管理 > 雨情与防洪专项分析',
      component: floodCtrlMgtList
    }, {
      path: '/pa-list',
      name: '综合应用 > 信息 > 考核信息',
      component: paList
    }, {
      path: '/flood-ctrl-list',
      name: '综合应用 > 信息 > 季节性信息 > 雨情与防洪专项分析',
      component: floodCtrlList
    }, {
      path: '/lm-heat-list',
      name: '综合应用 > 信息 > 机车打温',
      component: lmHeatList
    }, {
      path: '/typical-problem-mgt',
      name: '数据管理 > 典型问题管理',
      component: typicalProblemMgt
    }, {
      path: '/role-mgt-list',
      name: '系统管理 > 角色管理',
      component: role
    }, {
      path: '/user-mgt-list',
      name: '系统管理 > 用户管理',
      component: user
    }, {
      path: '/sys-config-mgt-list',
      name: '系统管理 > 系统设置管理',
      component: sysConfig
    }, {
      path: '/sys-config-group-mgt-list',
      name: '系统管理 > 系统设置分组管理',
      component: sysConfigGroup
    }, {
      path: '/lm-mgt-list',
      name: '系统管理 > 机车',
      component: lmMgtList
    }, {
      path: '/driver-mgt-list',
      name: '系统管理 > 司机',
      component: driverMgtList
    }, {
      path: '/op-dept-mgt-list',
      name: '系统管理 > 作业者部门',
      component: deptMgtList
    }, {
      path: '/data-analysis-dashboard',
      name: '数据分析管理',
      component: dataAnalysis
    }, {
      path: '/data-analysis-audio',
      name: '数据分析 > 车载音频分析',
      component: dataAnalysisAudio
    }, {
      path: '/data-analysis-video',
      name: '数据分析 > 车载视频分析',
      component: dataAnalysisVideo
    }, {
      path: '/data-analysis-lkj',
      name: '数据分析 > LKJ分析',
      component: dataAnalysisLkj
    }, {
      path: '/data-analysis-eoas',
      name: '数据分析 > EOAS分析',
      component: dataAnalysisEoas
    }, {
      path: '/data-analysis-om-video',
      name: '数据分析 > 检修视频分析',
      component: dataAnalysisOmVideo
    }//, {
    //   path: '/driver-daily-summary-time-list',
    //   name: '数据分析 > 每日司机信息汇总 > 趋势数据',
    //   component: driverDailySummaryTimeList
    // }, {
    //   path: '/driver-daily-summary-dept-list',
    //   name: '数据分析 > 每日司机信息汇总 > 对比数据',
    //   component: driverDailySummaryDeptList
    // },
  ]
})
