<template>
  <div>
    <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 555;"></div>
    <div class="popup">
      <div class="head" style="text-align: center;">
        <p style="font-weight: bold;">雨情信息详情</p>
        <i class="icon-remove icon-white" @click="closeAdminBox"></i>
      </div>
      <div class="table tableBox">
        <table class="table-hover">
          <thead>
          <tr>
            <th colspan="2" class="title-th">值乘信息
              <el-button type="danger" @click="delDetailed(adminDetailed)" class="adminBtn" size="medium">删 除</el-button>
              <el-button type="primary" @click="updateFloodVod(adminDetailed)" class="adminBtn" size="medium">编 辑</el-button>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td style="width:50%;"><span class="title-td">日期：</span><span v-text="adminDetailed.trainDt"></span></td>
            <td style="width:50%;"><span class="title-td">车次：</span><span v-text="adminDetailed.trainNo"></span></td>
          </tr>
          <tr>
            <td style="width:50%;"><span class="title-td">一位司机：</span><span v-if="adminDetailed.workNo1" v-text="adminDetailed.driverName1 + '（' + adminDetailed.workNo1 + '）'"></span></td>
            <td style="width:50%;"><span class="title-td">二位司机：</span><span v-if="adminDetailed.workNo2" v-text="adminDetailed.workNo2 ? adminDetailed.driverName2 + '（' + adminDetailed.workNo2 + '）' : ''"></span></td>
          </tr>
          <tr>
            <td style="width:50%;"><span class="title-td">三位司机：</span><span v-if="adminDetailed.workNo3" v-text="adminDetailed.workNo3 ? adminDetailed.driverName3 + '（' + adminDetailed.workNo3 + '）' : ''"></span></td>
            <td style="width:50%;"><span class="title-td">添乘司机：</span><span v-if="adminDetailed.workNo4" v-text="adminDetailed.workNo4 ? adminDetailed.driverName4 + '（' + adminDetailed.workNo4 + '）' : ''"></span></td>
          </tr>
          <tr>
            <td style="width:50%;"><span class="title-td">责任司机：</span><span v-text="adminDetailed.respName + '（' + adminDetailed.respWorkNo + '）'"></span></td>
             <td style="width:50%;"><span class="title-td">机车编号：</span><span v-text="adminDetailed.lmNo"></span></td>
          </tr>
          </tbody>
          <thead>
          <tr>
            <th colspan="2" class="title-th">非正常信息</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><span class="title-td">发生时间：</span><span v-text="adminDetailed.timeDt"></span></td>
            <td><span class="title-td">发生地点：</span><span v-text="adminDetailed.location"></span></td>
          </tr>
          <tr>
            <td><span class="title-td">雨情雨量：</span><span v-text="adminDetailed.rainfall"></span></td>
            <td><span class="title-td">信息概况：</span><span v-text="adminDetailed.detail"></span></td>
          </tr>
          <tr>
            <td><span class="title-td">录入者：</span><span v-text="adminDetailed.reporter"></span></td>
            <td><span class="title-td">备注：</span><span v-text="adminDetailed.memo"></span></td>
          </tr>
          </tbody>
        </table>
        <table class="table-hover">
          <thead>
          <tr>
            <th colspan="2" class="title-th">分析情况
              <el-button type="primary" @click="runInfoAnalysis(adminDetailed)" class="adminBtn" size="medium">分 析</el-button>
            </th>
          </tr>
          </thead>
          <tbody v-if="adminDetailed.analysed">
            <tr>
              <td><span class="title-td">分析员：</span><span v-text="adminDetailed.analystName + '（' + adminDetailed.analyst + '）'"></span></td>
              <td><span class="title-td">分析时间：</span><span v-text="adminDetailed.analysedDt"></span></td>
            </tr>
            <tr>
              <td style="width:50%;"><span class="title-td">音频文件核对：</span><span v-text="adminDetailed.analysedAudio ? '是' : '否'"></span></td>
              <td style="width:50%;"><span class="title-td">视频文件核对：</span><span v-text="adminDetailed.analysedVideo ? '是' : '否'"></span></td>
            </tr>
            <tr>
              <td style="width:50%;"><span class="title-td">一级地段：</span><span v-text="adminDetailed.areaL1 ? '是' : '否'"></span></td>
              <td style="width:50%;"><span class="title-td">二级地段：</span><span v-text="adminDetailed.areaL2 ? '是' : '否'"></span></td>
            </tr>
            <tr>
              <td style="width:50%;"><span class="title-td">瞭望困难地段：</span><span v-text="adminDetailed.areaHardToLook ? '是' : '否'"></span></td>
            </tr>
          </tbody>
          <tbody v-if="!adminDetailed.analysed">
            <tr>
              <td colspan="2"><span class="title-td">未分析音视频文件</span></td>
            </tr>
          </tbody>
        </table>
        <table class="table-hover" style="margin-bottom: 30px">
          <thead>
          <tr>
            <th colspan="5" class="title-th">两违详情列表
              <el-button type="primary" @click="addDetailed(adminDetailed)" class="adminBtn" size="medium">新增两违详情</el-button>
            </th>
          </tr>
          <tr v-if="vodList.length !== 0">
            <td style="width:12%;">责任司机</td>
            <td style="width:20%;">项点分类</td>
            <td style="width:14%;">发生时间</td>
            <td>两违详情</td>
          </tr>
          </thead>
          <tbody v-if="vodList.length !== 0">
          <tr v-for="(vod, index) in vodList" :class="{trbg: index % 2 === 0}">
            <td :title="vod.respDeptPath"><div v-text="vod.respName"></div><div v-text="vod.respWorkNo"></div></td>
            <td v-text="vod.vodType1 + ' > ' + vod.vodType2" :title="vod.vodType1 + ' > ' + vod.vodType2"></td>
            <td v-text="vod.time"></td>
            <td class="detail">
              <div class="detail-div ellipsis2" style="text-align:left;" :title="vod.detail" v-text="vod.detail"></div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="pageBox">
        <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="updataFloodCtrlBox">
      <flood-ctrl-mgt-add @closeBox='closeUpdataBox' :floodCtrlVo="floodCtrlMgt"></flood-ctrl-mgt-add>
    </div>
    <div v-if="addDriverVodBox">
      <driver-vod-mgt-add-box @closeBox='closeDriBox' :vodType1List='vodType1List' :driVo="driVoMgt" isFloodCtrl="true"></driver-vod-mgt-add-box>
    </div>
    <div v-if="floodCtrlAnalysisBox">
      <flood-ctrl-analysis @closefloodAnalysisBox='closeAnalysisBox' :floodAnalysis="analysis"></flood-ctrl-analysis>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import floodCtrlMgtAdd from '@/components/floodCtrl/flood-ctrl-mgt-add'
  import paginate from '@/components/paginate'
  import driverVodMgtAddBox from '@/components/driverVod/driver-vod-mgt-add'
  import floodCtrlAnalysis from '@/components/floodCtrl/flood-ctrl-analysis'

  export default {
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
        updataFloodCtrlBox: false,
        addDriverVodBox: false,
        floodCtrlAnalysisBox: false,
        restoring: false,
        loginPopup: false,
        vodList: [],
        vodType1List: [],
        floodCtrlList: {},
        dataBackup: {},
        isAudit: config.containsPrivilege('P-FLOOD-CTRL-MGT-AUDIT'),
        adminDetailed: this.adminDetaileds,
        loginName: '',
        name: ''
      }
    },
    props: ['adminDetaileds'],
    components: {
      loginPopup,
      config,
      floodCtrlMgtAdd,
      paginate,
      driverVodMgtAddBox,
      floodCtrlAnalysis
    },
    mounted () {
      this.$nextTick(() => {
        this.name = config.getStorage('loginResult').name
        this.loginName = config.getStorage('loginResult').loginName
        if (this.adminDetailed.sid) {
          this.adminDetailed.floodControlSid = this.adminDetailed.sid
        } else if (this.adminDetailed.runInfoSid) {
          delete this.adminDetailed.runInfoSid
        }
        this.getVodList()
        this.getVodType1List()
      })
    },
    methods: {
      closeAdminBox () {
        this.$emit('closeAdminBox')
      },
      delDetailed (driMgt) {
        if (!this.checkTime(driMgt)) {
          return
        }
        this.restoring = true
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': driMgt.sid},
            url: '/api/flood-ctrl/mgt/delete'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.$message.success('删除成功')
              this.$emit('closeAdminBox', 'q')
            } else if (data.type === 401) { // 登入信息验证失败
              config.gotoLogin()
              this.loginPopup = true
            }
          }).catch((error) => {
            console.log(error)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '删除取消!'
          })
        })
      },
      checkTime (floodCtrlMgt) {
        let timeLimit = config.getTimeLimit(floodCtrlMgt.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-13', 15)
        if (!this.isAudit && timeLimit) {
          this.msgBox = true
          this.message = '当前用户无权修改创建<br>' + '超过' + timeLimit + '分钟的数据'
          return false
        } else {
          return true
        }
      },
      updateFloodVod (floodCtrlMgt) {
        if (!this.checkTime(floodCtrlMgt)) {
          return
        }
        this.floodCtrlMgt = floodCtrlMgt
        this.dataBackup = JSON.parse(JSON.stringify(this.adminDetailed))
        this.updataFloodCtrlBox = true
      },
      addDetailed (floodCtrlMgt) {
        this.driVoMgt = floodCtrlMgt
        this.driVoMgt.isFloodCtrl = true
        this.dataBackup = JSON.parse(JSON.stringify(this.adminDetailed))
        this.addDriverVodBox = true
      },
      runInfoAnalysis (floodCtrlMgt) {
        let timeLimit = config.getTimeLimit(floodCtrlMgt.analysedDt, 'BIZ-DATA-EDIT-TIME-LIMIT-13', 15)
        if (!this.isAudit && timeLimit) {
          this.msgBox = true
          this.message = `当前用户无权修改创建超过${timeLimit}分钟的数据`
          return
        }
        this.analysis = floodCtrlMgt
        this.dataBackup = JSON.parse(JSON.stringify(this.adminDetailed))
        this.floodCtrlAnalysisBox = true
      },
      closeUpdataBox (floodCtrlMgt) {
        if (floodCtrlMgt) {
          this.getVodList()
          this.getFloodCtrl(floodCtrlMgt.sid)
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.updataFloodCtrlBox = false
      },
      getFloodCtrl (sid) {
        this.axios({
          method: 'get',
          params: {'sid': sid},
          url: '/api/flood-ctrl/mgt/get'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.adminDetailed = data.result
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      closeDriBox (floodCtrlMgt) {
        if (floodCtrlMgt) {
          this.adminDetailed = floodCtrlMgt
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.addDriverVodBox = false
        this.getVodList('query')
      },
      closeAnalysisBox (floodCtrlMgt) {
        if (floodCtrlMgt) {
          this.adminDetailed = floodCtrlMgt
          if (!this.adminDetailed.analystName) {
            this.adminDetailed.analystName = this.name
            this.adminDetailed.analyst = this.loginName
          }
          this.adminDetailed.analysed = true
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.floodCtrlAnalysisBox = false
      },
      getVodList (approach) {
        this.floodCtrlList.floodControlSid = this.adminDetailed.floodControlSid
        this.axios({
          method: 'post',
          data: this.floodCtrlList,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/driver-vod/mgt/list'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            this.vodList = data.result.resultList
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getVodList()
      },
      getVodType1List () {
        this.axios({
          method: 'get',
          url: '/api/driver-vod/view/types'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            let newType = {
              name: '全部',
              type2s: null
            }
            this.vodType1List = data.result.type1s
            this.vodType1List.splice(0, 0, newType)
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
  .btn-sm {
    width: auto;
    min-width: 51px;
  }

  .adminBtn {
    float: right;
    margin-right: 20px;
    height: 27px;
    padding: 0 5px;
  }

  .table-hover {
    width: 80%;
    margin: 30px auto 0;
  }

  .popup {
    overflow: scroll;
  }

  .icon-remove {
    right: 25px;
  }

  .popup {
    max-width: 1200px;
    width: 1200px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .popup .head {
    max-width: 1200px;
    width: 1200px;
  }

  .table {
    padding-bottom: 0;
  }

  .pageBox {
    width: 80%;
    margin-left: 10%;
  }

  .table td {
    height: 30px;
    line-height: 25px;
  }

  .table thead th {
    font-weight: 100;
    border: 1px solid #f5f5f5;
    height: 25px;
    background: #c4e4ff;
    color: #333;
  }

  .table tr td {
    border-color: #f5f5f5;
    text-align: left;
    padding: 5px;
  }

  .table thead .title-th {
    border-left: 5px solid #5b758e;
    text-align: left;
    padding-left: 5px;
    line-height: 30px;
  }

  .table tbody .title-td {
    color: #8c8c8c;
  }
</style>
