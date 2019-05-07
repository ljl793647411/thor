<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup">
      <div class="popup-head">
        <b>组织选择</b>
        <div class="icon-remove" @click="closeBox">
          <img src="../../static/cha.png" alt="">
        </div>
      </div>
      <div class="popup-search">
        <label for="dept">搜索：</label>
        <input style="width: 275px !important;border-radius: 5px;height: 33px !important;" type="text" v-model="dept" class="popup-input-background"/>
        <ul v-if="dept" class="oms-dept">
          <li v-for="dept in asmDept" @click="getDept(dept)" class="cursor">{{ dept.namePath }}</li>
        </ul>
      </div>
      <div class="dri-box">
        <div class="dri-tree" ref="driTree" v-if="deptShow !== 'LD'">
          <label>
            <span class="node-name" v-text="ldVo.name"></span>
            <input type="radio" name="driBox" v-model="driCheck" :value="ldVo" v-if="deptShow !== 'TT' && deptShow !== 'CT'"/>
          </label>
          <div v-for="(ts, tsIndex) in ldVo.children" v-if="deptShow !== 'TS'">
            <i :class="{minusIcon: ts.childShow, addIcon: !ts.childShow}" @click="transform(ts, tsIndex, ldVo.children)"></i>
            <label>
              <span class="node-name" v-text="ts.name" :class="{highlight: ts.isChoose}"></span>
              <input type="radio" name="driBox" v-model="driCheck" :value="ts" :disabled="driver" v-if="deptShow !== 'CT'"/>
            </label>
            <div v-show="ts.childShow" class="ts-box" v-for="(tt, ttIndex) in ts.children" v-if="deptShow !== 'TT'">
              <i :class="{minusIcon: tt.childShow, addIcon: !tt.childShow}" @click="transform(tt, ttIndex, ts.children)"></i>
              <label>
                <span class="node-name" v-text="tt.name" :class="{highlight: tt.isChoose}"></span>
                <input type="radio" name="driBox" v-model="driCheck" :value="tt" :disabled="driver"/>
              </label>
              <div v-show="tt.childShow" class="tt-box" v-for="(ct, ctIndex) in tt.children" v-if="deptShow !== 'CT'">
                <i :class="{minusIcon: ct.childShow && !driver && !deptVo, addIcon: !ct.childShow && !driver && !deptVo}" @click="getDriverList(ct, ctIndex, tt.children)"></i>
                <label>
                  <span class="node-name" v-text="ct.name" :class="{highlight: ct.isChoose}"></span>
                  <input type="radio" name="driBox" v-model="driCheck" :value="ct"/>
                </label>
                <div v-show="ct.childShow" class="ct-box lastNode" v-for="(dri, $index) in ct.children" v-if="!driver && !deptVo">
                  <label>
                    <span class="node-name" v-text="dri.name" :class="{highlight: dri.isChoose}"></span>
                    <input type="radio" name="driBox" v-model="driCheck" :value="dri"/>
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
        driCheck: {},
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
    props: ['driver', 'deptVo', 'deptShow'],
    watch: {
      dept: 'approximateStringMatching'
    },
    methods: {
      transform (team, index, fatherTeam) { // 显示or隐藏班组层级
        team.childShow = !team.childShow
        this.$set(fatherTeam, index, team)
      },
      getDriverList (ct, index, fatherTeam) { // 选择/取消 指导组
        ct.childShow = !ct.childShow
        this.$set(fatherTeam, index, ct)
        if (ct.childShow) {
          this.axios({
            method: 'get',
            params: {'ctCode': ct.code},
            url: '/api/op/driver/view/list'
          }).then((response) => {
            var data = response.data
            if (data.type === 1) {
              ct.children = data.result.list
            }
          }).catch((error) => {
            console.log(error)
          })
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
      boxClose () {
        this.$emit('getDeptCode', this.driCheck)
      },
      closeBox () {
        this.$emit('getDeptCode')
      },
      approximateStringMatching () { // 组织结构的模糊匹配
        this.asmDept = []
        if (!this.dept) {
          return
        }
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

  .ts-box, .tt-box, .ct-box {
    left: 19px;
    position: relative;
  }

  label {
    vertical-align: top;
  }

  .lastNode {
    left: 40px;
    position: relative;
  }
  .highlight{
    color: #2E6DA4;
    font-weight: bold;
  }
  .popup {
    z-index: 940;
  }
  
</style>
