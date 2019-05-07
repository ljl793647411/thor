<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>雨情信息</b>
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
              <input type="text" v-model="floodCtrlVos.trainNo" v-validate="'required'" name="trainNo"/><span class="warning"> *</span>
              <span v-show="errors.has('trainNo')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">一位司机:</td>
            <td class="td-left driver-style">
              <driver-search @getDriver='getDriver' :people="floodCtrlVos.driverName1 === undefined ? '' : floodCtrlVos.driverName1 + '(' + floodCtrlVos.workNo1 + ')'" :reqVo='respWorkNos'></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="floodCtrlVos.workNo1" v-model="floodCtrlVos.respWorkNo" name="respWorkNo" id="respWorkNo1" checked>
                <label for="respWorkNo1">设为责任人</label>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">二位司机:</td>
            <td class="td-left driver-style">
              <driver-search @getDriver2='getDriver2' :people="floodCtrlVos.driverName2 ? floodCtrlVos.driverName2 + '(' + floodCtrlVos.workNo2 + ')' : ''" :reqVo='respWorkNos' work2="work2"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="floodCtrlVos.workNo2 ? floodCtrlVos.workNo2 : ''" v-model="floodCtrlVos.respWorkNo" name="respWorkNo" id="respWorkNo2" :disabled="!floodCtrlVos.workNo2">
                <label for="respWorkNo2">设为责任人</label>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">三位司机:</td>
            <td class="td-left driver-style">
              <driver-search @getDriver3='getDriver3' :people="floodCtrlVos.driverName3 ? floodCtrlVos.driverName3 + '(' + floodCtrlVos.workNo3 + ')' : ''" :reqVo='respWorkNos' work3="work3"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="floodCtrlVos.workNo3 ? floodCtrlVos.workNo3 : ''" v-model="floodCtrlVos.respWorkNo" name="respWorkNo" id="respWorkNo3" :disabled="!floodCtrlVos.workNo3">
                <label for="respWorkNo3">设为责任人</label>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">添乘司机:</td>
            <td class="td-left driver-style">
              <driver-search @getDriver4='getDriver4' :people="floodCtrlVos.driverName4 ? floodCtrlVos.driverName4 + '(' + floodCtrlVos.workNo4 + ')' : ''" :reqVo='respWorkNos' work4="work4"></driver-search>
              <span class="dirver-style-span">
                <input type="radio" :value="floodCtrlVos.workNo4 ? floodCtrlVos.workNo4 : ''" v-model="floodCtrlVos.respWorkNo" name="respWorkNo" id="respWorkNo4" :disabled="!floodCtrlVos.workNo4">
                <label for="respWorkNo4">设为责任人</label>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">机车:</td>
            <td class="td-left">
              <train-search @getLm='getLm' :train="floodCtrlVos.lmNo ? floodCtrlVos.lmNo + '，' + LM_TYPES[floodCtrlVos.lmType] + '，' + '编号:' + floodCtrlVos.lmModel : ''" :lmVo='lmVo'></train-search>
            </td>
          </tr>
          <tr>
            <td class="td-right">发生时间:</td>
            <td class="td-left">
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
          </tr>
          <tr>
            <td class="td-right">发生地点:</td>
            <td class="td-left">
              <input type="text" v-model="floodCtrlVos.location" v-validate="'required'" name="location"/><span class="warning"> *</span>
              <span v-show="errors.has('location')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">雨情雨量:</td>
            <td class="td-left">
              <input type="text" v-model="floodCtrlVos.rainfall" v-validate="'required'" name="rainfall"/><span class="warning"> *</span>
              <span v-show="errors.has('rainfall')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">录入者:</td>
            <td class="td-left">
              <input type="text" v-model="floodCtrlVos.reporter" v-validate="'required'" name="reporter"/><span class="warning"> *</span>
              <span v-show="errors.has('reporter')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">详情:</td>
            <td class="td-left">
              <textarea name="detail" id="" cols="40" rows="3" v-model="floodCtrlVos.detail" v-validate="'required'"></textarea><span class="warning"> *</span>
              <span v-show="errors.has('detail')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">备注:</td>
            <td class="td-left">
              <textarea rows="3" cols="40" v-model="floodCtrlVos.memo" name="memo"></textarea>
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
    name: 'floodCtrlVosAddBox',
    data () {
      return {
        loginPopup: false,
        timeDt: '',
        trainDt: '',
        respWorkNos: {},
        lmVo: {},
        workNo2: '',
        workNo3: '',
        workNo4: '',
        LM_TYPES: config.LM_TYPES,
        floodCtrlVos: this.floodCtrlVo
      }
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
    mounted () {
      this.$nextTick(() => {
        if (this.floodCtrlVos) {
          this.timeDt = this.floodCtrlVos.timeDt
          this.trainDt = this.floodCtrlVos.trainDt
          if (this.floodCtrlVos.sid) {
            this.respWorkNos.deptCode = this.floodCtrlVos.ctCode
            this.respWorkNos.deptType = 'CT'
          } else {
            this.respWorkNos.deptCode = config.deptCode
            this.respWorkNos.deptType = config.deptType
          }
          this.lmVo.rbCode = this.floodCtrlVos.rbCode
          this.lmVo.ldCode = this.floodCtrlVos.ldCode
        }
      })
    },
    components: {
      loginPopup,
      driverSearch,
      trainSearch
    },
    props: ['floodCtrlVo'],
    methods: {
      createInfoMgtBox () {
        let url = this.floodCtrlVos.sid ? '/api/flood-ctrl/mgt/update' : '/api/flood-ctrl/mgt/create'
//        for (let i in this.floodCtrlVos) {
//          if (this.floodCtrlVos[i] === '' && i !== 'timeDt' && i !== 'analysedDt' && i !== 'analyst' && i !== 'analystName' && i !== 'cate' && i !== 'cmdNo' && i !== 'driverDeptPath2' && i !== 'driverName2' && i !== 'traceDept' && i !== 'traceOwner' && i !== 'tracePoints' && i !== 'traceSummary' && i !== 'tracedDt' && i !== 'tracedResult' && i !== 'workNo2' && i !== 'updatedDt' && i !== 'updatedByWorkNo' && i !== 'tracePoints' && i !== 'updatedByName' && i !== 'tracePoints' && i !== 'createdByName' && i !== 'memo' && i !== 'updatedByName') {
//            return
//          }
//        }
        if (!this.floodCtrlVos.workNo1) {
          this.$message.error('请将司机格式填写正确')
          return
        }
        if (!this.floodCtrlVos.lmNo) {
          this.$message.error('请将机车格式填写正确')
          return
        }
        if (!this.floodCtrlVos.respWorkNo) {
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
        this.floodCtrlVos.timeDt = config.dateToString(new Date(this.timeDt), 'yyyy-MM-dd hh:mm:ss')
        this.floodCtrlVos.trainDt = config.dateToString(new Date(this.trainDt), 'yyyy-MM-dd')
        if (this.floodCtrlVos.workNo1 === this.floodCtrlVos.workNo2 || this.floodCtrlVos.workNo1 === this.floodCtrlVos.workNo3 || this.floodCtrlVos.workNo1 === this.floodCtrlVos.workNo4) {
          this.$message({
            message: '值乘司机不能相同',
            type: 'error'
          })
          return
        }
        if (this.floodCtrlVos.workNo2) {
          if (this.floodCtrlVos.workNo3) {
            if (this.floodCtrlVos.workNo2 === this.floodCtrlVos.workNo3 || this.floodCtrlVos.workNo4 === this.floodCtrlVos.workNo3 || this.floodCtrlVos.workNo4 === this.floodCtrlVos.workNo2) {
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
          data: this.floodCtrlVos,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.floodCtrlVos)
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
        this.floodCtrlVos.workNo1 = resp.workNo
        this.floodCtrlVos.respWorkNo = resp.workNo
        this.floodCtrlVos.rbCode = resp.rbCode
        this.floodCtrlVos.ldCode = resp.ldCode
        this.floodCtrlVos.tsCode = resp.tsCode
        this.floodCtrlVos.ttCode = resp.ttCode
        this.floodCtrlVos.ctCode = resp.ctCode
      },
      getDriver2 (resp) {
        this.floodCtrlVos.workNo2 = resp.workNo
        this.workNo2 = this.floodCtrlVos.workNo2
      },
      getDriver3 (resp) {
        this.floodCtrlVos.workNo3 = resp.workNo
        this.workNo3 = this.floodCtrlVos.workNo3
      },
      getDriver4 (resp) {
        this.floodCtrlVos.workNo4 = resp.workNo
        this.workNo4 = this.floodCtrlVos.workNo4
      },
      getLm (lm) {
        if (lm) {
          this.floodCtrlVos.lmNo = lm.no
          this.floodCtrlVos.lmType = lm.type
          this.floodCtrlVos.lmModel = lm.model
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
  .dirver-style-span label {
    float: left;
    line-height: 33px;
  }
  .dirver-style-span input[type="radio"] {
    float: left;
    margin-right: 10px;
  }
</style>
