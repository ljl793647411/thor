<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-excel">
    <div class="popup-head">
      <b>考 核 信 息</b>
      <div class="icon-remove" @click="boxClose">
        <img src="../../../static/cha.png" alt="">
      </div>
    </div>
    <div class="excel-btn">
      <el-button type="primary" @click="submitAdd" v-if="!editing" class="">提 交</el-button>
      <el-button type="primary" @click="beginEdit" v-if="!editing" class="">编 辑</el-button>
      <div class="edit">
        <el-button type="primary" @click="cancelEdit" v-if="editing" class="btn-right">取 消</el-button>
        <el-button type="primary" @click="editOk" v-if="editing" class="btn-right">确 认</el-button>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <th style="width: 80px;">检查时间</th>
          <th style="width: 120px;">责任单位</th>
          <th style="width: 60px;">责任人</th>
          <th style="width: 100px;">检查地点</th>
          <th style="width: 100px;">问题点代码</th>
          <th style="width: 100px;">问题点内容</th>
          <th style="width: 40px;">级别</th>
          <th style="width: 100px;">性质</th>
          <th style="width: 100px;">整改情况</th>
        </thead>
        <tbody v-if="!editing">
          <tr v-for="(mgt, index) in paVos.resultList" :class="{complex: index % 2 === 0}">
            <td>
              <div v-text="mgt.date" :title="mgt.date"></div>
            </td>
            <td>
              <div v-text="mgt.respDept" :title="mgt.respDept" class="ellipsis ellipsis2"></div>
            </td>
            <td>
              <div v-text="mgt.respName"></div>
            </td>
            <td>
              <div v-text="mgt.location"></div>
            </td>
            <td>
              <div v-text="mgt.problemCode"></div>
            </td>
            <td>
              <div v-text="mgt.problemDesc" :title="mgt.problemDesc" class="ellipsis ellipsis2"></div>
            </td>
            <td>
              <div v-text="mgt.level"></div>
            </td>
            <td>
              <div v-text="mgt.type"></div>
            </td>
            <td>
              <div v-text="mgt.improve" :title="mgt.improve" class="ellipsis ellipsis2"></div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="editing">
          <tr v-for="(mgt, index) in paVos.resultList" :class="{trbg: index % 2 === 0}">
            <td>
              <input type="text" v-model="mgt.date"/>
            </td>
            <td>
              <textarea cols="18" rows="4" v-model="mgt.respDept"></textarea>
            </td>
            <td>
              <input type="text" v-model="mgt.respName" style="width: 55px;"/>
            </td>
            <td>
              <input type="text" v-model="mgt.location" style="width: 90px;"/>
            </td>
            <td>
              <textarea cols="15" rows="4" v-model="mgt.problemCode"></textarea>
            </td>
            <td>
              <textarea cols="35" rows="4" v-model="mgt.problemDesc"></textarea>
            </td>
            <td>
              <input type="text" v-model="mgt.level" style="width: 20px;"/>
            </td>
            <td>
              <input type="text" v-model="mgt.type" style="width: 80px;"/>
            </td>
            <td>
              <textarea cols="35" rows="4" v-model="mgt.improve"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'

  export default {
    name: 'paMgtAddMoreBox',
    data () {
      return {
        PA_LEVELS: config.getStorage('PA_LEVELS'),
        PA_TYPES: config.getStorage('PA_TYPES'),
        errMsg: '',
        paVosList: {
          list: []
        },
        editing: false,
        dataBackup: []
      }
    },
    props: ['paVos'],
    components: {
    },
    methods: {
      submitAdd (approach) {
        let cols = {
          'date': '检查时间',
          'respDept': '责任单位',
          'respName': '责任人',
          'location': '检查地点',
          'problemCode': '问题点代码',
          'problemDesc': '问题点内容',
          'level': '级别',
          'type': '性质',
          'improve': '整改情况'
        }
        let items = this.paVos.resultList
        for (var i = 0; i < items.length; i++) {
          for (let j in items[i]) {
            if (!items[i][j]) {
              if (cols[j]) {
                this.$message.error(`请将表格第${i + 1}行的${cols[j]}填写完整`)
                return
              }
            } else {
              if (j === 'level') {
                let levels = []
                this.PA_LEVELS.forEach(function (level, index) {
                  levels.push(level.value)
                })
                if (!levels.includes(items[i][j])) {
                  this.$message.error(`第${i + 1}行，级别必须是以下之一：${levels.join('、')}`)
                  return
                }
              } else if (j === 'type') {
                if (!this.PA_TYPES.includes(items[i][j])) {
                  this.$message.error(`第${i + 1}行，性质必须是以下之一：${this.PA_TYPES.join('、')}`)
                  return
                }
              }
            }
          }
        }
        this.paVosList.list = this.paVos.resultList
        this.axios({
          method: 'post',
          data: this.paVosList,
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize},
          url: '/api/pa/mgt/batch-create'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$emit('closeMoreBox')
          } else {
            this.$message.error(data.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      boxClose () {
        this.$emit('closeMoreBox')
      },
      beginEdit () {
        this.dataBackup = JSON.parse(JSON.stringify(this.paVos.resultList))
        this.editing = true
      },
      editOk () {
        this.editing = false
      },
      cancelEdit () {
        this.paVos.resultList = JSON.parse(JSON.stringify(this.dataBackup))
        this.editing = false
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getPaList()
      }
    }
  }
</script>

<style scoped>
  .popup-excel textarea {
    width: 200px;
    line-height: 20px;
    height: 70px;
  }
  .popup-excel input {
    width: 70px;
    height: 33px;
    line-height: 33px;
  }
</style>
