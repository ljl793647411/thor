<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>部门编辑</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">代码:</td>
            <td class="td-left" v-if="!deptVo.sid">
              <input type="text" v-model="deptVo.code" v-validate="'required'" name="code"/><span class="warning"> *</span>
              <span v-show="errors.has('code')" class="prompt">不能为空</span>
            </td>
            <td  v-if="deptVo.sid" v-text="deptVo.code"></td>
          </tr>
          <tr>
            <td class="td-right">名称:</td>
            <td class="td-left">
              <input type="text" v-model="deptVo.name" v-validate="'required'" name="name"/><span class="warning"> *</span>
              <span v-show="errors.has('name')" class="prompt">不能为空</span>
            </td>
          </tr>
          <tr>
            <td class="td-right">类型:</td>
            <td class="td-left" v-if="!deptVo.sid">
              <el-cascader
                :options="DEPT_TYPE"
                v-model="deptType"
                @change="getType">
              </el-cascader>
              <span class="warning"> *</span>
              <span v-show="errors.has('name')" class="prompt">不能为空</span>
            </td>
            <td v-if="deptVo.sid" v-text="deptVo.type"></td>
          </tr>
          <tr v-if="deptShow !== 'LD' && deptShow !== 'RB' && deptShow !== ''">
            <td class="td-right">所属组织:</td>
            <td class="td-left" v-if="!deptVo.sid"  >
              <div v-if="deptNamePath" class="multi-line-text" v-text="deptNamePath"></div>
              <div>
                <button @click="showChangeDeptPopup = true" class="button-link" v-if="deptShow !== 'OMTS' && deptShow !== 'OMT' && deptShow !== 'OMP'">选择运用车间</button>
                <button @click="showChangeOmDeptPopup = true" class="button-link" v-if="deptShow !== 'TT' && deptShow !== 'CT' && deptShow !== 'TS'">选择检修车间</button>
              </div>
            </td>
            <td v-if="deptVo.sid" v-text="deptNamePath"></td>
          </tr>
          <tr>
            <td class="td-right">备注:</td>
            <td class="td-left">
              <textarea cols="40" rows="3" v-model="deptVo.memo"></textarea>
            </td>
          </tr>
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
      <select-single-dept-popup @getDeptCode="onChangeDeptPopupClose" :deptVo="true" :deptShow="deptShow"></select-single-dept-popup>
    </div>
    <div v-if="showChangeOmDeptPopup">
      <select-single-om-dept-popup @getOmCode="onChangeDeptPopupClose" :deptShow="deptShow"></select-single-om-dept-popup>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'
  import selectSingleDeptPopup from '@/components/dept-radio-box'
  import selectSingleOmDeptPopup from '@/components/ts-overhaul-radio-box'

  export default {
    name: 'deptVoAddBox',
    data () {
      return {
        DEPT_TYPE: config.DEPT_TYPE,
        showChangeDeptPopup: false,
        showChangeOmDeptPopup: false,
        usersName: '',
        userList: [],
        loginPopup: false,
        message: '',
        deptNamePath: '',
        deptData: {},
        deptShow: '',
        deptType: []
      }
    },
    components: {
      loginPopup,
      selectSingleDeptPopup,
      selectSingleOmDeptPopup
    },
    props: ['deptVo'],
    mounted () {
      if (this.deptVo.sid) {
        this.deptNamePath = this.deptVo.codePath
        this.deptType.push(this.deptVo.type)
      }
      if (this.DEPT_TYPE[0].label === '全部') {
        this.DEPT_TYPE.splice(0, 1)
      }
    },
    computed: {
      type () {
        return this.deptVo.type
      }
    },
    watch: {
      deptType: function (val) {
        this.deptShow = val[0]
      }
    },
    methods: {
      getType (value) {
        this.deptType = value
      },
      closeUserBox () {
        this.$emit('closeBox')
      },
      submitAddEdit () {
        if (this.deptType && this.deptType.length !== 0) {
          this.deptVo.type = this.deptType[0]
        }
        let cols = {
          'code': '代码',
          'name': '名称',
          'type': '类型'
        }
        for (let i in cols) {
          if (!this.deptVo[i]) {
            this.$message.error(`请将${cols[i]}填写完整`)
            return
          }
        }
        if (this.deptVo.type === 'LD') {
          this.deptVo.parentCode = 'XATLJ'
        }
        let url = this.deptVo.sid ? '/api/op/dept/mgt/update' : '/api/op/dept/mgt/create'
        this.axios({
          method: 'post',
          data: this.deptVo,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.deptVo)
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
        if (result) {
          if (result === 'XAJWD') {
            this.deptVo.parentCode = result
          } else {
            this.deptNamePath = result.namePath
            this.deptVo.parentCode = result.code
          }
        }
      },
      onMsgBoxClose () {
        this.showMsgBox = false
        this.message = ''
      }
    }
  }
</script>

<style scoped>
</style>
