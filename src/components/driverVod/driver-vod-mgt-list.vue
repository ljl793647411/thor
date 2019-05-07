<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :type="true" class="search-child"></date-box>
      <div class="search-child relative">
        <label for="workNo">值乘司机：</label>
        <input type="text" v-model="workNo" name="workNo" @focus="workBoxChange" @blur="workBoxClose" class="search-input-class"/>
        <ul v-if="respWorkNoList.length !== 0 && workNoBox" class="resp-box">
          <li class="cursor" v-for="work in respWorkNoList" :key="work.sid" @click="getWork(work)">{{ work.name + ' —— ' + work.workNo }}</li>
        </ul>
      </div>
      <div class="search-child relative">
        <label for="respWorkNo">责任人：</label>
        <input type="text" v-model="driver" name="respWorkNo" @focus="respBoxChange" @blur="respBoxClose" class="search-input-class"/>
        <ul v-if="respWorkNoList.length !== 0 && respBox" class="resp-box">
          <li class="cursor" v-for="resp in respWorkNoList" :key="resp.sid" @click="getResp(resp)">{{ resp.name + ' —— ' + resp.workNo }}</li>
        </ul>
      </div>
      <div class="search-child" v-if="isAudit">
        <label for="createdBy">创建者工号：</label>
        <input type="text" name="createdBy" v-model="driVodMgtVo.createdBy" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="createdBy">来源：</label>
        <el-select v-model="sources" collapse-tags multiple placeholder="请选择">
          <el-option
            v-for="item in VOD_SOURCES"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="search-child" v-show="show">
        <label for="createdBy">项点：</label>
        <span class="block">
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            change-on-select
            @change="handleChange"
            size="medium">
          </el-cascader>
        </span>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getDriVodMgtList('query')">查 询</el-button>
        <el-button type="primary" @click="createDriverVodMgt" v-if="isEdit || isAdmin">新 增</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div class="table" v-if="!message">
      <table>
        <thead>
        <th v-if="isAudit">审核</th>
        <th colspan="6" style="width: 302px;">值乘信息</th>
        <th>时间地点来源</th>
        <th>项点</th>
        <th>详情</th>
        <th>创建者</th>
        <th style="width: 130px;">操作</th>
        </thead>
        <tbody>
        <template v-for="(item, index) in driVodMgtList">
          <tr :class="{complex: index % 2 === 0}">
            <td v-if="isAudit" rowspan="3" class="audit" :title="item.commentCnt ? '已审核' : '未审核'"><img v-if="item.commentCnt" src="/static/audit.png" alt="" title="已审核"></td>
            <td colspan="2" title="值乘日期" v-text="item.trainDt"></td>
            <td colspan="2" title="值乘车次" v-text="item.trainNo"></td>
            <td colspan="2" :title="LM_TYPES[item.lmType] + '，型号' + item.lmModel" v-text="item.lmNo"></td>
            <td title="发生时间" v-text="item.time"></td>
            <td rowspan="3" v-text="item.vodType2 ? item.vodType1 + ' > ' + item.vodType2 : item.vodType1"></td>
            <td rowspan="3" style="max-width:400px;">
              <div class="ellipsis ellipsis3" :title="item.detail" v-text="item.detail"></div>
            </td>
            <td rowspan="3">
              <div class="ellipsis" :title="item.createdByWorkNo" v-text="item.createdByName"></div>
            </td>
            <td rowspan="3" :key="item.sid">
              <el-button type="primary" @click="admin(item)">管 理</el-button>
              <el-dropdown @command="copy" v-if="isEdit || isAdmin">
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
            <td :title="`【来源】${VOD_SOURCE_LIST[item.source]}`" v-text="VOD_SOURCE_LIST[item.source]"></td>
          </tr>
        </template>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div v-if="message">
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1' @changePage='changePage'></paginate>
    </div>
    <div v-if="addDriverVodMgtBox">
      <driver-vod-mgt-add-box @closeBox='closeBox' :driVo="driVo"></driver-vod-mgt-add-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="adminBox">
      <admin-dri-detailed :adminDetaileds="adminDetaileds" @closeAdminBox='closeAdminBox'></admin-dri-detailed>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import paginate from '@/components/paginate'
  import driverVodMgtAddBox from '@/components/driverVod/driver-vod-mgt-add'
  import loginPopup from '@/components/login-popup'
  import adminDriDetailed from '@/components/driverVod/adminDri'
  import dateBox from '@/components/date-box'

  export default {
    name: 'driVodMgtList',
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
        driVodMgtVo: {},
        driVodMgtList: [],
        msg: '', // 报错信息
        addDriverVodMgtBox: false,
        LM_TYPES: config.LM_TYPES,
        VOD_SOURCE_LIST: config.VOD_SOURCE_LIST,
        isEdit: config.containsPrivilege('P-DRIVER-VOD-MGT-EDIT'),
        isAudit: config.containsPrivilege('P-DRIVER-VOD-MGT-AUDIT'),
        isAdmin: config.getAdmin(),
        loginName: config.getLoginName(),
        loginPopup: false,
        driVo: {},
        adminBox: false,
        respWorkNoList: [],
        respWorkNos: {
          deptCode: config.deptCode,
          deptType: config.deptType
        },
        workNos: {
          deptCode: config.deptCode,
          deptType: config.deptType
        },
        driver: '',
        workNo: '',
        respBox: false,
        workNoBox: false,
        message: '',
        VOD_SOURCES: config.VOD_SOURCES,
        options: [],
        vodList: config.getStorage('DRIVER_VOD_TYPES'),
        LKJList: config.getStorage('LKJ_TYPES'),
        EOASList: config.getStorage('EOAS_TYPES'),
        selectedOptions: [],
        sources: [],
        show: true,
        loading: false
      }
    },
    components: {
      paginate,
      loginPopup,
      driverVodMgtAddBox,
      adminDriDetailed,
      dateBox
    },
    watch: {
      driver: 'changeRespWorkNos',
      workNo: 'changeRespWorkNos',
      sources: 'changeCategory'
    },
    mounted () {
      this.$nextTick(() => {
        this.driVodMgtVo.trainTo = this.moment().format('YYYY-MM-DD')
        this.driVodMgtVo.trainFrom = this.moment().subtract(6, 'd').format('YYYY-MM-DD')
        this.sources = ['A', 'V', 'LKJ', 'EOAS']
        this.getDriVodMgtList('init')
      })
    },
    methods: {
      handleChange (value) {
        for (let i = 0; i < this.selectedOptions.length; i++) {
          this.driVodMgtVo.vodType1 = this.selectedOptions[0]
          this.driVodMgtVo.vodType2 = this.selectedOptions[1]
        }
      },
      changeCategory () {
        this.driVodMgtVo.vodType1 = ''
        this.driVodMgtVo.vodType2 = ''
        this.selectedOptions = []
        if (this.sources.length > 2) {
          this.show = false
        } else if (this.sources.length === 2) {
          if (this.sources.includes('A') && this.sources.includes('V')) {
            this.show = true
            this.options = this.vodList
          } else {
            this.show = false
          }
        } else {
          this.show = true
          if (this.sources.includes('A') || this.sources.includes('V')) {
            this.options = this.vodList
          } else if (this.sources.includes('LKJ')) {
            this.options = this.LKJList
          } else if (this.sources.includes('EOAS')) {
            this.options = this.EOASList
          } else {
            this.show = false
          }
        }
      },
      receiveDate (date) {
        this.driVodMgtVo.trainFrom = date.from
        this.driVodMgtVo.trainTo = date.to
      },
      getDriVodMgtList (approach) {
        this.message = ''
        if (this.sources && this.sources.length !== 0) {
          this.driVodMgtVo.sources = this.sources
        } else {
          this.$message.error('请选择来源')
          return
        }
        this.loading = true
        this.axios({
          method: 'post',
          data: this.driVodMgtVo,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/driver-vod/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.driVodMgtList = data.result.resultList
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
      admin (infoMgt) {
        this.adminDetaileds = infoMgt
        this.adminBox = true
      },
      closeAdminBox (data) {
        this.adminBox = false
        this.getDriVodMgtList(data)
      },
      deptBoxClose (result) {
        this.driVodMgtVo.deptCodes = []
        let deptCodesName = []
        this.driVodMgtVo.deptType = result.deptType
        if (this.driVodMgtVo.deptType === 'DR') {
          for (let i in result.depts) {
            this.driVodMgtVo.deptCodes.push(result.depts[i].workNo)
            deptCodesName.push(result.depts[i].name)
          }
        } else {
          for (let i in result.depts) {
            this.driVodMgtVo.deptCodes.push(result.depts[i].code)
            deptCodesName.push(result.depts[i].name)
          }
        }
        this.deptCodesName = deptCodesName.join(',')
        this.deptBoxShow = false
      },
      createDriverVodMgt () {
        this.driVo = {}
        this.addDriverVodMgtBox = true
      },
      updataDetailed (mgt) {
        this.driVo = mgt
        this.addDriverVodMgtBox = true
      },
      closeBox () {
        this.driVo = {}
        this.addDriverVodMgtBox = false
        this.getDriVodMgtList('query')
      },
      changePage (pageNo, pageSize) { // 切换页面
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getDriVodMgtList('p')
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      changeRespWorkNos () {
        let sendWorks
        if (this.driver) {
          if (encodeURI(this.driver).length < 2) {
            return
          }
          if (this.driver.length === 0) {
            this.respWorkNoList = []
          }
          this.respWorkNos.searchStr = this.driver
          sendWorks = this.respWorkNos
        }
        if (this.workNo) {
          if (encodeURI(this.workNo).length < 2) {
            return
          }
          if (this.workNo.length === 0) {
            this.respWorkNoList = ''
          }
          this.workNos.searchStr = this.workNo
          sendWorks = this.workNos
        }
        setTimeout(() => {
          this.axios({
            method: 'get',
            params: sendWorks,
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
        this.driVodMgtVo.respWorkNos.push(resp.workNo)
        this.respWorkNoList = []
        this.respBox = false
      },
      respBoxChange () {
        this.driver = ''
        this.driVodMgtVo.respWorkNos = []
        this.respBox = true
      },
      respBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = []
          this.respBox = false
        }, 500)
      },
      getWork (work) {
        this.workNo = `${work.name} （${work.workNo}）`
        this.driVodMgtVo.workNo = work.workNo
        this.respWorkNoList = ''
        this.workNoBox = false
      },
      workBoxChange () {
        this.workNo = ''
        this.driVodMgtVo.workNo = ''
        this.workNoBox = true
      },
      workBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = ''
          this.workNoBox = false
        }, 500)
      },
      copy (num) {
        if (num[0] === 1) {
          this.driVo = {
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
            type: num[1].type,
            respWorkNo: num[1].respWorkNo,
            rbCode: num[1].rbCode,
            ldCode: num[1].ldCode,
            ctCode: num[1].ctCode,
            ttCode: num[1].ttCode,
            tsCode: num[1].tsCode,
            copy: true
          }
        } else if (num[0] === 2) {
          this.driVo = {
            source: num[1].source,
            memo: num[1].memo,
            time: num[1].time,
            location: num[1].location,
            detail: num[1].detail,
            vodType1: num[1].vodType1,
            vodType2: num[1].vodType2,
            rbCode: num[1].rbCode,
            ldCode: num[1].ldCode,
            ctCode: num[1].ctCode,
            ttCode: num[1].ttCode,
            tsCode: num[1].tsCode,
            copy: true
          }
        } else if (num[0] === 3) {
          delete num[1].sid
          this.driVo = num[1]
          this.driVo.copy = true
        }
        this.addDriverVodMgtBox = true
      }
    }
  }
</script>

<style scoped>
</style>
