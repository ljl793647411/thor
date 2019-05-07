<template>
  <div id="app" :class="{'app': $route.path !== '/'}">
    <div class="head-title" v-if="$route.path !== '/'">
      <div class="head-title-inner-width">数据综合运用平台</div>
    </div>
    <div class="nav-box" v-if="$route.path !== '/'">
      <div v-if="route">
        <user-nav :loginResult='loginResult' @changeRoute='changeRoute'></user-nav>
      </div>
    </div>
    <div class="content-box" :class="{'login-width': $route.path === '/'}">
      <div class="content-inner-width" :class="{'login-width': $route.path === '/'}">
        <router-view class="main" @setLoginInfo='onLoginSuccessed' @getLocalStorage='initialize' @changeRoute='changeRoute'/>
      </div>
    </div>
    <footer v-if="$route.path !== '/'">
      版权所有©2014-2018 西安铁路局西安机务段 上海帝仪科技有限公司 联合研制
    </footer> 
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/components/config'
import userNav from '@/components/user-nav'
export default {
  name: 'app',
  data () {
    return {
      loginResult: '',
      route: true
    }
  },
  components: {
    config,
    userNav
  },
  mounted () {
    this.$nextTick(() => {
      this.initialize()
    })
  },
  methods: {
    /* mainifest.jsonmainifest.json
     * 每次刷新页面或者页面跳转到登入页面（不论最终是否停留在登入页面），都会进入这个方法
     */
    initialize () {
      this.loginResult = config.getStorage('loginResult')
      console.log('get "loginResult" from localStroage: ', this.loginResult)
      if (this.loginResult) {
        this.rebuildData()
      } else {
        this.$router.push({'path': '/'})
      }
    },
    rebuildData () {
      this.axios.defaults.headers.get['AppType'] = this.axios.defaults.headers.post['AppType'] = 'web'
      this.axios.defaults.headers.get['Appid'] = this.axios.defaults.headers.post['Appid'] = 'thor'
      this.axios.defaults.headers.get['accessToken'] = this.axios.defaults.headers.post['accessToken'] = this.loginResult.token
      let privileges = []
      if (this.loginResult.privileges) {
        this.loginResult.privileges.forEach(function (privilege, index) {
          privileges.push(privilege.code)
        })
      }
      config.setStorage('PRIVILEGES', privileges)
      // console.log('config.privileges: ', config.privileges)
    },
    /*
     * 登录成功后的回调方法
     */
    onLoginSuccessed (result) {
      console.log('登录成功', result)
      config.setStorage('loginResult', result)
      this.loginResult = result
      this.rebuildData()
      // 初始化那些通过API获取的常量
      // 0: 请求url, 1: result data中的数据属性名, 2: local storage key, 3: 处理数据时的回调函数（可以没有）
      let items = [
        ['/api/driver-vod/view/types', 'type1s', 'DRIVER_VOD_TYPES', function (value) {
          if (value) {
            value.splice(0, 0, { 'value': '', 'label': '全部', 'children': null })
          }
          return value
        }],
        ['/api/driver-vod/view/lkj-types', 'type1s', 'LKJ_TYPES', function (value) {
          if (value) {
            value.splice(0, 0, { 'value': '', 'label': '全部', 'children': null })
          }
          return value
        }],
        ['/api/driver-vod/view/eoas-types', 'types', 'EOAS_TYPES', function (value) {
          if (value) {
            value.splice(0, 0, { 'value': '', 'label': '全部' })
          }
          return value
        }],
        ['/api/om-vod/view/types', 'types', 'OM_VOD_TYPES'],
        ['/api/run-info/view/cates', 'types', 'RUN_INFO_CATES'],
        ['/api/run-info/view/types', 'types', 'RUN_INFO_TYPES'],
        ['/api/pa/view/levels', 'levels', 'PA_LEVELS'],
        ['/api/pa/view/types', 'types', 'PA_TYPES'],
        ['/api/ts-daily-summary/view/ts-codes', '', 'TS_CODES'],
        ['/api/driver-vod/mgt/tpls', 'list', 'DRI_VOD'],
        ['/api/om-vod/mgt/tpls', 'list', 'OM_VOD'],
        ['/api/sys-config/view/list?groupCode=BIZ-DATA-EDIT-TIME-LIMIT', 'list', 'EDIT_TIME_LIMITS', function (value) {
          if (value) {
            let map = {}
            value.forEach(function (item, index) {
              map[item.code] = item.value1
            })
            return map
          }
          return value
        }],
        ['/api/sys-config-group/mgt/list-all', 'resultList', 'SYS_CONFIG_GROUPS']
      ]
      items.forEach(function (item) {
        axios({
          method: 'get',
          url: item[0]
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            var value
            if (item[1] === '') {
              value = data.result
            } else {
              value = data.result[item[1]]
            }
            if (item[3]) {
              value = item[3](value)
            }
            config.setStorage(item[2], value)
          }
        })
      })
    },
    changeRoute (route) {
      console.log('changeRoute: ', route)
      if (route.path === '/') {
        this.route = false
      } else {
        this.route = true
      }
    }
  }
}
</script>

