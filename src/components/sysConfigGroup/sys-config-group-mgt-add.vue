<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>系统设置分组</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">代码:</td>
            <td class="td-left">
              <input type="text" v-model="configVo.code" v-validate="'required'" name="code" :title="configVo.code"/><span class="warning"> *</span>
              <span v-show="errors.has('code')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">名称:</td>
            <td class="td-left">
              <input type="text" v-model="configVo.name" v-validate="'required'" name="name" :title="configVo.name"/><span class="warning"> *</span>
              <span v-show="errors.has('name')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">备注:</td>
            <td class="td-left">
              <textarea cols="40" rows="3" v-model="configVo.memo"></textarea>
            </td>
          </tr>
        </table>
      </div>
      <div class="popup-submit">
        <el-button type="primary" @click="submitData">提交</el-button>
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
    name: 'configVoAddBox',
    data () {
      return {
        loginPopup: false
      }
    },
    components: {
      loginPopup
    },
    props: ['configVo'],
    mounted () {
      console.log(this.configVo)
    },
    methods: {
      submitData () {
        let cols = {
          'code': '代码',
          'name': '名称'
        }
        for (let i in cols) {
          if (!this.configVo[i]) {
            this.$message.error(`请将${cols[i]}填写完整`)
            return
          }
        }
        let url = this.configVo.sid ? '/api/sys-config-group/mgt/update' : '/api/sys-config-group/mgt/create'
        this.axios({
          method: 'post',
          data: this.configVo,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.configVo)
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
