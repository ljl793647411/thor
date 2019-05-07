<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search" style="margin-bottom: 0;">
      <date-box @sendDate="receiveDate" :from="from" :to="to" :type="true" class="search-child"></date-box>
      <div class="search-child relative">
        <label for="respWorkNo">责任人：</label>
        <input class="search-input-class" type="text" v-model="driver" name="respWorkNo" @focus="respBoxChange" @blur="respBoxClose"/>
        <ul v-if="respWorkNoList.length !== 0 && respBox" class="resp-box">
          <li class="cursor" v-for="resp in respWorkNoList" :key="resp.sid" @click="getResp(resp)">{{ resp.name + ' —— ' + resp.workNo }}</li>
        </ul>
      </div>
      <div class="search-child">
        <div class="block">
          <label>列车类型：</label>
          <el-cascader
            :options="TRAIN_TYPE_SELECT"
            v-model="trainType"
            @change="getTrainType">
          </el-cascader>
        </div>
      </div>
      <div class="search-child">
        <label>组织：</label>
        <input type="text" v-model="deptName" @click="changeBox" class="search-input-class">
      </div> 
      <div class="search-child">
        <div class="block">
          <label>运行信息分类：</label>
          <el-cascader
            :options="vodTypeList"
            v-model="vodType"
            @change="getVodType">
          </el-cascader>
        </div>
      </div>
      <div class="search-child">
        <div class="block">
          <label>追踪分类：</label>
          <el-cascader
            :options="RUN_INFO_CATES"
            v-model="cate"
            @change="getCate">
          </el-cascader>
        </div>
      </div>
      <div class="search-child">
        <label for="detail">两违详情查询：</label>
        <input class="search-input-class" type="text" v-model="runDetailed.detail"/>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getrunInfoDetailed('query')">查 询</el-button>
      </div>
    </div>
    <div class="search-switch">
      <div class="search-switch-child">
        <label for="fogAnalysis">雾天专项分析</label>
        <el-switch
          v-model="fogAnalysis"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </div>
      <div class="search-switch-child">
        <label for="needTrace">是否追踪</label>
        <el-switch
          v-model="needTrace"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table" style="margin-top: 23px;">
      <table>
        <thead>
          <th colspan="6">值乘信息</th>
          <th>分类</th>
          <th>时间地点录入者</th>
          <th>详情</th>
          <th>状态</th>
          <th>相关两违</th>
        </thead>
        <tbody>
          <template v-for="(mgt, index) in runInfoDetailed">
          <tr :class="{complex: index % 2 === 0}">
            <td colspan="2" title="值乘日期" v-text="mgt.trainDt"></td>
            <td colspan="2" title="值乘车次" v-text="mgt.trainNo"></td>
            <td colspan="2" :title="LM_TYPES[mgt.lmType] + '，型号' + mgt.lmModel" v-text="mgt.lmNo"></td>
            <td rowspan="3">
              <div>
                <span v-text="mgt.type"></span>
                <template v-if="mgt.type == '临时命令'">
                  <br />
                  <span v-text="'(' + mgt.cmdNo + ')'"></span>
                </template>
              </div>
            </td>
            <td title="发生时间" v-text="mgt.timeDt"></td>
            <td rowspan="3" style="max-width:200px;">
              <div class="ellipsis ellipsis3" :title="mgt.detail" v-text="mgt.detail"></div>
            </td>
            <td v-if="!mgt.analysed" title="【分析情况】未分析">未分析</td>
            <td v-if="mgt.analysed" :title="`【分析情况】${mgt.analystName}（${mgt.analyst}）于${mgt.analysedDt}完成分析`">分析完成</td>
            <td rowspan="3" v-text="mgt.vodCnt"></td>
          </tr>
          <tr :class="{complex: index % 2 === 0}">
            <td colspan="3">
              <span v-if="mgt.respWorkNo === mgt.workNo1" class="resp-work-no" title="责任人">责</span>
              <span v-if="mgt.respWorkNo !== mgt.workNo1" v-text="'　'"></span>
              <span :title="mgt.workNo1 ?`【一位司机】${mgt.driverDeptPath1} > ${mgt.driverName1}（${mgt.workNo1}）`: `【一位司机】`" v-text="mgt.driverName1 + '（' + mgt.workNo1 + '）'"></span>
            </td>
            <td colspan="3">
              <span v-if="mgt.respWorkNo === mgt.workNo2" class="resp-work-no" title="责任人">责</span>
              <span v-if="mgt.respWorkNo !== mgt.workNo2" v-text="'　'"></span>
              <span :title="mgt.workNo2 ? `【二位司机】${mgt.driverDeptPath2} > ${mgt.driverName2}（${mgt.workNo2}）` : `【二位司机】`" v-text="mgt.workNo2 ? mgt.driverName2 + '（' + mgt.workNo2 + '）' : ''"></span>
            </td>
            <td class="detail" style="max-width:200px;">
              <div class="ellipsis ellipsis1" :title="`【发生地点】${mgt.location}`" v-text="mgt.location"></div>
            </td>
            <td v-if="!mgt.needTrace" title="【追踪情况】不需要追踪">不需要追踪</td>
            <td v-if="mgt.needTrace" :title="`【追踪情况】责任人：${mgt.traceOwner}；涉及部门：${mgt.traceDept}，${mgt.traced ? '追踪已落实' : '追踪中'}`" v-text="mgt.traced ? '追踪已落实' : '追踪中'"></td>
          </tr>
          <tr :class="{complex: index % 2 === 0}">
            <td colspan="3">
              <span v-if="mgt.respWorkNo === mgt.workNo3" class="resp-work-no" title="责任人">责</span>
              <span v-if="mgt.respWorkNo !== mgt.workNo3" v-text="'　'"></span>
              <span :title="mgt.workNo3 ? `【三位司机】${mgt.driverDeptPath3} > ${mgt.driverName3}（${mgt.workNo3}）` : `【三位司机】`" v-text="mgt.workNo3 ? mgt.driverName3 + '（' + mgt.workNo3 + '）' : ''"></span>
            </td>
            <td colspan="3">
              <span v-if="mgt.respWorkNo === mgt.workNo4" class="resp-work-no" title="责任人">责</span>
              <span v-if="mgt.respWorkNo !== mgt.workNo4" v-text="'　'"></span>
              <span :title="mgt.workNo4 ? `【添乘司机】${mgt.driverDeptPath4} > ${mgt.driverName4}（${mgt.workNo4}）` : `【添乘司机】`" v-text="mgt.workNo4 ? mgt.driverName4 + '（' + mgt.workNo4 + '）' : ''"></span>
            </td>
            <td title="录入者" v-text="mgt.reporter"></td>
            <td :title="mgt.fogAnalysis ? '是雾天专项分析' : '不是雾天专项分析'"><div v-text="mgt.fogAnalysis ? '雾天专项' : ''"></div></td>
          </tr>
          </template>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div class="dri-choose" v-if="runBox">
      <dept-box @getDeptCode='deptBoxClose'></dept-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="message">
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1'></paginate>
    </div>
  </div>
