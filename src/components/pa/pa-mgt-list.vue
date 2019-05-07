<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :type="true" class="search-child"></date-box>
      <div class="search-child">
        <div>
          <label>级别：</label>
          <el-cascader
            :options="LEVELS"
            v-model="levels"
            @change="getLevels">
          </el-cascader>
        </div>
      </div>
      <div class="search-child">
        <label>性质：</label>
        <el-cascader
          :options="TYPES"
          v-model="types"
          @change="getTypes">
        </el-cascader>
      </div>
      <div class="search-child">
        <label for="respDept">责任单位：</label>
        <input type="text" id="respDept" v-model="pa.respDept" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="respLike">责任人：</label>
        <input type="text" v-model="pa.respLike" id="respLike" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="problemCode">问题点代码：</label>
        <input type="text" id="problemCode" v-model="pa.problemCode" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="problemDesc">问题点内容：</label>
        <input type="text" id="problemDesc" v-model="pa.problemDesc" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="createdBy">创建者：</label>
        <input type="text" id="createdBy" v-model="pa.createdBy" class="search-input-class"/>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getPaList('query')">查 询</el-button>
        <el-button type="primary" @click="createPaMgt" v-if="!detail">新 增</el-button>
      </div>
      <div class="search-child upload-class " v-if="!detail">
        <form @submit.prevent="submit($event)">
          <el-button type="primary">从Excel导入</el-button>
          <input ref="file" class="fileBtn" type="file" name="file" @change="getFile($event)">
        </form>
      </div>
      <div v-if="!detail"  class="help float-left" title="从【安全风险问题信息管理系统】中筛选状态为【已归档】的人员考核，导出为Excel，并在此处导入"><img src="../../../static/help.png"></div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div class="table" v-if="!message">
      <table>
        <thead>
        <tr>
          <th style="width:10%;">检查时间</th>
          <th style="width:10%;">责任单位</th>
          <th style="width:4%;">责任人</th>
          <th style="width:9%;">检查地点</th>
          <th style="width:15%;">问题点代码</th>
          <th style="width:23%;">问题内容</th>
          <th style="width:4%;">级别</th>
          <th style="width:6%;">性质</th>
          <th style="width:23%;">整改情况</th>
          <th v-if="!detail">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in paList" :class="{complex: index % 2 === 0}">
          <td v-text="mgt.date"></td>
          <td>
            <div v-text="mgt.respDept" :title="mgt.respDept" class="ellipsis ellipsis2"></div>
          </td>
          <td v-text="mgt.respName + (mgt.respWorkNo ? '（' + mgt.respWorkNo + '）' : '')"></td>
          <td v-text="mgt.location"></td>
          <td>
            <div v-text="mgt.problemCode" :title="mgt.problemCode" class="ellipsis ellipsis2"></div>
          </td>
          <td>
            <div v-text="mgt.problemDesc" :title="mgt.problemDesc" class="ellipsis ellipsis2"></div>
          </td>
          <td v-text="mgt.level"></td>
          <td v-text="mgt.type"></td>
          <td>
            <div v-if="mgt.improve" v-text="mgt.improve" :title="mgt.improve" class="ellipsis ellipsis2"></div>
          </td>
          <td v-if="!detail">
            <el-button type="primary" @click="admin(mgt)">管 理</el-button>
          </td>
        </tr>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div v-if="message">
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1'></paginate>
    </div>
    <div v-if="addPaBox">
      <pa-mgt-add @closeBox='closeBox' :paVo="paVo"></pa-mgt-add>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="addMoreBox">
      <pa-mgt-add-more @closeMoreBox='closeMoreBox' :paVos="paVos"></pa-mgt-add-more>
    </div>
    <div v-if="adminBox">
      <admin-pa-detailed :adminDetaileds="adminDetaileds" @closeAdminBox='closeAdminBox'></admin-pa-detailed>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import paginate from '@/components/paginate'
  import paMgtAdd from '@/components/pa/pa-mgt-add'
  import loginPopup from '@/components/login-popup'
  import paMgtAddMore from '@/components/pa/pa-mgt-add-more'
  import adminPaDetailed from '@/components/pa/adminPa'
  import dateBox from '@/components/date-box'

  export default {
    name: 'pa',
    data () {
      return {
        LEVELS: config.getStorage('PA_LEVELS'),
        TYPES: config.getStorage('PA_TYPES'),
        levels: [],
        types: [],
        currentPage: 1,
        count: 0,
        totalRecs: '',
        pageSize: 10,
        pageVo: {
          'prevText': '<<',
          'nextText': '>>'
        },
        pa: {},
        paList: [],
        addPaBox: false,
        loading: false,
        paVo: {},
        paVos: {},
        loginPopup: false,
        deptName: '',
        addMoreBox: false,
        adminBox: false,
        detail: false,
        message: ''
      }
    },
    components: {
      loginPopup,
      paginate,
      paMgtAdd,
      paMgtAddMore,
      adminPaDetailed,
      dateBox
    },
    watch: {
      '$route' () {
        this.refresh()
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.LEVELS.unshift({'label': '全部', 'value': ''})
        this.TYPES.unshift({'label': '全部', 'value': ''})
        this.refresh()
      })
    },
    methods: {
      refresh () {
        if (this.$route.query.detail) {
          this.detail = this.$route.query.detail
        } else {
          this.detail = this.$route.query.detail
        }
        this.pa.to = this.moment().format('YYYY-MM-DD')
        this.pa.from = this.moment().subtract(6, 'd').format('YYYY-MM-DD')
        this.getPaList('init')
      },
      getLevels (value) {
        this.levels = value
      },
      getTypes (value) {
        this.types = value
      },
      receiveDate (date) {
        this.pa.from = date.from
        this.pa.to = date.to
      },
      getFile (event) {
        this.file = event.target.files[0]
        console.log(this.file)
        event.preventDefault()
        let formData = new FormData()
        formData.append('file', this.file)
        return this.axios({
          method: 'post',
          data: formData,
          url: '/api/pa/mgt/read-excel',
          headers: {'appType': 'web', 'appid': 'thor'}
        }).then((response) => {
          var data = response.data
          this.$refs.file.value = ''
          if (data.type === 1) {
            this.paVos = data.result
            this.addMoreBox = true
          } else {
            this.$message.error('请选择正确的文件')
          }
        }).catch((error) => {
          this.$refs.file.value = ''
          this.$message.error(error)
        })
      },
      getPaList (approach) {
        this.message = ''
        this.loading = true
        if (this.levels) {
          this.pa.level = this.levels[0]
        }
        if (this.types) {
          this.pa.type = this.types[0]
        }
        this.axios({
          method: 'post',
          data: this.pa,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/pa/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.paList = data.result.resultList
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
      createPaMgt () {
        this.paVo = {}
        this.addPaBox = true
      },
      closeBox () {
        this.addPaBox = false
        this.getPaList('query')
      },
      closeMoreBox () {
        this.addMoreBox = false
        this.getPaList('query')
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getPaList()
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      admin (infoMgt) {
        this.adminDetaileds = infoMgt
        this.adminBox = true
      },
      closeAdminBox (data) {
        this.adminBox = false
        this.getPaList(data)
      }
    }
  }
</script>

<style scoped>
  .help{
    margin-left: 2px;
    width: 20px;
    height:20px;
  }
  .help img {
    width: 100%;
    height: 100%;
    margin-bottom: -3px;
  }
</style>
