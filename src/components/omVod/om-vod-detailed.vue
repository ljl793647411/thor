<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :type="true" :from="from" :to="to" :timeType="timeType"  class="search-child"></date-box>
      <div class="search-child">
        <label for="vodType">项点：</label>
        <el-cascader
          :options="vodTypeList"
          v-model="omType"
          @change="getOmType">
        </el-cascader>
      </div>
      <div class="search-child">
        <label>组织：</label>
        <input type="text" v-model="deptName" @click="selectT" class="search-input-class">
      </div>
      <div class="search-child">
        <label for="detail">详情：</label>
        <input type="text" v-model="omDetailed.detail" class="search-input-class"/>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getOmVodDetailed('query')">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table">
      <table>
        <thead>
          <th>机车</th>
          <th>责任岗位</th>
          <th>发生时间</th>
          <th>项点</th>
          <th>详情</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in omVodDetailed" :class="{complex: index % 2 === 0}">
            <td :title="LM_TYPES[item.lmType] + '，型号' + item.lmModel" v-text="item.lmNo"></td>
            <td>
              <div :title="item.omtsName + '>' + item.omtName + '>' + item.ompName">{{ item.ompName }}</div>
            </td>
            <td>
              <div v-text="item.timeDt"></div>
            </td>
            <td>
              <div v-text="item.vodType"></div>
            </td>
            <td style="max-width:400px;">
              <div class="ellipsis ellipsis2" :title="item.detail" v-text="item.detail"></div>
            </td>
          </tr>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div v-if="message">
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1'></paginate>
    </div>
    <div v-if="omBox">
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
  import paginate from '@/components/paginate'
  import dateBox from '@/components/date-box'

  export default {
    name: 'omVodDetailed',
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
        omBox: false,
        loading: false,
        omVodDetailed: [],
        omDetailed: {
          respWorkNos: []
        },
        driver: '',
        from: '',
        to: '',
        timeType: '',
        msg: '', // 报错信息
        code: '',
        vodTypeList: config.getStorage('OM_VOD_TYPES'),
        omType: [],
        vodType: '',
        loginPopup: false,
        deptName: '',
        LM_TYPES: config.LM_TYPES,
        message: ''
      }
    },
    components: {
      tsOverhaulBox,
      loginPopup,
      paginate,
      dateBox
    },
    created () {
      this.vodTypeList.unshift({'value': '', 'label': '全部'})
      if (!this.$route.query.from) {
        this.omDetailed.to = this.moment().format('YYYY-MM-DD')
        this.omDetailed.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
      } else {
        this.to = this.$route.query.to
        this.from = this.$route.query.from
        this.timeType = 'C'
        this.omDetailed.deptType = this.$route.query.deptType
        if (this.$route.query.deptCode) {
          this.omDetailed.deptCode = this.$route.query.deptCode
        }
        if (this.$route.query.deptCodes) {
          this.omDetailed.deptCodes = this.$route.query.deptCodes
        }
        this.deptName = this.$route.query.deptNames
        this.omDetailed.vodType = this.$route.query.vodType
        if (this.omDetailed.vodType) {
          this.omType.push(this.omDetailed.vodType)
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getOmVodDetailed()
      })
    },
    methods: {
      getOmType (value) {
        this.omType = value
      },
      receiveDate (date) {
        this.omDetailed.from = date.from
        this.omDetailed.to = date.to
      },
      getOmVodDetailed (approach) {
        this.message = ''
        this.loading = true
        if (this.omType && this.omType.length !== 0) {
          this.omDetailed.vodType = this.omType[0]
        }
        if (!this.omDetailed.deptCodes || this.omDetailed.deptCodes.length === 0) {
          delete this.omDetailed.deptCodes
          delete this.omDetailed.deptType
        }
        this.axios({
          method: 'post',
          data: this.omDetailed,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/om-vod/view/list-detail'
        }).then((response) => {
          this.loading = false
          let data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.omVodDetailed = data.result.resultList
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
        this.getOmVodDetailed()
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      selectT () {
        this.omBox = true
      },
      deptBoxClose (result) {
        if (result.depts !== '') {
          delete this.omDetailed.deptCode
        }
        this.omDetailed.deptCodes = []
        let deptCodesName = []
        this.omDetailed.deptType = result.deptType
        if (this.omDetailed.deptType === 'DR') {
          for (let i in result.depts) {
            this.omDetailed.deptCodes.push(result.depts[i].workNo)
            deptCodesName.push(result.depts[i].name)
          }
        } else {
          for (let i in result.depts) {
            this.omDetailed.deptCodes.push(result.depts[i].code)
            deptCodesName.push(result.depts[i].name)
          }
        }
        this.deptName = deptCodesName.join(',')
        this.omBox = false
      }
    }
  }
</script>

<style scoped>

</style>
