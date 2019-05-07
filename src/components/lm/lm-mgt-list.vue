<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <div class="search-child">
        <label class="td-left">机车编号:</label>
        <input type="text" v-model="res.noLike" class="search-input-class">
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getLmList('query')">查 询</el-button>
        <el-button type="primary" @click="openAddEditPopup">新 增</el-button>
      </div>
    </div>
    <template v-if="message">
    <h4 v-text="message" class="color-white float-left" style="width: 100;"></h4>
    <div>
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1'></paginate>
    </div>
    </template>
    <div v-if="!message" class="table">
      <table>
        <thead>
        <tr>
          <th>机车编号</th>
          <th>机车型号</th>
          <th>类型</th>
          <th>线别</th>
          <th>备注</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in lmList" :class="{complex: index % 2 === 0}">
          <td v-text="mgt.no"></td>
          <td v-text="mgt.type"></td>
          <td v-text="LM_TYPES[mgt.type]"></td>
          <td v-text="mgt.cate1"></td>
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
      <lm-add @closeBox='closeBox' :lmVo="lmVo"></lm-add>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'
  import lmAdd from '@/components/lm/lm-mgt-add'
  import trainSearch from '@/components/train-search'

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
        lmList: [],
        res: {},
        lmVo: {},
        errMsg: '',
        loading: false,
        loginPopup: false,
        showAddEditPopup: false,
        message: '',
        LM_TYPES: config.LM_TYPES,
        lmSid: ''
      }
    },
    components: {
      config,
      loginPopup,
      paginate,
      lmAdd,
      trainSearch
    },
    mounted () {
      this.$nextTick(() => {
        this.getLmList()
      })
    },
    methods: {
      getLmList (approach) {
        this.loading = true
        this.res.rbCode = config.RBCode
        this.res.ldCode = config.deptCode
        this.message = ''
        this.axios({
          method: 'post',
          data: this.res,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/lm/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.lmList = data.result.resultList
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
        this.getLmList()
      },
      openAddEditPopup (mgt) {
        if (mgt.sid) {
          this.lmVo = mgt
        } else {
          this.lmVo = {}
        }
        this.showAddEditPopup = true
      },
      closeBox () {
        this.showAddEditPopup = false
        this.getLmList()
      },
      openDelEditPopup (lm) {
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': lm.sid},
            url: '/api/lm/mgt/delete'
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
      }
    }
  }
</script>


<style>
</style>
