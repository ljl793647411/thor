<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <div class="search-child">
        <label for="code">编码：</label>
        <input type="text" name="code" v-model="dept.code" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="name">名称：</label>
        <input type="text" name="name" v-model="dept.name" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="type">类型：</label>
        <el-cascader
          :options="DEPT_TYPE"
          v-model="deptType"
          @change="getType">
        </el-cascader>
        </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getDeptList('query')">查 询</el-button>
        <el-button type="primary" @click="openAddEditPopup(null)">新 增</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table">
      <table>
        <thead>
        <tr>
          <th>编码</th>
          <th>名称</th>
          <th>类型</th>
          <th>备注</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in deptList" :class="{complex: index % 2 === 0}">
          <td v-text="mgt.codePath.replace(/,/g, ' > ')" style="text-align: left;"></td>
          <td v-text="mgt.namePath.replace(/,/g, ' > ')" style="text-align: left;"></td>
          <td v-text="DEPT_TYPE_LIST[mgt.type]"></td>
          <td v-text="mgt.memo"></td>
          <td>
            <el-button type="primary" @click="openAddEditPopup(mgt)">编 辑</el-button>
            <el-button type="danger" @click="delDept(mgt)">删 除</el-button>
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
    <div v-if="deptBox">
      <dept-add @closeBox='closeBox' :deptVo="deptVo"></dept-add>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'
  import deptAdd from '@/components/dept/dept-add'

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
        deptList: [],
        dept: {},
        deptVo: {},
        loginPopup: false,
        deptBox: false,
        DEPT_TYPE: config.DEPT_TYPE,
        DEPT_TYPE_LIST: config.DEPT_TYPE_LIST,
        message: '',
        loading: false,
        deptType: []
      }
    },
    components: {
      config,
      loginPopup,
      paginate,
      deptAdd
    },
    mounted () {
      this.$nextTick(() => {
        this.getDeptList()
      })
    },
    methods: {
      getType (value) {
        this.deptType = value
      },
      getDeptList (approach) {
        this.loading = true
        this.message = ''
        if (this.deptType[0] && this.deptType.length) {
          this.dept.type = this.deptType[0]
        } else {
          delete this.dept.type
        }
        this.axios({
          method: 'post',
          data: this.dept,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/op/dept/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.deptList = data.result.resultList
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
      delDept (dept) {
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': dept.sid},
            url: '/api/op/dept/mgt/delete'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getDeptList()
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
        this.getDeptList()
      },
      openAddEditPopup (dept) {
        if (dept) {
          this.deptVo = dept
        } else {
          this.deptVo = {}
        }
        this.deptBox = true
      },
      closeBox () {
        this.deptBox = false
        this.getDeptList()
      }
    }
  }
</script>
