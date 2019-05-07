<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-admin">
      <div class="popup-head">
        <b>检修两违信息</b>
        <div class="icon-remove" @click="closeAdminBox">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div class="admin">
        <div class="title-th">
          <div class="title-th-left">检修两违信息</div>
          <div class="title-th-right">
            <el-button v-if="isEdit || isAdmin" type="danger" @click="delDetailed(adminDetailed)">删 除</el-button>
            <el-button type="primary" @click="updataOmMgtBox(adminDetailed)">编 辑</el-button>
          </div>
        </div>
        <div class="admin-content">
          <div>
            <span class="title-td">发生时间：</span><span v-text="adminDetailed.timeDt"></span>
          </div>
          <div>
            <span class="title-td">机车编号：</span><span v-text="adminDetailed.lmNo"></span>
          </div>
          <div>
            <span class="title-td">两违项点分类：</span><span v-text="adminDetailed.vodType"></span>
          </div>
          <div>
            <span class="title-td">责任岗位：</span><span v-text="adminDetailed.ompName"></span>
          </div>
          <div class="admin-last-child">
            <span class="title-td">创建者：</span><span v-text="`${adminDetailed.createdByName}（${adminDetailed.createdByWorkNo}）`"></span>
          </div>
          <div>
            <span class="title-td">两违问题详情：</span>
          </div>
          <div class="admin-last-child">
            <span v-text="adminDetailed.detail" class="ellipsis2" :title="adminDetailed.detail"></span>
          </div>
        </div>
        <div class="title-th">
          <div class="title-th-left">主管意见</div>
          <div class="title-th-right">
            <el-button type="primary" @click="updataOmMgtBox(adminDetailed)">修 改</el-button>
          </div>
        </div>
        <div class="admin-content" v-if="adminDetailed.commentCnt">
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
            <span v-text="adminDetailed.commentCnt" class="ellipsis ellipsis2" :title="adminDetailed.commentCnt"></span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="updataOmBox">
      <om-mgt-add @closeBox='closeUpdataBox' :omVoMgt="omMgt"></om-mgt-add>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import omMgtAdd from '@/components/omVod/om-vod-mgt-add'

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
        updataOmBox: false,
        dataBackup: {},
        loginPopup: false,
        isAudit: config.containsPrivilege('P-OM-VOD-MGT-AUDIT'),
        isEdit: false,
        isAdmin: config.getAdmin(),
        loginName: config.getLoginName(),
        message: '',
        adminDetailed: this.adminDetaileds
      }
    },
    props: ['adminDetaileds'],
    components: {
      loginPopup,
      config,
      omMgtAdd
    },
    mounted () {
      this.$nextTick(() => {
        console.log(this.adminDetailed)
        this.isEdit = config.containsPrivilege('P-OM-VOD-MGT-EDIT') && (this.loginName === this.adminDetailed.createdByName || !this.adminDetailed.createdByName)
      })
    },
    methods: {
      closeAdminBox () {
        this.$emit('closeAdminBox')
      },
      delDetailed (omMgt) {
        if (!this.checkTime(omMgt)) {
          return
        }
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': omMgt.sid},
            url: '/api/om-vod/mgt/delete'
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
      checkTime (omMgt) {
        let timeLimit = config.getTimeLimit(omMgt.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-04', 15)
        if (!this.isAudit && timeLimit) {
          this.$message.error('当前用户无权修|改创建超过' + timeLimit + '分钟的数据')
          return false
        } else {
          return true
        }
      },
      updataOmMgtBox (omMgt) {
        if (!this.checkTime(omMgt)) {
          return
        }
        this.omMgt = omMgt
        this.dataBackup = JSON.parse(JSON.stringify(this.adminDetailed))
        this.updataOmBox = true
      },
      closeUpdataBox (omMgt) {
        if (omMgt) {
          this.getOm(omMgt.sid)
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.updataOmBox = false
      },
      getOm (sid) {
        this.axios({
          method: 'get',
          params: {'sid': sid},
          url: '/api/om-vod/mgt/get'
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
