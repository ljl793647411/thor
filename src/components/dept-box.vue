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
        <span for="dept">搜索：</span>
        <input style="width: 275px !important;border-radius: 5px;height: 33px !important;" type="text" v-model="dept" class="popup-input-background"/>
        <ul v-if="dept" class="oms-dept">
          <li v-for="dept in asmDept" @click="getDept(dept)" class="cursor">{{ dept.name + ' —— ' + dept.code }}</li>
        </ul>
      </div>
      <div class="dri-box">
        <div class="tree-choose-box">
          <span class="tree-node cursor" @click="chooseLastNode(1)" :class="{isChoose: type === 1}">车间</span>
          <span class="tree-node cursor" @click="chooseLastNode(2)" :class="{isChoose: type === 2}">车队</span>
          <span class="tree-node cursor" @click="chooseLastNode(3)" :class="{isChoose: type === 3}">指导组</span>
          <span class="tree-node cursor" @click="chooseLastNode(4)" :class="{isChoose: type === 4}" v-if="!driver">乘务员</span>
        </div>
        <div class="dri-tree" ref="driTree">
        	<label>
            <span class="node-name" v-text="ldVo.name"></span>
            <input type="checkbox" name="driBox" v-model="ldVo.isCheck" @click="selectTeam(ldVo)"/>
          </label>
          <div :class="{lastNode: type === 1}" v-for="(ts, tsIndex) in ldVo.children">
            <i v-show="type > 1" :class="{minusIcon: ts.childShow, addIcon: !ts.childShow}" @click="transform(ts, tsIndex, ldVo.children)"></i>
            <label>
              <span :id="ts.code" class="node-name" v-text="ts.name" :class="{highlight: ts.isChoose}"></span>
              <input type="checkbox" v-model="ts.isCheck" @click="selectTeam(ts, ldVo)"/>
            </label>
            <div :class="{lastNode: type === 2}" v-show="type > 1 && ts.childShow" class="ts-box" v-for="(tt, ttIndex) in ts.children">
              <i v-if="type > 2" :class="{minusIcon: tt.childShow, addIcon: !tt.childShow}" @click="transform(tt, ttIndex, ts.children)"></i>
              <label>
                <span :id="tt.code" class="node-name" v-text="tt.name" :class="{highlight: tt.isChoose}"></span>
                <input type="checkbox" v-model="tt.isCheck" @click="selectTeam(tt, ts)"/>
              </label>
              <div :class="{lastNode: type === 3}" v-show="type > 2 && tt.childShow" class="tt-box" v-for="(ct, ctIndex) in tt.children">
                <i v-if="type === 4" :class="{minusIcon: ct.childShow, addIcon: !ct.childShow}" @click="getDriverList(ct, 'q', ctIndex, tt.children)"></i>
                <label>
                  <span :id="ct.code" class="node-name" v-text="ct.name" :class="{highlight: ct.isChoose}"></span>
                  <input type="checkbox" v-model="ct.isCheck" @click="ctChoose(ct, tt, ts, ctIndex)"/>
                </label>
                <div :class="{lastNode: type === 4}" v-show="type === 4 && ct.childShow" class="ct-box" v-for="(dri, $index) in ct.children">
                  <label>
                    <span class="node-name" v-text="dri.name" :class="{highlight: dri.isChoose}"></span>
                    <input type="checkbox" v-model="dri.isCheck" @click="driSelect(dri, ct, tt, ts, tsIndex, ttIndex, ctIndex)"/>
                  </label>
                </div>
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
    name: 'driBox',
    data () {
      return {
        type: 1,
        resultVo: {
          deptType: '',
          depts: []
        },
        ldVo: {},
        dept: '',
        asmDept: []
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getLdVo()
      })
    },
    watch: {
      dept: 'approximateStringMatching'
    },
    props: ['driver'],
    methods: {
      chooseLastNode (type) {
        this.type = type
      },
      transform (team, index, fatherTeam) { // 显示or隐藏班组层级
        team.childShow = !team.childShow
        this.$set(fatherTeam, index, team)
      },
      selectTeam (team, fahterT) {
        if (team.isCheck && fahterT) { // 取消
          fahterT.isCheck = false
          this.$set(fahterT.children)
          this.ldVo.isCheck = false
        }
        this.selectChildrenTeam(team, !team.isCheck)
      },
      selectChildrenTeam (team, type, i, fahterT) { // 自动 选择/取消 子级节点
        if (team && team.children) {
          for (let i in team.children) {
            if (team.children[i] !== undefined) {
              team.children[i].isCheck = type
            }
            if (team.children && team.children.length !== 0) {
              this.selectChildrenTeam(team.children[i], type, i, team.children)
            }
            this.$set(team.children, i, team.children[i])
          }
        }
        if (this.type === 4 && team.type === 'CT' && team.children.length === 0) {
          this.selectCtChildren(team, false, i, fahterT)
          console.log('~~~~~~~~~~进入：' + team)
        }
      },
      getDriverList (ct, type, index, fatherTeam, t) { // 选择/取消 指导组
        ct.childShow = !ct.childShow
        this.$set(fatherTeam, index, ct)
        if (ct.childShow || !t) {
          this.axios({
            method: 'get',
            params: {'ctCode': ct.code},
            url: '/api/op/driver/view/list'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              ct.children = data.result.list
              if (type === 'isChoose' || ct.isCheck) { // 子节点全选
                for (let i in ct.children) {
                  ct.children[i].isCheck = true
                  this.$set(ct.children, i, ct.children[i])
                }
              }
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      ctChoose (ct, fahterT, grandfatherT, ctIndex) {
        if (ct.isCheck) {
          this.ldVo.isCheck = false
          fahterT.isCheck = false
          this.$set(fahterT.children)
          grandfatherT.isCheck = false
          this.$set(grandfatherT.children)
          this.$set(this.ldVo.children)
        }
        if (this.type === 4) {
          this.selectCtChildren(ct, true, ctIndex, fahterT)
        }
      },
      selectCtChildren (ct, t, ctIndex, fahterT) {
        let a = t ? ct.isCheck : !ct.isCheck
        if (!a) { // 子节点全选，
          if (!ct.childShow) { // 如果指导组没有展开，展开子节点
            this.getDriverList(ct, 'isChoose', ctIndex, fahterT, t)
          } else { // 指导组已经展开
            for (let i = 0; i < ct.children.length; i++) {
              if (ct.children[i] !== undefined && i !== undefined) {
                ct.children[i].isCheck = true
                this.$set(ct.children, i, ct.children[i])
              }
            }
          }
        } else { // 子节点全取消
          if (ct.childShow) { // 如果指导组展开了
            for (let i = 0; i < ct.children.length; i++) {
              if (ct.children[i] !== undefined && i !== undefined) {
                ct.children[i].isCheck = false
                this.$set(ct.children, i, ct.children[i]) // 这样是刷新具体的某一项。 this.$set(ct.children)这是整体刷新
              }
            }
          }
        }
      },
      driSelect (dri, ct, tt, ts, tsIndex, ttIndex, ctIndex) { // 具体某人的选择取消时，
        if (dri.isCheck) {
          this.ldVo.isCheck = false
          ct.isCheck = false
          this.$set(tt.children, ctIndex, ct)
          tt.isCheck = false
          this.$set(ts.children, ttIndex, tt)
          ts.isCheck = false
          this.$set(this.ldVo.children, tsIndex, ts)
        }
      },
      initLdVo (team) { // 初始化
        if (!team) {
          return
        }
        team.isCheck = false
        team.isChoose = false
        team.childShow = false
        for (let i in team.children) {
          this.initLdVo(team.children[i])
        }
      },
      getLdVo () { // 获取this.ldVo
        this.axios({
          method: 'get',
          params: {'type': 1},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.ldVo = data.result.tree
            this.initLdVo(this.ldVo)
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
        this.dept = this.dept.toUpperCase()
        if (this.ldVo.code.indexOf(this.dept) > -1 || this.ldVo.name.indexOf(this.dept) > -1) {
          this.asmDept.push(this.ldVo)
        }
        if (this.ldVo.children.length !== 0) {
          this.ldVo.path = []
          this.asm(this.ldVo) // 级联的模糊匹配
        }
      },
      asm (team) {
        let p = JSON.parse(JSON.stringify(team.path))
        let t = team.children
        for (let i = 0; i < t.length; i++) {
          t[i].path = JSON.parse(JSON.stringify(p))
          t[i].path.push(i)
          if (t[i].type) {
            if (t[i].code.indexOf(this.dept) > -1 || t[i].name.indexOf(this.dept) > -1) {
              this.asmDept.push(t[i])
            }
          }
          if (t[i].children && t[i].children.length !== 0) {
            this.asm(t[i])
          }
        }
      },
      getDept (dept) {
        this.dept = ''
        this.initLdVo(this.ldVo)
        this.asmDept = []
        if (dept.path.length === 0) {
          this.ldVo.isChoose = true
        } else if (dept.path.length === 1) {
          this.ldVo.children[dept.path[0]].isChoose = true
          setTimeout(() => {
            document.getElementById('driTree').scrollTop = (dept.path[0] + 2) * 30 - 400
          }, 0)
        } else if (dept.path.length === 2) {
          this.ldVo.children[dept.path[0]].childShow = true
          this.ldVo.children[dept.path[0]].children[dept.path[1]].isChoose = true
          setTimeout(() => {
            this.$refs.driTree.scrollTop = (dept.path[0] + 2) * 30 + (dept.path[1] + 1) * 30 - 400
          }, 0)
        } else if (dept.path.length === 3) {
          this.ldVo.children[dept.path[0]].childShow = true
          this.ldVo.children[dept.path[0]].children[dept.path[1]].childShow = true
          this.ldVo.children[dept.path[0]].children[dept.path[1]].children[dept.path[2]].isChoose = true
          setTimeout(() => {
            this.$refs.driTree.scrollTop = (dept.path[0] + 2) * 30 + (dept.path[1] + 1) * 30 + (dept.path[2] + 1) * 30 - 400
          }, 0)
        }
        this.$set(this.ldVo.children, dept.path[0], this.ldVo.children[dept.path[0]])
        this.$set(this.ldVo.children[dept.path[0]].children, dept.path[1], this.ldVo.children[dept.path[0]].children[dept.path[1]])
        this.$set(this.ldVo.children[dept.path[0]].children[dept.path[1]].children, dept.path[2], this.ldVo.children[dept.path[0]].children[dept.path[1]].children[dept.path[2]])
      },
      boxClose () {
        this.resultVo.depts = []
        if (this.type === 1) {
          this.resultVo.deptType = 'TS'
          for (let i = 0; i < this.ldVo.children.length; i++) {
            if (this.ldVo.children[i].isCheck) {
              this.resultVo.depts.push(this.ldVo.children[i])
            }
          }
        } else if (this.type === 2) {
          this.resultVo.deptType = 'TT'
          for (let i = 0; i < this.ldVo.children.length; i++) {
            for (let j = 0; j < this.ldVo.children[i].children.length; j++) {
              if (this.ldVo.children[i].children[j].isCheck) {
                this.resultVo.depts.push(this.ldVo.children[i].children[j])
              }
            }
          }
        } else if (this.type === 3) {
          this.resultVo.deptType = 'CT'
          for (let i = 0; i < this.ldVo.children.length; i++) {
            for (let j = 0; j < this.ldVo.children[i].children.length; j++) {
              for (let m = 0; m < this.ldVo.children[i].children[j].children.length; m++) {
                if (this.ldVo.children[i].children[j].children[m].isCheck) {
                  this.resultVo.depts.push(this.ldVo.children[i].children[j].children[m])
                }
              }
            }
          }
        } else if (this.type === 4) {
          this.resultVo.deptType = 'DR'
          for (let i = 0; i < this.ldVo.children.length; i++) {
            for (let j = 0; j < this.ldVo.children[i].children.length; j++) {
              for (let m = 0; m < this.ldVo.children[i].children[j].children.length; m++) {
                for (var n = 0; n < this.ldVo.children[i].children[j].children[m].children.length; n++) {
                  if (this.ldVo.children[i].children[j].children[m].children[n].isCheck) {
                    this.resultVo.depts.push(this.ldVo.children[i].children[j].children[m].children[n])
                  }
                }
              }
            }
          }
        }
        this.$emit('getDeptCode', this.resultVo)
      }
    }
  }
</script>

<style scoped>
.isChoose{
  color: #fff !important;
  background-color: rgba(0,0,0,0.1) !important; 
}
.dri-tree span{
  line-height: 30px;
}
.ts-box,.tt-box,.ct-box{
  left: 19px;
  position: relative;
}
label{
  vertical-align: top;
}
.lastNode{
  left: 30px;
  position: relative;
}
li{
  border-bottom: 1px solid #ccc;
}
.highlight{
  color: #2E6DA4;
  font-weight: bold;
}
.popup {
  z-index: 940;
}
.tree-node {
  width: 74.5px;
}

</style>
