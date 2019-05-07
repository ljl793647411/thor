<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>机车</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div>
        <table class="edit-table">
          <tr>
            <td class="td-right">机车编号:</td>
            <td class="td-left">
              <input type="text" v-model="lmVo.no" v-validate="'required'" name="no" :title="lmVo.no"/><span class="warning"> *</span>
              <span v-show="errors.has('no')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">机车型号:</td>
            <td class="td-left">
              <input type="text" v-model="lmVo.model" v-validate="'required'" name="model" :title="lmVo.model"/><span class="warning"> *</span>
              <span v-show="errors.has('model')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">机车类型:</td>
            <td class="td-left">
              <el-cascader
                :options="LM_TYPE_LIST"
                v-model="type"
                @change="getType">
              </el-cascader>
              <span class="warning"> *</span>
              <span v-show="errors.has('type')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">线别:</td>
            <td class="td-left">
              <input type="text" v-model="lmVo.cate1" v-validate="'required'" name="cate1" :title="lmVo.cate1"/><span class="warning"> *</span>
              <span v-show="errors.has('cate1')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">备注:</td>
            <td class="td-left">
              <textarea cols="40" rows="3" v-model="lmVo.memo"></textarea>
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
    name: 'lmVoAddBox',
    data () {
      return {
        loginPopup: false,
        LM_TYPE_LIST: config.LM_TYPE_LIST,
        type: []
      }
    },
    components: {
      loginPopup
    },
    props: ['lmVo'],
    mounted () {
      if (this.lmVo) {
        this.type.push(this.lmVo.type)
      }
      if (this.LM_TYPES[0].label === '全部') {
        this.LM_TYPES.splice(0, 1)
      }
    },
    methods: {
      getType (value) {
        this.type = value
      },
      submitData () {
        if (this.type && this.type.length !== 0) {
          this.lmVo.type = this.type[0]
        }
        let rps = {
          'no': '机车编号',
          'model': '机车型号',
          'type': '机车类型',
          'cate1': '线别'
        }
        for (let i in rps) {
          if (!this.lmVo[i]) {
            this.$message.error(`请填写${rps[i]}`)
            return
          }
        }
        let url = this.lmVo.sid ? '/api/lm/mgt/update' : '/api/lm/mgt/create'
        this.lmVo.rbCode = config.RBCode
        this.lmVo.ldCode = config.deptCode
        this.axios({
          method: 'post',
          data: this.lmVo,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.lmVo)
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          } else if (data.type === 4101) { // 登入信息验证失败
            this.$message.error(`机车编号已经存在，请确认`)
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