<style>
/* element loading样式 */
.el-loading-mask {
  position: fixed;
}


body{
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
ul, li {
  padding: 0;
  margin: 0;
  list-style: none;
}
#app {
  height: 100%;
  width: 100%;
  background-image: url('../static/bj.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.login-width {
  padding: 0 !important;
  width: 100% !important;
  margin: 0 !important;
}
.content-inner-width,.nav-inner-width {
  width: 1291px;
  height: auto;
  margin: 0 auto; 
  position: relative;
}
.content-inner-width {
  min-height: calc(100vh - 139px);
  padding: 0 55px 100px;
  box-sizing: border-box;
  background: rgba(0,0,0,0.5);
}
.head-title {
  width: 100%;
  height: 40px;
  background: #252525;
  position: fixed;
  top: 0;
  z-index: 100;
}
.nav-box {
  width: 100%;
  height: 68px;
  background: #e6e6e6;
  position: fixed;
  top: 40px;
  z-index: 100;
}
.content-box {
  margin-top: 108px;
}
.head-title-inner-width {
  width: 1291px;
  height: auto;
  line-height: 40px;
  font-size:18px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color: #fff;
  margin: 0 auto;
  text-align: center;
}
footer {
  width: 100%;
  height: 31px;
  position: relative;
  bottom: 0;
  left: 0;
  line-height: 31px;
  text-align: center;
  font-size:12px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgba(255,255,255,1);
  background: rgba(0,0,0,0.5);
}
.cursor {
  cursor: pointer;
}
.cursor-hover:hover {
  background: #00BBEE;
  color: #fff;
}
a {
  text-decoration: none;
  color: #1A1A1A;
}
.table {
  font-size:14px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgba(255,255,255,1);
  line-height:30px;
}
.table table ,.table tr th ,.table tr td {
  border: 1px solid #fff;
  text-align: center;
  line-height: 30px;
  border-collapse: collapse;
}
.table table {
  width: 100%;
}
.table tr th {
  background-color: rgba(0,0,0,0.5);
  color: #fff;
}
.table tr td {
  background-color: rgba(255,255,255,1);
  color: #000;
  opacity: 0.8
}
.table .complex {
  background-color: rgba(0,0,0,1);
  color: #000;
  opacity: 0.8
}




/* 筛选框样式 */
.search {
  float: right;
  background-color: rgba(3,3,3,0.3);
  border: 1px solid rgba(201,201,201,1);
  border-radius: 5px;
  margin-top: 61px;
  margin-bottom: 49px;
  padding: 0 12px;
  box-sizing: border-box;
  line-height: 44px;
  color: #fff;
  font-size: 14px;
  font-family:'HiraginoSansGB-W3';
  font-weight:normal;
}
.search-child {
  float: left;
  margin-left: 15px;
}
.select-class {
  width: 120px;
  height: 33px;
  font-size: 14px;
  border-radius: 5px;
  line-height: 33px;
}
.search-input-class {
  width: 120px;
  height: 28px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 28px;
}

.search-switch {
  width: 100%;
  float: right;
  line-height: 44px;
  color: #fff;
  font-size: 14px;
  font-family:'HiraginoSansGB-W3';
  font-weight:normal;
  margin-bottom: 49px;
}
.search-switch-child {
  float: right;
  margin-right: 15px;
}
.upload-class {
  position: relative;
  overflow: hidden;
}

/* 位置样式 */
.float-left {
  float: left;
}
.relative {
  position: relative;
}

/* 文本换行样式 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box; 
  -webkit-box-orient:vertical;
}
.ellipsis1 {
  -webkit-line-clamp:1; 
}
.ellipsis2 {
  -webkit-line-clamp:2; 
}
.ellipsis3 {
  -webkit-line-clamp:3; 
}
.color-white {
  color: #fff; 
}


/* 特殊标识符号 */ 
.resp-work-no {
  color: red;
  text-shadow: 0 0 2px red;
}


/* 数据管理*/
.select-update-class {
  width: 200px;
  height: 33px;
  font-size: 14px;
  border-radius: 5px;
  line-height: 33px;
}
.mgt-update {
  width: 100%;
}
.mgt-update td input,.mgt-update td textarea {
  height: 28px;
  font-size: 14px;
  border-radius: 5px;
}
.mgt-update td input {
  line-height: 33px;
}
.mgt-update td textarea {
  line-height: 20px;
}

.add-button {
  margin-top: 20px; 
  float: right;
}
.warning,.prompt {
  color: red;
  font-size: 14px;
}
.audit img {
  width: 100%;
  height: 100%;
}
.audit {
  width: 20px;
  height: 20px;
}
.fileBtn {
  width: 97px;
  height: 33px;
  position: absolute;
  top: 12px;
  opacity: 0;
}


/* 司机模糊查询框样式 */
.resp-box {
 position: absolute;
 left: 12px;
 background: #000;
 z-index: 1;
 padding: 0 10px;
 max-height: 600px;
 overflow-y: auto;
 width: 170px;
}
.resp-box li:hover {
  transform: scale(1.1);
  background: #fff;
  color: #000;
}


/* 弹窗 */
/* 组织结构 */
.popup,.popup-excel,.popup-add,.popup-role,.popup-privilege,.popup-admin,.popup-analysis {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 400px;
  height: 520px;
  background-color: rgba(0,0,0,0.7);
  color: #fff;
  font-size:16px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  border: 1px solid rgb(201,201,201);
}
.zhezhao {
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.5);
}
.popup-head {
  width: 100%;
  height: 30px; 
  background: #fff;
  opacity: 0.8;
  text-align: center;
  line-height: 30px;
  font-size:16px;
  color: #000;
  font-family:SourceHanSansCN-Regular;
  font-weight:400;
}
.icon-remove {
  width: 16px;
  height: 16px;
  float: right;
  margin-right: 10px;
}
.icon-remove img {
  width: 100%;
  height: 100%;
}
.popup-search {
  padding: 20px;
}
.popup-input-background {
  background-color: rgba(0,0,0,0.5) !important;
  color: #fff;
}

