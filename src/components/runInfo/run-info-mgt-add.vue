<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>运行信息</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">值乘日期:</td>
            <td class="td-left">
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
          </tr>
          <tr>
            <td class="td-right">值乘车次:</td>
            <td class="td-left">
              <input type="text" v-model="infoVoMgt.trainNo" v-validate="'required'" name="trainNo"/><span class="warning"> *</span>
              <span v-show="errors.has('trainNo')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">列车类型:</td>
            <td class="td-left source-class">
                <input type="radio" value="COMM" v-model="infoVoMgt.trainType" id="trainType1">
                <label for="trainType1">普速列车</label>
                <input type="radio" value="EMU" v-model="infoVoMgt.trainType" id="trainType0">
                <label for="trainType0">动车</label>
            </td>
          </tr>
          <tr>
            <td class="td-right">一位司机:</td>
            <td class="td-left driver-style">
              <driver-search @getDriver='getDriver' :people="infoVoMgt.driverName1 === undefined ? '' : infoVoMgt.driverName1 + '(' + infoVoMgt.workNo1 + ')'" :reqVo='respWorkNos'></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="infoVoMgt.workNo1" v-model="infoVoMgt.respWorkNo" name="respWorkNo" id="respWorkNo1" checked>
                <label for="respWorkNo1">设为责任人</label>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">二位司机:</td>
            <td class="td-left driver-style">
              <driver-search @getDriver2='getDriver2' :people="infoVoMgt.driverName2 ? infoVoMgt.driverName2 + '(' + infoVoMgt.workNo2 + ')' : ''" :reqVo='respWorkNos' :work2="true"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="infoVoMgt.workNo2 ? infoVoMgt.workNo2 : ''" v-model="infoVoMgt.respWorkNo" name="respWorkNo" id="respWorkNo2" :disabled="!infoVoMgt.workNo2">
                <label for="respWorkNo2">设为责任人</label>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">三位司机:</td>
            <td class="td-left driver-style">
              <driver-search @getDriver3='getDriver3' :people="infoVoMgt.driverName3 ? infoVoMgt.driverName3 + '(' + infoVoMgt.workNo3 + ')' : ''" :reqVo='respWorkNos' :work3="true"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="infoVoMgt.workNo3 ? infoVoMgt.workNo3 : ''" v-model="infoVoMgt.respWorkNo" name="respWorkNo" id="respWorkNo3" :disabled="!infoVoMgt.workNo3">
                <label for="respWorkNo3">设为责任人</label>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">添乘司机:</td>
            <td class="td-left driver-style">
              <driver-search @getDriver3='getDriver4' :people="infoVoMgt.driverName4 ? infoVoMgt.driverName4 + '(' + infoVoMgt.workNo4 + ')' : ''" :reqVo='respWorkNos' :work4="true"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="infoVoMgt.workNo4 ? infoVoMgt.workNo4 : ''" v-model="infoVoMgt.respWorkNo" name="respWorkNo" id="respWorkNo4" :disabled="!infoVoMgt.workNo4">
                <label for="respWorkNo4">设为责任人</label>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">机车:</td>
            <td class="td-left">
              <train-search @getLm='getLm' :train="infoVoMgt.lmNo ? infoVoMgt.lmNo + '，' + LM_TYPES[infoVoMgt.lmType] + '，' + '型号' + infoVoMgt.lmModel : ''" :lmVo='lmVo'></train-search>
            </td>
          </tr>
          <tr>
            <td class="td-right">运行信息分类:</td>
            <td class="td-left">
              <el-cascader
                :options="vodTypeList"
                v-model="vodType"
                @change="getVodType">
              </el-cascader>
              <span class="warning"> *</span>
              <span v-show="errors.has('type')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">运行信息追踪类别:</td>
            <td class="td-left">
              <el-cascader
                :options="cateList"
                v-model="cate"
                @change="getCate">
              </el-cascader>
              <span class="warning"> *</span>
              <span v-show="errors.has('cate')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">发生时间:</td>
            <td class="td-left">
              <span class="block">
                <el-date-picker
                  v-model="timeDt"
                  type="datetime"
                  placeholder="选择日期时间"
                  >
                </el-date-picker>
              </span>
              <span class="warning"> *</span>
              <span v-show="errors.has('timeDt')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">发生地点:</td>
            <td class="td-left">
              <input type="text" v-model="infoVoMgt.location" v-validate="'required'" name="location"/><span class="warning"> *</span>
              <span v-show="errors.has('location')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">录入员:</td>
            <td class="td-left">
              <input type="text" v-model="infoVoMgt.reporter" v-validate="'required'" name="reporter"/><span class="warning"> *</span>
              <span v-show="errors.has('reporter')" class="prompt">不能为空 </span>
            </td>
          </tr> 
          <tr>
            <td class="td-right" style="vertical-align: top;">详情:</td>
            <td class="td-left">
              <textarea name="detail" id="" cols="40" rows="3" v-model="infoVoMgt.detail" v-validate="'required'"></textarea><span class="warning"> *</span>
              <span v-show="errors.has('detail')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right" style="vertical-align: top;">备注:</td>
            <td class="td-left">
              <textarea rows="3" cols="40" v-model="infoVoMgt.memo" name="memo"></textarea>
            </td>
          </tr>
        </table>
      </div>
      <div class="popup-submit">
        <el-button type="primary" @click="createInfoMgtBox">提交</el-button>
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

  export default {
    name: 'dsVodMgtAddBox',
    data () {
      return {
        state: {
          format: 'yyyy-MM-dd',
          disabled: {
            from: new Date()
          },
          highlighted: {
            dates: [new Date()]
          }
        },
        LM_TYPES: config.LM_TYPES,
        vodTypeList: config.getStorage('RUN_INFO_TYPES'),
        vodType: [],
        cate: [],
        cateList: config.getStorage('RUN_INFO_CATES'),
        loginPopup: false,
        restoring: false,
        errMsg: '',
        timeDt: '',
        trainDt: '',
        respWorkNos: {},
        lmVo: {},
        workNo2: '',
        workNo3: '',
        workNo4: '',
        msgBox: false,
        driChange: false,
        message: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.timeDt = this.infoVoMgt.timeDt
        this.trainDt = this.infoVoMgt.trainDt
        if (this.infoVoMgt.cate) {
          this.cate.push(this.infoVoMgt.cate)
        }
        if (this.infoVoMgt.type) {
          this.vodType.push(this.infoVoMgt.type)
        }
        if (this.infoVoMgt.sid) {
          this.respWorkNos.deptCode = this.infoVoMgt.ctCode
          this.respWorkNos.deptType = 'CT'
        } else {
          this.respWorkNos.deptCode = config.deptCode
          this.respWorkNos.deptType = config.deptType
        }
        this.lmVo.rbCode = this.infoVoMgt.rbCode
        this.lmVo.ldCode = this.infoVoMgt.ldCode
      })
    },
    components: {
      loginPopup,
      driverSearch,
      trainSearch
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
      deep: true
    },
    props: ['infoVoMgt'],
    methods: {
      getVodType (value) {
        this.vodType = value
      },
      getCate (value) {
        this.cate = value
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
      createInfoMgtBox () {
        let url = this.infoVoMgt.sid ? '/api/run-info/mgt/update' : '/api/run-info/mgt/create'
        if (!this.infoVoMgt.respWorkNo) {
          this.$message.error('请选择责任人')
          return
        }
        if (this.timeDt < this.trainDt || this.timeDt > new Date()) {
          this.$message({
            message: '请选择合理的时间',
            type: 'error'
          })
          return
        }
        if (this.vodType && this.vodType.length !== 0) {
          this.infoVoMgt.type = this.vodType[0]
        }
        if (this.cate && this.cate.length !== 0) {
          this.infoVoMgt.cate = this.cate[0]
        }
        this.infoVoMgt.timeDt = config.dateToString(new Date(this.timeDt), 'yyyy-MM-dd hh:mm:ss')
        this.infoVoMgt.trainDt = config.dateToString(new Date(this.trainDt), 'yyyy-MM-dd')
        for (let i in this.infoVoMgt) {
          if (this.infoVoMgt[i] === '' && i !== 'timeDt' && i !== 'analysedDt' && i !== 'respName' && i !== 'analystName' && i !== 'cate' && i !== 'cmdNo' && i !== 'driverDeptPath2' && i !== 'driverName2' && i !== 'traceDept' && i !== 'traceOwner' && i !== 'tracePoints' && i !== 'traceSummary' && i !== 'tracedDt' && i !== 'tracedResult' && i !== 'workNo2' && i !== 'updatedDt' && i !== 'updatedByWorkNo' && i !== 'tracePoints' && i !== 'updatedByName' && i !== 'tracePoints' && i !== 'createdByName' && i !== 'memo' && i !== 'updatedByName' && i !== 'respDeptPath' && i !== 'driverName3' && i !== 'workNo3' && i !== 'driverDeptPath3' && i !== 'driverName4' && i !== 'workNo4' && i !== 'driverDeptPath4') {
            this.$message.error('请将带红色*号的填写完整')
            console.log('缺少', i)
            return
          }
        }
        if (this.infoVoMgt.workNo1 === this.infoVoMgt.workNo2 || this.infoVoMgt.workNo1 === this.infoVoMgt.workNo3 || this.infoVoMgt.workNo1 === this.infoVoMgt.workNo4) {
          this.$message({
            message: '值乘司机不能相同',
            type: 'error'
          })
          return
        }
        if (this.infoVoMgt.workNo2) {
          if (this.infoVoMgt.workNo3) {
            if (this.infoVoMgt.workNo2 === this.infoVoMgt.workNo3 || this.infoVoMgt.workNo4 === this.infoVoMgt.workNo3 || this.infoVoMgt.workNo4 === this.infoVoMgt.workNo2) {
              this.$message({
                message: '值乘司机不能相同',
                type: 'error'
              })
              return
            }
          }
        }
        this.axios({
          method: 'post',
          data: this.infoVoMgt,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.infoVoMgt)
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
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      getDriver (resp) {
        this.infoVoMgt.workNo1 = resp.workNo
        this.infoVoMgt.rbCode = resp.rbCode
        this.infoVoMgt.ldCode = resp.ldCode
        this.infoVoMgt.tsCode = resp.tsCode
        this.infoVoMgt.ttCode = resp.ttCode
        this.infoVoMgt.ctCode = resp.ctCode
      },
      getDriver2 (resp) {
        this.infoVoMgt.workNo2 = resp.workNo
        this.workNo2 = this.infoVoMgt.workNo2
      },
      getDriver3 (resp) {
        this.infoVoMgt.workNo3 = resp.workNo
        this.workNo3 = this.infoVoMgt.workNo3
      },
      getDriver4 (resp) {
        this.infoVoMgt.workNo4 = resp.workNo
        this.workNo4 = this.infoVoMgt.workNo4
      },
      getLm (lm) {
        if (lm) {
          this.infoVoMgt.lmNo = lm.no
          this.infoVoMgt.lmType = lm.type
          this.infoVoMgt.lmModel = lm.model
        }
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
