<template>
  <div>
    <input type="text" v-model="vod" name="vod" @focus="vodBoxChange" @blur="vodBoxClose"/>
    <ul v-if="vodList.length !== 0 && vodBox" class="search-box cursor">
      <li v-for="vod in vodList" :key="vod.sid" @click="getVod(vod)" v-html="'编码:'+vod.code + '<br>' + '地点:' + vod.location + '<br>' + '详情:' + vod.content"></li>
    </ul>
  </div>
</template>
<script>
  import config from '@/components/config'
  export default {
    data () {
      return {
        vod: '',
        vodList: [],
        vodBox: false,
        vodLists: []
      }
    },
    watch: {
      vod: 'changeVod'
    },
    mounted () {
      this.$nextTick(() => {
        console.log('两违模糊查询')
        if (this.driVod) {
          this.vodLists = config.getStorage('DRI_VOD')
        } else if (this.omVod) {
          this.vodLists = config.getStorage('OM_VOD')
        }
      })
    },
    props: ['driVod', 'omVod'],
    methods: {
      changeVod () {
        this.vodList = []
        if (this.vod.length < 2) {
          return
        }
        if (this.vod.length === 0) {
          this.vodList = []
        }
        let vod = this.vod.toUpperCase()
        console.log(this.vod)
        for (let i in this.vodLists) {
          if (this.vodLists[i].code.indexOf(vod) >= 0 ||
            (this.vodLists[i].content && this.vodLists[i].content.indexOf(vod) >= 0)) {
            this.vodList.push(this.vodLists[i])
          } else if (this.vodLists[i].location) {
            if (this.vodLists[i].location.indexOf(vod) >= 0) {
              this.vodList.push(this.vodLists[i])
            }
          }
        }
      },
      getVod (vod) {
        this.vod = `编码:${vod.code}<br>地点:${vod.location}<br>详情:${vod.content}`
        this.$nextTick(function () {
          console.log(this.$el.textContent) // => 更新完成'
        })
        this.$emit('getDriVod', vod)
        console.log(vod)
        this.vodList = []
        this.vod = ''
        this.vodBox = false
      },
      vodBoxChange () {
        this.vodBox = true
      },
      vodBoxClose () {
        setTimeout(() => {
          this.vodList = []
          this.vodBox = false
        }, 500)
      }
    }
  }
</script>

<style scoped>
  .search-box {
    width: 300px;
  }
</style>