.dri-box,.dri2-box {
  width: 273px;
  margin: 0 auto;
  font-size:16px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgba(229,229,229,1);
}
.tree-choose-box {
  width: 286px;
  height: 33px;
  border: 1px solid #d1d1d1;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-bottom: 20px;
}
.dri-tree,.privilege-box-tree {
  width: 286px;
  height: 300px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: rgba(253,253,253,0.2);
  overflow-y: scroll;
  overflow-x: hidden;
}
.popup-submit {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.oms-dept{
  border: 1px solid #ccc;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
  position: absolute;
  background: rgba(0,0,0,0.8);
  z-index: 111;
  left: 72px;
  width: 279px;
  border-radius: 5px;
}
.oms-dept li {
  padding: 3px 5px;
}
.oms-dept li:hover {
  color: #000;
  background-color: rgba(255,255,255,0.8);
}
.addIcon:before{
  border-top: 4px solid;
  content:"";
  display: block;
  position: relative;
  width: 16px;
  top: 13px;
  left: 7px;
}
.tree-node{
  line-height: 33px;
  text-align: center;
  background-color: rgba(229,229,229,1);
  font-size:18px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgba(0,0,0,1);
}
.addIcon{
  vertical-align: top;
  display: inline-block;
  width: 30px;
  cursor: pointer;
  top: 0;
  height: 30px;
  position: relative;
  text-align: center;
  color: #CCC;
}
.addIcon:after{
  border-left:4px solid;
  content:"";
  display: inline-block;
  position: relative;
  top: 3px;
  height: 16px;
}
.minusIcon:before{
  border-top: 4px solid;
  content:"";
  display: block;
  position: relative;
  width: 16px;
  top: 13px;
  left: 7px;
}
.minusIcon{
  vertical-align: top;
  display: inline-block;
  width: 30px;
  cursor: pointer;
  top: 0;
  height: 30px;
  position: relative;
  color: #CCC;
}

/* excel弹框 */
.popup-excel {
  width: 100%;
  max-height: 600px;
  overflow-y: scroll;
  z-index: 940;
}
.popup-excel .popup-head{
  position: fixed;
  z-index: 1;
  width: 1274px;
}
.excel-btn {
  position: fixed;
  margin-top: 50px;
  margin-left: 20px;
  z-index: 1;
}
.popup-excel input,.popup-excel textarea {
  font-size:12px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgba(0,0,0,1);
  border-radius: 5px;
}
.popup-excel .table {
  margin-top: 100px;
}


/* add弹框 */
.popup-add {
  width: 600px;
  max-height: 600px;
  overflow-y: scroll;
  z-index: 940;
  font-size:16px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgb(223, 223, 223);
}
.edit-table {
  padding: 20px 10px;
  margin-top: 20px;
}
.popup-add .popup-head{
  position: fixed;
  z-index: 100;
  width: 583px;
}
.edit-table tr {
  height: 50px;
}
.edit-table input {
  height: 33px;
  line-height: 33px;
  border-radius: 5px;
  padding: 0 5px;
}
.edit-table textarea {
  line-height: 33px;
  border-radius: 5px;
  padding: 0 5px;
}
.popup-add .popup-submit {
  margin-bottom: 20px;
}
.td-right {
  width: 20%;
  text-align: right;
}
.td-left {
  width: 75%;
  text-align: left;
}

/* 模糊查询样式 */
.search-box {
  position: absolute;
  background: #fff;
  color: #000;
  z-index: 100;
  padding: 0 10px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.search-box li:hover {
  background: #000;
  color: #fff;
}

/* 权限弹框 */
.popup-privilege {
  width: 800px;
  max-height: 600px;
  overflow-y: auto;
  z-index: 940;
  font-size:16px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgb(223, 223, 223);
}
.privilege-box-tree {
  height: 400px;
  width: 330px;
}
.privilege-box {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  padding: 30px 0 15px;
}
.privilege-tree {
  padding: 0 15px;
}
.privilege-tree-right {
  padding: 5px 15px;
}


/* 管理页面弹框 */
.popup-admin {
  width: 800px;
  max-height: 600px;
  overflow-y: scroll;
  z-index: 940;
  font-size:16px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgb(223, 223, 223);
}
.popup-admin .popup-head{
  position: fixed;
  z-index: 100;
  width: 787px;
}
.admin {
  width:600px;
  margin: 0 auto;
  margin-top: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
.admin-content {
  overflow: hidden;
}
.admin-content div {
  width: 50%;
  float: left;
  min-height: 33px;
  line-height: 33px;
  padding-left: 10px;
  box-sizing: border-box;
}
.admin-content .admin-last-child {
  width: 100%;
}
.title-th {
  margin: 10px auto;
  width:100%;
  height:40px;
  background:rgba(253,253,253,0.5);
  border-left: 10px solid rgba(253,253,253,0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  box-sizing: border-box;
}
.title-th-left {
  margin-left: 10px;
}
.title-th-right {
  margin-right: 10px;
}
.title-td {
  font-size: 14px;
  color: #ccc;
}
/* 分析追踪弹框 */
.popup-analysis {
  width: 600px;
  z-index: 950;
  overflow-y: scroll;
  padding: 0 0 20px;
}
.popup-analysis .popup-head {
  width: 587px;
  position: fixed;
  z-index: 950;
}



.popup-info-msg {
  margin: 0 auto;
  width: 450px;
  height: 60px;
  margin-top: 50px;
}
.popup-info-msg div {
  line-height: 30px;
}
.info-msg {
  width: 100%;
  float: left;
  color: #fff;
  font-size:16px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgb(223, 223, 223);
}


/* 图标样式 */
.h-chart-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.h-chart{
  margin-bottom: 50px;
}
.h3 {
  color: #fff;
}
.tacData {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}
.h-chart-title {
  color: #fff;
}
</style>