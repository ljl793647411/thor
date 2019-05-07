<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-admin">
      <div class="popup-head">
        <b>运行信息详情</b>
        <div class="icon-remove" @click="closeAdminBox">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div class="admin">
        <div class="title-th">
          <div class="title-th-left">值乘信息</div>
          <div class="title-th-right">
            <el-button type="danger" @click="delDetailed(adminDetailed)" class="adminBtn" >删 除</el-button>
            <el-button type="primary" @click="updateInfoVod(adminDetailed)" class="adminBtn" >编 辑</el-button>
          </div>
        </div>
        <div class="admin-content">
          <div>
            <span class="title-td">日期：</span><span v-text="adminDetailed.trainDt"></span>
          </div>
          <div>
            <span class="title-td">车次：</span><span v-text="adminDetailed.trainNo"></span>
          </div>
          <div>
            <span class="title-td">列车类型：</span><span v-text="TRAIN_TYPES[adminDetailed.trainType]"></span>
          </div>
          <div>
            <span class="title-td">机车：</span><span v-text="adminDetailed.lmNo + '，' + LM_TYPES[adminDetailed.lmType] + '，型号' + adminDetailed.lmModel"></span>
          </div>
          <div>
            <span class="title-td">一位司机：</span><span v-text="adminDetailed.driverName1 + '（' + adminDetailed.workNo1 + '）'"></span>
          </div>
          <div>
            <span class="title-td">二位司机：</span><span v-if="adminDetailed.workNo2" v-text="adminDetailed.driverName2 + '（' + adminDetailed.workNo2 + '）'"></span>
          </div>
          <div>
            <span class="title-td">三位司机：</span><span v-if="adminDetailed.workNo3" v-text="adminDetailed.driverName3 + '（' + adminDetailed.workNo3 + '）'"></span>
          </div>
          <div>
            <span class="title-td">添乘司机：</span><span v-if="adminDetailed.workNo4" v-text="adminDetailed.workNo4 ? adminDetailed.driverName4 + '（' + adminDetailed.workNo4 + '）' : ''"></span>
          </div>
        </div>
        <div class="title-th">
          <div class="title-th-left">非正常信息</div>
        </div>
        <div class="admin-content">
          <div class="admin-last-child">
            <span class="title-td">发生时间地点：</span><span v-text="adminDetailed.timeDt"></span>，<span v-text="adminDetailed.location"></span>
          </div>
          <div>
            <span class="title-td">追踪分类：</span><span v-text="adminDetailed.cate"></span>
          </div>
          <div>
            <span class="title-td">录入者：</span><span v-text="adminDetailed.reporter"></span>
          </div>
          <div>
            <span class="title-td">类别：</span><span v-text="adminDetailed.type"></span>
          </div>
          <div>
            <span v-if="adminDetailed.type == '临时命令'"><span class="title-td">命令编号：</span><span v-text="adminDetailed.cmdNo"></span></span>
          </div>
          <div class="admin-last-child">
            <span class="title-td">详情：</span><span v-if="adminDetailed.detail" v-html="adminDetailed.detail.replace(/(?:\r\n|\r|\n)/g, '<br />')"></span>
          </div>
          <div class="admin-last-child">
            <span class="title-td">备注：</span><span v-if="adminDetailed.memo" v-html="adminDetailed.memo.replace(/(?:\r\n|\r|\n)/g, '<br />')"></span>
          </div>
        </div>
        <div class="title-th">
          <div class="title-th-left">分析情况</div>
          <div class="title-th-right">
            <el-button type="primary" @click="runInfoAnalysis(adminDetailed)" class="adminBtn" >分 析</el-button>
          </div>
        </div>
        <div class="admin-content" v-if="adminDetailed.analysed">
          <div>
            <span class="title-td">分析员：</span><span v-if="adminDetailed.analyst" v-text="adminDetailed.analystName + '（' + adminDetailed.analyst + '）'"></span>
          </div>
          <div>
            <span class="title-td">分析时间：</span><span v-text="adminDetailed.analysedDt"></span>
          </div>
          <div>
            <span class="title-td">音频文件核对：</span><span v-text="adminDetailed.analysedAudio ? '已核对' : '未核对'"></span>
          </div>
          <div>
            <span class="title-td">视频文件核对：</span><span v-text="adminDetailed.analysedVideo ? '已核对' : '未核对'"></span>
          </div>
        </div>
        <div class="admin-content" v-if="!adminDetailed.analysed">
          <div>
            <span class="title-td">未分析</span>
          </div>
        </div>
        <div class="title-th">
          <div class="title-th-left">雾天专项分析</div>
        </div>
        <div class="admin-content" v-if="adminDetailed.fogAnalysis">
          <div>
            <span class="title-td">恢复双人值乘情况：</span><span v-text="adminDetailed.fogDoubleTtd ? '是' : '否'"></span>
          </div>
          <div>
            <span class="title-td">降雾区段防伤鸣笛情况：</span><span v-text="adminDetailed.fogWhistle ? '是' : '否'"></span>
          </div>
          <div>
            <span class="title-td">接收临时调度命令呼唤核对：</span><span v-text="adminDetailed.fogCallVerification ? '是' : '否'"></span>
          </div>
          <div>
            <span class="title-td">信息反馈情况核对：</span><span v-text="adminDetailed.fogFeedbackCheck ? '是' : '否'"></span>
          </div>
        </div>
        <div class="admin-content" v-if="!adminDetailed.fogAnalysis">
          <div>
            <span class="title-td">不是雾天专项分析</span>
          </div>
        </div>
        <div class="title-th">
          <div class="title-th-left">追踪</div>
          <div class="title-th-right">
            <el-button type="primary" @click="runInfoTrack(adminDetailed)" class="adminBtn" >录入追踪结果</el-button>
          </div>
        </div>
        <div class="admin-content" v-if="adminDetailed.needTrace">
          <div>
            <span class="title-td">追踪分析项点：</span><span v-if="adminDetailed.tracePoints" v-html="adminDetailed.tracePoints.replace(/(?:\r\n|\r|\n)/g, '<br />')"></span>
          </div>
          <div>
            <span class="title-td">问题性质：</span><span v-text="adminDetailed.traceSummary"></span>
          </div>
          <div>
            <span class="title-td">追踪责任人：</span><span v-text="adminDetailed.traceOwner"></span>
          </div>
          <div>
            <span class="title-td">涉及部门：</span><span v-text="adminDetailed.traceDept"></span>
          </div>
          <div class="admin-last-child" v-if="adminDetailed.traced">
            <span class="title-td">落实日期：</span><span v-text="adminDetailed.tracedDt"></span>
          </div>
          <div class="admin-last-child" v-if="adminDetailed.traced">
            <span class="title-td">落实情况：</span><span v-if="adminDetailed.tracedResult" v-html="adminDetailed.tracedResult.replace(/(?:\r\n|\r|\n)/g, '<br />')"></span>
          </div>
        </div>
        <div class="admin-content" v-if="!adminDetailed.needTrace">
          <div>
            <span class="title-td">不需要追踪</span>
          </div>
        </div>
        <div class="admin">
          <div class="title-th">
            <div class="title-th-left">两违详情列表</div>
            <div class="title-th-right">
              <el-button type="primary" @click="addDetailed(adminDetailed)" class="adminBtn" >新 增</el-button>
            </div>
          </div>
        </div>
        <div class="table">
          <table>
            <thead>
              <tr v-if="vodList.length !== 0">
                <td style="width:12%;">责任司机</td>
                <td style="width:20%;">项点分类</td>
                <td style="width:14%;">发生时间</td>
                <td>两违详情</td>
              </tr>
            </thead>
            <tbody v-if="vodList.length !== 0">
              <tr v-for="(vod, index) in vodList" :class="{complex: index % 2 === 0}">
                <td :title="vod.respDeptPath"><div v-text="vod.respName"></div><div v-text="vod.respWorkNo"></div></td>
                <td v-text="vod.vodType1 + ' > ' + vod.vodType2" :title="vod.vodType1 + ' > ' + vod.vodType2"></td>
                <td v-text="vod.time"></td>
                <td class="detail" v-if="vod.detail">
                  <div class="detail-div ellipsis2" style="text-align:left;" :title="vod.detail" v-html="vod.detail.replace(/(?:\r\n|\r|\n)/g, '<br />')"></div>
                </td>
              </tr>
            </tbody>
            <tbody v-if="vodList.length === 0">
              <tr>
                <td style="text-align:left;"><span class="title-td">没有两违信息</span></td>
              </tr>
            </tbody>
          </table>
          <div class="pageBox">
            <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="updataInfoMgtBox">
      <info-mgt-add @closeBox='closeUpdataBox' :infoVoMgt="infoVoMgt"></info-mgt-add>
    </div>
    <div v-if="addDriverVodMgtBox">
      <driver-vod-mgt-add-box @closeBox='closeDriBox' :driVo="driVoMgt" isRunInfo="isRunInfo"></driver-vod-mgt-add-box>
    </div>
    <div v-if="runInfoAnalysisBox">
      <run-info-analysis @closeAnalysisBox='closeAnalysisBox' :analysis="analysis"></run-info-analysis>
    </div>
    <div v-if="runInfoTrackBox">
      <run-info-track @closeTrackBox='closeTrackBox' :track="track"></run-info-track>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import infoMgtAdd from '@/components/runInfo/run-info-mgt-add'
  import paginate from '@/components/paginate'
  import driverVodMgtAddBox from '@/components/driverVod/driver-vod-mgt-add'
  import runInfoAnalysis from '@/components/runInfo/run-info-analysis'
  import runInfoTrack from '@/components/runInfo/run-info-track'

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
        updataInfoMgtBox: false,
        addDriverVodMgtBox: false,
        runInfoAnalysisBox: false,
        runInfoTrackBox: false,
        loginPopup: false,
        vodList: [],
        runInfoList: {
          runInfoSid: 0
        },
        dataBackup: {},
        isAudit: config.containsPrivilege('P-RUN-INFO-MGT-AUDIT'),
        LM_TYPES: config.LM_TYPES,
        TRAIN_TYPES: config.TRAIN_TYPES,
        msgBox: false,
        message: '',
        adminDetailed: this.adminDetaileds,
        name: '',
        loginName: ''
      }
    },
    props: ['adminDetaileds'],
    components: {
      loginPopup,
      config,
      infoMgtAdd,
      paginate,
      driverVodMgtAddBox,
      runInfoAnalysis,
      runInfoTrack
    },
    mounted () {
      this.$nextTick(() => {
        this.name = config.getStorage('loginResult').name
        this.loginName = config.getStorage('loginResult').loginName
        this.getVodList()
      })
    },
    methods: {
      closeAdminBox () {
        this.$emit('closeAdminBox')
      },
      delDetailed (infoMgt) {
        if (!this.checkTime(infoMgt)) {
          return
        }
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': infoMgt.sid},
            url: '/api/run-info/mgt/delete'
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
      checkTime (infoVoMgt) {
        let timeLimit = config.getTimeLimit(infoVoMgt.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-03', 15)
        if (!this.isAudit && timeLimit) {
          this.$message.error('当前用户无权修改创建超过' + timeLimit + '分钟的数据')
          return false
        } else {
          return true
        }
      },
      updateInfoVod (infoVoMgt) {
        if (!this.checkTime(infoVoMgt)) {
          return
        }
        this.infoVoMgt = infoVoMgt
        this.dataBackup = JSON.parse(JSON.stringify(this.adminDetailed))
        this.updataInfoMgtBox = true
      },
      addDetailed (infoVoMgt) {
        this.driVoMgt = infoVoMgt
        this.driVoMgt.fogAnalysis = infoVoMgt.fogAnalysis
        this.driVoMgt.isRunInfo = true
        this.dataBackup = JSON.parse(JSON.stringify(infoVoMgt))
        this.addDriverVodMgtBox = true
      },
      runInfoAnalysis (infoVoMgt) {
        let timeLimit = config.getTimeLimit(infoVoMgt.analysedDt, 'BIZ-DATA-EDIT-TIME-LIMIT-03', 15)
        if (!this.isAudit && timeLimit) {
          this.$message.error('当前用户无权修改创建超过' + timeLimit + '分钟的数据')
          return
        }
        this.analysis = infoVoMgt
        this.dataBackup = JSON.parse(JSON.stringify(infoVoMgt))
        this.runInfoAnalysisBox = true
      },
      runInfoTrack (infoVoMgt) {
        let timeLimit = config.getTimeLimit(infoVoMgt.analysedDt, 'BIZ-DATA-EDIT-TIME-LIMIT-03', 15)
        if (!this.isAudit && timeLimit) {
          this.$message.error('当前用户无权修改创建超过' + timeLimit + '分钟的数据')
          return
        }
        this.track = infoVoMgt
        this.dataBackup = JSON.parse(JSON.stringify(infoVoMgt))
        this.runInfoTrackBox = true
      },
      closeUpdataBox (infoVoMgt) {
        if (infoVoMgt) {
          this.getVodList()
          this.getRunInfo(infoVoMgt.sid)
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.updataInfoMgtBox = false
      },
      getRunInfo (sid) {
        this.axios({
          method: 'get',
          params: {'sid': sid},
          url: '/api/run-info/mgt/get'
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
      closeDriBox (infoVoMgt) {
        if (infoVoMgt) {
          this.adminDetailed = infoVoMgt
          this.getVodList()
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.addDriverVodMgtBox = false
        this.getVodList(infoVoMgt)
      },
      closeAnalysisBox (infoVoMgt) {
        if (infoVoMgt) {
          this.getRunInfo(infoVoMgt.sid)
          if (!this.adminDetailed.analystName) {
            this.adminDetailed.analystName = this.name
            this.adminDetailed.analyst = this.loginName
          }
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.runInfoAnalysisBox = false
      },
      closeTrackBox (infoVoMgt) {
        if (infoVoMgt) {
          this.adminDetailed = infoVoMgt
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.runInfoTrackBox = false
      },
      getVodList (approach) {
        this.runInfoList.runInfoSid = this.adminDetailed.sid
        this.axios({
          method: 'post',
          data: this.runInfoList,
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
      }
    }
  }
</script>


<style scoped>
  

</style>
