<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-excel">
      <div class="popup-head">
        <b>运 行 信 息</b>
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
            <th style="width: 40px;">行号</th>
            <th style="width: 100px;">值乘日期</th>
            <th style="width: 80px;">值乘车次</th>
            <th style="width: 80px;">列车类型</th>
            <th style="width: 100px;">机车</th>
            <th style="width: 100px;">司机</th>
            <th style="width: 100px;">时间</th>
            <th style="width: 100px;">地点</th>
            <th style="width: 80px;">追踪分类</th>
            <th style="width: 80px;">类别</th>
            <th style="width: 80px;">命令编号</th>
            <th style="width: 80px;">录入者</th>
            <th>内容</th>
            <th style="width: 80px;">备注</th>
          </thead>
          <tbody v-if="!editing">
            <tr v-for="(mgt, index) in infoVoMgts.resultList" :class="{complex: index % 2 === 0}">
              <td v-text="index + 1"></td>
              <td>
                <div v-text="mgt.trainDt"></div>
              </td>
              <td>
                <div v-text="mgt.trainNo"></div>
              </td>
              <td>
                <div v-text="TRAIN_TYPES[mgt.trainType]"></div>
              </td>
              <td :title="LM_TYPES[mgt.lmType] + '，型号' + mgt.lmModel" v-text="mgt.lmNo"></td>
              <td>
                <div :title="mgt.driverDeptPath1" v-text="mgt.driverName1 + '（' + mgt.workNo1 + '）'"></div>
              </td>
              <td>
                <div v-text="mgt.timeDt"></div>
              </td>
              <td>
                <div v-text="mgt.location"></div>
              </td>
              <td>
                <div v-text="mgt.cate"></div>
              </td>
              <td>
                <div v-text="mgt.type"></div>
              </td>
              <td>
                <div v-text="mgt.cmdNo"></div>
              </td>
              <td>
                <div v-text="mgt.reporter"></div>
              </td>
              <td>
                <div class="ellipsis ellipsis3" :title="mgt.detail" v-text="mgt.detail"></div>
              </td>
              <td>
                <div class="ellipsis ellipsis3" :title="mgt.memo" v-text="mgt.memo"></div>
              </td>
            </tr>
          </tbody>
          <tbody v-if="editing">
            <tr v-for="(mgt, index) in infoVoMgts.resultList">
              <td v-text="index + 1"></td>
              <td>
                <input type="text" v-model="mgt.trainDt"/>
              </td>
              <td>
                <input type="text" v-model="mgt.trainNo"/>
              </td>
              <td>
                <input type="text" v-model="mgt.trainType"/>
              </td>
              <td :title="LM_TYPES[mgt.lmType] + '，型号' + mgt.lmModel" v-text="mgt.lmNo"></td>
              <td>
                <div :title="mgt.driverDeptPath1" v-text="mgt.driverName1 + '（' + mgt.workNo1 + '）'"></div>
              </td>
              <td>
                <input type="text" v-model="mgt.timeDt" style="width: 160px;"/>
              </td>
              <td>
                <input type="text" v-model="mgt.location"/>
              </td>
              <td>
                <input type="text" v-model="mgt.cate"/>
              </td>
              <td>
                <input type="text" v-model="mgt.type" style="width: 150px;"/>
              </td>
              <td>
                <input type="text" v-model="mgt.cmdNo"/>
              </td>
              <td>
                <input type="text" v-model="mgt.reporter"/>
              </td>
              <td>
                <textarea name="detail" cols="20" rows="4" v-model="mgt.detail"></textarea>
              </td>
              <td>
                <textarea name="detail" cols="20" rows="4" v-model="mgt.memo"></textarea>
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
    name: 'dsVodMgtAddMoreBox',
    data () {
      return {
        LM_TYPES: config.LM_TYPES,
        TRAIN_TYPES: config.TRAIN_TYPES,
        infoVoMgtsList: {
          list: []
        },
        editing: false,
        dataBackup: []
      }
    },
    props: ['infoVoMgts'],
    components: {
    },
    methods: {
      submitAdd (approach) {
        let cols = {
          'trainDt': '值乘日期',
          'trainNo': '值乘车次',
          'trainType': '列车类型',
          'lmNo': '机车编号',
          'workNo1': '司机工号',
          'cate': '追踪分类',
          'type': '类别',
          'respWorkNo': '司机工号',
          'timeDt': '时间',
          'location': '地点',
          'reporter': '录入者',
          'detail': '内容'
        }
        let items = this.infoVoMgts.resultList
        for (var i = 0; i < items.length; i++) {
          for (let j in items[i]) {
            if (j === 'respWorkNo') {
              if (items[i][j] !== items[i].workNo1) {
                this.$message.error(`若要修改司机，请至Excel中修改后重新导入`)
                return
              }
            }
            if (!items[i][j]) {
              if (['rbCode', 'ldCode', 'tsCode', 'ttCode', 'ctCode'].includes(j)) {
                this.$message.error(`未找到第${i + 1}行工号${items[i].workNo1}对应的司机`)
                return
              } else if (['lmType', 'lmModel'].includes(j)) {
                this.$message.error(`未找到第${i + 1}行编号${items[i].lmNo}对应的机车`)
                return
              } else if (j === 'cmdNo') {
                if (items[i].type === '临时命令') {
                  this.$message.error(`表格第${i + 1}行，当类型为“临时命令”时，命令编号必需填写`)
                  return
                }
              } else if (cols[j]) {
                this.$message.error(`请将表格第${i + 1}行的${cols[j]}填写完整`)
                return
              }
            }
          }
        }
        this.infoVoMgtsList.list = this.infoVoMgts.resultList
        this.axios({
          method: 'post',
          data: this.infoVoMgtsList,
          url: '/api/run-info/mgt/batch-create'
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
        this.dataBackup = JSON.parse(JSON.stringify(this.infoVoMgts.resultList))
        this.editing = true
      },
      editOk () {
        this.editing = false
      },
      cancelEdit () {
        this.infoVoMgts.resultList = JSON.parse(JSON.stringify(this.dataBackup))
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
    width: 80px;
    line-height: 20px;
    height: 70px;
  }
  .popup-excel input {
    width: 70px;
    height: 33px;
    line-height: 33px;
  }
</style>
