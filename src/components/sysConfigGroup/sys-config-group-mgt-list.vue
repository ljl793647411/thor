<template>
  <div>
    <div class="search">
      <div class="search-child">
        <label for="code">代码：</label>
        <input type="text" name="code" v-model="config.code" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="name">名称：</label>
        <input type="text" name="name" v-model="config.name" class="search-input-class"/>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getConfigList('query')">查 询</el-button>
        <el-button type="primary" @click="openAddEditPopup(null)">新 增</el-button>
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
          <th>代码</th>
          <th>名称</th>
          <th style="width: 10%">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in configList" :class="{complex: index % 2 === 0}">
          <td v-text="mgt.code"></td>
          <td v-text="mgt.name"></td>
          <td>
            <el-button type="primary" @click="openAddEditPopup(mgt)">编 辑</el-button>
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
      <config-add @closeBox='closeBox' :configVo="configVo"></config-add>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'
  import configAdd from '@/components/sysConfigGroup/sys-config-group-mgt-add'

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
        configList: [],
        config: {},
        configVo: {},
        configSid: '',
        loginPopup: false,
        showAddEditPopup: false,
        message: '',
        configGroupsList: []
      }
    },
    components: {
      config,
      loginPopup,
      paginate,
      configAdd
    },
    mounted () {
      this.$nextTick(() => {
        this.getConfigList()
      })
    },
    methods: {
      getConfigList (approach) {
        this.message = ''
        if (config.groupCode) {

        }
        this.axios({
          method: 'post',
          data: this.config,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/sys-config-group/mgt/list'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.configList = data.result.resultList
            } else {
              this.message = config.LIST_NO_DATA_TEXT
            }
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          } else {
            this.message = data.msg
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
        this.getConfigList()
      },
      openAddEditPopup (entity) {
        this.configVo = entity || {}
        this.showAddEditPopup = true
      },
      closeBox () {
        this.showAddEditPopup = false
        this.getConfigList()
      }
    }
  }
</script>


<style>

</style>
