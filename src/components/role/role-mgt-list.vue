<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <div class="search-child">
        <label for="code">角色编码：</label>
        <input type="text" name="code" v-model="role.code" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="name">角色名称：</label>
        <input type="text" name="name" v-model="role.name" class="search-input-class"/>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getRoleList('query')">查 询</el-button>
        <el-button type="primary" @click="addRole">新 增</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table">
      <table>
        <thead>
        <tr>
          <th>角色编码</th>
          <th>角色名称</th>
          <th style="width:40%;">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in roleList" :class="{complex: index % 2 === 0}">
          <td v-text="mgt.code"></td>
          <td v-text="mgt.name"></td>
          <td>
            <el-button type="primary" @click="updataRole(mgt)">编 辑</el-button>
            <el-button type="danger" @click="delRole(mgt)">删 除</el-button>
            <el-button type="primary" @click="assignUser(mgt)">用户分配</el-button>
            <el-button type="primary" @click="assignPrivilege(mgt)">权限分配</el-button>
          </td>
        </tr>
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
    <div v-if="addRoleBox">
      <role-add @closeBox='closeBox' :roleVo="roleVo"></role-add>
    </div>
    <div v-if="assignUserBox">
      <assign-user @closeUserBox='closeUserBox' :assignUserVo="assignUserVo"></assign-user>
    </div>
    <div v-if="assignPrivilegeBox">
      <assign-privilege @closeBox='closePrivilegeBox' :ajVo="ajVo"></assign-privilege>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'
  import roleAdd from '@/components/role/role-add'
  import assignUser from '@/components/role/assign-user-role'
  import assignPrivilege from '@/components/role/assign-privilege-role'

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
        role: {},
        roleList: [],
        roleVo: {},
        roleSid: '',
        ajVo: {},
        assignUserVo: {},
        addRoleBox: false,
        loading: false,
        assignUserBox: false,
        assignPrivilegeBox: false,
        loginPopup: false,
        message: ''
      }
    },
    components: {
      config,
      loginPopup,
      paginate,
      roleAdd,
      assignPrivilege,
      assignUser
    },
    mounted () {
      this.$nextTick(() => {
        this.getRoleList()
      })
    },
    methods: {
      getRoleList (approach) {
        this.loading = true
        this.message = ''
        this.axios({
          method: 'post',
          data: this.role,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/role/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.roleList = data.result.resultList
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
      addRole () {
        this.roleVo = {}
        this.addRoleBox = true
      },
      closeBox () {
        this.addRoleBox = false
        this.getRoleList('query')
      },
      updataRole (role) {
        this.roleVo = role
        this.addRoleBox = true
      },
      delRole (role) {
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': role.sid},
            url: '/api/role/mgt/delete'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getRoleList()
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
      assignPrivilege (mgt) {
        this.ajVo = mgt
        this.assignPrivilegeBox = true
      },
      assignUser (mgt) {
        this.assignUserVo = mgt
        this.assignUserBox = true
      },
      closeUserBox () {
        this.assignUserBox = false
      },
      closePrivilegeBox (privilege) {
        this.assignPrivilegeBox = false
        this.ajVo.pvlgSids = privilege
        this.getRoleList()
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getRoleList()
      }
    }
  }
</script>

<style scoped>

</style>
