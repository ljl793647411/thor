<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>检修数据</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">机车:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <train-search @getLm='getLm' :train="omVoMgt.lmNo ? omVoMgt.lmNo + '，' + LM_TYPES[omVoMgt.lmType] + '，' + '编号:' + omVoMgt.lmModel : ''" :lmVo='lmVo'></train-search>
            </td>
            <td class="td-left" v-text="omVoMgt.lmNo ? omVoMgt.lmNo + '，' + LM_TYPES[omVoMgt.lmType] + '，' + '编号:' + omVoMgt.lmModel : ''" v-if="!isEdit && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">责任岗位:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <div v-if="omVoMgt.deptNamePath" @click="openTsOverhaulRadioBox" class="multi-line-text">{{ omVoMgt.deptNamePath }}</div>
              <el-button type="primary" @click="openTsOverhaulRadioBox" v-if="!omVoMgt.deptNamePath" class="button-link">管 理</el-button>
            </td>
            <td class="td-left" v-text="omVoMgt.deptNamePath" v-if="!isEdit && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">项点:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <el-cascader
                :options="vodTypeList"
                v-model="omTypes"
                @change="getOmTypes">
              </el-cascader>
              <span class="warning"> *</span>
              <span v-show="errors.has('vodType')" class="prompt">不能为空 </span>
            </td>
            <td class="td-left" v-text="omTypes[0]" v-if="!isEdit && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">发生时间:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <span class="block">
                <el-date-picker
                  v-model="timeDt"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </span>
              <span class="warning"> *</span>
              <span v-show="errors.has('timeDt')" class="prompt">不能为空 </span>
            </td>
            <td class="td-left" v-text="timeDt" v-if="!isEdit && !isAdmin"></td>
          </tr>
          <tr v-if="isEdit || isAdmin">
            <td class="td-right">两违模板:</td>
            <td class="td-left">
              <vod-box omVod="omVod" @getDriVod="getOmVod"></vod-box>
            </td>
          </tr>
          <tr>
            <td class="td-right">发生地点:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <input type="text" v-model="location" name="location"/>
            </td>
            <td class="td-left" v-text="location" v-if="!isEdit && !isAdmin"></td>
          </tr>
          <tr>
            <td style="vertical-align: top;" class="td-right">详情:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <textarea rows="5" cols="45" type="text" v-model="detail" v-validate="'required'" name="detail"></textarea><span class="warning"> *</span>
              <span v-show="errors.has('detail')" class="prompt">不能为空 </span>
            </td>
            <td class="td-left" v-text="detail" v-if="!isEdit && !isAdmin"></td>
          </tr>
          <tr>
            <td style="vertical-align: top;" class="td-right">备注:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <textarea rows="3" cols="45" type="text" v-model="omVoMgt.memo"></textarea>
            </td>
            <td class="td-left" v-text="omVoMgt.memo" v-if="!isEdit && !isAdmin"></td>
          </tr>
          <tr v-if="omVoMgt.sid">
            <td class="td-right">主管意见:</td>
            <td>
              <textarea type="text" rows="3" cols="45" v-model="omVoMgt.commentCnt" v-if="isAudit || isAdmin"></textarea>
              <div v-text="omVoMgt.commentCnt" v-if="!isAudit"></div>
            </td>
          </tr>
        </table>
      </div>
      <div class="popup-submit">
          <el-button type="primary" @click="createOmVodMgtBox">提交</el-button>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="omBox">
      <ts-overhaul-radio-box @getOmCode="getOmCode" :radio="true"></ts-overhaul-radio-box>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import tsOverhaulRadioBox from '@/components/ts-overhaul-radio-box'
  import trainSearch from '@/components/train-search'
  import vodBox from '@/components/vod-box'

  export default {
    name: 'driverVodMgtAddBox',
    data () {
      return {
        addBox: false,
        dept: {},
        deptList: [{
          value: 1,
          name: '上海铁路局'
        }, {
          value: 2,
          name: '杭州铁路局'
        }],
        loginPopup: false,
        omBox: false,
        timeDt: '',
        vodTypeList: config.getStorage('OM_VOD_TYPES'),
        lmVo: {},
        LM_TYPES: config.LM_TYPES,
        isEdit: false,
        isAudit: config.containsPrivilege('P-OM-VOD-MGT-AUDIT'),
        loginName: config.getLoginName(),
        omTypes: [],
        location: '',
        detail: '',
        message: '',
        isAdmin: config.getAdmin()
      }
    },
    components: {
      loginPopup,
      tsOverhaulRadioBox,
      trainSearch,
      vodBox
    },
    mounted () {
      this.$nextTick(() => {
        this.isEdit = config.containsPrivilege('P-OM-VOD-MGT-EDIT') && (this.loginName === this.omVoMgt.createdByName || !this.omVoMgt.createdByName)
        if (this.omVoMgt.timeDt) {
          this.timeDt = this.omVoMgt.timeDt
          this.lmVo.rbCode = this.omVoMgt.rbCode
          this.lmVo.ldCode = this.omVoMgt.ldCode
        }
        this.omTypes.push(this.omVoMgt.vodType)
        this.location = this.omVoMgt.location
        this.detail = this.omVoMgt.detail
      })
    },
    props: ['omVoMgt'],
    methods: {
      getOmTypes (value) {
        this.omTypes = value
      },
      editCancel () {
        this.$confirm('是否取消编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('closeBox')
          this.$message({
            type: 'info',
            message: '编辑取消!'
          })
        }).catch(() => {
        })
      },
      createOmVodMgtBox () {
        if (this.omTypes && this.omTypes.length !== 0) {
          this.omVoMgt.vodType = this.omTypes[0]
        }
        let url = this.omVoMgt.sid ? '/api/om-vod/mgt/update' : '/api/om-vod/mgt/create'
        this.timeDt = config.dateToString(new Date(this.timeDt), 'yyyy-MM-dd hh:mm:ss')
        if (!this.timeDt || !this.omVoMgt.lmNo || !this.omVoMgt.lmType || !this.omVoMgt.lmModel || !this.omVoMgt.rbCode || !this.omVoMgt.ldCode || !this.omVoMgt.omtsCode || !this.omVoMgt.omtCode || !this.omVoMgt.ompCode || !this.omVoMgt.vodType || !this.detail) {
          return
        }
        if (this.isAudit) {
          if (this.omVoMgt.commentCnt) {
            if (this.omVoMgt.commentCnt.trim() === '') {
              this.$message({
                message: '请填写主管意见',
                type: 'error'
              })
              return
            }
          }
        }
        if (this.omVoMgt.commentCnt) {
          this.omVoMgt.commentTime = config.dateToString(new Date(new Date().getTime()), 'yyyy-MM-dd hh:mm:ss')
          this.omVoMgt.commentWorkNo = config.getStorage('loginResult').loginName
          this.omVoMgt.commentName = config.getStorage('loginResult').name
        }
        this.omVoMgt.location = this.location
        this.omVoMgt.detail = this.detail
        this.omVoMgt.timeDt = this.timeDt
        if (this.timeDt > new Date()) {
          this.$message({
            message: '请选择合理的时间',
            type: 'error'
          })
          return
        }
        this.axios({
          method: 'post',
          data: this.omVoMgt,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('操作成功')
            this.$emit('closeBox', this.omVoMgt)
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          } else if (data.type === 403) {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      openTsOverhaulRadioBox () {
        this.omBox = true
      },
      getOmCode (om) {
        this.omBox = false
        if (!om.sid) {
          return
        }
        this.omVoMgt.deptNamePath = om.namePath.split(',').join('>')
        let omCodes = om.codePath.split(',')
        this.omVoMgt.rbCode = omCodes[0]
        this.omVoMgt.ldCode = omCodes[1]
        this.omVoMgt.omtsCode = omCodes[2]
        this.omVoMgt.omtCode = omCodes[3]
        if (typeof this.omVoMgt.ompCode === 'undefined') {
          this.$set(this.omVoMgt, 'ompCode', omCodes[4])
        } else {
          this.omVoMgt.ompCode = omCodes[4]
        }
      },
      getLm (lm) {
        if (lm) {
          this.omVoMgt.lmNo = lm.no
          this.omVoMgt.lmType = lm.type
          this.omVoMgt.lmModel = lm.model
        }
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      getOmVod (vod) {
        if (!vod.location) {
          this.location = ''
        } else {
          this.location = vod.location
        }
        this.detail = vod.content
      }
    }
  }
</script>

<style scoped>
 .ptDetail.prompt {
    margin-left: 0;
  }
  .driver-style {
    position: relative;
  }
  .dirver-style-span{
    position: absolute;
    left:230px;
    bottom: 5px;
  }
  .dirver-style-span label {
    float: left;
    line-height: 33px;
    margin-right: 10px;
  }
  .dirver-style-span input[type="radio"] {
    float: left;
    margin-right: 10px;
  }
</style>
