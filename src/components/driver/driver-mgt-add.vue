<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>司机</b>
        <div class="icon-remove" @click="boxClose">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">工号:</td>
            <td class="td-left" v-if="!driVo.sid">
              <input type="text" v-model="driVo.workNo" v-validate="'required'" name="workNo" :title="driVo.workNo"/><span class="warning"> *</span>
              <span v-show="errors.has('workNo')" class="prompt">不能为空 </span>
            </td>
            <td class="td-left" v-if="driVo.sid">
              <input type="text" v-model="driVo.workNo" name="workNo"/>
            </td>
          </tr>
          <tr>
            <td class="td-right">姓名:</td>
            <td class="td-left">
              <input type="text" v-model="driVo.name" v-validate="'required'" name="name" :title="driVo.name"/><span class="warning"> *</span>
              <span v-show="errors.has('name')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">指导组:</td>
            <td class="td-left">
              <input type="text" v-model="deptName" @click="changeBox">
              <span class="warning"> *</span>
              <span v-show="errors.has('name')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">出生日期:</td>
            <td class="td-left">
              <span class="block">
                <el-date-picker
                  v-model="dateOfBirth"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">性别:</td>
            <td class="td-left source-class">
              <template v-for="(text, value) in SEX">
                <input type="radio" name="sex" :value="value" v-model="driVo.sex" :id="'sex' + value"><label :for="'sex' + value">{{ text }}</label>
              </template>
            </td>
          </tr>
          <tr>
            <td class="td-right">在职状态:</td>
            <td class="td-left">
              <select v-model="driVo.status" class="select-class" style="width: 183px;">
                <option :value="key" v-for="(value, key) in STATUS_LIST">{{ value }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="td-right">驾照级别:</td>
            <td class="td-left">
              <input type="text" v-model="driVo.licenseLevel" name="licenseLevel"/>
            </td>
          </tr>
          <tr>
            <td class="td-right">学历:</td>
            <td class="td-left">
              <input type="text" v-model="driVo.education" name="education"/>
            </td>
          </tr>
          <tr>
            <td class="td-right">政治面貌:</td>
            <td class="td-left">
              <input type="text" v-model="driVo.politicalStatus" name="politicalStatus"/>
            </td>
          </tr>
          <tr>
            <td class="td-right">技术资格:</td>
            <td class="td-left">
              <input type="text" v-model="driVo.technicalQualification" name="technicalQualification"/>
            </td>
          </tr>
          <tr>
            <td class="td-right">动车技术资格:</td>
            <td class="td-left">
              <input type="text" v-model="driVo.emuTechnicalQualification" name="emuTechnicalQualification"/>
            </td>
          </tr>
          <tr>
            <td class="td-right">备注:</td>
            <td class="td-left">
              <textarea cols="40" rows="3" v-model="driVo.memo"></textarea>
            </td>
          </tr>
        </table>
      </div>
      <div class="err-msg" v-text="errMsg"></div>
      <div class="popup-submit">
        <el-button type="primary" @click="submitData">提交</el-button>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="deptBox">
      <dept-radio-box @getDeptCode="getDeptCode" driver="true"></dept-radio-box>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import deptRadioBox from '@/components/dept-radio-box'

  export default {
    name: 'driVoAddBox',
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
        errMsg: '',
        loginPopup: false,
        msgBox: false,
        deptBox: false,
        message: '',
        deptName: '',
        dateOfBirth: '',
        LM_TYPES: config.LM_TYPES,
        STATUS_LIST: config.STATUS_LIST,
        SEX: config.SEX
      }
    },
    components: {
      loginPopup,
      deptRadioBox
    },
    props: ['driVo'],
    mounted () {
      this.$nextTick(() => {
        this.deptName = this.driVo.ctName
        this.dateOfBirth = this.driVo.dateOfBirth
      })
    },
    methods: {
      submitData () {
        let rps = {
          'workNo': '工号',
          'name': '姓名',
          'ctCode': '指导组'
        }
        for (let i in rps) {
          if (!this.driVo[i]) {
            this.$message.error(`请将${rps[i]}填写完整`)
            return
          }
        }
        if (this.dateOfBirth) {
          this.driVo.dateOfBirth = config.dateToString(new Date(this.dateOfBirth), 'yyyy-MM-dd')
        }
        let url = this.driVo.sid ? '/api/op/driver/mgt/update' : '/api/op/driver/mgt/create'
        this.axios({
          method: 'post',
          data: this.driVo,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.driVo)
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
      boxClose () {
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
      getDeptCode (result) {
        this.deptBox = false
        if (!result.sid) {
          return
        }
        this.deptName = result.name
        if (result.type) {
          this.driVo.ctCode = result.code
        }
      },
      changeBox () {
        this.deptBox = true
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
