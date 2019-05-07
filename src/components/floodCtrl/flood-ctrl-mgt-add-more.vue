<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-excel">
      <div class="popup-head">
        <b>雨 情 信 息</b>
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
            <th>行号</th>
            <th>值乘日期</th>
            <th>值乘车次</th>
            <th>机车</th>
            <th>司机</th>
            <th>时间</th>
            <th>地点</th>
            <th>雨情雨量</th>
            <th>录入者</th>
            <th>信息概况</th>
            <th style="width: 120px;">备注</th>
          </thead>
          <tbody v-if="!editing">
            <tr v-for="(mgt, index) in floodCtrlVos.resultList" :class="{complex: index % 2 === 0}">
              <td v-text="index + 1"></td>
              <td v-text="mgt.trainDt"></td>
              <td v-text="mgt.trainNo"></td>
              <td :title="LM_TYPES[mgt.lmType] + '，型号' + mgt.lmModel" v-text="mgt.lmNo"></td>
              <td :title="mgt.driverDeptPath1" v-text="mgt.driverName1 + '（' + mgt.workNo1 + '）'"></td>
              <td v-text="mgt.timeDt"></td>
              <td v-text="mgt.location"></td>
              <td v-text="mgt.rainfall"></td>
              <td v-text="mgt.reporter"></td>
              <td>
                <div class="ellipsis ellipsis3" :title="mgt.detail" v-text="mgt.detail"></div>
              </td>
              <td>
                <div class="ellipsis ellipsis3" :title="mgt.memo" v-text="mgt.memo"></div>
              </td>
            </tr>
          </tbody>
          <tbody v-if="editing">
            <tr v-for="(mgt, index) in floodCtrlVos.resultList">
              <td v-text="index + 1"></td>
              <td>
                <input type="text" v-model="mgt.trainDt"/>
              </td>
              <td>
                <input type="text" v-model="mgt.trainNo"/>
              </td>
              <td :title="LM_TYPES[mgt.lmType] + '，型号' + mgt.lmModel" v-text="mgt.lmNo"></td>
              <td :title="mgt.driverDeptPath1" v-text="mgt.driverName1 + '（' + mgt.workNo1 + '）'"></td>
              <td>
                <input type="text" v-model="mgt.timeDt" style="width: 160px;"/>
              </td>
              <td>
                <input type="text" v-model="mgt.location"/>
              </td>
              <td>
                <input type="text" v-model="mgt.rainfall"/>
              </td>
              <td>
                <input type="text" v-model="mgt.reporter"/>
              </td>
              <td>
                <textarea name="detail" cols="20" rows="3" v-model="mgt.detail"></textarea>
              </td>
              <td>
                <textarea name="memo" cols="20" rows="3" v-model="mgt.memo"></textarea>
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
    name: 'floodCtrlMgtAddMoreBox',
    data () {
      return {
        LM_TYPES: config.LM_TYPES,
        floodCtrlVosList: {
          list: []
        },
        editing: false,
        dataBackup: []
      }
    },
    props: ['floodCtrlVos'],
    methods: {
      submitAdd () {
        let cols = {
          'trainDt': '值乘日期',
          'trainNo': '值乘车次',
          'lmNo': '机车编号',
          'workNo1': '司机工号',
          'timeDt': '时间',
          'location': '地点',
          'rainfall': '雨情雨量',
          'respWorkNo': '司机工号',
          'detail': '信息概况',
          'reporter': '录入者'
        }
        let items = this.floodCtrlVos.resultList
        for (var i = 0; i < items.length; i++) {
          for (let j in items[i]) {
            if (j === 'respWorkNo') {
              if (items[i][j] !== items[i]['workNo1']) {
                this.$message.error(`若要修改司机，请至Excel中修改后重新导入`)
                return
              }
            }
            if (!items[i][j]) {
              if (['rbCode', 'ldCode', 'tsCode', 'ttCode', 'ctCode'].includes(j)) {
                this.$message.error(`未找到第${i + 1}行工号${items[i]['workNo1']}对应的司机`)
                return
              } else if (['lmType', 'lmModel'].includes(j)) {
                this.$message.error(`未找到第${i + 1}行编号${items[i]['lmNo']}对应的机车`)
                return
              } else if (cols[j]) {
                this.$message.error(`请将表格第${i + 1}行的${cols[j]}填写完整`)
                return
              }
            }
          }
        }
        this.floodCtrlVosList.list = this.floodCtrlVos.resultList
        this.axios({
          method: 'post',
          data: this.floodCtrlVosList,
          url: '/api/flood-ctrl/mgt/batch-create'
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
        this.dataBackup = JSON.parse(JSON.stringify(this.floodCtrlVos.resultList))
        this.editing = true
      },
      editOk () {
        this.editing = false
      },
      cancelEdit () {
        this.floodCtrlVos.resultList = JSON.parse(JSON.stringify(this.dataBackup))
        this.editing = false
      }
    }
  }
</script>

<style scoped>
  .popup-excel textarea {
    width: 150px;
    line-height: 20px;
    height: 70px;
  }
  .popup-excel input {
    width: 70px;
    height: 33px;
    line-height: 33px;
  }
</style>
