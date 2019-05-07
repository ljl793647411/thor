<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <div class="search-child">
        <label for="code">登录名：</label>
        <input type="text" name="loginName" v-model="user.loginName" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="name">姓名：</label>
        <input type="text" name="name" v-model="user.name" class="search-input-class"/>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getUserList('query')">查 询</el-button>
        <el-button type="primary" @click="openAddEditPopup(null)">新 增</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100;"></h4>
    <div v-if="!message" class="table">
      <table>
        <thead>
        <tr>
          <th>登录名</th>
          <th>姓名</th>
          <th>性别</th>
          <th>系统管理员</th>
          <th>启用状态</th>
          <th>在职状态</th>
          <th style="width: 30%">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in userList" :class="{complex: index % 2 === 0}">
          <td v-text="mgt.loginName"></td>
          <td v-text="mgt.name"></td>
          <td v-text="SEX[mgt.sex]"></td>
          <td v-text="mgt.admin ? '是' : '否'"></td>
          <td v-text="mgt.enabled ? '启用' : '禁用'"></td>
          <td v-text="STATUS_LIST[mgt.status]"></td>
          <td>
            <el-button type="primary" @click="openAddEditPopup(mgt)">编 辑</el-button>
            <el-button type="danger" @click="delUser(mgt)" v-if="mgt.loginName !== 'admin'">删 除</el-button>
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
    <div v-if="userBox">
      <user-add @closeBox='closeBox' :userVo="userVo" see="see"></user-add>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'
  import userAdd from '@/components/user/user-add'

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
        userList: [],
        user: {},
        userVo: {},
        loading: false,
        loginPopup: false,
        userBox: false,
        STATUS_LIST: config.STATUS_LIST,
        SEX: config.SEX,
        message: ''
      }
    },
    components: {
      config,
      loginPopup,
      paginate,
      userAdd
    },
    mounted () {
      this.$nextTick(() => {
        this.getUserList()
      })
    },
    methods: {
      getUserList (approach) {
        this.message = ''
        this.loading = true
        this.axios({
          method: 'post',
          data: this.user,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/user/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.userList = data.result.resultList
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
      getUser (sid) {
        this.axios({
          method: 'get',
          params: {'sid': sid},
          url: '/api/user/mgt/get'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.userVo = data.result
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      delUser (user) {
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': user.sid},
            url: '/api/user/mgt/delete'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getUserList()
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
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getUserList()
      },
      openAddEditPopup (user) {
        if (user) {
          this.getUser(user.sid)
        } else {
          this.userVo = {'dataDeptNamePaths': [], 'roleSids': []}
        }
        this.userBox = true
      },
      closeBox () {
        this.userBox = false
        this.see = false
        this.getUserList()
      }
    }
  }
</script>


<style>

</style>
