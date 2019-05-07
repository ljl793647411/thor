<template>
  <div>
    <div class="modal-backdrop fade in" modal-animation-class="fade" modal-backdrop="modal-backdrop" modal-animation="true" style="z-index: 920;"></div>
    <div class="popup analysis">
      <div class="head" style="text-align: center;">
        <p style="font-weight: bold;">分析详情</p>
        <i class="icon-remove icon-white" @click="editCancel"></i>
      </div>
      <div v-if="this.floodAnalysis.analysedDt" class="info-msg">
        <div v-text="this.floodAnalysis.analystName + '(' + this.floodAnalysis.analyst + ') 创建于 ' + this.floodAnalysis.analysedDt
"></div>
        <div v-if="this.floodAnalysis.updatedDt" v-text="this.floodAnalysis.updatedByName + '(' + this.floodAnalysis.updatedByWorkNo + ') 修改于 ' + this.floodAnalysis.updatedDt"></div>
      </div>
      <div class="floodAnalysisBox dri-box">
        <div class="dri-tree">
          <div>
            <label>
              <span>音频文件核对：</span>
              <input type="radio" :value="true" v-model="floodAnalysis.analysedAudio" id="analysedAudio1">
              <label for="analysedAudio1">是</label>
              <input type="radio" :value="false" v-model="floodAnalysis.analysedAudio" id="analysedAudio0">
              <label for="analysedAudio0">否</label>
            </label>
          </div>
          <div>
            <label>
              <span>视频文件核对：</span>
              <input type="radio" :value="true" v-model="floodAnalysis.analysedVideo" id="analysedVideo1">
              <label for="analysedVideo1">是</label>
              <input type="radio" :value="false" v-model="floodAnalysis.analysedVideo" id="analysedVideo0">
              <label for="analysedVideo0">否</label>
            </label>
          </div>
          <div>
            <label>
              <span>一级地段：</span>
              <input type="radio" :value="true" v-model="floodAnalysis.areaL1" id="areaL1">
              <label for="areaL1">是</label>
              <input type="radio" :value="false" v-model="floodAnalysis.areaL1" id="areaL0">
              <label for="areaL0">否</label>
            </label>
          </div>
          <div>
            <label>
              <span>二级地段：</span>
              <input type="radio" :value="true" v-model="floodAnalysis.areaL2" id="areaL1">
              <label for="areaL1">是</label>
              <input type="radio" :value="false" v-model="floodAnalysis.areaL2" id="areaL0">
              <label for="areaL0">否</label>
            </label>
          </div>
          <div>
            <label>
              <span>瞭望困难地段：</span>
              <input type="radio" :value="true" v-model="floodAnalysis.areaHardToLook" id="areaHardToLook1">
              <label for="areaHardToLook1">是</label>
              <input type="radio" :value="false" v-model="floodAnalysis.areaHardToLook" id="areaHardToLook0">
              <label for="areaHardToLook0">否</label>
            </label>
          </div>
        </div>
        <div class="popup-submit">
          <div class="btn-primary btn-md dept-box-btn" @click="addfloodAnalysis">提交</div>
        </div>
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
    data () {
      return {
        loginPopup: false
      }
    },
    props: ['floodAnalysis'],
    components: {
      loginPopup,
      config
    },
    mounted () {
      this.$nextTick(() => {
        console.log(this.floodAnalysis)
      })
    },
    methods: {
      addfloodAnalysis () {
        this.axios({
          method: 'post',
          data: this.floodAnalysis,
          url: '/api/flood-ctrl/mgt/update-analysis-result'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closefloodAnalysisBox', this.floodAnalysis)
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          } else if (data.type === 403) {
            this.msgBox = true
            this.message = data.msg
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
          this.$emit('closefloodAnalysisBox')
          this.$message({
            type: 'info',
            message: '编辑取消!'
          })
        }).catch(() => {
        })
      }
    }
  }
</script>


<style>
  .popup.analysis {
    z-index: 920;
    overflow-y: scroll;
  }

  .icon-remove {
     right: 25px;
   }

  .info-msg {
    margin-top: 30px;
    margin-left: 73px;
    line-height: 30px;
  }

  .floodAnalysisBox.dri-box {
    width: 80%;
    height: 500px;
    font-size: 16px;
    margin-top: 30px;
    line-height: 20px;
  }

  .popup-submit {
    margin-top: 20px;
  }
</style>
