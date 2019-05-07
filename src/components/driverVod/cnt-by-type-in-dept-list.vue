<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search" style="margin-bottom: 0;">
      <date-box @sendDate="receiveDate" :type="true" :from="dri.from" :to="dri.to" class="float-left"></date-box>
      <div class="search-child">
        <label for="dept">组织：</label>
        <input type="text" name="driver" id="driver" v-model="deptCodesName" :title="deptCodesName" @click="selectT" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="createdBy">来源：</label>
        <el-select v-model="sources" multiple collapse-tags placeholder="请选择">
          <el-option
            v-for="item in VOD_SOURCES"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getDeptList">查 询</el-button>
      </div>
    </div>
    <div class="search-switch">
      <div class="search-switch-child">
        <label for="showType2s">显示二级项点：</label>
        <el-switch
          v-model="showType2s"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :disabled="switchShow">
        </el-switch>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div class="table" style="margin-top: 23px;" v-if="!message">
      <table>
        <thead>
        <tr>
          <th :rowspan="showType2s ? 2 : 1" style="min-width: 130px;" v-text="deptSummary.deptTypeName"></th>
          <th :rowspan="showType2s ? 2 : 1">问题合计</th>
          <th v-for="(t1, i) in deptSummary.t1" :colspan="showType2s ? t1.t2.length : 1" v-text="t1.name"></th>
        </tr>
        <tr v-if="showType2s">
          <template v-for="(t1, i) in deptSummary.t1">
            <th v-for="(t2, j) in t1.t2" v-text="t2.name"></th>
          </template>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(dept, index) in deptList" :class="{complex: index % 2 === 0}">
          <td v-text="dept.name"></td>
          <td @click="jumpDetailList(dept.code, dept.name)" v-text="dept.total" class="data"></td>
          <template v-if="showType2s" v-for="(t1, i) in dept.t1">
            <td @click="jumpDetailList(dept.code, dept.name, t1.name, t2.name)" v-for="(t2, j) in t1.t2" v-text="t2.cnt" class="data"></td>
          </template>
          <td v-if="!showType2s" @click="jumpDetailList(dept.code, dept.name, t1.name)" v-for="(t1, i) in dept.t1" v-text="t1.cnt" class="data"></td>
        </tr>
        <tr v-if="deptSummary.total || deptSummary.total === 0">
          <td :rowspan="showType2s ? 2 : 1">合计</td>
          <td @click="jumpDetailList()" rowspan="2" v-text="deptSummary.total" class="data"></td>
          <template v-if="showType2s" v-for="(t1, i) in deptSummary.t1">
            <td @click="jumpDetailList(null, null, t1.name, t2.name)" v-for="(t2, j) in t1.t2" v-text="t2.cnt" class="data"></td>
          </template>
          <td v-if="!showType2s" @click="jumpDetailList(null, null, t1.name)" v-for="(t1, i) in deptSummary.t1" v-text="t1.cnt" class="data"></td>
        </tr>
        <tr v-if="showType2s">
          <td @click="jumpDetailList(null, null, t1.name)" v-for="(t1, i) in deptSummary.t1" :colspan="t1.t2.length" v-text="t1.cnt" class="data"></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="dri-choose" v-if="deptBoxShow">
      <dept-box @getDeptCode='deptBoxClose'></dept-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import deptBox from '@/components/dept-box'
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import dateBox from '@/components/date-box'

  export default {
    name: 'opVodDeptList',
    data () {
      return {
        dri: {
          deptType: 'TS',
          from: '',
          to: '',
          deptCodes: []
        },
        VOD_SOURCES: config.VOD_SOURCES,
        sources: [],
        loginPopup: false,
        loading: false,
        deptSummary: {},
        deptList: [],
        deptCodesName: '',
        showType2s: false,
        deptBoxShow: false,
        switchShow: false,
        message: '',
        ldVo: {},
        tsCodes: [],
        ttCodes: []
      }
    },
    watch: {
      sources: 'changeSwitch'
    },
    components: {
      deptBox,
      loginPopup,
      dateBox
    },
    created () {
      if (this.$route.params.queryVo) {
        this.dri = this.$route.params.queryVo
        this.sources = ['A', 'V']
        this.getDeptList()
      } else {
        this.dri.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
        this.dri.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
        this.sources = ['A', 'V']
        this.getLdVo()
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.$route.query.from) {
          this.dri = {
            from: this.$route.query.from,
            to: this.$route.query.to,
            deptType: this.$route.query.deptType,
            deptCodes: this.$route.query.deptCodes
          }
          if (typeof (this.$route.query.sources) === 'string' && this.$route.query.sources) {
            let sources = []
            sources.push(this.$route.query.sources)
            this.sources = sources
          } else {
            this.sources = this.$route.query.sources
          }
          if (this.sources.includes('LKJ')) {
            this.switchShow = false
            this.showType2s = true
          }
          this.getDeptList()
        }
      })
    },
    methods: {
      changeSwitch () {
        if (this.sources.length === 1 && this.sources.includes('EOAS')) {
          this.switchShow = true
        } else {
          this.switchShow = false
        }
      },
      receiveDate (date) {
        this.dri.from = date.from
        this.dri.to = date.to
      },
      jumpDetailList (deptCode, deptName, vodType1, vodType2) {
        let query = {
          deptType: this.deptSummary.deptType,
          deptCode: deptCode,
          deptNames: deptName,
          from: this.dri.from,
          to: this.dri.to,
          vodType1: vodType1,
          vodType2: vodType2,
          sources: this.sources
        }
        // 合计行的单元格没有deptCode，取请求的deptCodes
        if (!deptCode) {
          let deptNames = []
          for (let i in this.deptList) {
            deptNames.push(this.deptList[i].name)
          }
          query['deptNames'] = deptNames.join(',')
          query['deptCodes'] = this.dri.deptCodes
        }
        console.log('jump to driver vod detail list: ', query)
        this.$router.push({
          path: '/driver-vod-list',
          query: query
        })
      },
      getLdVo () { // 获取this.ldVo
        this.axios({
          method: 'get',
          params: {'type': 1},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.ldVo = data.result.tree
            this.getDeptList()
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getDeptList () {
        this.message = ''
        if (this.sources && this.sources.length !== 0) {
          if (this.sources.length <= 2) {
            if (this.sources.length === 2) {
              if (this.sources.includes('A') && this.sources.includes('V')) {
                this.dri.sources = this.sources
              } else {
                this.$message.error('如果选中两项，只能同时选中音频和视频')
                return
              }
            } else {
              this.dri.sources = this.sources
            }
          } else {
            this.$message.error('来源项点不能多于两项')
            return
          }
        } else {
          this.$message.error('请选择来源')
          return
        }
        if (this.sources.length === 1 && this.sources.includes('LKJ')) {
          this.switchShow = false
          this.showType2s = true
        }
        if (this.sources.length === 1 && this.sources.includes('EOAS')) {
          this.switchShow = true
          this.showType2s = false
        }
        if (this.dri.deptType === 'TS' && this.dri.deptCodes.length === 0) {
          for (let i in this.ldVo.children) {
            this.dri.deptCodes.push(this.ldVo.children[i].code)
          }
        }
        this.loading = true
        this.axios({
          method: 'post',
          data: this.dri,
          url: '/api/driver-vod/view/vod-cnt-by-type-in-dept'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            if (data.result.list.length !== 0) {
              this.deptList = data.result.list
              this.deptSummary = data.result.summary
            } else {
              this.message = config.LIST_NO_DATA_TEXT
            }
          } else if (data.type === 4001) {
            this.$message.error('指定的组织结构数量过多，请缩小范围')
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
      deptBoxClose (result) {
        console.log('result:', result)
        this.dri.deptCodes = []
        let deptCodesName = []
        this.dri.deptType = result.deptType
        if (this.dri.deptType === 'DR') {
          for (let i in result.depts) {
            this.dri.deptCodes.push(result.depts[i].workNo)
            deptCodesName.push(result.depts[i].name)
          }
        } else {
          for (let i in result.depts) {
            this.dri.deptCodes.push(result.depts[i].code)
            deptCodesName.push(result.depts[i].name)
          }
        }
        this.deptCodesName = deptCodesName.join(',')
        this.deptBoxShow = false
      },
      selectT () {
        this.deptBoxShow = true
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      }
    }
  }
</script>

<style scoped>
  
</style>
