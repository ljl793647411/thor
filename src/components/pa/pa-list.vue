<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :from="from" :to="to" :timeType="timeType" :type="true" class="float-left"></date-box>
      <div class="search-child">
        <div class="block">
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
        <el-button type="primary" icon="el-icon-search" @click="getPaList('query')">查 询</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white"></h4>
    <div v-if="!message" class="table" style="margin-top: 23px;">
      <table style="width: 100%;" class="">
        <thead>
        <tr>
          <th style="width:8%;">检查时间</th>
          <th style="width:10%;">责任单位</th>
          <th style="width:4%;">责任人</th>
          <th style="width:10%;">检查地点</th>
          <th style="width:15%;">问题点代码</th>
          <th style="width:23%;">问题内容</th>
          <th style="width:4%;">级别</th>
          <th style="width:6%;">性质</th>
          <th style="width:23%;">整改情况</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(mgt, index) in paList" :class="{trbg: index % 2 === 0}">
          <td v-text="mgt.date"></td>
          <td>
            <div v-text="mgt.respDept" :title="mgt.respDept" class="ellipsis ellipsis2"></div>
          </td>
          <td v-text="mgt.respName"></td>
          <td v-text="mgt.location"></td>
          <td v-text="mgt.problemCode" :title="mgt.problemCode"></td>
          <td>
            <div v-text="mgt.problemDesc" :title="mgt.problemDesc" class="ellipsis ellipsis2"></div>
          </td>
          <td v-text="mgt.level"></td>
          <td v-text="mgt.type"></td>
          <td>
            <div v-if="mgt.improve" v-text="mgt.improve" :title="mgt.improve" class="ellipsis ellipsis2"></div>
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
  </div>
</template>

<script>
  import config from '@/components/config'
  import paginate from '@/components/paginate'
  import loginPopup from '@/components/login-popup'
  import dateBox from '@/components/date-box'

  export default {
    name: 'pa',
    data () {
      return {
        LEVELS: config.getStorage('PA_LEVELS'),
        levels: [],
        types: [],
        TYPES: config.getStorage('PA_TYPES'),
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
        pa: {},
        paList: [],
        loginPopup: false,
        loading: false,
        respWorkNoList: [],
        message: ''
      }
    },
    components: {
      loginPopup,
      paginate,
      dateBox
    },
    created () {
      this.LEVELS.unshift({'label': '全部', 'value': ''})
      this.TYPES.unshift({'label': '全部', 'value': ''})
      this.refresh()
    },
    mounted () {
      this.$nextTick(() => {
        this.getPaList()
      })
    },
    methods: {
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
      refresh () {
        if (this.$route.query.from) {
          this.levels.push(this.$route.query.level)
          if (this.$route.query.type) {
            this.types.push(this.$route.query.type)
          }
          this.to = this.$route.query.to
          this.from = this.$route.query.from
          this.timeType = 'C'
        } else {
          this.pa.to = this.moment().format('YYYY-MM-DD')
          this.pa.from = this.moment().subtract(6, 'd').format('YYYY-MM-DD')
        }
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
          url: '/api/pa/view/list'
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
      }
    }
  }
</script>

<style scoped>


</style>
