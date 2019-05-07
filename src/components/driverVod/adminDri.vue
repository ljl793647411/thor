  <template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-admin">
      <div class="popup-head">
        <b>值乘两违信息</b>
        <div class="icon-remove" @click="closeAdminBox">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div class="admin">
        <div class="title-th">
          <div class="title-th-left">值乘两违</div>
          <div class="title-th-right">
            <el-button v-if="isEdit || isAdmin" type="danger" @click="delDetailed(adminDetailed)" class="adminBtn">删 除</el-button>
            <el-button type="primary" @click="updataDriMgtBox(adminDetailed)">编 辑</el-button>
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
            <span class="title-td">一位司机：</span><span v-if="adminDetailed.workNo1" v-text="adminDetailed.driverName1 + '（' + adminDetailed.workNo1 + '）'"></span>
          </div>
          <div>
            <span class="title-td">二位司机：</span><span v-if="adminDetailed.workNo2" v-text="adminDetailed.workNo2 ? adminDetailed.driverName2 + '（' + adminDetailed.workNo2 + '）' : ''"></span>
          </div>
          <div>
            <span class="title-td">三位司机：</span><span v-if="adminDetailed.workNo3" v-text="adminDetailed.workNo3 ? adminDetailed.driverName3 + '（' + adminDetailed.workNo3 + '）' : ''"></span>
          </div>
          <div>
            <span class="title-td">添乘司机：</span><span v-if="adminDetailed.workNo4" v-text="adminDetailed.workNo4 ? adminDetailed.driverName4 + '（' + adminDetailed.workNo4 + '）' : ''"></span>
          </div>
          <div>
            <span class="title-td">责任司机：</span><span v-text="adminDetailed.respName + '（' + adminDetailed.respWorkNo + '）'"></span>
          </div>
          <div>
            <span class="title-td">机车编号：</span><span v-text="adminDetailed.lmNo"></span>
          </div>
          <div>
            <span class="title-td">项点：</span><span v-text="adminDetailed.vodType2 ? adminDetailed.vodType1 + ' > ' + adminDetailed.vodType2 : adminDetailed.vodType1"></span>
          </div>
          <div>
            <span class="title-td">创建者：</span><span v-text="`${adminDetailed.createdByName}（${adminDetailed.createdByWorkNo}）`"></span>
          </div>
          <div>
            <span class="title-td">两违详情：</span>
          </div>
          <div class="admin-last-child">
            <span v-text="adminDetailed.detail" class="ellipsis2" :title="adminDetailed.detail"></span>
          </div>
        </div>
        <div class="title-th">
          <div class="title-th-left">主管意见</div>
          <div class="title-th-right">
            <el-button type="primary" @click="updataDriMgtBox(adminDetailed)" class="adminBtn">修 改</el-button>
          </div>
        </div>
        <div class="admin-content">
          <div>
            <span class="title-td">主管姓名：</span><span v-text="adminDetailed.commentName + '（' + adminDetailed.commentWorkNo + '）'"></span>
          </div>
          <div>
            <span class="title-td">时间：</span><span v-text="adminDetailed.commentTime"></span>
          </div>
          <div>
            <span class="title-td">主管意见：</span>
          </div>
          <div class="admin-last-child">
            <span v-text="adminDetailed.commentCnt" class="ellipsis2" :title="adminDetailed.commentCnt"></span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="updataDriBox">
      <dri-mgt-add @closeBox='closeUpdataBox' :driVo="driMgt"></dri-mgt-add>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import driMgtAdd from '@/components/driverVod/driver-vod-mgt-add'

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
        updataDriBox: false,
        restoring: false,
        dataBackup: {},
        loginPopup: false,
        isAudit: config.containsPrivilege('P-DRIVER-VOD-MGT-AUDIT'),
        loginName: config.getLoginName(),
        isEdit: false,
        isAdmin: config.getAdmin(),
        message: '',
        adminDetailed: this.adminDetaileds
      }
    },
    props: ['adminDetaileds'],
    components: {
      loginPopup,
      config,
      driMgtAdd
    },
    mounted () {
      this.$nextTick(() => {
        console.log('adminDetailed', this.adminDetaileds)
        this.isEdit = config.containsPrivilege('P-DRIVER-VOD-MGT-EDIT') && (this.loginName === this.adminDetailed.createdByName || !this.adminDetailed.createdByName)
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
            url: '/api/driver-vod/mgt/delete'
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
      checkTime (driMgt) {
        let timeLimit = config.getTimeLimit(driMgt.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-02', 15)
        if (!this.isAudit && timeLimit) {
          this.$message.error('当前用户无权修改创建超过' + timeLimit + '分钟的数据')
          return false
        } else {
          return true
        }
      },
      updataDriMgtBox (driMgt) {
        if (!this.checkTime(driMgt)) {
          return
        }
        this.driMgt = driMgt
        this.dataBackup = JSON.parse(JSON.stringify(this.adminDetailed))
        this.updataDriBox = true
      },
      closeUpdataBox (driMgt) {
        if (driMgt) {
          this.getDri(driMgt.sid)
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.updataDriBox = false
      },
      getDri (sid) {
        this.axios({
          method: 'get',
          params: {'sid': sid},
          url: '/api/driver-vod/mgt/get'
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
      }
    }
  }
</script>


<style scoped>
  
</style>
