<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <div class="search-child">
        <label for="code">字典编码：</label>
        <input type="text" name="code" v-model="config.code" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="name">字典名称：</label>
        <input type="text" name="name" v-model="config.name" class="search-input-class"/> 
      </div>
      <div class="search-child">
        <label for="groupCode">所属分组：</label>
        <select v-model="config.groupSid" class="select-class">
          <option :value="group.sid" v-for="group in configGroupsList">{{group.name}}</option>
        </select>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getConfigList('query')">查 询</el-button>
        <el-button type="primary" @click="addConfig">新 增</el-button>
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
          <th>字典代码</th>
          <th>字典名称</th>
          <th>所属分组</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in configList" :class="{complex: index % 2 === 0}">
          <td v-text="mgt.code"></td>
          <td v-text="mgt.name"></td>
          <td v-text="mgt.groupName"></td>
          <td>
            <el-button type="primary" @click="updateConfig(mgt)">编 辑</el-button>
            <el-button type="danger" @click="deleteEntity(mgt)">删 除</el-button>
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
      <add-edit-popup @closeBox='closeBox' :configVo="configVo"></add-edit-popup>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'
  import addEditPopup from '@/components/sysConfig/sys-config-mgt-add'

  export default {
    data () {
      return {
        sid: 0,
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
        loginPopup: false,
        showAddEditPopup: false,
        loading: false,
        message: '',
        configGroupsList: []
      }
    },
    components: {
      config,
      loginPopup,
      paginate,
      addEditPopup
    },
    mounted () {
      this.$nextTick(() => {
        this.configGroupsList = config.getStorage('SYS_CONFIG_GROUPS')
        this.getConfigList()
      })
    },
    methods: {
      getConfigList (approach) {
        this.message = ''
        this.loading = true
        this.axios({
          method: 'post',
          data: this.config,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/sys-config/mgt/list'
        }).then((response) => {
          this.loading = false
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
        this.getConfigList()
      },
      addConfig () {
        this.configVo = {}
        this.showAddEditPopup = true
      },
      updateConfig (config) {
        this.configVo = config
        this.showAddEditPopup = true
      },
      closeBox () {
        this.showAddEditPopup = false
        this.getConfigList()
      },
      deleteEntity (entity) {
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method: 'get',
            params: {'sid': entity.sid},
            url: '/api/sys-config/mgt/delete'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getConfigList()
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
