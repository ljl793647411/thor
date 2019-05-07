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
        <el-button type="primary" icon="el-icon-search" @click="getInfoMgtList('query')">查 询</el-button>
        <el-button type="primary" @click="createInfoMgt" v-if="isEdit">新 增</el-button>
      </div>
      <div class="search-child upload-class" v-if="isEdit">
        <form @submit.prevent="submit($event)">
          <el-button type="primary">从Excel导入</el-button>
          <input ref="file" class="fileBtn" type="file" name="file" @change="getFile($event)" title="">
        </form>
      </div>
      <div class="search-child">
        <a class="color-white" href="/static/tpls/非正常运行信息.xls" v-if="isEdit">下载Excel模板</a>
      </div>
    </div>
    <template v-if="message">
    <h4 v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div>
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1'></paginate>
    </div>
    </template>
    <div v-if="!message" class="table">
      <table>
        <thead>
          <th v-if="isAudit">审核</th>
          <th colspan="6">值乘信息</th>
          <th>分类</th>
          <th>时间地点录入者</th>
          <th>详情</th>
          <th>状态</th>
          <th>相关两违</th>
          <th>操作</th>
        </thead>
        <tbody>
          <template v-for="(mgt, index) in omVodMgtList">
          <tr :class="{complex: index % 2 === 0}">
            <td v-if="isAudit" rowspan="3" class="audit" :title="mgt.commentCnt ? '已审核' : '未审核'"><img v-if="mgt.commentCnt" src="/static/audit.png" alt="" title="已审核"></td>
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
            <td rowspan="3" :key="mgt.sid">
              <el-button type="primary" @click="admin(mgt)">管 理</el-button>
              <el-dropdown @command="copy">
                <el-button type="primary">
                  复 制
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="[1, mgt]">仅值乘</el-dropdown-item>
                  <el-dropdown-item :command="[2, mgt]">仅非正常</el-dropdown-item>
                  <el-dropdown-item :command="[3, mgt]">全部</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </td>
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
            <td style="max-width:200px;">
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
    <div v-if="addInfoMgtBox">
      <info-mgt-add @closeBox='closeBox' :infoVoMgt="infoVoMgt"></info-mgt-add>
    </div>
    <div v-if="deptBoxShow">
      <dept-radio-box @getDeptCode="getDeptCode" driver="true"></dept-radio-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="addMoreBox">
      <info-mgt-add-more @closeMoreBox='closeMoreBox' :infoVoMgts="infoVoMgts"></info-mgt-add-more>
    </div>
    <div v-if="adminBox">
      <adminDetailed :adminDetaileds="adminDetaileds" @closeAdminBox='closeAdminBox'></adminDetailed>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import paginate from '@/components/paginate'
  import infoMgtAdd from '@/components/runInfo/run-info-mgt-add'
  import loginPopup from '@/components/login-popup'
  import deptRadioBox from '@/components/dept-radio-box'
  import infoMgtAddMore from '@/components/runInfo/run-info-mgt-add-more'
  import adminDetailed from '@/components/runInfo/adminDetailed'
  import dateBox from '@/components/date-box'

  export default {
    name: 'infoMgtList',
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
        infoMgtVo: {},
        omVodMgtList: [],
        addInfoMgtBox: false,
        infoVoMgt: {},
        infoVoMgts: {},
        loginPopup: false,
        deptBoxShow: false,
        loading: false,
        deptName: '',
        LM_TYPES: config.LM_TYPES,
        TRAIN_TYPES: config.TRAIN_TYPES,
        isEdit: config.containsAnyPrivilege([' P-RUN-INFO-MGT-EDIT', 'P-RUN-INFO-MGT-AUDIT']),
        isAudit: config.containsPrivilege('P-DRIVER-VOD-MGT-AUDIT'),
        addMoreBox: false,
        adminBox: false,
        respWorkNoList: [],
        respWorkNo: {
          deptCode: config.deptCode,
          deptType: config.deptType
        },
        driver: '',
        respBox: false,
        message: ''
      }
    },
    components: {
      loginPopup,
      paginate,
      infoMgtAdd,
      deptRadioBox,
      infoMgtAddMore,
      adminDetailed,
      dateBox
    },
    watch: {
      driver: 'changerespWorkNo'
    },
    mounted () {
      this.$nextTick(() => {
        this.infoMgtVo.to = this.moment().format('YYYY-MM-DD')
        this.infoMgtVo.from = config.dateToString(new Date(new Date().getTime() - 6 * config.oneDayMs), 'yyyy-MM-dd')
        this.getInfoMgtList('init')
      })
    },
    methods: {
      receiveDate (date) {
        this.infoMgtVo.from = date.from
        this.infoMgtVo.to = date.to
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
          url: '/api/run-info/mgt/read-excel',
          headers: {'appType': 'web', 'appid': 'thor'}
        }).then((response) => {
          var data = response.data
          this.$refs.file.value = ''
          if (data.type === 1) {
            this.infoVoMgts = data.result
            this.addMoreBox = true
          } else {
            this.$message.error('请选择正确的文件')
          }
        }).catch((error) => {
          this.$refs.file.value = ''
          this.$message.error(error)
        })
      },
      getInfoMgtList (approach) {
        this.message = ''
        this.loading = true
        this.axios({
          method: 'post',
          data: this.infoMgtVo,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/run-info/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.omVodMgtList = data.result.resultList
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
        if (!result.sid) {
          return
        }
        this.infoMgtVo.deptType = result.type
        this.infoMgtVo.deptCode = result.code
        this.deptName = result.name
      },
      createInfoMgt () {
        this.infoVoMgt = {}
        this.addInfoMgtBox = true
      },
      closeBox () {
        this.addInfoMgtBox = false
        this.getInfoMgtList('query')
      },
      closeMoreBox () {
        this.addMoreBox = false
        this.getInfoMgtList('query')
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getInfoMgtList()
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
        this.getInfoMgtList(data)
      },
      changerespWorkNo () {
        if (encodeURI(this.driver).length < 2) {
          return
        }
        if (this.driver.length === 0) {
          this.respWorkNoList = []
        }
        this.respWorkNo.searchStr = this.driver
        setTimeout(() => {
          this.axios({
            method: 'get',
            params: this.respWorkNo,
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
        this.infoMgtVo.respWorkNo = resp.workNo
        this.respWorkNoList = []
        this.respBox = false
      },
      respBoxChange () {
        this.driver = ''
        this.infoMgtVo.respWorkNo = ''
        this.respBox = true
      },
      respBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = []
          this.respBox = false
        }, 500)
      },
      copy (num) {
        if (num[0] === 1) {
          this.infoVoMgt = {
            trainDt: num[1].trainDt,
            trainNo: num[1].trainNo,
            trainType: num[1].trainType,
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
            rbCode: num[1].rbCode,
            ldCode: num[1].ldCode,
            ctCode: num[1].ctCode,
            ttCode: num[1].ttCode,
            tsCode: num[1].tsCode
          }
        } else if (num[0] === 2) {
          this.infoVoMgt = {
            respWorkNo: true,
            type: num[1].type,
            cate: num[1].cate,
            memo: num[1].memo,
            timeDt: num[1].timeDt,
            location: num[1].location,
            detail: num[1].detail,
            reporter: num[1].reporter,
            rbCode: num[1].rbCode,
            ldCode: num[1].ldCode,
            ctCode: num[1].ctCode,
            ttCode: num[1].ttCode,
            tsCode: num[1].tsCode
          }
        } else if (num[0] === 3) {
          delete num[1].sid
          this.infoVoMgt = num[1]
        }
        this.addInfoMgtBox = true
      }
    }
  }
</script>

<style scoped>
  .vdp-datepicker {
    display: inline-block;
  }

  .sup {
    color: #900;
    font-size: 10px;
    vertical-align: super;
  }
  .errorFile {
    left:20px;
  }
  .copyBtn {
    width: 77px;
    height: 200px;
    position: absolute;
    top: -1px;
    right: -13px;
    z-index: 20;
  }
</style>
