<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-admin">
      <div class="popup-head">
        <b>人员考核信息</b>
        <div class="icon-remove" @click="closeAdminBox">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div class="admin">
        <div class="title-th">
          <div class="title-th-left">人员考核</div>
          <div class="title-th-right">
            <el-button type="danger" @click="delDetailed(adminDetailed)" class="adminBtn" size="medium">删 除</el-button>
              <el-button type="primary" @click="updatePaVod(adminDetailed)" class="adminBtn" size="medium">编 辑</el-button>
          </div>
        </div>
        <div class="admin-content">
          <div>
            <span class="title-td">检查时间：</span><span v-text="adminDetailed.date"></span>
          </div>
          <div>
            <span class="title-td">责任单位：</span><span v-text="adminDetailed.respDept" :title="adminDetailed.respDept"></span>
          </div>
          <div>
            <span class="title-td">责任人：</span><span v-text="adminDetailed.respName"></span>
          </div>
          <div>
            <span class="title-td">检查地点：</span><span v-text="adminDetailed.location"></span>
          </div>
          <div>
            <span class="title-td">级别：</span><span v-text="adminDetailed.level"></span>
          </div>
          <div>
            <span class="title-td">性质：</span><span v-text="adminDetailed.type"></span>
          </div>
          <div class="admin-last-child">
            <span class="title-td">问题点代码：</span><span v-text="adminDetailed.problemCode" class="ellipsis ellipsis2" :title="adminDetailed.problemCode"></span>
          </div>
          <div class="admin-last-child">
            <span class="title-td">问题内容：</span><span v-text="adminDetailed.problemDesc" class="ellipsis ellipsis2" :title="adminDetailed.problemDesc"></span>
          </div>
          <div class="admin-last-child">
            <span class="title-td">整改情况：</span>
          </div>
          <div class="admin-last-child">
            <span v-text="adminDetailed.improve" class="ellipsis ellipsis2" :title="adminDetailed.improve"></span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="updataPaBox">
      <pa-mgt-add @closeBox='closeUpdataBox' :paVo="paMgt"></pa-mgt-add>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import paMgtAdd from '@/components/pa/pa-mgt-add'

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
        updataPaBox: false,
        loginPopup: false,
        dataBackup: {},
        isAudit: config.containsPrivilege('P-PA-MGT-AUDIT'),
        message: '',
        adminDetailed: this.adminDetaileds
      }
    },
    props: ['adminDetaileds'],
    components: {
      loginPopup,
      config,
      paMgtAdd
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    methods: {
      closeAdminBox () {
        this.$emit('closeAdminBox')
      },
      delDetailed (paMgt) {
        if (!this.checkTime(paMgt)) {
          return
        }
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': paMgt.sid},
            url: '/api/pa/mgt/delete'
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
      checkTime (paMgt) {
        let timeLimit = config.getTimeLimit(paMgt.createdDt, 'BIZ-DATA-EDIT-TIME-LIMIT-14', 15)
        if (!this.isAudit && timeLimit) {
          this.$message.error('当前用户无权修改创建' + timeLimit + '分钟的数据')
          return false
        } else {
          return true
        }
      },
      updatePaVod (paMgt) {
        if (!this.checkTime(paMgt)) {
          return
        }
        this.paMgt = paMgt
        this.dataBackup = JSON.parse(JSON.stringify(this.adminDetailed))
        this.updataPaBox = true
      },
      closeUpdataBox (paMgt) {
        if (paMgt) {
          this.getPa(paMgt.sid)
        } else {
          this.adminDetailed = JSON.parse(JSON.stringify(this.dataBackup))
        }
        this.updataPaBox = false
      },
      getPa (sid) {
        this.axios({
          method: 'get',
          params: {'sid': sid},
          url: '/api/pa/mgt/get'
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