</template>

<script>
  import deptBox from '@/components/dept-box'
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'
  import dateBox from '@/components/date-box'

  export default {
    name: 'runInfoDetailed',
    data () {
      return {
        currentPage: 1,
        count: 0,
        totalRecs: '',
        pageSize: 10,
        pageVo: {
          'prevText': '<<',
          'nextText': '>>'
        },
        runBox: false,
        runInfoDetailed: [],
        runDetailed: {
          respWorkNos: []
        },
        driver: '',
        from: '',
        to: '',
        code: '',
        vodTypeList: config.getStorage('RUN_INFO_TYPES'),
        loginPopup: false,
        loading: false,
        respWorkNoList: [],
        respWorkNos: {
          deptCode: config.deptCode,
          deptType: config.deptType
        },
        respBox: false,
        deptName: '',
        LM_TYPES: config.LM_TYPES,
        TRAIN_TYPES: config.TRAIN_TYPES,
        TRAIN_TYPE_SELECT: config.TRAIN_TYPE_SELECT,
        RUN_INFO_CATES: config.getStorage('RUN_INFO_CATES'),
        message: '',
        trainType: [],
        vodType: [],
        cate: [],
        needTrace: false,
        fogAnalysis: false
      }
    },
    components: {
      loginPopup,
      paginate,
      deptBox,
      dateBox
    },
    watch: {
      driver: 'changeRespWorkNos',
      '$route' () {
        this.refresh()
      }
    },
    created () {
      this.RUN_INFO_CATES.unshift({'value': '', 'label': '全部'})
      this.vodTypeList.unshift({'value': '', 'label': '全部'})
      this.refresh()
    },
    mounted () {
      this.$nextTick(() => {
        this.getrunInfoDetailed()
      })
    },
    methods: {
      getTrainType (value) {
        this.trainType = value
      },
      getVodType (value) {
        this.vodType = value
      },
      getCate (value) {
        this.cate = value
      },
      receiveDate (date) {
        this.runDetailed.from = date.from
        this.runDetailed.to = date.to
      },
      refresh () {
        if (this.$route.query.fogAnalysis) {
          if (this.$route.query.needTrace) {
            this.runDetailed.needTrace = this.$route.query.needTrace
            this.needTrace = this.$route.query.needTrace
          }
          this.runDetailed.fogAnalysis = true
          this.fogAnalysis = true
          this.cate.push(this.$route.query.cate)
          this.timeType = 'W'
        } else {
          this.runDetailed.fogAnalysis = this.$route.query.fogAnalysis
          this.fogAnalysis = this.$route.query.fogAnalysis
        }
        this.trainType.push(this.$route.query.trainType)
        if (!this.$route.query.from) {
          this.runDetailed.to = this.moment().format('YYYY-MM-DD')
          this.runDetailed.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
        } else {
          this.to = this.$route.query.to
          this.from = this.$route.query.from
          this.runDetailed.deptType = this.$route.query.deptType
          if (this.$route.query.deptCode) {
            this.runDetailed.deptCode = this.$route.query.deptCode
          }
          if (this.$route.query.deptCodes) {
            this.runDetailed.deptCodes = this.$route.query.deptCodes
          }
          this.deptName = this.$route.query.deptNames
          if (this.$route.query.vodType === '质量信息') {
            this.$route.query.vodType = '机车故障'
          }
          if (this.$route.query.vodType) {
            this.vodType.push(this.$route.query.vodType)
          }
        }
      },
      jumpDriVod (sid) {
        let query = {
          from: this.runDetailed.from,
          to: this.runDetailed.to,
          runInfoSid: sid
        }
        console.log('jump to driver detail list: ', query)
        this.$router.push({
          path: '/driver-vod-list',
          query: query
        })
      },
      getrunInfoDetailed (approach) {
        this.message = ''
        this.loading = true
        if (this.trainType[0] && this.trainType.length !== 0) {
          this.runDetailed.trainType = this.trainType[0]
        } else {
          delete this.runDetailed.trainType
        }
        if (this.vodType && this.vodType.length !== 0) {
          this.runDetailed.type = this.vodType[0]
        }
        if (this.cate && this.cate.length !== 0) {
          this.runDetailed.cate = this.cate[0]
        }
        this.runDetailed.fogAnalysis = this.fogAnalysis
        this.runDetailed.needTrace = this.needTrace
        if (!this.runDetailed.needTrace) {
          this.runDetailed.needTrace = false
        }
        if (!this.runDetailed.fogAnalysis) {
          this.needTrace = false
          delete this.runDetailed.needTrace
          delete this.runDetailed.fogAnalysis
        }
        if (!this.runDetailed.deptCodes || this.runDetailed.deptCodes.length === 0) {
          delete this.runDetailed.deptCodes
//          delete this.runDetailed.deptType
        }
        this.axios({
          method: 'post',
          data: this.runDetailed,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/run-info/view/list-detail'
        }).then((response) => {
          this.loading = false
          let data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.runInfoDetailed = data.result.resultList
            } else {
              this.message = config.LIST_NO_DATA_TEXT
            }
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          } else {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getrunInfoDetailed()
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      changeBox () {
        this.runBox = true
      },
      deptBoxClose (result) {
        if (result.depts !== '') {
          delete this.runDetailed.deptCode
        }
        this.runDetailed.deptCodes = []
        let deptCodesName = []
        this.runDetailed.deptType = result.deptType
        if (this.runDetailed.deptType === 'DR') {
          for (let i in result.depts) {
            this.runDetailed.deptCodes.push(result.depts[i].workNo)
            deptCodesName.push(result.depts[i].name)
          }
        } else {
          for (let i in result.depts) {
            this.runDetailed.deptCodes.push(result.depts[i].code)
            deptCodesName.push(result.depts[i].name)
          }
        }
        this.deptName = deptCodesName.join(',')
        this.runBox = false
      },
      changeRespWorkNos () {
        if (encodeURI(this.driver).length < 2) {
          return
        }
        if (this.driver.length === 0) {
          this.respWorkNoList = []
        }
        this.respWorkNos.searchStr = this.driver
        setTimeout(() => {
          this.axios({
            method: 'get',
            params: this.respWorkNos,
            url: '/api/op/driver/view/search-by-name-work-no'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.respWorkNoList = data.result.list
            } else if (data.type === 401) { // 登入信息验证失败
              config.gotoLogin()
              this.loginPopup = true
            }
          }).catch((error) => {
            console.log(error)
          })
        }, 500)
      },
      getResp (resp) {
        this.driver = `${resp.name} （${resp.workNo}）`
        this.runDetailed.respWorkNos.push(resp.workNo)
        this.respWorkNoList = []
        this.respBox = false
      },
      respBoxChange () {
        this.driver = ''
        this.runDetailed.respWorkNos = []
        this.respBox = true
      },
      respBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = []
          this.respBox = false
        }, 500)
      }
    }
  }
</script>

<style scoped>
 
</style>
