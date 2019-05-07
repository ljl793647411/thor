<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :type="true" :from="from" :to="to" :timeType="timeType" class="search-child"></date-box>
      <div class="search-child">
        <label>组织：</label>
        <input type="text" v-model="deptName" @click="changeBox" class="search-input-class">
      </div>
      <div class="search-child relative">
        <label for="respWorkNo">责任人：</label>
        <input type="text" v-model="driver" name="respWorkNo" @focus="respBoxChange" @blur="respBoxClose" class="search-input-class"/>
        <ul v-if="respWorkNoList.length !== 0 && respBox" class="resp-box">
          <li class="cursor" v-for="resp in respWorkNoList" :key="resp.sid" @click="getResp(resp)">{{ resp.name + ' —— ' + resp.workNo }}</li>
        </ul>
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
      <div class="search-child" v-show="show">
        <label for="createdBy">项点：</label>
        <span class="block">
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            change-on-select
            @change="handleChange"
            size="medium">
          </el-cascader>
        </span>
      </div>
      <div class="search-child">
        <label for="detail">两违详情查询：</label>
        <input type="text" v-model="dsDetailed.detail" class="search-input-class"/>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getDsVodDetailed('query')">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="message"></h4>
    <div class="table" style="margin-top: 23px;" v-if="!message">
      <table>
        <thead>
        <th colspan="6">值乘信息</th>
        <th>时间地点来源</th>
        <th>项点</th>
        <th>详情</th>
        </thead>
        <tbody>
        <template v-for="(item, index) in dsVodDetailed">
          <tr :class="{complex: index % 2 === 0}">
            <td colspan="2" title="值乘日期" v-text="item.trainDt"></td>
            <td colspan="2" title="值乘车次" v-text="item.trainNo"></td>
            <td colspan="2" :title="LM_TYPES[item.lmType] + '，型号' + item.lmModel" v-text="item.lmNo"></td>
            <td title="发生时间" v-text="item.time"></td>
            <td rowspan="3" v-text="item.vodType2 ? item.vodType1 + ' > ' + item.vodType2 : item.vodType1"></td>
            <td rowspan="3" class="detail" style="max-width:400px;">
              <div class="ellipsis ellipsis3" :title="item.detail" v-text="item.detail"></div>
            </td>
          </tr>
          <tr :class="{complex: index % 2 === 0}">
            <td colspan="3">
              <span v-if="item.respWorkNo === item.workNo1" class="resp-work-no" title="责任人">责</span>
              <span v-if="item.respWorkNo !== item.workNo1" v-text="'　'"></span>
              <span :title="item.workNo1 ?`【一位司机】${item.driverDeptPath1} > ${item.driverName1}（${item.workNo1}）`: `【一位司机】`" v-text="item.driverName1 + '（' + item.workNo1 + '）'"></span>
            </td>
            <td colspan="3">
              <span v-if="item.respWorkNo === item.workNo2" class="resp-work-no" title="责任人">责</span>
              <span v-if="item.respWorkNo !== item.workNo2" v-text="'　'"></span>
              <span :title="item.workNo2 ? `【二位司机】${item.driverDeptPath2} > ${item.driverName2}（${item.workNo2}）` : `【二位司机】`" v-text="item.workNo2 ? item.driverName2 + '（' + item.workNo2 + '）' : ''"></span>
            </td>
            <td style="max-width:200px;">
              <div class="ellipsis ellipsis1" :title="`【发生地点】${item.location}`" v-text="item.location"></div>
            </td>
          </tr>
          <tr :class="{complex: index % 2 === 0}">
            <td colspan="3">
              <span v-if="item.respWorkNo === item.workNo3" class="resp-work-no" title="责任人">责</span>
              <span v-if="item.respWorkNo !== item.workNo3" v-text="'　'"></span>
              <span :title="item.workNo3 ? `【三位司机】${item.driverDeptPath3} > ${item.driverName3}（${item.workNo3}）` : `【三位司机】`" v-text="item.workNo3 ? item.driverName3 + '（' + item.workNo3 + '）' : ''"></span>
            </td>
            <td colspan="3">
              <span v-if="item.respWorkNo === item.workNo4" class="resp-work-no" title="责任人">责</span>
              <span v-if="item.respWorkNo !== item.workNo4" v-text="'　'"></span>
              <span :title="item.workNo4 ? `【添乘司机】${item.driverDeptPath4} > ${item.driverName4}（${item.workNo4}）` : `【添乘司机】`" v-text="item.workNo4 ? item.driverName4 + '（' + item.workNo4 + '）' : ''"></span>
            </td>
            <td :title="`【来源】${VOD_SOURCE_LIST[item.source]}`" v-text="VOD_SOURCE_LIST[item.source]"></td>
          </tr>
        </template>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div v-if="message">
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1' @changePage='changePage'></paginate>
    </div>
    <div class="dri-choose" v-if="dsBox">
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
  import paginate from '@/components/paginate'
  import dateBox from '@/components/date-box'

  export default {
    name: 'dsVodDetailed',
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
        from: '',
        to: '',
        timeType: '',
        dsBox: false,
        dsVodDetailed: [],
        dsDetailed: {
          respWorkNos: []
        },
        driver: '',
        msg: '', // 报错信息
        code: '',
        loginPopup: false,
        respWorkNoList: [],
        respWorkNos: {
          deptCode: config.deptCode,
          deptType: config.deptType
        },
        respBox: false,
        loading: false,
        deptName: '',
        LM_TYPES: config.LM_TYPES,
        message: '',
        VOD_SOURCES: config.VOD_SOURCES,
        VOD_SOURCE_LIST: config.VOD_SOURCE_LIST,
        options: [],
        vodList: config.getStorage('DRIVER_VOD_TYPES'),
        LKJList: config.getStorage('LKJ_TYPES'),
        EOASList: config.getStorage('EOAS_TYPES'),
        selectedOptions: [],
        sources: [],
        show: true
      }
    },
    components: {
      loginPopup,
      paginate,
      deptBox,
      dateBox
    },
    watch: {
      sources: 'changeCategory',
      driver: 'changeRespWorkNos'
    },
    created () {
      if (this.$route.query.runInfoSid) {
        this.dsDetailed.runInfoSid = this.$route.query.runInfoSid
        this.sources = ['A', 'V', 'LKJ', 'EOAS']
        this.from = this.$route.query.from
        this.to = this.$route.query.to
      } else if (this.$route.query.floodControlSid) {
        this.dsDetailed.runInfoSid = this.$route.query.floodControlSid
        this.sources = ['A', 'V', 'LKJ', 'EOAS']
        this.from = this.$route.query.from
        this.to = this.$route.query.to
      } else {
        if (!this.$route.query.from) {
          this.dsDetailed.to = this.moment().format('YYYY-MM-DD')
          this.dsDetailed.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
          this.sources = ['A', 'V', 'LKJ', 'EOAS']
        } else {
          this.to = this.$route.query.to
          this.from = this.$route.query.from
          this.timeType = 'C'
          this.dsDetailed.deptType = this.$route.query.deptType
          if (this.$route.query.deptCode) {
            this.dsDetailed.deptCode = this.$route.query.deptCode
          }
          if (this.$route.query.deptCodes) {
            this.dsDetailed.deptCodes = this.$route.query.deptCodes
          }
          this.deptName = this.$route.query.deptNames
          if (this.$route.query.sources) {
            this.sources = this.$route.query.sources
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.$route.query.vodType1) {
          this.dsDetailed.vodType1 = this.$route.query.vodType1
          this.selectedOptions.push(this.$route.query.vodType1)
        }
        if (this.$route.query.vodType2) {
          this.dsDetailed.vodType2 = this.$route.query.vodType2
          this.selectedOptions.push(this.$route.query.vodType2)
        }
        this.getDsVodDetailed()
      })
    },
    methods: {
      handleChange (value) {
        for (let i = 0; i < this.selectedOptions.length; i++) {
          this.dsDetailed.vodType1 = this.selectedOptions[0]
          this.dsDetailed.vodType2 = this.selectedOptions[1]
        }
      },
      changeCategory () {
        this.dsDetailed.vodType1 = ''
        this.dsDetailed.vodType2 = ''
        this.selectedOptions = []
        if (this.sources.length > 2) {
          this.show = false
        } else if (this.sources.length === 2) {
          if (this.sources.includes('A') && this.sources.includes('V')) {
            this.options = this.vodList
            this.show = true
          } else {
            this.show = false
          }
        } else {
          this.show = true
          if (this.sources.includes('A') || this.sources.includes('V')) {
            this.options = this.vodList
          } else if (this.sources.includes('LKJ')) {
            this.options = this.LKJList
          } else if (this.sources.includes('EOAS')) {
            this.options = this.EOASList
          } else {
            this.show = false
          }
        }
      },
      receiveDate (date) {
        this.dsDetailed.from = date.from
        this.dsDetailed.to = date.to
      },
      getDsVodDetailed (approach) {
        this.message = ''
        if (this.sources && this.sources.length !== 0) {
          this.dsDetailed.sources = this.sources
        } else {
          this.$message.error('请选择来源')
          return
        }
        this.loading = true
        if (!this.dsDetailed.deptCodes || this.dsDetailed.deptCodes.length === 0) {
          delete this.dsDetailed.deptCodes
        }
        this.axios({
          method: 'post',
          data: this.dsDetailed,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/driver-vod/view/list-detail'
        }).then((response) => {
          this.loading = false
          let data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.dsVodDetailed = data.result.resultList
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
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getDsVodDetailed()
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      changeBox () {
        this.dsBox = true
      },
      deptBoxClose (result) {
        if (result.depts !== '') {
          delete this.dsDetailed.deptCode
        }
        this.dsDetailed.deptCodes = []
        let deptCodesName = []
        this.dsDetailed.deptType = result.deptType
        if (this.dsDetailed.deptType === 'DR') {
          for (let i in result.depts) {
            this.dsDetailed.deptCodes.push(result.depts[i].workNo)
            deptCodesName.push(result.depts[i].name)
          }
        } else {
          for (let i in result.depts) {
            this.dsDetailed.deptCodes.push(result.depts[i].code)
            deptCodesName.push(result.depts[i].name)
          }
        }
        this.deptName = deptCodesName.join(',')
        this.dsBox = false
      },
      changeRespWorkNos () {
        if (encodeURI(this.driver).length < 2) {
          return
        }
        if (this.driver.length === 0) {
          this.respWorkNoList = []
        }
        this.respWorkNos.searchStr = this.driver
        setTimeout(() => {
          this.axios({
            method: 'get',
            params: this.respWorkNos,
            url: '/api/op/driver/view/search-by-name-work-no'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.respWorkNoList = data.result.list
            } else if (data.type === 401) { // 登入信息验证失败
              config.gotoLogin()
              this.loginPopup = true
            }
          }).catch((error) => {
            console.log(error)
          })
        }, 500)
      },
      getResp (resp) {
        this.driver = `${resp.name} （${resp.workNo}）`
        this.dsDetailed.respWorkNos.push(resp.workNo)
        this.respWorkNoList = []
        this.respBox = false
      },
      respBoxChange () {
        this.driver = ''
        this.dsDetailed.respWorkNos = []
        this.respBox = true
      },
      respBoxClose () {
        setTimeout(() => {
          this.respWorkNoList = []
          this.respBox = false
        }, 500)
      }
    }
  }
</script>

<style scoped>
 
</style>
