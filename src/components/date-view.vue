<template>
  <div class="date-view">
    <el-radio-group v-model="radio" :change="change(radio)">
      <el-radio-button label="周报" border></el-radio-button>
      <el-radio-button label="月报" border></el-radio-button>
    </el-radio-group>
    <div class="date" v-show="radio === '周报'">
      <el-date-picker
        v-model="week"
        type="week"
        format="yyyy 第 WW 周"
        placeholder="选择周"
        :editable="false"
        @change="getWeek">
      </el-date-picker>
    </div>
    <span class="date" v-show="radio === '月报'">
      <el-date-picker
        v-model="mouth"
        type="month"
        :editable="false"
        placeholder="选择月"
        @change="getMouth">
      </el-date-picker>
    </span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        week: '',
        mouth: '',
        radio: '月报',
        value: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
      })
    },
    props: ['to'],
    methods: {
      change (value) {
        if (this.value === value) {
          return
        }
        this.value = value
        if (this.value === '周报') {
          this.getWeek()
        } else if (this.value === '月报') {
          this.getMouth()
        }
      },
      getWeek () {
        let nowDay = new Date(new Date()).getDay()
        let from
        let to
        let now
        if (nowDay === 0) {
          nowDay = 7
        }
        if (!this.week) {
          this.week = this.moment(new Date()).subtract(nowDay + 6, 'd')._d
          from = this.moment(this.week)
          to = this.moment(from).add(6, 'd')
        } else {
          from = this.moment(this.week)
          to = this.moment(from).add(6, 'd')
        }
        now = this.moment(new Date()).subtract(nowDay, 'd')
        if (to > now) {
          this.$message({
            message: '请选择有效时间',
            type: 'error'
          })
          return false
        } else {
          let date = {}
          date.from = from.format('YYYY-MM-DD')
          date.to = to.format('YYYY-MM-DD')
          date.timeUnit = 'W'
          this.$emit('sendDate', date)
        }
      },
      getMouth () {
        let date = {}
        let nowDate = new Date().getDate()
        let now = new Date()
        let nowMouth
        let mouth
        let nowYear
        let Year
        if (!this.mouth) {
          this.mouth = this.moment(now).subtract(1, 'M')
        }
        nowYear = new Date().getFullYear()
        Year = new Date(this.mouth).getFullYear()
        nowMouth = new Date().getMonth()
        mouth = new Date(this.mouth).getMonth()
        if (Year > nowYear) {
          this.$message({
            message: '请选择有效时间',
            type: 'error'
          })
          return
        } else if (Year === nowYear) {
          if (mouth > now) {
            this.$message({
              message: '请选择有效时间',
              type: 'error'
            })
            return
          } else if (mouth <= nowMouth) {
            if (nowDate > 26) {
              date.to = this.moment(this.mouth).format('YYYY-MM-25')
              date.from = this.moment(this.mouth).subtract(1, 'M').format('YYYY-MM-26')
              date.timeUnit = 'M'
            } else {
              if (mouth === nowMouth) {
                this.$message({
                  message: '请选择上一个月',
                  type: 'error'
                })
                return
              } else if (mouth < nowMouth) {
                date.to = this.moment(this.mouth).format('YYYY-MM-25')
                date.from = this.moment(this.mouth).subtract(1, 'M').format('YYYY-MM-26')
                date.timeUnit = 'M'
              }
            }
          }
        } else if (Year < nowYear) {
          date.to = this.moment(this.mouth).format('YYYY-MM-25')
          date.from = this.moment(this.mouth).subtract(1, 'M').format('YYYY-MM-26')
          date.timeUnit = 'M'
        }
        this.$emit('sendDate', date)
      }
    }
  }
</script>


<style>
  .date-view {
    display: inline-block;
  }
  .date {
    display: inline-block;
  }
</style>
