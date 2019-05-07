<template>
  <div>
    <div class="zhezhao" style="z-index: 950;"></div>
      <div class="popup-privilege">
      <div class="popup-head">
        <b>组织选择</b>
        <div class="icon-remove" @click="onSubmitClick">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div class="dri-box">
        <div class="dir-head">
          <div>
            <input type="checkbox" id="selectAll" @click="onSelectAllClicked" />
            <label for="selectAll">全选</label>
          </div>
          <div>
            <input type="checkbox" id="selectAllEditor" @click="onSelectAllEditorClicked" />
            <label for="selectAllEditor">全部数据录入者</label>
          </div>
          <div>
            <input type="checkbox" id="selectAllAuditor" @click="onSelectAllAuditorClicked" />
            <label for="selectAllAuditor">全部数据审核者</label>
          </div>
        </div>
        <ul class="dir-parent">
          <li class="dir-list" v-for="(role, index) in allRoles">
            <input type="checkbox" v-model="selectedRoleSids" :value="role.sid" :id="'role-' + role.sid" />
            <label :for="'role-' + role.sid">{{ role.name }}</label>
          </li>
        </ul>
        <div class="popup-submit">
          <el-button type="primary" @click="onSubmitClick">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'driBox',
    data () {
      return {
        allRoles: [],
        selectedRoleSids: [],
        selectedRoles: []
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.roleSids) {
          for (let i in this.roleSids) {
            this.selectedRoleSids.push(this.roleSids[i])
          }
        }
        this.getAllRoles()
      })
    },
    props: ['roleSids'],
    methods: {
      getAllRoles () {
        this.axios({
          method: 'post',
          data: {},
          params: {'pageNo': 1, 'pageSize': 1000},
          url: '/api/role/mgt/list'
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.allRoles = data.result.resultList
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      onSubmitClick () {
        if (this.selectedRoleSids && this.selectedRoleSids.length) {
          this.selectedRoles = []
          for (let i in this.allRoles) {
            let role = this.allRoles[i]
            if (this.selectedRoleSids.includes(role.sid)) {
              this.selectedRoles.push(role)
            }
          }
        }
        this.$emit('boxClose', this.selectedRoles)
      },
      onSelectAllClicked (event) {
        setTimeout(() => {
          this.selectedRoleSids = []
          if (event.target.checked) {
            for (let i in this.allRoles) {
              this.selectedRoleSids.push(this.allRoles[i].sid)
            }
          }
        }, 10)
      },
      onSelectAllEditorClicked (event) {
        this.handledMatched(event.target.checked, 'EDITOR')
      },
      onSelectAllAuditorClicked (event) {
        this.handledMatched(event.target.checked, 'AUDITOR')
      },
      handledMatched (checked, matchStr) {
        setTimeout(() => {
          let matched = []
          for (let i in this.allRoles) {
            if (this.allRoles[i].code.endsWith(matchStr)) {
              matched.push(this.allRoles[i].sid)
            }
          }
          if (checked) {
            for (let j in matched) {
              if (!this.selectedRoleSids.includes(matched[j])) {
                this.selectedRoleSids.push(matched[j])
              }
            }
          } else {
            let result = []
            for (let j in this.selectedRoleSids) {
              if (!matched.includes(this.selectedRoleSids[j])) {
                result.push(this.selectedRoleSids[j])
              }
            }
            this.selectedRoleSids = result
          }
        }, 10)
      }
    }
  }
</script>

<style scoped>
  .popup-privilege {
    z-index: 950;
  }
  .dir-list {
    width: 48%;
    float: left;
    padding:5px 5px;
  }
  .dri-box {
    width: 80%;
    margin: 0 auto;
  }
  .dir-head {
    width: 80%;
    height: 33px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 20px auto;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    background: #ccc;
    color: #000;
  }
  .dir-parent {
    width: 100%;
    height: 360px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 0;
    box-sizing: border-box;
  }

</style>
