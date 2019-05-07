<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>用户信息</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">登录名:</td>
            <td class="td-left" v-if="!userVo.sid">
              <input type="text" v-model="userVo.loginName" v-validate="'required'" name="loginName"/><span class="warning"> *</span>
              <span v-show="errors.has('loginName')" class="prompt">不能为空</span>
            </td>
            <td class="td-left" v-if="userVo.sid" v-text="userVo.loginName"></td>
          </tr>
          <tr>
            <td class="td-right">密码:</td>
            <td class="td-left" v-if="!userVo.sid">
              <input type="password" v-model="pwd1" v-validate="'required'" name="pwd1"/><span class="warning"> *</span>
              <span v-show="errors.has('pwd1')" class="prompt">不能为空</span>
            </td>
            <td class="td-left" v-if="userVo.sid">
              <input type="password" v-model="pwd1" name="pwd1"/>
            </td>
          </tr>
          <tr>
            <td class="td-right">再次输入密码:</td>
            <td class="td-left">
              <input type="password" v-model="pwd2" name="pwd2"/>
            </td>
          </tr>
          <template v-if="userVo.loginName !== 'admin'">
          <tr>
            <td class="td-right">姓名:</td>
            <td class="td-left">
              <input type="text" v-model="userVo.name" v-validate="'required'" name="name"/><span class="warning"> *</span>
              <span v-show="errors.has('name')" class="prompt">不能为空</span>
            </td>
          </tr>
          <tr>
            <td class="td-right">性别:</td>
            <td class="td-left source-class" v-if="userVo.sid !== 1">
              <template v-for="(text, value) in SEX">
              <input type="radio" name="sex" :value="value" v-model="userVo.sex" :id="'sex' + value"><label :for="'sex' + value">{{ text }}</label>
              </template>
            </td>
          </tr>
          <tr>
            <td class="td-right">启用状态:</td>
            <td class="td-lef source-class">
              <input type="radio" name="enabled" value="true" v-model="userVo.enabled" id="enabled1"><label for="enabled1">启用</label>
              <input type="radio" name="enabled" value="false" v-model="userVo.enabled" id="enabled2"><label for="enabled2">禁用</label>
            </td>
          </tr>
          <tr>
            <td class="td-right">在职状态:</td>
            <td class="td-left">
              <select v-model="userVo.status" class="select-class">
                <option v-for="(status,index) in STATUS_LIST" :value="index">{{ status }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="td-right">系统管理员:</td>
            <td class="td-left source-class">
              <input type="radio" name="admin" value="true" v-model="userVo.admin" id="admin1"><label for="admin1">是</label>
              <input type="radio" name="admin" value="false" v-model="userVo.admin" id="admin2"><label for="admin2">否</label>
            </td>
          </tr>
          <tr>
            <td class="td-right">所属组织:</td>
            <td class="td-left">
              <div v-if="userVo.deptNamePath" class="multi-line-text">{{ userVo.deptNamePath }}</div>
              <button @click="showChangeDeptPopup = true" class="button-link">选择运用车间</button>
              <button @click="showChangeOmDeptPopup = true" class="button-link">选择检修车间</button>
            </td>
          </tr>
          <tr>
            <td class="td-right">数据权限:</td>
            <td class="td-left">
              <div v-if="userVo.dataDeptNamePaths && userVo.dataDeptNamePaths.length" v-model="userVo.dataDeptNamePaths" v-html="userVo.dataDeptNamePaths.join('<br>')" class="multi-line-text"></div>
              <button @click="setDataDeptAsLd" class="button-link">设为机务段</button>
              <button @click="showChangeDataDeptPopup = true" class="button-link">选择运用车间</button>
              <button @click="showChangeDataOmDeptPopup = true" class="button-link">选择检修车间</button>
            </td>
          </tr>
          <tr>
            <td class="td-right">关联角色:</td>
            <td class="td-left">
              <div v-if="userVo.roleNames && userVo.roleNames.length" v-model="userVo.roleNames" @click="showSelectRolePopup = true" class="multi-line-text">
                {{ userVo.roleNames.join('、') }}
              </div>
              <button @click="showSelectRolePopup = true" class="button-link">选择</button>
            </td>
          </tr>
          </template>
        </table>
      </div>
      <div class="popup-submit">
        <el-button type="primary" @click="submitAddEdit">提交</el-button>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
    <div v-if="showChangeDeptPopup">
      <select-single-dept-popup @getDeptCode="onChangeDeptPopupClose"></select-single-dept-popup>
    </div>
    <div v-if="showChangeOmDeptPopup">
      <select-single-om-dept-popup @getOmCode="onChangeDeptPopupClose" :omType="{'omts': true, 'omt': true, 'omp': true}"></select-single-om-dept-popup>
    </div>
    <div v-if="showChangeDataDeptPopup" class="dri-choose">
      <select-multi-dept-popup @getDeptCode='onChangeDataDeptPopupClose' driver="false"></select-multi-dept-popup>
    </div>
    <div v-if="showChangeDataOmDeptPopup" class="dri-choose">
      <select-multi-om-dept-popup @getDeptCode='onChangeDataDeptPopupClose'></select-multi-om-dept-popup>
    </div>
    <div v-if="showSelectRolePopup">
      <role-box @boxClose='onSelectRolePopupClose' :roleSids='userVo.roleSids'></role-box>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import selectSingleDeptPopup from '@/components/dept-radio-box'
  import selectSingleOmDeptPopup from '@/components/ts-overhaul-radio-box'
  import selectMultiDeptPopup from '@/components/dept-box'
  import selectMultiOmDeptPopup from '@/components/ts-overhaul-box'
  import roleBox from '@/components/user/role-box'
  import md5 from 'js-md5'

  export default {
    name: 'userVoAddBox',
    data () {
      return {
        STATUS_LIST: config.STATUS_LIST,
        DEPT_TYPE: config.DEPT_TYPE,
        SEX: config.SEX,
        showChangeDeptPopup: false,
        showChangeOmDeptPopup: false,
        showChangeDataDeptPopup: false,
        showChangeDataOmDeptPopup: false,
        usersName: '',
        showSelectRolePopup: false,
        userList: [],
        loginPopup: false,
        pwd1: '',
        pwd2: '',
        msg: '',
        type: '',
        showMsgBox: false,
        message: ''
      }
    },
    components: {
      loginPopup,
      selectSingleDeptPopup,
      selectSingleOmDeptPopup,
      selectMultiDeptPopup,
      selectMultiOmDeptPopup,
      roleBox,
      md5
    },
    watch: {
      pwd2: 'checkPwd'
    },
    props: ['userVo'],
    mounted () {
      if (this.userVo) {
        if (!this.userVo.dataDeptNamePaths) {
          this.userVo.dataDeptNamePaths = []
        }
      }
    },
    methods: {
      closeUserBox () {
        this.$emit('closeBox')
      },
      submitAddEdit () {
        let url = this.userVo.sid ? '/api/user/mgt/update' : '/api/user/mgt/create'
        if (this.pwd2 !== this.pwd1) {
          this.$message.error('请两次密码保持一致')
          return
        }
        if (!this.userVo.loginName || !this.userVo.sex || this.userVo.enabled === undefined || !this.userVo.status || this.userVo.admin === undefined) {
          return
        }
        if (this.pwd1) {
          this.userVo.pwd = this.pwd1
          this.userVo.pwd = md5.hex(this.userVo.pwd)
        }
        let self = this
        this.axios({
          method: 'post',
          data: this.userVo,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            self.$message.success('编辑成功')
            self.$emit('closeBox')
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            self.loginPopup = true
          } else {
            self.$message.error(data.msg)
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
      onChangeDeptPopupClose (result) {
        this.showChangeDeptPopup = false
        this.showChangeOmDeptPopup = false
        if (!result.sid) {
          return
        }
        if (result.workNo) {
          this.message = '必须选择部门，不能选择司机'
          this.showMsgBox = true
          return
        }
        if (result.codePath) {
          this.userVo.deptNamePath = result.namePath.replace(/,/g, ' > ')
          let codes = result.codePath.split(',')
          if (codes.length > 0) {
            this.userVo.rbCode = codes[0]
            if (codes.length > 1) {
              this.userVo.ldCode = codes[1]
              if (codes.length > 2) {
                this.userVo.tsCode = codes[2]
                if (codes.length > 3) {
                  this.userVo.ttCode = codes[3]
                  if (codes.length > 4) {
                    this.userVo.ctCode = codes[4]
                  }
                }
              }
            }
          }
        }
      },
      setDataDeptAsLd () {
        this.userVo.dataDeptType = config.deptType
        this.userVo.dataDeptCodes = [ config.deptCode ]
        this.userVo.dataDeptNamePaths = [ '西安铁路局 > 西安机务段' ]
      },
      onChangeDataDeptPopupClose (result) {
        if (result) {
          this.userVo.dataDeptCodes = []
          this.userVo.dataDeptNamePaths = []
          this.userVo.dataDeptType = result.deptType
          for (let i in result.depts) {
            this.userVo.dataDeptCodes.push(result.depts[i].code)
            this.userVo.dataDeptNamePaths.push(result.depts[i].namePath)
          }
          this.showChangeDataDeptPopup = false
          this.showChangeDataOmDeptPopup = false
        }
      },
      onSelectRolePopupClose (result) {
        this.userVo.roleNames = []
        this.userVo.roleSids = []
        for (let i in result) {
          this.userVo.roleNames.push(result[i].name)
          this.userVo.roleSids.push(result[i].sid)
        }
        this.showSelectRolePopup = false
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
