<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup">
      <div class="popup-head">
        <b>组织选择</b>
        <div class="icon-remove" @click="boxClose">
          <img src="../../static/cha.png" alt="">
        </div>
      </div>
      <div class="popup-search">
        <label for="dept">搜索：</label>
        <input style="width: 275px !important;border-radius: 5px;height: 33px !important;" type="text" v-model="dept" class="popup-input-background"/>
        <ul v-if="dept" class="oms-dept">
          <li v-for="dept in asmDept" @click="getDept(dept)" class="cursor">{{ dept.name + ' —— ' + dept.code }}</li>
        </ul>
      </div>
      <div class="dri-box">
        <div class="tree-choose-box">
          <span class="tree-node cursor" @click="chooseLastNode(0)" :class="{isChoose: type === 0}">车间</span>
          <span class="tree-node cursor" @click="chooseLastNode(1)" :class="{isChoose: type === 1}">班组</span>
          <span class="tree-node cursor" @click="chooseLastNode(2)" :class="{isChoose: type === 2}">岗位</span>
        </div>
        <div class="dri-tree">
          <label>
            <span class="node-name" v-text="ohVo.name"></span>
            <input type="checkbox" v-model="ohVo.isCheck" @click="selectTeam(ohVo)"/>
          </label>
          <div class="" ref="driTree" v-for="(ohVo, o) in ohVo.children" style="padding-left: 30px;">
            <label>
              <span class="node-name" v-text="ohVo.name"></span>
              <input type="checkbox" v-model="ohVo.isCheck" @click="selectTeam(ohVo)"/>
            </label>
            <div v-if="type > 0" :class="{lastNode: type === 1}" v-for="(omt, a) in ohVo.children">
              <i v-if="type > 1" :class="{minusIcon: omt.childShow, addIcon: !omt.childShow}" @click="transform(omt, a, ohVo.children)"></i>
              <label>
                <span class="node-name" v-text="omt.name" :class="{highlight: omt.isChoose}"></span>
                <input type="checkbox" v-model="omt.isCheck" @click="selectTeam(omt, o)"/>
              </label>
              <div :class="{lastNode: type === 2}" v-if="type > 1" v-show="omt.childShow" class="omt-box" v-for="(omp, b) in omt.children">
                <i v-if="type > 2" :class="{minusIcon: omp.childShow, addIcon: !omp.childShow}" @click="transform(omp, b, omt.children)"></i>
                <label>
                  <span class="node-name" v-text="omp.name" :class="{highlight: omp.isChoose}"></span>
                  <input type="checkbox" v-model="omp.isCheck" @click="selectLastNode(omp, omt, a, o)"/>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-submit">
        <el-button type="primary" @click="boxClose">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'overhaulBox',
    data () {
      return {
        type: 0,
        ohVo: {},
        resultVo: {
          depts: [],
          deptType: ''
        },
        asmDept: [],
        dept: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getOhVo()
      })
    },
    watch: {
      dept: 'approximateStringMatching'
    },
    methods: {
      chooseLastNode (type) {
        this.type = type
      },
      transform (team, index, fatherTeam) { // 显示or隐藏班组层级
        team.childShow = !team.childShow
        this.$set(fatherTeam, index, team)
      },
      selectTeam (team, fahterIndex) {
        if ((team.type === 'OMT' || team.type === 'OMTS') && team.isCheck) {
          this.ohVo.isCheck = false
          if (fahterIndex || fahterIndex === 0) {
            this.ohVo.children[fahterIndex].isCheck = false
            this.$set(this.ohVo.children, fahterIndex, this.ohVo.children[fahterIndex])
          }
        }
        this.selectChildrenTeam(team, !team.isCheck)
      },
      selectChildrenTeam (team, type) { // 自动 选择/取消 子级节点
        for (let i in team.children) {
          if (team.children[i] !== undefined) {
            team.children[i].isCheck = type
          }
          if (team.children && team.children.length !== 0) {
            this.selectChildrenTeam(team.children[i], type)
          }
          this.$set(team.children, i, team.children[i])
        }
      },
      selectLastNode (omp, omt, a, o) { // 最后一级， 倒数第二级， 倒数第二级的index
        if (omp.isCheck) { // 取消
          omt.isCheck = false
          this.ohVo.isCheck = false
          this.ohVo.children[o].isCheck = false
          this.$set(this.ohVo.children, o, this.ohVo.children[o])
          this.$set(omt.children, a, omt.children[a])
        }
      },
      boxClose () {
        this.resultVo.depts = []
        if (this.type === 0) {
          this.resultVo.deptType = 'OMTS'
          for (let i in this.ohVo.children) {
            if (this.ohVo.children[i] && this.ohVo.children[i].isCheck) {
              this.resultVo.depts.push(this.ohVo.children[i])
            }
          }
        } else if (this.type === 1) {
          this.resultVo.deptType = 'OMT'
          for (let i in this.ohVo.children) {
            for (let j in this.ohVo.children[i].children) {
              if (this.ohVo.children[i] && this.ohVo.children[i].children[j] && this.ohVo.children[i].children[j].isCheck) {
                this.resultVo.depts.push(this.ohVo.children[i].children[j])
              }
            }
          }
        } else if (this.type === 2) {
          this.resultVo.deptType = 'OMP'
          for (let i in this.ohVo.children) {
            for (let j in this.ohVo.children[i].children) {
              for (let m in this.ohVo.children[i].children[j].children) {
                if (this.ohVo.children[i] && this.ohVo.children[i].children[j] && this.ohVo.children[i].children[j].children[m] && this.ohVo.children[i].children[j].children[m].isCheck) {
                  this.resultVo.depts.push(this.ohVo.children[i].children[j].children[m])
                }
              }
            }
          }
        }
        this.$emit('getDeptCode', this.resultVo)
      },
      initOhVo (team) { // 初始化
        if (!team) {
          return
        }
        team.isCheck = false
        team.isChoose = false
        team.childShow = false
        for (let i in team.children) {
          this.initOhVo(team.children[i])
        }
      },
      getOhVo () { // 获取this.ohVo
        let self = this
        this.axios({
          method: 'get',
          params: {'type': 2},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.ohVo = data.result.tree
            this.initOhVo(self.ohVo) // 层级的显示or隐藏，初始化
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      approximateStringMatching () { // 组织结构的模糊匹配
        this.asmDept = []
        if (!this.dept) {
          return
        }
        if (this.ohVo.code.indexOf(this.dept) > -1 || this.ohVo.name.indexOf(this.dept) > -1) {
          this.asmDept.push(this.ohVo)
        }
        if (this.ohVo.children.length !== 0) {
          this.ohVo.codePath = []
          this.asm(this.ohVo) // 级联的模糊匹配
        }
      },
      asm (team) {
        let p = JSON.parse(JSON.stringify(team.codePath))
        let t = team.children
        for (let i = 0; i < t.length; i++) {
          t[i].codePath = JSON.parse(JSON.stringify(p))
          t[i].codePath.push(i)
          if (t[i].type) {
            if (t[i].code.indexOf(this.dept) > -1 || t[i].name.indexOf(this.dept) > -1) {
              this.asmDept.push(t[i])
            }
          }
          if (t[i].children.length !== 0) {
            this.asm(t[i])
          }
        }
      },
      getDept (dept) {
        this.dept = ''
        this.initOhVo(this.ohVo)
        this.asmDept = []
        if (dept.codePath.length === 0) {
          this.ohVo.isChoose = true
        } else if (dept.codePath.length === 1) {
          this.ohVo.children[dept.codePath[0]].isChoose = true
          setTimeout(() => {
            document.getElementById('driTree').scrollTop = (dept.codePath[0] + 3) * 30 - 400
          }, 0)
        } else if (dept.codePath.length === 2) {
          this.ohVo.children[dept.codePath[0]].childShow = true
          this.ohVo.children[dept.codePath[0]].children[dept.codePath[1]].isChoose = true
          setTimeout(() => {
            this.$refs.driTree.scrollTop = (dept.codePath[0] + 3) * 30 + (dept.codePath[1] + 1) * 30 - 400
          }, 0)
        } else if (dept.codePath.length === 3) {
          this.ohVo.children[dept.codePath[0]].childShow = true
          this.ohVo.children[dept.codePath[0]].children[dept.codePath[1]].childShow = true
          this.ohVo.children[dept.codePath[0]].children[dept.codePath[1]].children[dept.codePath[2]].isChoose = true
          setTimeout(() => {
            this.$refs.driTree.scrollTop = (dept.codePath[0] + 3) * 30 + (dept.codePath[1] + 1) * 30 + (dept.codePath[2] + 1) * 30 - 400
          }, 0)
        }
        this.$set(this.ohVo.children, dept.codePath[0], this.ohVo.children[dept.codePath[0]])
        this.$set(this.ohVo.children[dept.codePath[0]].children, dept.codePath[1], this.ohVo.children[dept.codePath[0]].children[dept.codePath[1]])
      }
    }
  }
</script>

<style scoped>
  .isChoose {
    color: #fff !important;
    background-color: rgba(0,0,0,0.1) !important; 
  }

  .dri-tree span {
    line-height: 30px;
  }

  .omt-box, .omp-box, .omp-box {
    left: 19px;
    position: relative;
  }

  label {
    vertical-align: top;
  }

  .lastNode {
    left: 22px;
    position: relative;
  }

  .highlight {
    color: #2E6DA4;
    font-weight: bold;
  }
  .popup {
    z-index: 940;
  }
  .tree-node {
    width: 96px;
  }
</style>
