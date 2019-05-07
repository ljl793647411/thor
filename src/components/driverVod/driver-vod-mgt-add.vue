<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>值乘两违</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">值乘日期:</td>
            <td class="td-left" v-if="(!isRunInfo && isEdit) || isAdmin">
              <span class="block">
                <el-date-picker
                v-model="trainDt"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
              </span>
              <span class="warning"> *</span>
              <span v-show="errors.has('trainDt')" class="prompt">不能为空 </span>
            </td>
            <td class="td-left" v-text="driVo.trainDt" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">值乘车次:</td>
            <td class="td-left" v-if="(!isRunInfo && isEdit) || isAdmin">
              <input type="text" v-model="driVo.trainNo" v-validate="'required'" name="trainNo"/><span class="warning"> *</span>
              <span v-show="errors.has('trainNo')" class="prompt">不能为空 </span>
            </td>
            <td class="td-left" v-text="driVo.trainNo" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">一位司机:</td>
            <td class="td-left driver-style" v-if="(!isRunInfo && isEdit) || isAdmin">
              <driver-search @getDriver='getDriver' :people="driVo.driverName1 === undefined ? '' : driVo.driverName1 + '(' + driVo.workNo1 + ')'" :reqVo='respWorkNos'></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="driVo.workNo1" v-model="driVo.respWorkNo" name="respWorkNo" id="respWorkNo1">
                <label for="respWorkNo1">设为责任人</label>
              </span>
            <td class="td-left" v-text="driVo.driverName1 + '(' + driVo.workNo1 + ')'" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
            </td>
          </tr>
          <tr>
            <td class="td-right">二位司机:</td>
            <td class="td-left driver-style" v-if="(!isRunInfo && isEdit) || isAdmin">
              <driver-search @getDriver2='getDriver2' :people="driVo.driverName2 ? driVo.driverName2 + '(' + driVo.workNo2 + ')' : ''" :reqVo='respWorkNos' :work2="true"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="driVo.workNo2 ? driVo.workNo2 : ''" v-model="driVo.respWorkNo" name="respWorkNo" id="respWorkNo2" :disabled="!driVo.workNo2">
                <label for="respWorkNo2">设为责任人</label>
              </span>
            </td>
            <td class="td-left" v-text="driVo.driverName2 + '(' + driVo.workNo2 + ')'" v-if="(isRunInfo || !isEdit) && driVo.workNo2 && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">三位司机:</td>
            <td class="td-left driver-style" v-if="(!isRunInfo && isEdit) || isAdmin">
              <driver-search @getDriver3='getDriver3' :people="driVo.driverName3 ? driVo.driverName3 + '(' + driVo.workNo3 + ')' : ''" :reqVo='respWorkNos' :work3="true"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="driVo.workNo3 ? driVo.workNo3 : ''" v-model="driVo.respWorkNo" name="respWorkNo" id="respWorkNo3" :disabled="!driVo.workNo3">
                <label for="respWorkNo3">设为责任人</label>
              </span>
            </td>
            <td class="td-left" v-text="driVo.driverName3 + '(' + driVo.workNo3 + ')'" v-if="(isRunInfo || !isEdit) && driVo.workNo3 && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">添乘司机:</td>
            <td class="td-left driver-style" v-if="(!isRunInfo && isEdit) || isAdmin">
              <driver-search @getDriver4='getDriver4' :people="driVo.driverName4 ? driVo.driverName4 + '(' + driVo.workNo4 + ')' : ''" :reqVo='respWorkNos' :work4="true"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="driVo.workNo4 ? driVo.workNo4 : ''" v-model="driVo.respWorkNo" name="respWorkNo" id="respWorkNo4" :disabled="!driVo.workNo4">
                <label for="respWorkNo4">设为责任人</label>
              </span>
            </td>
            <td class="td-left" v-text="driVo.driverName4 + '(' + driVo.workNo4 + ')'" v-if="(isRunInfo || !isEdit) && driVo.workNo4 && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">机车:</td>
            <td class="td-left" v-if="(!isRunInfo && isEdit) || isAdmin">
              <train-search @getLm='getLm' :train="driVo.lmNo ? driVo.lmNo + '，' + LM_TYPES[driVo.lmType] + '，' + '编号:' + driVo.lmModel : ''" :lmVo='lmVo'></train-search>
            </td>
            <td class="td-left" v-text="driVo.lmNo ? driVo.lmNo + '，' + LM_TYPES[driVo.lmType] + '，' + '编号:' + driVo.lmModel : ''" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">来源:</td>
            <td class="td-left source-class" v-if="isEdit || isAdmin">
              <template v-for="value in VOD_SOURCES">
              <input type="radio" v-model="source" :id="'source-' + value.label" :value="value.value">
              <label :for="'source-' + value.label" v-text="value.label"></label>
              </template>
              <span class="warning" style="line-height: 40px;"> *</span>
            </td>
            <td class="td-left" v-text="VOD_SOURCE_LIST[source]" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right">项点:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <span class="block">
                <el-cascader
                  :options="options"
                  v-model="selectedOptions"
                  @change="handleChange">
                </el-cascader>
              </span>
              <span class="warning"> *</span>
              <span v-show="errors.has('vodType2')" class="prompt">不能为空 </span>
            </td>
            <td class="td-left" v-text="selectedOptions[0] + ',' + selectedOptions[1]" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
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
            <td class="td-left" v-text="timeDt" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
          </tr>
          <tr v-if="isRunInfo && !isEdit">
            <td class="td-right">两违模板:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <vod-box driVod="driVod" @getDriVod="getDriVod"></vod-box>
            </td>
          </tr>
          <tr>
            <td class="td-right">发生地点:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <input type="text" v-model="location" name="location"/>
            </td>
            <td class="td-left" v-text="location" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right" style="vertical-align: top;">详情:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <textarea type="text" rows="5" cols="45" v-model="detail" v-validate="'required'" name="detail"/></textarea><span class="warning"> *</span>
              <span v-show="errors.has('detail')" class="prompt" style="marginLeft:0">不能为空 </span>
            </td>
            <td class="td-left" v-text="detail" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
          </tr>
          <tr>
            <td class="td-right" style="vertical-align: top;">备注:</td>
            <td class="td-left" v-if="isEdit || isAdmin">
              <textarea type="text" rows="3" cols="45" v-model="driVo.memo"></textarea>
            </td>
            <td class="td-left" v-text="memo" v-if="(isRunInfo || !isEdit) && !isAdmin"></td>
          </tr>
          <template v-if="driVo.sid && !isRunInfo">
          <tr>
            <td class="td-right">主管意见:</td>
            <td class="td-left">
              <textarea v-if="isAudit || isAdmin" type="text" rows="3" cols="45" v-model="driVo.commentCnt"></textarea>
              <div v-if="!isAudit" v-text="driVo.commentCnt"></div>
            </td>
          </tr>
          </template>
        </table>
      </div>
      <div class="popup-submit">
        <el-button type="primary" @click="createDriVodMgtBox">提交</el-button>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import driverSearch from '@/components/driver-search'
  import trainSearch from '@/components/train-search'
  import vodBox from '@/components/vod-box'

  export default {
    name: 'driverVodMgtAddBox',
    data () {
      return {
        VOD_SOURCES: config.VOD_SOURCES,
        VOD_SOURCE_LIST: config.VOD_SOURCE_LIST,
        addBox: false,
        loginPopup: false,
        vodType1List: [],
        vodType1: {},
        timeDt: '',
        trainDt: '',
        respWorkNos: {},
        sendData: {},
        url: '',
        workNo2: '',
        workNo3: '',
        workNo4: '',
        lmVo: {},
        isCreating: false,
        isEdit: false,
        isAudit: config.containsPrivilege('P-DRIVER-VOD-MGT-AUDIT'),
        loginName: config.getLoginName(),
        location: '',
        detail: '',
        message: '',
        options: [],
        LM_TYPES: config.LM_TYPES,
        vodList: config.getStorage('DRIVER_VOD_TYPES'),
        LKJList: config.getStorage('LKJ_TYPES'),
        EOASList: config.getStorage('EOAS_TYPES'),
        isAdmin: config.getAdmin(),
        selectedOptions: [],
        source: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.driVo) {
          this.isEdit = config.containsPrivilege('P-DRIVER-VOD-MGT-EDIT') && (this.loginName === this.driVo.createdByName || !this.driVo.createdByName)
          if (this.driVo.source) {
            this.source = this.driVo.source
          }
          this.isCreating = this.driVo.sid
          this.selectedOptions = [this.driVo.vodType1, this.driVo.vodType2]
          if (!this.driVo.workNo1) {
            this.driVo.workNo1 = ''
          }
          this.timeDt = this.driVo.time
          this.trainDt = this.driVo.trainDt
          if (this.driVo.sid) {
            this.respWorkNos.deptCode = this.driVo.ctCode
            this.respWorkNos.deptType = 'CT'
            this.lmVo.rbCode = this.driVo.ctCode
            this.lmVo.ldCode = 'CT'
          } else {
            this.respWorkNos.deptCode = config.deptCode
            this.respWorkNos.deptType = config.deptType
            this.lmVo.rbCode = config.deptCode
            this.lmVo.ldCode = config.deptType
          }
          this.location = this.driVo.location
          this.detail = this.driVo.detail
          if (this.isRunInfo || this.isFloodCtrl) {
            this.location = ''
            this.detail = ''
            this.driVo.memo = ''
          }
        }
      })
    },
    watch: {
      workNo2: function () {
        let work2 = document.getElementById('respWorkNo2')
        work2.disabled = false
      },
      workNo3: function () {
        let work3 = document.getElementById('respWorkNo3')
        work3.disabled = false
      },
      workNo4: function () {
        let work4 = document.getElementById('respWorkNo4')
        work4.disabled = false
      },
      source: 'changeCategory'
    },
    components: {
      driverSearch,
      loginPopup,
      trainSearch,
      vodBox
    },
    props: ['driVo', 'isRunInfo', 'isFloodCtrl'],
    methods: {
      handleChange (value) {
        for (let i = 0; i < this.selectedOptions.length; i++) {
          this.driVo.vodType1 = this.selectedOptions[0]
          this.driVo.vodType2 = this.selectedOptions[1]
        }
      },
      changeCategory () {
        if (!this.driVo.sid && !this.driVo.copy) {
          this.driVo.vodType1 = ''
          this.driVo.vodType2 = ''
        }
        if (this.source === 'A' || this.source === 'V') {
          this.options = this.vodList
        } else if (this.source === 'LKJ') {
          this.options = this.LKJList
        } else if (this.source === 'EOAS') {
          this.options = this.EOASList
        }
        if (this.options[0].label === '全部') {
          this.options.splice(0, 1)
        }
      },
      createDriVodMgtBox () {
        this.sendData = this.driVo
        if (this.isRunInfo) {
          this.sendData.runInfoSid = this.driVo.sid
        } else if (this.isFloodCtrl) {
          this.sendData.floodControlSid = this.driVo.floodControlSid
        }
        if (this.sendData.vodType1 === '全部') {
          this.sendData.vodType1 = ''
        }
        this.sendData.location = this.location
        this.sendData.detail = this.detail
        this.sendData.source = this.source
        if (this.timeDt < this.trainDt || this.timeDt > new Date()) {
          this.$message({
            message: '请选择合理的时间',
            type: 'error'
          })
          return
        }
        this.sendData.time = config.dateToString(new Date(this.timeDt), 'yyyy-MM-dd hh:mm:ss')
        this.sendData.trainDt = config.dateToString(new Date(this.trainDt), 'yyyy-MM-dd')
        if (!this.sendData.respWorkNo) {
          this.$message.error('请选择责任人')
          return
        }
        if (!this.sendData.source) {
          this.$message.error('请选择信息来源')
          return
        }
        if (!this.sendData.trainDt || !this.sendData.trainNo || !this.sendData.workNo1 || !this.sendData.lmNo || !this.sendData.lmType || !this.sendData.lmModel || !this.sendData.source || !this.sendData.vodType1 || !this.sendData.respWorkNo || !this.sendData.time || !this.sendData.detail) {
          this.$message({
            message: '请将带红色*号的填写完整',
            type: 'error'
          })
          return
        }
        if (this.sendData.sid) {
          if (this.sendData.isRunInfo || this.sendData.isFloodCtrl) {
            this.url = '/api/driver-vod/mgt/create'
          } else {
            this.url = '/api/driver-vod/mgt/update'
          }
        } else {
          this.url = '/api/driver-vod/mgt/create'
        }
        if (this.sendData.commentCnt) {
          this.sendData.commentTime = config.dateToString(new Date(new Date().getTime()), 'yyyy-MM-dd hh:mm:ss')
          this.sendData.commentWorkNo = this.loginName
          this.sendData.commentName = config.getStorage('loginResult').name
        }
        if (this.sendData.workNo1 === this.sendData.workNo2 || this.sendData.workNo1 === this.sendData.workNo3 || this.sendData.workNo1 === this.sendData.workNo4) {
          this.$message({
            message: '值乘司机不能相同',
            type: 'error'
          })
          return
        }
        if (this.sendData.workNo2) {
          if (this.sendData.workNo3) {
            if (this.sendData.workNo2 === this.sendData.workNo3 || this.sendData.workNo4 === this.sendData.workNo3 || this.sendData.workNo4 === this.sendData.workNo2) {
              this.$message({
                message: '值乘司机不能相同',
                type: 'error'
              })
              return
            }
          }
        }
        if (this.isAudit) {
          if (this.sendData.commentCnt) {
            if (this.sendData.commentCnt.trim() === '') {
              this.$message({
                message: '请填写主管意见',
                type: 'error'
              })
              return
            }
          }
        }
        let self = this
        this.axios({
          method: 'post',
          data: this.sendData,
          url: this.url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', self.sendData)
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
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      getDriver (resp) {
        this.driVo.workNo1 = resp.workNo
        this.driVo.rbCode = resp.rbCode
        this.driVo.ldCode = resp.ldCode
        this.driVo.tsCode = resp.tsCode
        this.driVo.ttCode = resp.ttCode
        this.driVo.ctCode = resp.ctCode
      },
      getDriver2 (resp) {
        this.driVo.workNo2 = resp.workNo
        this.workNo2 = this.driVo.workNo2
      },
      getDriver3 (resp) {
        this.driVo.workNo3 = resp.workNo
        this.workNo3 = this.driVo.workNo3
      },
      getDriver4 (resp) {
        this.driVo.workNo4 = resp.workNo
        this.workNo4 = this.driVo.workNo4
      },
      getLm (lm) {
        if (lm) {
          this.driVo.lmNo = lm.no
          this.driVo.lmType = lm.type
          this.driVo.lmModel = lm.model
        }
      },
      getDriVod (vod) {
        this.location = vod.location
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
  .dirver-style-span label,.source-class label {
    float: left;
    line-height: 33px;
    margin-right: 10px;
  }
  .dirver-style-span input[type="radio"],.source-class input[type="radio"] {
    float: left;
    margin-right: 10px;
  }
</style>
