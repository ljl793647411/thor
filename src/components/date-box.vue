<template>
  <div class="day-time">
    <div v-if="!onlyDate">
      <span v-if="!type">
      <el-radio-group v-model="radio">
        <el-radio-button label="日视图" @click.native="getWeekRadio(1)" border></el-radio-button>
        <el-radio-button label="周视图" @click.native="getWeekRadio(8)" border></el-radio-button>
        <el-radio-button label="月视图" @click.native="getMouthRadio(6)" border></el-radio-button>
      </el-radio-group>
    </span>
      <span class="block" v-show="radio === '日视图'">
      <span class="demonstration">时间范围：</span>
      <el-date-picker
        :editable="false"
        v-model="dayValue"
        value-format="yyyy-MM-dd"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptionsDay"
        @input="getDay">
      </el-date-picker>
    </span>
      <span class="block" v-show="radio === '周视图'">
      <span class="demonstration">周范围</span>
      <span>
        <el-radio-group v-model="radioWeek">
          <el-radio label="最近四周" @change="getWeekRadio(4)"></el-radio>
          <el-radio label="最近八周" @change="getWeekRadio(8)"></el-radio>
          <el-radio label="最近十二周" @change="getWeekRadio(12)"></el-radio>
        </el-radio-group>
      </span>
      <span class="demonstration">自定义</span>
      <el-date-picker
        :editable="false"
        v-model="weekValueFrom"
        type="week"
        format="yyyy第WW周"
        placeholder="选择周"
        @change="getWeek">
      </el-date-picker>
      <span>到</span>
      <el-date-picker
        v-model="weekValueTo"
        type="week"
        format="yyyy第WW周"
        placeholder="选择周"
        @change="getWeek">
      </el-date-picker>
    </span>
      <span class="block" v-show="radio === '月视图'">
      <span class="demonstration">月范围</span>
      <span>
      <el-radio-group v-model="radioMouth">
        <el-radio label="最近三月" @change="getMouthRadio(3)"></el-radio>
        <el-radio label="最近半年" @change="getMouthRadio(6)"></el-radio>
        <el-radio label="最近一年" @change="getMouthRadio(12)"></el-radio>
      </el-radio-group>
    </span>
      <span class="demonstration">自定义</span>
      <el-date-picker
        :editable="false"
        firstDayOfWeek="1"
        v-model="mouthValueFrom"
        value-format="yyyy-MM-26"
        type="month"
        placeholder="选择月"
        @change="getMouth">
      </el-date-picker>
      <span>到</span>
      <el-date-picker
        firstDayOfWeek="1"
        v-model="mouthValueTo"
        value-format="yyyy-MM-25"
        type="month"
        placeholder="选择月"
        @change="getMouth">
      </el-date-picker>
    </span>
    </div>
    <div v-if="onlyDate">
      <div class="block">
        <span class="demonstration">日期选择：</span>
        <el-button type="primary" icon="el-icon-arrow-left" @click="getBeforeDay">前一天</el-button>
        <el-date-picker
          :editable="false"
          v-model="dateVal"
          type="date"
          placeholder="选择日期"
          @change="getDate">
        </el-date-picker>
        <el-button type="primary" @click="getAfterDay">后一天<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        pickerOptionsDay: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近两周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近四周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 28)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dayValue: [],
        radio: '日视图',
        radioMouth: '最近半年',
        radioWeek: '最近八周',
        mouthValueFrom: '',
        mouthValueTo: '',
        weekValueFrom: '',
        weekValueTo: '',
        msg: '',
        timeUnit: 'W',
        dateVal: this.date
      }
    },
    props: ['from', 'to', 'type', 'date', 'onlyDate'],
    mounted () {
      this.$nextTick(() => {
        if (!this.onlyDate) {
          if (this.from) {
            this.dayValue.push(this.from, this.to)
          } else {
            let from = this.moment().subtract(6, 'd').format('YYYY-MM-DD')
            let to = this.moment().format('YYYY-MM-DD')
            this.dayValue.push(from, to)
          }
          this.getDay()
        } else {
          this.getDate()
        }
      })
    },
    methods: {
      getDay () {
        let date = {}
        for (let i = 0; i < this.dayValue.length; i++) {
          date.from = this.dayValue[0]
          date.to = this.dayValue[1]
        }
        date.timeUnit = 'D'
        let toMs = new Date(date.to).getTime()
        let noMs = new Date().getTime()
        if (toMs > noMs) {
          this.$message({
            message: '请选择有效的时间',
            type: 'error'
          })
          this.dayValue = []
          return
        }
        this.$emit('sendDate', date)
      },
      getWeek () {
        let fromMs = new Date(this.weekValueFrom).getTime()
        let toMs = new Date(this.weekValueTo).getTime()
        let noMs = new Date().getTime()
        let from = this.moment(this.weekValueFrom)
        let to = this.moment(this.weekValueTo)
        if (toMs > noMs || fromMs > noMs || !this.moment(this.dateVal).isValid()) {
          this.$message({
            message: '请选择有效的时间',
            type: 'error'
          })
          return
        }
        if (this.weekValueFrom && this.weekValueTo) {
          if (fromMs > toMs) {
            this.$message({
              message: '开始时间不能大于结束时间',
              type: 'error'
            })
            return
          }
          let date = {}
          date.from = from.format('YYYY-MM-DD')
          date.to = this.moment(to).add(6, 'd').format('YYYY-MM-DD')
          date.timeUnit = 'W'
          this.$emit('sendDate', date)
        }
      },
      getMouth () {
        let fromMs = new Date(this.mouthValueFrom).getTime()
        let toMs = new Date(this.mouthValueTo).getTime()
        let from = this.moment(this.mouthValueFrom)
        let to = this.moment(this.mouthValueTo)
        let noMs = new Date().getTime()
        if (toMs > noMs || fromMs > noMs || !this.moment(this.dateVal).isValid()) {
          this.$message({
            message: '请选择有效的时间',
            type: 'error'
          })
          return
        }
        if (this.mouthValueFrom && this.mouthValueTo) {
          if (fromMs > toMs) {
            this.$message({
              message: '开始时间不能大于结束时间',
              type: 'error'
            })
            return
          }
          let date = {}
          date.from = from.format('YYYY-MM-DD')
          date.to = to.format('YYYY-MM-DD')
          date.timeUnit = 'M'
          this.$emit('sendDate', date)
        }
      },
      getMouthRadio (num) {
        let date = {}
        let nowDate = new Date().getDate()
        let now = new Date()
        if (nowDate > 26) {
          date.from = this.moment(now).subtract(num, 'M').format('YYYY-MM-26')
          date.to = this.moment(now).format('YYYY-MM-25')
        } else {
          date.from = this.moment(now).subtract(num + 1, 'M').format('YYYY-MM-26')
          date.to = this.moment(now).subtract(1, 'M').format('YYYY-MM-25')
        }
        date.timeUnit = 'M'
        this.$emit('sendDate', date)
      },
      getWeekRadio (num) {
        let date = {}
        let nowDay = new Date().getDay()
        let now = new Date()
        if (num === 1) {
          date.from = this.moment().subtract(1, 'w').format('YYYY-MM-DD')
          date.to = this.moment().format('YYYY-MM-DD')
          date.timeUnit = 'D'
        } else {
          date.from = this.moment(now).subtract(num - 1, 'w').subtract(nowDay + 6, 'd').format('YYYY-MM-DD')
          date.to = this.moment(now).subtract(nowDay, 'd').format('YYYY-MM-DD')
          date.timeUnit = 'W'
        }
        this.$emit('sendDate', date)
      },
      getDate () {
        let noMs = new Date().getTime()
        let dateVal = this.moment(this.dateVal).format('YYYY-MM-DD')
        if (new Date(dateVal).getTime() > noMs || !this.moment(this.dateVal).isValid()) {
          this.$message({
            message: '请选择有效的时间',
            type: 'error'
          })
          this.dateVal = this.moment().format('YYYY-MM-DD')
          return
        }
        this.$emit('sendDate', dateVal)
      },
      getBeforeDay () {
        if (!this.dateVal) {
          this.dateVal = this.moment().format('YYYY-MM-DD')
        } else {
          this.dateVal = this.moment(this.dateVal).subtract(1, 'd').format('YYYY-MM-DD')
        }
        let noMs = new Date().getTime()
        if (new Date(this.dateVal).getTime() > noMs) {
          this.$message({
            message: '请选择有效的时间',
            type: 'error'
          })
          this.dateVal = this.moment().format('YYYY-MM-DD')
          return
        }
        this.$emit('sendDate', this.dateVal)
      },
      getAfterDay () {
        if (!this.dateVal) {
          this.dateVal = this.moment().format('YYYY-MM-DD')
        } else {
          this.dateVal = this.moment(this.dateVal).add(1, 'd').format('YYYY-MM-DD')
        }
        let noMs = new Date().getTime()
        if (new Date(this.dateVal).getTime() > noMs) {
          this.$message({
            message: '请选择有效的时间',
            type: 'error'
          })
          this.dateVal = this.moment().format('YYYY-MM-DD')
          return
        }
        this.$emit('sendDate', this.dateVal)
      }
    }
  }
</script>


<style>
  .day-time {
    display: inline-block;
  }
  .block .el-date-editor.el-input__inner {
    width: 250px;
  }
  .demonstration {
    font-size:14px;
    font-family:HiraginoSansGB-W3;
    font-weight:normal;
    color:#fff;
  }
</style>
