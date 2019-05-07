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
          <li v-for="dept in asmDept" @click="searchResultSelected(dept)" class="cursor">{{ dept.namePath }}</li>
        </ul>
      </div>
      <div class="dri-box">
        <div class="dri-tree" ref="driTree">
        	<label>
            <span class="node-name" v-text="root.name" :class="{highlight: root.isChoose}"></span>
            <input type="radio" v-model="tsVo" value="XAJWD" v-if="deptShow !== 'OMP' && deptShow !== 'OMT' && !radio"/>
          </label>
          <div v-for="(omts, a) in root.children" v-show="deptShow !== 'OMTS'">
            <i :class="{minusIcon: omts.childShow, addIcon: !omts.childShow}" @click="transform(omts, a, root.children)"></i>
            <label>
              <span class="node-name" v-text="omts.name" :class="{highlight: omts.isChoose}"></span>
              <input type="radio" v-model="tsVo" :value="omts" v-if="deptShow !== 'OMP' && !radio"/>
            </label>
            <div v-show="omts.childShow && deptShow !== 'OMT'" v-for="(omt, a) in omts.children" class="omt-box">
              <i :class="{minusIcon: omt.childShow, addIcon: !omt.childShow}" @click="transform(omt, a, omts.children)"></i>
              <label>
                <span class="node-name" v-text="omt.name" :class="{highlight: omt.isChoose}"></span>
                <input type="radio" v-model="tsVo" :value="omt" v-if="!radio"/>
              </label>
              <div v-show="omt.childShow && deptShow !== 'OMP'" class="omp-box lastNode" v-for="(omp, b) in omt.children">
                <label>
                  <span class="node-name" v-text="omp.name" :class="{highlight: omp.isChoose}"></span>
                  <input type="radio" v-model="tsVo" :value="omp"/>
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
    name: 'overhaulRadioBox',
    data () {
      return {
        root: {},
        nodeMap: {},
        resultVo: {
          depts: [],
          deptType: ''
        },
        tsVo: {},
        asmDept: [],
        dept: ''
      }
    },
    props: ['deptShow', 'radio'],
    mounted () {
      this.$nextTick(() => {
        console.log(this.deptShow)
        this.getTree()
      })
    },
    watch: {
      dept: 'approximateStringMatching'
    },
    methods: {
      transform (node, index, fathernode) { // 显示or隐藏班组层级
        node.childShow = !node.childShow
        this.$set(fathernode, index, node)
      },
      boxClose () {
        this.$emit('getOmCode', this.tsVo)
      },
      initTree (node) { // 初始化
        if (!node) {
          return
        }
        this.nodeMap[node.code] = node
        node.isCheck = false
        node.isChoose = false
        node.childShow = node.type === 'OMTS'
        for (let i in node.children) {
          this.initTree(node.children[i])
        }
      },
      getTree () { // 获取this.root
        let self = this
        this.axios({
          method: 'get',
          params: {'type': 2},
          url: '/api/op/dept/view/tree'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            self.root = data.result.tree
            self.initTree(self.root) // 层级的显示or隐藏，初始化
            self.root.childShow = true
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
        for (let i in this.nodeMap) {
          let node = this.nodeMap[i]
          if (node.code.indexOf(this.dept) > -1 || node.name.indexOf(this.dept) > -1) {
            this.asmDept.push(node)
          }
        }
      },
      searchResultSelected (dept) {
        this.dept = ''
        this.initTree(this.root)
        if (dept.codePath) {
          let codes = dept.codePath.split(',')
          let node
          for (let i in codes) {
            node = this.nodeMap[codes[i]]
            if (node) {
              node.childShow = true
            }
          }
          node.isChoose = true
        }
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

  .omt-box, .omp-box {
    position: relative;
  }

  .omt-box {
    left: 19px;
  }

  .omp-box {
    left: 40px;
  }

  label {
    vertical-align: top;
  }

  .lastNode {
    left: 40px;
    position: relative;
  }

  .dept-box-btn {
    position: absolute;
    bottom: 20px;
    right: 60px;
  }
  .highlight {
    color: #2E6DA4;
    font-weight: bold;
  }
  .popup {
    z-index: 940;
  }

</style>
