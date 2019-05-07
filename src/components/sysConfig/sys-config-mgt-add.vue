<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>系统配置</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">选择分组:</td>
            <td class="td-left">
              <select v-model="configVos.groupSid" class="select-class" style="width: 183px;">
                <option :value="sid" v-for="(group, sid) in groups" v-model="configVos.groupSid">{{ group[1] }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="td-right">配置项编码:</td>
            <td class="td-left">
              <input type="text" v-model="configVos.code" v-validate="'required'" name="code" :title="configVos.code"/><span class="warning"> *</span>
              <span v-show="errors.has('code')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">配置项名称:</td>
            <td class="td-left">
              <input type="text" v-model="configVos.name" v-validate="'required'" name="name" :title="configVos.name"/><span class="warning"> *</span>
              <span v-show="errors.has('name')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">排列序号:</td>
            <td class="td-left">
              <input type="number" v-model="configVos.sortNum" /><span> 越大排在越前，默认为0</span>
            </td>
          </tr>
          <tr>
            <td class="td-right">参数1:</td>
            <td class="td-left">
              <textarea name="value1" cols="40" rows="3" v-model="configVos.value1" v-validate="'required'"></textarea><span class="warning"> *</span>
              <span v-show="errors.has('value1')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">参数2:</td>
            <td class="td-left">
              <textarea cols="40" rows="3" v-model="configVos.value2"></textarea>
            </td>
          </tr>
          <tr>
            <td class="td-right">参数3:</td>
            <td class="td-left">
              <textarea cols="40" rows="3" v-model="configVos.value3"></textarea>
            </td>
          </tr>
          <tr>
            <td class="td-right">参数4:</td>
            <td class="td-left">
              <textarea cols="40" rows="3" v-model="configVos.value4"></textarea>
            </td>
          </tr>
          <tr>
            <td class="td-right">备注:</td>
            <td class="td-left">
              <textarea cols="40" rows="3" v-model="configVos.memo"></textarea>
            </td>
          </tr>
        </table>
      </div>
      <div class="popup-submit">
        <el-button type="primary" @click="createConfigBox">提交</el-button>
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

  export default {
    name: 'configVosAddBox',
    data () {
      return {
        loginPopup: false,
        groups: {},
        configVos: this.configVo
      }
    },
    components: {
      loginPopup
    },
    props: ['configVo'],
    mounted () {
      let configGroupsList = config.getStorage('SYS_CONFIG_GROUPS')
      if (configGroupsList) {
        for (let index in configGroupsList) {
          let group = configGroupsList[index]
          this.groups[group.sid] = [ group.code, group.name ]
        }
      }
    },
    methods: {
      createConfigBox () {
        if (this.configVos.groupSid) {
          this.configVos.groupCode = this.groups[this.configVos.groupSid][0]
        } else {
          this.$message.error('请选择分组')
          return
        }
        let cols = {
          'code': '配置项编码',
          'name': '配置项名称',
          'value1': '参数1'
        }
        for (let i in cols) {
          if (!this.configVos[i]) {
            this.$message.error(`请将带红色*号的填写完整`)
            return
          }
        }
        if (this.configVos.sortNum < 0) {
          this.$message.error(`排列序号不能为负数`)
          return
        }
        let url = this.configVos.sid ? '/api/sys-config/mgt/update' : '/api/sys-config/mgt/create'
        this.axios({
          method: 'post',
          data: this.configVos,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.configVos)
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
      }
    }
  }
</script>

<style scoped>
 
</style>
