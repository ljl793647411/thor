<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :type="true" class="search-child"></date-box>
      <div class="search-child relative">
        <label for="respWorkNo">责任人：</label>
        <input type="text" v-model="driver" name="respWorkNo" @focus="respBoxChange" @blur="respBoxClose" class="search-input-class"/>
        <ul v-if="respWorkNoList.length !== 0 && respBox" class="resp-box">
          <li class="cursor" v-for="resp in respWorkNoList" :key="resp.sid" @click="getResp(resp)">{{ resp.name + ' —— ' + resp.workNo }}</li>
        </ul>
      </div>
      <div class="search-child">
        <label>组织：</label>
        <input type="text" v-model="deptName" @click="changeBox" class="search-input-class">
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getFloodCtrlList('query')">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table" >
      <table>
        <thead>
          <th colspan="6" style="width: 30%">值乘信息</th>
          <th style="width: 15%">时间地点录入者</th>
          <th style="width: 8%">雨情雨量</th>
          <th>信息概况</th>
          <th style="width: 8%">两违数量</th>
          <th style="width: 10%">备注</th>
        </thead>
        <tbody>
          <template v-for="(item, index) in floodCtrlList">
          <tr :class="{complex: index % 2 === 0}">
            <td v-if="isAudit" rowspan="3" class="audit" :title="item.commentCnt ? '已审核' : '未审核'"><img v-if="item.commentCnt" src="/static/audit.png" alt="" title="已审核"></td>
            <td colspan="2" title="值乘日期" v-text="item.trainDt"></td>
            <td colspan="2" title="值乘车次" v-text="item.trainNo"></td>
            <td colspan="2" :title="LM_TYPES[item.lmType] + '，型号' + item.lmModel" v-text="item.lmNo"></td>
            <td title="发生时间" v-text="item.timeDt"></td>
            <td rowspan="3" v-text="item.rainfall"></td>
            <td rowspan="3" v-text="item.detail"></td>
            <td rowspan="3" v-text="item.vodCnt" @click="jumpDriVod(item.sid)"></td>
            <td rowspan="3" v-text="item.memo"></td>
          </tr>
          <tr :class="{complex: index % 2 === 0}">
            <td colspan="3">
              <span v-if="item.respWorkNo === item.workNo1" class="resp-work-no" title="责任人">责</span>
              <span v-if="item.respWorkNo !== item.workNo1" v-text="'　'"></span>
              <span :title="item.workNo1 ?`【一位司机】${item.driverDeptPath1} > ${item.driverName1}（${item.workNo1}）`: `【一位司机】`" v-text="item.driverName1 + '（' + item.workNo1 + '）'"></span>
            </td>
            <td colspan="3">
              <span v-if="item.respWorkNo === item.workNo2" class="resp-work-no" title="责任人">责</span>
              <span v-if="item.respWorkNo !== item.workNo2" v-text="'　'"></span>
              <span :title="item.workNo2 ? `【二位司机】${item.driverDeptPath2} > ${item.driverName2}（${item.workNo2}）` : `【二位司机】`" v-text="item.workNo2 ? item.driverName2 + '（' + item.workNo2 + '）' : ''"></span>
            </td>
            <td style="max-width:200px;">
              <div class="ellipsis ellipsis1" :title="`【发生地点】${item.location}`" v-text="item.location"></div>
            </td>
          </tr>
          <tr :class="{trbg: index % 2 === 0}">
            <td colspan="3">
              <span v-if="item.respWorkNo === item.workNo3" class="resp-work-no" title="责任人">责</span>
              <span v-if="item.respWorkNo !== item.workNo3" v-text="'　'"></span>
              <span :title="item.workNo3 ? `【三位司机】${item.driverDeptPath3} > ${item.driverName3}（${item.workNo3}）` : `【三位司机】`" v-text="item.workNo3 ? item.driverName3 + '（' + item.workNo3 + '）' : ''"></span>
            </td>
            <td colspan="3">
              <span v-if="item.respWorkNo === item.workNo4" class="resp-work-no" title="责任人">责</span>
              <span v-if="item.respWorkNo !== item.workNo4" v-text="'　'"></span>
              <span :title="item.workNo4 ? `【添乘司机】${item.driverDeptPath4} > ${item.driverName4}（${item.workNo4}）` : `【添乘司机】`" v-text="item.workNo4 ? item.driverName4 + '（' + item.workNo4 + '）' : ''"></span>
            </td>
            <td title="录入者" v-text="item.reporter"></td>
          </tr>
          </template>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div v-if="message">
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1'></paginate>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div class="dri-choose" v-if="deptBoxShow">
      <dept-box @getDeptCode='deptBoxClose'></dept-box>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import paginate from '@/components/paginate'
  import loginPopup from '@/components/login-popup'
  import deptBox from '@/components/dept-box'
  import dateBox from '@/components/date-box'

  export default {
    name: 'floodCtrl',
    data () {
      return {
        LM_TYPES: config.LM_TYPES,
        currentPage: 1,
        count: 0,
        totalRecs: '',
        pageSize: 10,
        pageVo: {
          'prevText': '<<',
          'nextText': '>>'
        },
        floodCtrl: {},
        floodCtrlList: [],
        msg: '', // 报错信息
        loginPopup: false,
        loading: false,
        deptBoxShow: false,
        deptName: '',
        respBox: false,
        respWorkNos: {
          deptCode: config.deptCode,
          deptType: config.deptType
        },
        driver: '',
        respWorkNoList: [],
        message: ''
      }
    },
    components: {
      loginPopup,
      paginate,
      deptBox,
      dateBox
    },
    watch: {
      driver: 'changeRespWorkNos'
    },
    mounted () {
      this.$nextTick(() => {
        this.floodCtrl.timeTo = this.moment().format('YYYY-MM-DD')
        this.floodCtrl.timeFrom = this.moment().subtract(6, 'd').format('YYYY-MM-DD')
        this.getFloodCtrlList('init')
      })
    },
    methods: {
      receiveDate (date) {
        this.floodCtrl.timeFrom = date.from
        this.floodCtrl.timeTo = date.to
      },
      jumpDriVod (sid) {
        let query = {
          from: this.floodCtrl.from,
          to: this.floodCtrl.to,
          floodControlSid: sid
        }
        console.log('jump to driver detail list: ', query)
        this.$router.push({
          path: '/driver-vod-list',
          query: query
        })
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
        this.floodCtrl.respWorkNos.push(resp.workNo)
        this.respWorkNoList = []
        this.respBox = false
      },
      respBoxChange () {
        this.driver = ''
        this.floodCtrl.respWorkNos = []
        this.respBox = true
      },
      respBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = []
          this.respBox = false
        }, 500)
      },
      getFloodCtrlList (approach) {
        this.message = ''
        this.loading = true
        this.axios({
          method: 'post',
          data: this.floodCtrl,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/flood-ctrl/view/list-detail'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.floodCtrlList = data.result.resultList
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
      changeBox () {
        this.deptBoxShow = true
      },
      deptBoxClose (result) {
        if (result.depts !== '') {
          delete this.floodCtrl.deptCode
        }
        this.floodCtrl.deptCodes = []
        let deptCodesName = []
        this.floodCtrl.deptType = result.deptType
        if (this.floodCtrl.deptType === 'DR') {
          for (let i in result.depts) {
            this.floodCtrl.deptCodes.push(result.depts[i].workNo)
            deptCodesName.push(result.depts[i].name)
          }
        } else {
          for (let i in result.depts) {
            this.floodCtrl.deptCodes.push(result.depts[i].code)
            deptCodesName.push(result.depts[i].name)
          }
        }
        this.deptName = deptCodesName.join(',')
        this.deptBoxShow = false
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getFloodCtrlList()
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
