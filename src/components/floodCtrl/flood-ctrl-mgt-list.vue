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
        <el-button type="primary" @click="createFloodMgt">新 增</el-button>
      </div>
      <div class="search-child upload-class">
        <form @submit.prevent="submit($event)">
          <el-button type="primary">从Excel导入</el-button>
          <input ref="file" class="fileBtn" type="file" name="file" @change="getFile($event)">
        </form>
      </div>
      <div class="search-child">
        <a class="color-white" href="/sttic/tpls/雨情信息登记.xls">下载Excel模板</a>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div class="table" v-if="!message">
      <table>
        <thead>
          <th v-if="isAudit">审核</th>
          <th colspan="6">值乘信息</th>
          <th>时间地点录入者</th>
          <th>雨情雨量</th>
          <th>信息概况</th>
          <th>两违数量</th>
          <th>备注</th>
          <th>操作</th>
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
            <td rowspan="3">
              <el-button type="primary" @click="admin(item)">管 理</el-button>
              <el-dropdown @command="copy">
                <el-button type="primary">
                  复 制
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="[1, item]">仅值乘</el-dropdown-item>
                  <el-dropdown-item :command="[2, item]">仅两违</el-dropdown-item>
                  <el-dropdown-item :command="[3, item]">全部</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </td>
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
          <tr :class="{complex: index % 2 === 0}">
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
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1' @changePage='changePage'></paginate>
    </div>
    <div v-if="addFloodCtrlBox">
      <flood-ctrl-mgt-add @closeBox='closeBox' :floodCtrlVo="floodCtrlVo"></flood-ctrl-mgt-add>
    </div>
    <div v-if="deptBoxShow">
      <dept-radio-box @getDeptCode="getDeptCode" :driver="true"></dept-radio-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="addMoreBox">
      <flood-ctrl-mgt-add-more @closeMoreBox='closeMoreBox' :floodCtrlVos="floodCtrlVos"></flood-ctrl-mgt-add-more>
    </div>
    <div v-if="adminBox">
      <admin-flood-detailed :adminDetaileds="adminDetaileds" @closeAdminBox='closeAdminBox'></admin-flood-detailed>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import paginate from '@/components/paginate'
  import floodCtrlMgtAdd from '@/components/floodCtrl/flood-ctrl-mgt-add'
  import loginPopup from '@/components/login-popup'
  import deptRadioBox from '@/components/dept-radio-box'
  import floodCtrlMgtAddMore from '@/components/floodCtrl/flood-ctrl-mgt-add-more'
  import adminFloodDetailed from '@/components/floodCtrl/adminFloodDetailed'
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
        addFloodCtrlBox: false,
        loading: false,
        floodCtrlVo: {},
        floodCtrlVos: {},
        loginPopup: false,
        deptBoxShow: false,
        deptName: '',
        addMoreBox: false,
        errMsg: '',
        adminBox: false,
        detail: false,
        respBox: false,
        respWorkNos: {
          deptCode: config.deptCode,
          deptType: config.deptType
        },
        driver: '',
        respWorkNoList: [],
        message: '',
        isAudit: config.containsPrivilege('P-DRIVER-VOD-MGT-AUDIT')
      }
    },
    components: {
      loginPopup,
      paginate,
      floodCtrlMgtAdd,
      deptRadioBox,
      floodCtrlMgtAddMore,
      adminFloodDetailed,
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
        this.floodCtrl.respWorkNo = resp.workNo
        this.respWorkNoList = []
        this.respBox = false
      },
      respBoxChange () {
        this.driver = ''
        this.floodCtrl.respWorkNo = ''
        this.respBox = true
      },
      respBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = []
          this.respBox = false
        }, 500)
      },
      getFile (event) {
        this.file = event.target.files[0]
        console.log(this.file)
        event.preventDefault()
        let formData = new FormData()
        formData.append('file', this.file)
        return this.axios({
          method: 'post',
          data: formData,
          url: '/api/flood-ctrl/mgt/read-excel',
          headers: {'appType': 'web', 'appid': 'thor'}
        }).then((response) => {
          var data = response.data
          this.$refs.file.value = ''
          if (data.type === 1) {
            this.floodCtrlVos = data.result
            this.addMoreBox = true
          } else {
            this.$message.error('请选择正确的文件')
          }
        }).catch((error) => {
          this.$refs.file.value = ''
          this.$message.error(error)
        })
      },
      getFloodCtrlList (approach) {
        this.message = ''
        this.loading = true
        this.axios({
          method: 'post',
          data: this.floodCtrl,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/flood-ctrl/mgt/list'
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
      getDeptCode (result) {
        this.deptBoxShow = false
        this.floodCtrl.rbCode = result.codePath.split(',')[0]
        this.floodCtrl.ldCode = result.codePath.split(',')[1]
        this.floodCtrl.tsCode = result.codePath.split(',')[2]
        this.floodCtrl.ttCode = result.codePath.split(',')[3]
        this.floodCtrl.ctCode = result.codePath.split(',')[4]
        this.deptName = result.name
      },
      createFloodMgt () {
        this.floodCtrlVo = {}
        this.addFloodCtrlBox = true
      },
      closeBox () {
        this.addFloodCtrlBox = false
        this.getFloodCtrlList('query')
      },
      closeMoreBox () {
        this.addMoreBox = false
        this.getFloodCtrlList('query')
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
      },
      admin (infoMgt) {
        this.adminDetaileds = infoMgt
        this.adminBox = true
      },
      closeAdminBox (data) {
        this.adminBox = false
        this.getFloodCtrlList(data)
      },
      copy (num) {
        if (num[0] === 1) {
          this.floodCtrlVo = {
            trainDt: num[1].trainDt,
            trainNo: num[1].trainNo,
            driverName1: num[1].driverName1,
            workNo1: num[1].workNo1,
            driverName2: num[1].driverName2,
            workNo2: num[1].workNo2,
            driverName3: num[1].driverName3,
            workNo3: num[1].workNo3,
            driverName4: num[1].driverName4,
            workNo4: num[1].workNo4,
            lmNo: num[1].lmNo,
            lmType: num[1].lmType,
            lmModel: num[1].lmModel,
            respWorkNo: num[1].respWorkNo,
            rbCode: num[1].rbCode,
            ldCode: num[1].ldCode,
            ctCode: num[1].ctCode,
            ttCode: num[1].ttCode,
            tsCode: num[1].tsCode,
            copy: true
          }
        } else if (num[0] === 2) {
          this.floodCtrlVo = {
            memo: num[1].memo,
            timeDt: num[1].timeDt,
            location: num[1].location,
            detail: num[1].detail,
            rainfall: num[1].rainfall,
            reporter: num[1].reporter,
            rbCode: num[1].rbCode,
            ldCode: num[1].ldCode,
            ctCode: num[1].ctCode,
            ttCode: num[1].ttCode,
            tsCode: num[1].tsCode,
            copy: true
          }
        } else if (num[0] === 3) {
          delete num[1].sid
          this.floodCtrlVo = num[1]
          this.floodCtrlVo.copy = true
        }
        this.addFloodCtrlBox = true
      }
    }
  }
</script>

<style scoped>
  
</style>
