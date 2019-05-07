<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <div class="search">
      <date-box @sendDate="receiveDate" :type="true" class="search-child"></date-box>
      <div class="search-child">
        <label for="workNo">机车：</label>
        <el-cascader
          :options="LM_TYPE_LIST"
          v-model="lmType"
          @change="getLmType">
        </el-cascader>
      </div>
      <div class="search-child">
        <label for="createdBy">创建者工号：</label>
        <input type="text" name="createdBy" v-model="omVodMgtVo.createdBy" class="search-input-class"/>
      </div>
      <div class="search-child">
        <label for="vodType">分类：</label>
        <el-cascader
          :options="vodTypeList1"
          v-model="omType"
          @change="getOmType">
        </el-cascader>
      </div>
      <div class="search-child">
        <el-button type="primary" icon="el-icon-search" @click="getomVodMgtList('query')">查 询</el-button>
        <el-button type="primary" @click="createOmVodMgt" v-if="isEdit || isAdmin">新 增</el-button>
      </div>
    </div>
    <h4 v-if="message" v-text="message" class="color-white float-left" style="width: 100%;"></h4>
    <div v-if="!message" class="table">
      <table>
        <thead>
          <th v-if="isAudit">审核</th>
          <th>机车</th>
          <th>责任岗位</th>
          <th>发生时间</th>
          <th>项点</th>
          <th>详情</th>
          <th>创建者</th>
          <th>操作</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in omVodMgtList" :class="{complex: index % 2 === 0}">
            <td v-if="isAudit" class="audit" :title="item.commentCnt ? '已审核' : '未审核'"><img v-if="item.commentCnt" src="/static/audit.png" alt="" title="已审核"></td>
            <td :title="LM_TYPES[item.lmType] + '，型号' + item.lmModel" v-text="item.lmNo"></td>
            <td>
              <div :title="item.deptNamePath">{{ item.ompName }}</div>
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
            <td>
              <div :title="item.createdByWorkNo" v-text="item.createdByName"></div>
            </td>
            <td :key="item.sid">
              <el-button type="primary" @click="admin(item)">管 理</el-button>
              <el-dropdown @command="copy" v-if="isEdit || isAdmin">
                <el-button type="primary">
                  复 制
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="[1, item]">仅机车</el-dropdown-item>
                  <el-dropdown-item :command="[2, item]">仅两违</el-dropdown-item>
                  <el-dropdown-item :command="[3, item]">全部</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </td>
          </tr>
        </tbody>
      </table>
      <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
    </div>
    <div v-if="message">
      <paginate :pageVo='1' :pageSize='1' :totalRecs='0' :currentPage='1' :count='1'></paginate>
    </div>
    <div v-if="addOmVodMgtBox">
      <om-vod-mgt-add @closeBox='closeBox' :omVoMgt="omVoMgt"></om-vod-mgt-add>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="adminBox">
      <admin-om-detailed :adminDetaileds="adminDetaileds" @closeAdminBox='closeAdminBox'></admin-om-detailed>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import paginate from '@/components/paginate'
  import omVodMgtAdd from '@/components/omVod/om-vod-mgt-add'
  import loginPopup from '@/components/login-popup'
  import adminOmDetailed from '@/components/omVod/adminOm'
  import dateBox from '@/components/date-box'

  export default {
    name: 'omVodMgtList',
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
        omVodMgtVo: {},
        omVodMgtList: [],
        omType: [],
        lmType: [],
        addOmVodMgtBox: false,
        loading: false,
        omVoMgt: {},
        vodTypeList1: config.getStorage('OM_VOD_TYPES'),
        vodType: {},
        LM_TYPES: config.LM_TYPES,
        LM_TYPE_LIST: config.LM_TYPE_LIST,
        isEdit: config.containsPrivilege('P-OM-VOD-MGT-EDIT'),
        isAudit: config.containsPrivilege('P-DRIVER-VOD-MGT-AUDIT'),
        isAdmin: config.getAdmin(),
        loginPopup: false,
        adminBox: false,
        message: ''
      }
    },
    components: {
      loginPopup,
      paginate,
      omVodMgtAdd,
      adminOmDetailed,
      dateBox
    },
    mounted () {
      this.$nextTick(() => {
        console.log(this.LM_TYPE_LIST)
        this.omVodMgtVo.timeTo = this.moment().format('YYYY-MM-DD')
        this.omVodMgtVo.timeFrom = this.moment().subtract(6, 'd').format('YYYY-MM-DD')
        this.getomVodMgtList('init')
        this.vodTypeList1.unshift({'value': '', 'label': '全部'})
        this.vodTypeList = config.getStorage('OM_VOD_TYPES')
      })
    },
    methods: {
      getOmType (value) {
        this.omType = value
      },
      getLmType (value) {
        this.lmType = value
      },
      receiveDate (date) {
        this.omVodMgtVo.timeFrom = date.from
        this.omVodMgtVo.timeTo = date.to
      },
      admin (mgt) {
        this.adminDetaileds = mgt
        this.adminBox = true
      },
      closeAdminBox (data) {
        this.adminBox = false
        this.getomVodMgtList(data)
      },
      getomVodMgtList (approach) {
        this.message = ''
        this.loading = true
        if (this.omType && this.omType.length !== 0) {
          this.omVodMgtVo.vodType = this.omType[0]
        }
        if (this.lmType && this.lmType.length !== 0) {
          this.omVodMgtVo.lmType = this.lmType[0]
        }
        this.axios({
          method: 'post',
          data: this.omVodMgtVo,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/om-vod/mgt/list'
        }).then((response) => {
          this.loading = false
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            if (data.result.resultList.length !== 0) {
              this.omVodMgtList = data.result.resultList
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
      createOmVodMgt () {
        this.omVoMgt = {
          lmNo: '',
          rbCode: '',
          ldCode: '',
          lmType: '',
          lmModel: '',
          omtsCode: '',
          vodType: '',
          detail: '',
          memo: ''
        }
        this.addOmVodMgtBox = true
      },
      closeBox () {
        this.addOmVodMgtBox = false
        this.getomVodMgtList('query')
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getomVodMgtList()
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      copy (num) {
        if (num[0] === 1) {
          this.omVoMgt = {
            lmNo: num[1].lmNo,
            lmType: num[1].lmType,
            lmModel: num[1].lmModel,
            rbCode: num[1].rbCode,
            ldCode: num[1].ldCode,
            omtsCode: num[1].omtsCode,
            omtCode: num[1].omtCode,
            ompCode: num[1].ompCode,
            deptNamePath: num[1].deptNamePath
          }
        } else if (num[0] === 2) {
          this.omVoMgt = {
            vodType: num[1].vodType,
            timeDt: num[1].timeDt,
            memo: num[1].memo,
            location: num[1].location,
            detail: num[1].detail,
            rbCode: num[1].rbCode,
            ldCode: num[1].ldCode,
            omtsCode: num[1].omtsCode,
            omtCode: num[1].omtCode,
            ompCode: num[1].ompCode
          }
        } else if (num[0] === 3) {
          delete num[1].sid
          this.omVoMgt = num[1]
        }
        this.addOmVodMgtBox = true
      }
    }
  }
</script>

<style scoped>


</style>
