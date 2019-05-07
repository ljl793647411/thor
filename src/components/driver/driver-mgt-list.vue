<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <div class="search-child relative">
        <label for="respWorkNo">司机：</label>
        <input type="text" v-model="driver" name="driver" @focus="respBoxChange" @blur="respBoxClose" class="search-input-class"/>
        <ul v-if="respWorkNoList.length !== 0 && respBox" class="resp-box">
          <li class="cursor" v-for="resp in respWorkNoList" :key="resp.sid" @click="getResp(resp)">{{ resp.name + ' —— ' + resp.workNo }}</li>
        </ul>
      </div>
      <div class="search-child">
        <label for="dept">组织：</label>
        <input type="text" v-model="deptName" @click="changeBox" class="search-input-class">
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getDriList('query')">查 询</el-button>
        <el-button type="primary" @click="openAddEditPopup">新 增</el-button>
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
        <tr>
          <th>工号</th>
          <th>姓名</th>
          <th>指导组</th>
          <th>性别</th>
          <th>出生日期</th>
          <th>在职状态</th>
          <th>驾照级别</th>
          <th>学历</th>
          <th>政治面貌</th>
          <th>技术资格</th>
          <th>动车技术资格</th>
          <th>备注</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in driverList" :class="{complex: index % 2 === 0}">
          <td v-text="mgt.workNo"></td>
          <td v-text="mgt.name"></td>
          <td v-text="mgt.ctName"></td>
          <td v-text="SEX[mgt.sex]"></td>
          <td v-text="mgt.dateOfBirth"></td>
          <td v-text="STATUS_LIST[mgt.status]"></td>
          <td v-text="mgt.licenseLevel"></td>
          <td v-text="mgt.education"></td>
          <td v-text="mgt.politicalStatus"></td>
          <td v-text="mgt.technicalQualification"></td>
          <td v-text="mgt.emuTechnicalQualification"></td>
          <td v-text="mgt.memo"></td>
          <td>
            <el-button type="primary" @click="openAddEditPopup(mgt)">编 辑</el-button>
            <el-button type="danger" @click="openDelEditPopup(mgt)">删 除</el-button>
          </td>
        </tr>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="showAddEditPopup">
      <driver-add @closeBox='closeBox' :driVo="driverVo"></driver-add>
    </div>
    <div v-if="deptBox">
      <dept-radio-box @getDeptCode="getDeptCode" :driver="true"></dept-radio-box>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'
  import driverAdd from '@/components/driver/driver-mgt-add'
  import deptBox from '@/components/dept-box'
  import deptRadioBox from '@/components/dept-radio-box'

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
        driverList: [],
        respWorkNoList: [],
        res: {},
        driverVo: {},
        errMsg: '',
        loginPopup: false,
        showAddEditPopup: false,
        deptBox: false,
        loading: false,
        respBox: false,
        message: '',
        STATUS_LIST: config.STATUS_LIST,
        SEX: config.SEX,
        driverSid: '',
        driver: '',
        deptName: '',
        respWorkNos: {
          deptCode: config.deptCode,
          deptType: config.deptType
        }
      }
    },
    components: {
      config,
      loginPopup,
      paginate,
      driverAdd,
      deptBox,
      deptRadioBox
    },
    watch: {
      driver: 'changeRespWorkNos'
    },
    mounted () {
      this.$nextTick(() => {
        this.getDriList()
      })
    },
    methods: {
      getDriList (approach) {
        this.loading = true
        this.res.rbCode = config.RBCode
        this.res.ldCode = config.deptCode
        this.message = ''
        this.axios({
          method: 'post',
          data: this.res,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/op/driver/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.driverList = data.result.resultList
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
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      changePage (pageNo, pageSize) { // 切换页面
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getDriList()
      },
      openAddEditPopup (mgt) {
        if (mgt.sid) {
          this.driverVo = mgt
        } else {
          this.driverVo = {}
        }
        this.showAddEditPopup = true
      },
      closeBox () {
        this.showAddEditPopup = false
        this.getDriList()
      },
      openDelEditPopup (driver) {
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': driver.sid},
            url: '/api/op/driver/mgt/delete'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getDriList()
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
      changeRespWorkNos () {
        if (this.driver) {
          if (encodeURI(this.driver).length < 2) {
            return
          }
          if (this.driver.length === 0) {
            this.respWorkNoList = []
          }
          this.respWorkNos.searchStr = this.driver
        }
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
        this.res.workNo = resp.workNo
        this.res.name = resp.name
        this.respWorkNoList = []
        this.respBox = false
      },
      respBoxChange () {
        this.driver = ''
        this.res.workNo = ''
        this.res.name = ''
        this.res.respWorkNos = []
        this.respBox = true
      },
      respBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = []
          this.respBox = false
        }, 500)
      },
      getDeptCode (result) {
        this.deptBox = false
        if (!result.sid) {
          return
        }
        this.deptName = result.name
        if (result.type) {
          this.res.deptCode = result.code
        }
      },
      changeBox () {
        this.deptBox = true
      }
    }
  }
</script>


<style>

</style>
