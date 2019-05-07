<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>角色信息</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr v-if="!roleVo.sid">
            <td class="td-right">角色编码:</td>
            <td class="td-left">
              <input type="text" v-model="roleVo.code" v-validate="'required'" name="code"/><span class="warning"> *</span>
              <span v-show="errors.has('code')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr v-else>
            <td class="td-right">角色编码:</td>
            <td class="td-left" v-text="roleVo.code"></td>
          </tr>
          <tr>
            <td class="td-right">角色:</td>
            <td class="td-left">
              <input type="text" v-model="roleVo.name" v-validate="'required'" name="name"/><span class="warning"> *</span>
              <span v-show="errors.has('name')" class="prompt">不能为空 </span>
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

  export default {
    name: 'roleVoAddBox',
    data () {
      return {
        loginPopup: false
      }
    },
    components: {
      loginPopup
    },
    props: ['roleVo'],
    methods: {
      createInfoMgtBox () {
        let url = this.roleVo.sid ? '/api/role/mgt/update' : '/api/role/mgt/create'
        for (let i in this.roleVo) {
          if (this.roleVo[i] === '' && (i === 'code' || i === 'name')) {
            return
          }
        }
        this.axios({
          method: 'post',
          data: this.roleVo,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.roleVo)
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
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
