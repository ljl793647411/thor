<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-add">
      <div class="popup-head">
        <b>人员考核信息</b>
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
                  v-model="date"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </span>
              <span class="warning"> *</span>
              <span v-show="errors.has('date')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right" style="vertical-align: top;">责任单位:</td>
            <td class="td-left">
              <textarea name="respDept" cols="30" rows="2" v-model="paVo.respDept" v-validate="'required'"></textarea>
              <span class="warning"> *</span>
              <span v-show="errors.has('respDept')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">责任姓名:</td>
            <td class="td-left">
              <input type="text" v-model="paVo.respName" v-validate="'required'" name="respName"/><span class="warning"> *</span>
              <span v-show="errors.has('respName')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">检查地点:</td>
            <td class="td-left">
              <input type="text" v-model="paVo.location" v-validate="'required'" name="location"/><span class="warning"> *</span>
              <span v-show="errors.has('location')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right" style="vertical-align: top;">问题点代码:</td>
            <td class="td-left">
              <textarea name="problemCode" cols="30" rows="2" v-model="paVo.problemCode" v-validate="'required'"></textarea>
              <span class="warning"> *</span>
              <span v-show="errors.has('problemCode')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right" style="vertical-align: top;">问题点内容:</td>
            <td class="td-left">
              <textarea name="problemDesc" cols="30" rows="3" v-model="paVo.problemDesc" v-validate="'required'"></textarea>
              <span class="warning"> *</span>
              <span v-show="errors.has('problemDesc')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">级别:</td>
            <td class="td-left">
              <el-cascader
                :options="LEVELS"
                v-model="levels"
                @change="getLevels">
              </el-cascader>
              <span class="warning"> *</span>
              <span v-show="errors.has('level')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right">性质:</td>
            <td class="td-left">
              <el-cascader
                :options="TYPES"
                v-model="types"
                @change="getTypes">
              </el-cascader>
              <span class="warning"> *</span>
              <span v-show="errors.has('type')" class="prompt">不能为空 </span>
            </td>
          </tr>
          <tr>
            <td class="td-right" style="vertical-align: top;">整改情况:</td>
            <td class="td-left">
              <textarea name="improve" cols="30" rows="3" v-model="paVo.improve" v-validate="'required'"></textarea>
              <span class="warning"> *</span>
              <span v-show="errors.has('improve')" class="prompt">不能为空 </span>
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
    name: 'paVoAddBox',
    data () {
      return {
        loginPopup: false,
        LEVELS: config.getStorage('PA_LEVELS'),
        TYPES: config.getStorage('PA_TYPES'),
        levels: [],
        types: [],
        message: '',
        date: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (!this.paVo.sid) {
          this.paVo.rbCode = config.RBCode
          this.paVo.ldCode = config.deptCode
        }
        this.date = this.paVo.date
        this.levels.push(this.paVo.level)
        this.types.push(this.paVo.type)
      })
    },
    components: {
      loginPopup
    },
    props: ['paVo'],
    methods: {
      getLevels (value) {
        this.levels = value
      },
      getTypes (value) {
        this.types = value
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
        let url = this.paVo.sid ? '/api/pa/mgt/update' : '/api/pa/mgt/create'
        if (this.date > new Date()) {
          this.$message({
            message: '请选择合理的时间',
            type: 'error'
          })
          return
        }
        if (this.levels) {
          this.paVo.level = this.levels[0]
        }
        if (this.types) {
          this.paVo.type = this.types[0]
        }
        this.paVo.date = config.dateToString(new Date(this.date), 'yyyy-MM-dd')
        for (let i in this.paVo) {
          if (this.paVo[i] === '' && i !== 'respWorkNo' && i !== 'updatedByName' && i !== 'updatedByWorkNo' && i !== 'updatedDt') {
            this.$message.error('请将带红色*号的填写完整')
            return
          }
        }
        this.axios({
          method: 'post',
          data: this.paVo,
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeBox', this.paVo)
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
