<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :type="true" :from="dri.from" :to="dri.to" class="search-child"></date-box>
      <div class="search-child">
        <label for="dept">组织：</label>
        <input type="text" name="workshop" id="workshop" v-model="deptCodesName" :title="deptCodesName" @click="selectT" class="search-input-class"/>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getDeptList">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table">
      <table>
        <thead>
	        <tr>
	          <th style="min-width: 110px;" v-text="deptSummary.deptTypeName"></th>
            <th @click="">问题合计</th>
            <th v-for="(t1, i) in deptSummary.t1" v-text="t1.name"></th>
	        </tr>
        </thead>
        <tbody>
        <tr v-for="(dept, index) in deptList" :class="{complex: index % 2 === 0}">
          <td v-text="dept.name"></td>
          <td @click="jumpDetailList(dept.code,dept.name)" v-text="dept.total" class="cursor"></td>
          <td @click="jumpDetailList(dept.code,dept.name,t1.name)" v-for="(t1, j) in dept.t1" v-text="t1.cnt" class="cursor"></td>
        </tr>
        <tr v-if="deptSummary.total || deptSummary.total === 0">
          <td style="width: 5.26%">合计</td>
          <td @click="jumpDetailList()" v-text="deptSummary.total" class="cursor"></td>
          <td @click="jumpDetailList(null,null,t1.name)" v-for="(t1, i) in deptSummary.t1" v-text="t1.cnt" class="cursor"></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="tsBoxShow">
      <ts-overhaul-box @getDeptCode='deptBoxClose'></ts-overhaul-box>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import tsOverhaulBox from '@/components/ts-overhaul-box'
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import dateBox from '@/components/date-box'

  export default {
    name: 'omVodDeptList',
    data () {
      return {
        dri: {
          deptType: 'OMTS',
          from: '',
          to: '',
          deptCodes: []
        },
        loginPopup: false,
        loading: false,
        deptSummary: {},
        deptList: [],
        deptCodesName: '',
        tsBoxShow: false,
        message: '',
        tsVo: {}
      }
    },
    components: {
      tsOverhaulBox,
      loginPopup,
      dateBox
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
          this.getDeptList()
        } else {
          this.dri.to = this.moment().subtract(1, 'd').format('YYYY-MM-DD')
          this.dri.from = this.moment().subtract(7, 'd').format('YYYY-MM-DD')
          this.getLdVo()
        }
      })
    },
    methods: {
      receiveDate (date) {
        this.dri.from = date.from
        this.dri.to = date.to
      },
      jumpDetailList (deptCode, deptName, vodType) {
        let query = {
          deptType: this.deptSummary.deptType,
          deptCode: deptCode,
          deptNames: deptName,
          from: this.dri.from,
          to: this.dri.to,
          vodType: vodType
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
        console.log('jump to om vod detail list: ', query)
        this.$router.push({
          path: '/om-vod-detailed',
          query: query
        })
      },
      getLdVo () { // 获取this.tsVo
        this.axios({
          method: 'get',
          params: {'type': 2},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.tsVo = data.result.tree
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
        this.loading = true
        if (this.dri.deptType === 'OMTS' && this.dri.deptCodes.length === 0) {
          for (let i in this.tsVo.children) {
            this.dri.deptCodes.push(this.tsVo.children[i].code)
          }
        }
        this.axios({
          method: 'post',
          data: this.dri,
          url: '/api/om-vod/view/vod-cnt-by-type-in-dept'
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
        this.dri.deptCodes = []
        let deptCodesName = []
        this.dri.deptType = result.deptType
        for (let i in result.depts) {
          this.dri.deptCodes.push(result.depts[i].code)
          deptCodesName.push(result.depts[i].name)
        }
        this.deptCodesName = deptCodesName.join(',')
        this.tsBoxShow = false
      },
      selectT () {
        this.tsBoxShow = true
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
