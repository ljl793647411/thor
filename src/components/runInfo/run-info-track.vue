<template>
  <div>
    <div class="zhezhao" style="z-index: 950;"></div>
    <div class="popup-analysis">
      <div class="popup-head">
        <b>录入追踪结果</b>
        <div class="icon-remove" @click="editCancel">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div v-if="track.analysedDt" class="popup-info-msg">
        <div v-text="track.analystName + '(' + track.analyst + ') 创建于 ' + track.analysedDt
"></div>
        <div v-if="track.updatedDt" v-text="track.updatedByName + '(' + track.updatedByWorkNo + ') 修改于 ' + track.updatedDt"></div>
      </div>
      <div class="track-table">
        <table>
          <tr>
            <td class="td-right">信息概况:</td>
            <td class="td-left">
              <div v-text="track.detail"></div>
            </td>
          </tr>
          <tr>
            <td class="td-right">分析项点:</td>
            <td class="td-left">
              <div v-text="track.tracePoints"></div>
            </td>
          </tr>
          <tr>
            <td class="td-right">落实情况:</td>
            <td class="td-left">
              <div>
                <textarea rows="9" cols="40" v-model="track.tracedResult" name="memo"></textarea>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="popup-submit">
        <el-button type="primary" @click="addTrack">提交</el-button>
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
    props: ['track'],
    components: {
      loginPopup,
      config
    },
    mounted () {
      this.$nextTick(() => {
        console.log(this.track)
      })
    },
    methods: {
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
          this.$emit('closeTrackBox')
          this.$message({
            type: 'info',
            message: '编辑取消!'
          })
        }).catch(() => {
        })
      },
      addTrack () {
        if (!this.track.tracedResult) {
          return
        }
        this.axios({
          method: 'post',
          data: this.track,
          url: '/api/run-info/mgt/update-trace-result'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('录入成功')
            this.$emit('closeTrackBox', this.track)
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          } else if (data.type === 403) {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>


<style>
  .track-table {
    width: 450px;
    margin: 0 auto;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .track-table tr {
    height: 34px;
  }
  .track-table .td-left {
    margin-left: 20px;
  }
  .track-table textarea {
    font-size: 14px;
    border-radius: 5px;
    line-height: 28px;
  }
</style>
