<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :onlyDate="true" :date="date" class="search-child"></date-box>
    </div>
    <div class="report" v-if="dailyList.runInfoComm">
      <div class="top">
        <div class="top-left">
          <div class="t-l-top">
            <div class="t-l-t-left">
              <div class="t-l-t-left-1 table">
                <table>
                  <thead>
                    <tr>
                      <th colspan="8" @click="jumpRunInfo('COMM')" class="cursor cursor-hover">普速运行信息</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td @click="jumpRunInfo('COMM', '区间停车')" class="cursor cursor-hover">区间停车</td>
                      <td @click="jumpRunInfo('COMM', '异常站停')" class="cursor cursor-hover">异常站停</td>
                      <td @click="jumpRunInfo('COMM', '防压伤')" class="cursor cursor-hover">防压伤</td>
                      <td @click="jumpRunInfo('COMM', '路外伤亡')" class="cursor cursor-hover">路外伤亡</td>
                      <td @click="jumpRunInfo('COMM', '质量信息')" class="cursor cursor-hover">质量信息</td>
                      <td @click="jumpRunInfo('COMM', '临时命令')" class="cursor cursor-hover">临时命令</td>
                      <td @click="jumpRunInfo('COMM', '接触网')" class="cursor cursor-hover">接触网</td>
                      <td @click="jumpRunInfo('COMM', '路外安全')" class="cursor cursor-hover">路外安全</td>
                    </tr>
                    <tr>
                      <td v-text="dailyList.runInfoComm['区间停车']" @click="jumpRunInfo('COMM', '区间停车')" class="cursor cursor-hover"></td>
                      <td v-text="dailyList.runInfoComm['异常站停']" @click="jumpRunInfo('COMM', '异常站停')" class="cursor cursor-hover"></td>
                      <td v-text="dailyList.runInfoComm['防压伤']" @click="jumpRunInfo('COMM', '防压伤')" class="cursor cursor-hover"></td>
                      <td v-text="dailyList.runInfoComm['路外伤亡']" @click="jumpRunInfo('COMM', '路外伤亡')" class="cursor cursor-hover"></td>
                      <td v-text="dailyList.runInfoComm['质量信息']" @click="jumpRunInfo('COMM', '质量信息')" class="cursor cursor-hover"></td>
                      <td v-text="dailyList.runInfoComm['临时命令']" @click="jumpRunInfo('COMM', '临时命令')" class="cursor cursor-hover"></td>
                      <td v-text="dailyList.runInfoComm['接触网']" @click="jumpRunInfo('COMM', '接触网')" class="cursor cursor-hover"></td>
                      <td v-text="dailyList.runInfoComm['路外安全']" @click="jumpRunInfo('COMM', '路外安全')" class="cursor cursor-hover"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="t-l-t-left-2 table">
                <table>
                  <thead>
                    <tr>
                      <th colspan="8" @click="jumpRunInfo('EMU')" class="cursor cursor-hover">动车运行信息</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td @click="jumpRunInfo('EMU', '区间停车')" class="cursor cursor-hover">区间停车</td>
                    <td @click="jumpRunInfo('EMU', '异常站停')" class="cursor cursor-hover">异常站停</td>
                    <td @click="jumpRunInfo('EMU', '防压伤')" class="cursor cursor-hover">防压伤</td>
                    <td @click="jumpRunInfo('EMU', '路外伤亡')" class="cursor cursor-hover">路外伤亡</td>
                    <td @click="jumpRunInfo('EMU', '质量信息')" class="cursor cursor-hover">质量信息</td>
                    <td @click="jumpRunInfo('EMU', '临时命令')" class="cursor cursor-hover">临时命令</td>
                    <td @click="jumpRunInfo('EMU', '接触网')" class="cursor cursor-hover">接触网</td>
                    <td @click="jumpRunInfo('EMU', '路外安全')" class="cursor cursor-hover">路外安全</td>
                  </tr>
                  <tr>
                    <td v-text="dailyList.runInfoEmu['区间停车']" @click="jumpRunInfo('EMU', '区间停车')" class="cursor cursor-hover"></td>
                    <td v-text="dailyList.runInfoEmu['异常站停']" @click="jumpRunInfo('EMU', '异常站停')" class="cursor cursor-hover"></td>
                    <td v-text="dailyList.runInfoEmu['防压伤']" @click="jumpRunInfo('EMU', '防压伤')" class="cursor cursor-hover"></td>
                    <td v-text="dailyList.runInfoEmu['路外伤亡']" @click="jumpRunInfo('EMU', '路外伤亡')" class="cursor cursor-hover"></td>
                    <td v-text="dailyList.runInfoEmu['质量信息']" @click="jumpRunInfo('EMU', '质量信息')" class="cursor cursor-hover"></td>
                    <td v-text="dailyList.runInfoEmu['临时命令']" @click="jumpRunInfo('EMU', '临时命令')" class="cursor cursor-hover"></td>
                    <td v-text="dailyList.runInfoEmu['接触网']" @click="jumpRunInfo('EMU', '接触网')" class="cursor cursor-hover"></td>
                    <td v-text="dailyList.runInfoEmu['路外安全']" @click="jumpRunInfo('EMU', '路外安全')" class="cursor cursor-hover"></td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="t-l-t-left-3 table">
                <table>
                  <thead>
                    <tr>
                      <th colspan="10">安全数据</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>LKJ问题</td>
                      <td>EOAS问题</td>
                      <td>430报警</td>
                      <td>TCMS报警</td>
                      <td>弓网检测报警</td>
                      <td>音频问题</td>
                      <td>视频问题</td>
                      <td>6A报警</td>
                      <td>6A故障</td>
                      <td>摄像手电问题</td>
                    </tr>
                    <tr>
                      <td v-text="dailyList.lmSecurity.lkjCnt"></td>
                      <td v-text="dailyList.lmSecurity.eoasCnt"></td>
                      <td v-text="dailyList.lmSecurity.jk11430AlarmCnt"></td>
                      <td v-text="dailyList.lmSecurity.tcmsAlarmCnt"></td>
                      <td v-text="dailyList.lmSecurity.pccAlarmCnt"></td>
                      <td v-text="dailyList.lmSecurity.ttdVodAudioCnt"></td>
                      <td v-text="dailyList.lmSecurity.ttdVodVideoCnt"></td>
                      <td v-text="dailyList.lmSecurity.a6AlarmCnt"></td>
                      <td v-text="dailyList.lmSecurity.a6ProblemCnt"></td>
                      <td v-text="dailyList.lmSecurity.omVodCnt"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="t-l-t-left-4">
                <div class="t-l-t-l-4-left">
                  <div class="t-l-t-l-4-l-left table">
                    <table>
                      <thead>
                        <tr>
                          <th colspan="5">质量数据</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td rowspan="2">机车类型</td>
                          <td colspan="2">定修</td>
                          <td rowspan="2">临修</td>
                          <td rowspan="2">专修</td>
                        </tr>
                        <tr>
                          <td>大中修</td>
                          <td>小辅修</td>
                        </tr>
                        <tr v-for="om in dailyList.lmOm.list">
                          <td v-text="om.lmType"></td>
                          <td v-text="om.pomL23Cnt"></td>
                          <td v-text="om.pomL1Cnt"></td>
                          <td v-text="om.uomCnt"></td>
                          <td v-text="om.romCnt"></td>
                        </tr>
                        <tr style="height: 66px;">
                          <td>合计</td>
                          <td v-text="dailyList.lmOm.summary.pomL23Cnt"></td>
                          <td v-text="dailyList.lmOm.summary.pomL1Cnt"></td>
                          <td v-text="dailyList.lmOm.summary.uomCnt"></td>
                          <td v-text="dailyList.lmOm.summary.romCnt"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="t-l-t-l-4-l-right table">
                    <table>
                      <thead>
                        <tr>
                          <th colspan="2" @click="jumpPa(null)" class="cursor cursor-hover">考核数据</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>级别</td>
                          <td>人数</td>
                        </tr>
                        <tr v-for="item in dailyList.pa.list" @click="jumpPa(item.label)" class="cursor cursor-hover">
                          <td v-text="item.label"></td>
                          <td v-text="item.value"></td>
                        </tr>
                        <tr class="cursor cursor-hover">
                          <td>合计</td>
                          <td v-text="dailyList.pa.total" @click="jumpPa(null)"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="t-l-t-l-4-right table">
                  <table>
                    <thead>
                    <tr @click="jumpTrainData" class="cursor cursor-hover">
                      <th colspan="4">车载数据转储情况</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>名称</td>
                      <td>应转</td>
                      <td>实转</td>
                      <td>故障</td>
                    </tr>
                    <tr>
                      <td>LKJ</td>
                      <td v-text="dailyList.dataDump.data.lkjPlanedCnt"></td>
                      <td v-text="dailyList.dataDump.data.lkjActualCnt"></td>
                      <td v-text="dailyList.dataDump.data.lkjPlanedCnt - dailyList.dataDump.data.lkjActualCnt"></td>
                    </tr>
                    <tr>
                      <td>EOAS</td>
                      <td v-text="dailyList.dataDump.data.eoasPlanedCnt"></td>
                      <td v-text="dailyList.dataDump.data.eoasActualCnt"></td>
                      <td v-text="dailyList.dataDump.data.eoasPlanedCnt - dailyList.dataDump.data.eoasActualCnt"></td>
                    </tr>
                    <tr>
                      <td>音频</td>
                      <td v-text="dailyList.dataDump.data.ttdAudioPlanedCnt"></td>
                      <td v-text="dailyList.dataDump.data.ttdAudioActualCnt"></td>
                      <td v-text="dailyList.dataDump.data.ttdAudioPlanedCnt - dailyList.dataDump.data.ttdAudioActualCnt"></td>
                    </tr>
                    <tr>
                      <td>视频</td>
                      <td v-text="dailyList.dataDump.data.ttdVideoPlanedCnt"></td>
                      <td v-text="dailyList.dataDump.data.ttdVideoActualCnt"></td>
                      <td v-text="dailyList.dataDump.data.ttdVideoPlanedCnt - dailyList.dataDump.data.ttdVideoActualCnt"></td>
                    </tr>
                    <tr>
                      <td>摄像手电</td>
                      <td v-text="dailyList.dataDump.data.omVideoPlanedCnt"></td>
                      <td v-text="dailyList.dataDump.data.omVideoActualCnt"></td>
                      <td v-text="dailyList.dataDump.data.omVideoPlanedCnt - dailyList.dataDump.data.omVideoActualCnt"></td>
                    </tr>
                    <tr>
                      <td>合计</td>
                      <td v-text="dailyList.dataDump.summary.planedCnt"></td>
                      <td v-text="dailyList.dataDump.summary.actualCnt"></td>
                      <td v-text="dailyList.dataDump.summary.abnormalCnt"></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="t-l-t-right">
              <div class="t-l-t-r-top">
                <div class="t-l-t-r-t-left table">
                  <table>
                    <thead>
                      <tr>
                        <th colspan="5">添乘信息</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="3">部门/车间</td>
                        <td>人数</td>
                        <td>趟数</td>
                      </tr>
                      <tr v-for="(tta, index) in dailyList.tta.list">
                        <td v-text="tta.name" colspan="3"></td>
                        <td v-text="tta.personCnt"></td>
                        <td v-text="tta.trainCnt"></td>
                      </tr>
                      <tr>
                        <td colspan="3">合计</td>
                        <td v-text="dailyList.tta.summary.personCnt"></td>
                        <td v-text="dailyList.tta.summary.personCnt"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="t-l-t-r-t-right table">
                  <table>
                    <thead>
                      <tr @click="jumpNeedTrace(null)" class="cursor cursor-hover">
                        <th colspan="2">信息追踪</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>类别</td>
                        <td>件数</td>
                      </tr>
                      <tr v-for="(cnt, cate) in dailyList.runInfoTrace.list" @click="jumpNeedTrace(cate)" class="cursor cursor-hover" style="height: 66px;">
                        <td v-text="cate"></td>
                        <td v-text="cnt"></td>
                      </tr>
                      <tr @click="jumpNeedTrace(null)" class="cursor cursor-hover" style="height: 32px;">
                        <td>合计</td>
                        <td v-text="dailyList.runInfoTrace.total"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="t-l-t-r-bottom table">
                <table>
                  <thead>
                    <tr>
                      <th colspan="7">运用数据</th>
                    </tr>
                  </thead>
                    <tr>
                      <td colspan="2">日车公里</td>
                      <td colspan="2">日吨公里</td>
                      <td colspan="3">出退勤</td>
                    </tr>
                    <tr>
                      <td colspan="2" v-text="dailyList.lmUsing.lmKilo"></td>
                      <td colspan="2" v-text="dailyList.lmUsing.tonKilo"></td>
                      <td></td>
                      <td>出勤</td>
                      <td>退勤</td>
                    </tr>
                    <tr>
                      <td colspan="4">机车出入库</td>
                      <td>客车</td>
                      <td v-text="dailyList.lmUsing.passengerTrainOnDutyCnt"></td>
                      <td v-text="dailyList.lmUsing.passengerTrainOffDutyCnt"></td>
                    </tr>
                    <tr>
                      <td>出</td>
                      <td>入</td>
                      <td colspan="2">合计</td>
                      <td>货车</td>
                      <td v-text="dailyList.lmUsing.freightTrainOnDutyCnt"></td>
                      <td v-text="dailyList.lmUsing.freightTrainOffDutyCnt"></td>
                    </tr>
                    <tr>
                      <td v-text="dailyList.lmUsing.lmOffDepotCnt"></td>
                      <td v-text="dailyList.lmUsing.lmToDepotCnt"></td>
                      <td colspan="2" v-text="offAndToDepotCnt"></td>
                      <td>合计</td>
                      <td v-text="odCnt"></td>
                      <td v-text="ofdCnt"></td>
                    </tr>
                    <tr>
                      <td colspan="3">开行对数</td>
                      <td colspan="4">乘务员上线</td>
                    </tr>
                    <tr>
                      <td>图定</td>
                      <td>实际</td>
                      <td>增减</td>
                      <td>图定</td>
                      <td>实际</td>
                      <td colspan="2">增减</td>
                    </tr>
                    <tr>
                      <td v-text="dailyList.lmUsing.runPairCntPlaned"></td>
                      <td v-text="dailyList.lmUsing.runPairCntActual"></td>
                      <td v-text="runPairChange"></td>
                      <td v-text="dailyList.lmUsing.driverOnBoardCntPlaned"></td>
                      <td v-text="dailyList.lmUsing.driverOnBoardCntActual"></td>
                      <td colspan="2" v-text="driverOnChange"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="t-l-bottom table">
            <table>
              <thead>
                <tr>
                  <th :colspan="weatherCol">天气</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>地点</td>
                  <td v-for="weather in dailyList.weather" v-text="weather.location"></td>
                </tr>
                <tr>
                  <td>白班</td>
                  <td v-for="weather in dailyList.weather" v-text="weather.day"></td>
                </tr>
                 <tr>
                  <td>夜班</td>
                  <td v-for="weather in dailyList.weather" v-text="weather.night"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="top-right table">
          <table>
            <thead>
              <tr>
                <th colspan="7">测酒信息</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td colspan="3">地点</td>
              <td>应测</td>
              <td>实测</td>
              <td>正常</td>
              <td>异常</td>
            </tr>
            <tr v-for="(wt , index) in dailyList.wt.list">
              <td v-text="wt.location" colspan="3"></td>
              <td v-text="wt.planedCnt"></td>
              <td v-text="wt.actualCnt"></td>
              <td v-text="wt.normalCnt"></td>
              <td v-text="wt.abnormalCnt"></td>
            </tr>
            <tr>
              <td colspan="3" style="height: 32px;">合计</td>
              <td v-text="dailyList.wt.summary.planedCnt"></td>
              <td v-text="dailyList.wt.summary.actualCnt"></td>
              <td v-text="dailyList.wt.summary.normalCnt"></td>
              <td v-text="dailyList.wt.summary.abnormalCnt"></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bottom table">
        <table>
          <thead>
            <tr>
              <td>典型问题</td>
            </tr>
          </thead>
            <tr>
              <td colspan="15" v-html="dailyList.typicalProblem" :title="dailyList.typicalProblem"></td>
            </tr>
        </table>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th style="width: 100px;">值乘日期</th>
            <th style="width: 100px;">值乘车次</th>
            <th style="width: 100px;">值乘机车编号</th>
            <th style="width: 100px;">责任人</th>
            <th style="width: 100px;">运行信息分类</th>
            <th style="width: 100px;">发生时间</th>
            <th style="width: 100px;">发生地点</th>
            <th style="width: 70px;">录入者</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in runInfoDetailed" :class="{complex: index % 2 === 0}">
          <td>
            <div v-text="mgt.trainDt"></div>
          </td>
          <td>
            <div v-text="mgt.trainNo"></div>
          </td>
          <td>
            <div v-text="mgt.lmModel"></div>
          </td>
          <td>
            <div :title="mgt.respDeptPath" v-text="mgt.respName + '（' + mgt.respWorkNo + '）'"></div>
          </td>
          <td>
            <div v-text="mgt.type"></div>
          </td>
          <td>
            <div v-text="mgt.timeDt"></div>
          </td>
          <td>
            <div v-text="mgt.location"></div>
          </td>
          <td>
            <div v-text="mgt.reporter"></div>
          </td>
          <td>
            <div class="ellipsis ellipsis2" :title="mgt.detail" v-text="mgt.detail"></div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import dateBox from '@/components/date-box'

  export default {
    data () {
      return {
        dailyList: {},
        runInfoDetailed: [],
        odCnt: '',
        ofdCnt: '',
        offAndToDepotCnt: '',
        runPairChange: '',
        driverOnChange: '',
        lmOmCnt: '',
        date: this.moment().subtract(1, 'd').format('YYYY-MM-DD'),
        loading: false,
        weatherCol: 0
      }
    },
    components: {
      dateBox
    },
    methods: {
      receiveDate (date) {
        if (date) {
          this.date = date
        }
        this.getDailyReport()
        this.getRunInfoList()
      },
      jumpRunInfo (trainType, type) {
        let query = {
          from: this.date,
          to: this.date,
          trainType: trainType,
          vodType: type
        }
        console.log('jump to run info detail list: ', query)
        this.$router.push({
          path: '/run-info-detailed',
          query: query
        })
      },
      jumpPa (level) {
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
      jumpNeedTrace (cate) {
        let query = {
          from: this.date,
          to: this.date,
          cate: cate
        }
        console.log('jump to needTrace list: ', query)
        this.$router.push({
          path: '/run-info-detailed?fogAnalysis=true&needTrace=true',
          query: query
        })
      },
      jumpTrainData () {
        let query = {
          date: this.date
        }
        console.log('jump to trainData list: ', query)
        this.$router.push({
          path: '/train-data-dump-daily-summary',
          query: query
        })
      },
      getDailyReport () {
        this.loading = true
        this.axios({
          method: 'get',
          params: {'date': this.date},
          url: '/api/daily-report/get'
        }).then((response) => {
          this.loading = false
          let data = response.data
          if (data.type === 1) {
            this.dailyList = data.result
            this.odCnt = this.dailyList.lmUsing.passengerTrainOnDutyCnt + this.dailyList.lmUsing.freightTrainOnDutyCnt
            this.ofdCnt = this.dailyList.lmUsing.passengerTrainOffDutyCnt + this.dailyList.lmUsing.freightTrainOffDutyCnt
            this.offAndToDepotCnt = this.dailyList.lmUsing.lmOffDepotCnt + this.dailyList.lmUsing.lmToDepotCnt
            this.runPairChange = this.dailyList.lmUsing.runPairCntActual - this.dailyList.lmUsing.runPairCntPlaned
            this.driverOnChange = this.dailyList.lmUsing.driverOnBoardCntActual - this.dailyList.lmUsing.driverOnBoardCntPlaned
            this.lmOmCnt = this.dailyList.lmOm.summary.planedOmL1Cnt + this.dailyList.lmOm.summary.planedOmL23Cnt
            this.weatherCol = this.dailyList.weather.length + 1
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getRunInfoList () {
        this.axios({
          method: 'post',
          params: {
            'pageNo': 1,
            'pageSize': 1000
          },
          data: {
            'from': this.date,
            'to': this.date
          },
          url: '/api/run-info/view/list-detail'
        }).then((response) => {
          let data = response.data
          if (data.type === 1) {
            this.runInfoDetailed = data.result.resultList
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>


<style scoped>
  .report {
    width: 100%;
    height: auto;
    float: left;
    margin-bottom: 20px;
  }
  .top-left {
    float: left;
  }
  .t-l-top {
    overflow: hidden;
  }
  .t-l-t-left {
    float: left;
  }
  .t-l-t-left-1,.t-l-t-left-2,.t-l-t-left-3,.t-l-t-left-4 {
    width: 522px;
  }
  .t-l-t-left-3 {
    height: 131px;
  }
  .t-l-t-left-3 tr td {
    width: 10%;
  }
  .t-l-t-left-4 {
    overflow: hidden;
  }
  .t-l-t-l-4-left {
    width: 299px;
    float: left;
  }
  .t-l-t-l-4-l-left {
    width: 230px;
    float: left;
  }
  .t-l-t-l-4-l-right {
    width: 69px;
    float: left;
  }
  .t-l-t-l-4-right {
    width: 223px;
    float: left;
  }

  .t-l-t-right {
    float: left;
  }
  .t-l-t-r-bottom {
    width: 335px;
  }
  .t-l-t-r-top {
    overflow: hidden;
  }
  .t-l-t-r-t-left {
    width: 255px;
    height: 298px;
    float: left;
  }
  .t-l-t-r-t-right {
    width: 80px;
    float: left;
  }
  .t-l-t-r-t-right tr td {
    width: 50%;
  }
  .t-l-bottom {
    width: 857px;
  }

  .top-right {
    width: 324px;
    min-height: 661px;
    float: left;
  }
  .bottom {
    width: 100%;
  }
</style>
