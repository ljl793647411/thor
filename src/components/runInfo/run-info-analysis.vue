<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-analysis">
      <div class="popup-head">
        <b>分析详情</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div v-if="analysis.analysedDt" class="popup-info-msg">
        <div v-text="analysis.analystName + '(' + analysis.analyst + ') 创建于 ' + analysis.analysedDt
"></div>
        <div v-if="analysis.updatedDt" v-text="analysis.updatedByName + '(' + analysis.updatedByWorkNo + ') 修改于 ' + analysis.updatedDt"></div>
      </div>
      <div class="dri2-box" :class="{'margin-top-class': !analysis.analysedDt}">
        <div class="dri-box-analysis">
          <div class="dri-box-analysis-child">
            <span>音频文件核对：</span>
            <div>
              <input type="radio" :value="true" v-model="analysis.analysedAudio" id="analysedAudio1">
              <label for="analysedAudio1" class="cursor">是</label>
              <input type="radio" :value="false" v-model="analysis.analysedAudio" id="analysedAudio0">
              <label for="analysedAudio0" class="cursor">否</label>
            </div>
          </div>
          <div class="dri-box-analysis-child">
            <span>视频文件核对：</span>
            <div>
              <input type="radio" :value="true" v-model="analysis.analysedVideo" id="analysedVideo1">
              <label for="analysedVideo1" class="cursor">是</label>
              <input type="radio" :value="false" v-model="analysis.analysedVideo" id="analysedVideo0">
              <label for="analysedVideo0" class="cursor">否</label>
            </div>
          </div>
        </div>
        <div class="dri-box-analysis">
          <input type="checkbox" v-model="analysis.fogAnalysis" id="fogAnalysis">
          <label for="fogAnalysis" class="cursor">雾天专项分析</label>
          <div v-if="analysis.fogAnalysis">
            <div class="dri-box-analysis-child">
              <span>恢复双人值乘情况：</span>
              <div>
                <input type="radio" :value="true" v-model="analysis.fogDoubleTtd" id="fogDoubleTtd1">
                <label for="fogDoubleTtd1" class="cursor">是</label>
                <input type="radio" :value="false" v-model="analysis.fogDoubleTtd" id="fogDoubleTtd0">
                <label for="fogDoubleTtd0" class="cursor">否</label>
              </div>
            </div>
            <div class="dri-box-analysis-child">
              <span>降雾区段防伤鸣笛情况：</span>
              <div>
                <input type="radio" :value="true" v-model="analysis.fogWhistle" id="fogWhistle1">
                <label for="fogWhistle1" class="cursor">是</label>
                <input type="radio" :value="false" v-model="analysis.fogWhistle" id="fogWhistle0">
                <label for="fogWhistle0" class="cursor">否</label>
              </div>
            </div>
            <div class="dri-box-analysis-child">
              <span>接收临时调度命令呼唤核对：</span>
              <div>
                <input type="radio" :value="true" v-model="analysis.fogCallVerification" id="fogCallVerification1">
                <label for="fogCallVerification1" class="cursor">是</label>
                <input type="radio" :value="false" v-model="analysis.fogCallVerification" id="fogCallVerification0">
                <label for="fogCallVerification0" class="cursor">否</label>
              </div>
            </div>
            <div class="dri-box-analysis-child">
              <span>信息反馈情况核对：</span>
              <div>
                <input type="radio" :value="true" v-model="analysis.fogFeedbackCheck" id="fogFeedbackCheck1">
                <label for="fogFeedbackCheck1" class="cursor">是</label>
                <input type="radio" :value="false" v-model="analysis.fogFeedbackCheck" id="fogFeedbackCheck0">
                <label for="fogFeedbackCheck0" class="cursor">否</label>
              </div>
              
            </div>
          </div>
        </div>
        <div class="dri-box-analysis">
          <input type="checkbox" v-model="analysis.needTrace" @click="changeNeedTraceState" id="needTrace">
          <label for="needTrace" class="cursor">追踪</label>
          <div v-if="analysis.needTrace">
            <div class="dri-box-analysis-child">
              <label for="tracePoints" style="vertical-align: top;">追踪分析项点：</label>
              <textarea cols="35" v-model="analysis.tracePoints" name="tracePoints"></textarea>
            </div>
            <div class="dri-box-analysis-child">
              <label for="traceSummary">问题性质：</label>
              <input type="text" v-model="analysis.traceSummary" name="traceSummary">
            </div>
            <div class="dri-box-analysis-child">
              <label for="traceOwner">追踪责任人：</label>
              <input type="text" v-model="analysis.traceOwner" name="traceOwner">
            </div>
            <div class="dri-box-analysis-child">
              <label for="traceDept">涉及部门：</label>
              <input type="text" v-model="analysis.traceDept" name="traceDept">
            </div>
          </div>
        </div>
        <div class="popup-submit">
          <el-button type="primary" @click="addAnalysis">提交</el-button>
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
    props: ['analysis'],
    components: {
      loginPopup,
      config
    },
    mounted () {
      this.$nextTick(() => {
        console.log(this.analysis)
      })
    },
    methods: {
      changeNeedTraceState () {
        if (!this.analysis.needTrace) {
          this.analysis.needTrace = true
          this.analysis.traceDept = ''
          this.analysis.tracePoints = ''
          this.analysis.traceOwner = ''
          this.analysis.traceSummary = ''
        }
      },
      addAnalysis () {
        if (this.analysis.needTrace) {
          if (!this.analysis.traceDept || !this.analysis.tracePoints || !this.analysis.traceOwner || !this.analysis.traceSummary) {
            return
          }
        }
        this.axios({
          method: 'post',
          data: this.analysis,
          url: '/api/run-info/mgt/update-analysis-result'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('编辑成功')
            this.$emit('closeAnalysisBox', this.analysis)
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
      },
      editCancel () {
        this.$confirm('是否取消编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('closeAnalysisBox')
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


<style scoped>
  .dri2-box {
    width: 450px;
  }
  .dri2-box input[type="text"],.dri2-box textarea {
    height: 28px;
    font-size: 14px;
    border-radius: 5px;
  }
  .dri2-box input[type="text"] {
    line-height: 33px;
  }
  .dri2-box textarea {
    line-height: 28px;
  }
  .popup-analysis {
    width: 600px;
    z-index: 950;
    overflow-y: scroll;
    padding: 0 0 20px;
  }
  .popup-analysis .popup-head {
    width: 587px;
    position: fixed;
    z-index: 950;
  }
  .dri-box-analysis {
    width: 100%;
    height: auto;
    padding: 10px 20px;
    box-sizing: boder;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 20px 0;
  }
  .dri-box-analysis-child {
    width: 100%;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
  }
  .margin-top-class {
    margin-top: 50px;
  }
</style>
