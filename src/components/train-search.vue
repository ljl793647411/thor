  <template>
  <div style="display: inline-block">
    <input type="text" v-model="lm" name="lmVo" @focus="lmBoxChange" @blur="lmBoxClose" v-validate=" 'required'" class="lmInput"/>
    <span class="warning" v-if="!noRequired"> *</span>
    <span v-show="errors.has('lmVo')" class="prompt" v-if="!noRequired">不能为空 </span>
    <ul v-if="lmVoList.length !== 0 && lmBox" class="search-box cursor">
      <li v-for="lm in lmVoList" :key="lm.sid" @click="getLm(lm)">{{ lm.no + '，' + LM_TYPES[lm.type] + '，' + '型号' + lm.model }}</li>
    </ul>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  export default {
    data () {
      return {
        lm: '',
        lmVoList: [],
        lmBox: false,
        LM_TYPES: config.LM_TYPES,
        loginPopup: false
      }
    },
    watch: {
      lm: 'changelmVo'
    },
    mounted () {
      this.$nextTick(() => {
        console.log('司机模糊查询')
        if (this.train) {
          this.lm = this.train
        }
      })
    },
    components: {
      loginPopup,
      config
    },
    props: ['lmVo', 'train', 'noRequired'],
    methods: {
      changelmVo () {
        if (encodeURI(this.lm).length < 2) {
          return
        }
        if (this.lm.length === 0) {
          this.lmVoList = []
        }
        this.lmVo.rbCode = config.RBCode
        this.lmVo.ldCode = config.deptCode
        this.lmVo.noLike = this.lm
        setTimeout(() => {
          this.axios({
            method: 'get',
            params: this.lmVo,
            url: '/api/lm/view/search-by-no'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              this.lmVoList = data.result.list
            } else if (data.type === 401) { // 登入信息验证失败
              config.gotoLogin()
              this.loginPopup = true
            }
          }).catch((error) => {
            console.log(error)
          })
        }, 500)
      },
      getLm (lm) {
        this.lm = `${lm.no}，${this.LM_TYPES[lm.type]}，编号:${lm.model}`
        console.log(this.$el.textContent)
        this.$nextTick(function () {
          console.log(this.$el.textContent) // => '更新完成'
        })
        this.$emit('getLm', lm)
        this.lmVoList = []
        this.lmBox = false
      },
      lmBoxChange () {
        this.lm = ''
        this.$emit('getLm')
        this.lmBox = true
      },
      lmBoxClose () {
        setTimeout(() => {
          this.lmVoList = []
          this.lmBox = false
        }, 500)
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
 .search-box {
    width: 300px;
  }
</style>
