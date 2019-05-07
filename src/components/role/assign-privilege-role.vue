<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-privilege">
      <div class="popup-head">
        <b>角色权限分配</b>
        <div class="icon-remove" @click="boxClose">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div class="privilege-box">
        <div>
          <div class="privilege-box-tree">
            <div :class="{addIcon: rootNodeStatus, minusIcon: !rootNodeStatus}" @click="rootNodeStatus = !rootNodeStatus"></div>
            <span>
              <input type="checkbox" name="head" v-model="mAll" @click="menusAll(all)"><label for="head">菜单列表</label>
            </span>
            <div class="privilege-tree" v-for="(menu,index) in menus" v-if="!rootNodeStatus && menus">
              <div :class="{addIcon: !menu.childShow && menu.children.length !== 0, minusIcon: menu.childShow || menu.children.length === 0}" @click="changeNodeStatus(menu)"></div>
              <span>
                <input type="checkbox" name="head" :id="'m' + menu.sid" v-model="menu.isCheck" :value="menu.sid" @click="menusAll(all, menu)"><label :for="'m' + menu.sid" v-text="menu.pathName"></label>
              </span>
              <div class="privilege-tree" v-for="(menu2,index) in menu.children" v-if="menu.childShow && menu.children">
                <div :class="{addIcon: !menu2.childShow && menu2.children.length !== 0, minusIcon: menu2.childShow || menu2.children.length === 0}" @click="changeNodeStatus(menu2)"></div>
                <span>
                  <input type="checkbox" name="head" :id="'m' + menu2.sid" v-model="menu2.isCheck" :value="menu2.sid" @click="menusAll(all, menu, menu2)"><label :for="'m' + menu2.sid" v-text="menu2.pathName"></label>
                </span>
                <div class="privilege-tree" v-for="(menu3,index) in menu2.children" v-if="menu2.childShow && menu2.children">
                  <div :class="{addIcon: !menu3.childShow && menu3.children.length !== 0, minusIcon: menu3.childShow || menu3.children.length === 0}" @click="changeNodeStatus(menu3)"></div>
                  <span>
                  <input type="checkbox" name="head" :id="'m' + menu3.sid" v-model="menu3.isCheck" :value="menu3.sid" @click="menusAll(all, menu, menu2, menu3)"><label :for="'m' + menu3.sid" v-text="menu3.pathName"></label>
                </span>
                  <div class="privilege-tree" v-for="(menu4,index) in menu3.children" v-if="menu3.childShow && menu3.children">
                    <div :class="{minusIcon: menu3.children}"></div>
                    <span>
                    <input type="checkbox" name="head" :id="'m' + menu4.sid" v-model="menu4.isCheck" :value="menu4.sid" @click="menusAll(all, menu, menu2, menu3, menu4)"><label :for="'m' + menu4.sid" v-text="menu4.pathName"></label>
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="privilege-box-tree">
            <span>
              <input type="checkbox" name="head" @click="functionsAll" v-model="fAll"><label for="head">功能列表</label>
            </span>
            <div class="privilege-tree-right" v-for="(f,index) in functions" v-if="functions">
              <span>
                <input type="checkbox" name="head" :id="'f' + f.sid" v-model="functionsList" :value="f.sid"><label :for="'f' + f.sid" v-text="f.dispName"></label>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-submit">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import loginPopup from '@/components/login-popup'
  import config from '@/components/config'

  export default {
    data () {
      return {
        menus: [],
        menus1: [],
        functions: [],
        restoring: false,
        functionsList: [],
        menusList: [],
        rootNodeStatus: false,
        loginPopup: false,
        fAll: false,
        mAll: false,
        all: {
          ischeck: false
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getPrivilegeList()
        console.log(this.ajVo)
      })
    },
    props: ['ajVo'],
    components: {
      loginPopup,
      config
    },
    methods: {
      boxClose () {
        this.$emit('closeBox')
      },
      getPrivilegeList () {
        this.axios({
          method: 'get',
          url: '/api/privilege/mgt/all'
        }).then((response) => {
          let self = this
          var data = response.data
          if (data.type === 1) {
            self.menus = []
            let menuSidMap = {}
            let menus = data.result.menus
            for (let index in menus) {
              let menu = menus[index]
              if (!menu.parentSid) {
                self.menus.push(menu)
              }
              menuSidMap[menu.sid] = menu
              self.$set(menu, 'children', [])
              self.$set(menu, 'isCheck', false)
              self.$set(menu, 'childShow', true)
            }
            for (let index in menus) {
              let menu = menus[index]
              if (menuSidMap[menu.parentSid]) {
                menuSidMap[menu.parentSid].children.push(menu)
              }
            }
            self.menus1 = menus
            self.functions = data.result.functions
            for (let i in self.ajVo.pvlgSids) {
              let sid = self.ajVo.pvlgSids[i]
              let menu = menuSidMap[sid]
              menu.isCheck = true
              while (menu.parentSid) {
                menu = menuSidMap[menu.parentSid]
                menu.isCheck = true
                menu.childShow = true
              }
              for (let f in self.functions) {
                if (self.ajVo.pvlgSids[i] === self.functions[f].sid) {
                  self.functionsList.push(self.ajVo.pvlgSids[i])
                }
              }
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      loginSuccess (result) {
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登录成功')
      },
      changeNodeStatus (val) {
        if (typeof val.childShow === 'undefined') {
          this.$set(val, 'childShow', true)
        } else {
          val.childShow = !val.childShow
        }
        console.dir(val)
      },
      submit () {
        for (let i in this.menus1) {
          if (this.menus1[i].isCheck) {
            this.menusList.push(this.menus1[i].sid)
          }
        }
        this.roleSid = this.ajVo.sid
        if (this.menusList.length === 0) {
          this.privilegeSids = this.functionsList
        } else if (this.functionsList.length === 0) {
          this.privilegeSids = this.menusList
        } else {
          this.privilegeSids = this.functionsList.concat(this.menusList)
        }
        this.axios({
          method: 'post',
          data: this.privilegeSids,
          url: '/api/role/mgt/assign-privilege-to-role',
          params: {'roleSid': this.roleSid}
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            console.log('操作成功')
            this.$emit('closeBox', this.privilegeSids)
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      functionsAll () {
        let self = this
        setTimeout(() => {
          if (self.fAll) {
            for (let i in self.functions) {
              self.functionsList.push(self.functions[i].sid)
            }
          } else {
            self.functionsList = []
          }
        }, 0)
      },
      menusAll (all, menu, menu2, menu3, menu4) {
        if (all) {
          if (all && menu) {
            if (all && menu && menu2) {
              if (all && menu && menu2 && menu3) {
                if (all && menu && menu2 && menu3 && menu4) {
                  menu4.isCheck = !menu4.isCheck
                } else {
                  menu3.isCheck = !menu3.isCheck
                  menu3.childShow = true
                  for (let i in menu3.children) {
                    menu3.children[i].isCheck = menu3.isCheck
                  }
                }
              } else {
                menu2.isCheck = !menu2.isCheck
                menu2.childShow = true
                for (let l in menu2.children) {
                  menu2.children[l].childShow = true
                  for (let j in menu2.children[l].children) {
                    menu2.children[l].children[j].isCheck = menu2.isCheck
                    menu2.children[l].isCheck = menu2.isCheck
                  }
                }
              }
            } else {
              menu.isCheck = !menu.isCheck
              menu.childShow = true
              for (let l in menu.children) {
                menu.children[l].childShow = true
                for (let j in menu.children[l].children) {
                  menu.children[l].children[j].childShow = true
                  for (let k in menu.children[l].children[j].children) {
                    menu.children[l].children[j].children[k].isCheck = menu.isCheck
                    menu.children[l].children[j].isCheck = menu.isCheck
                    menu.children[l].isCheck = menu.isCheck
                  }
                }
              }
            }
          } else {
            this.all.isCheck = !this.all.isCheck
            for (let m in this.menus1) {
              this.menus1[m].isCheck = this.all.isCheck
            }
          }
        }
      }
    }
  }
</script>


<style scoped>

</style>
