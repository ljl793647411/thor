<template>
  <div>
    <div class="zhezhao" style="z-index: 940;"></div>
    <div class="popup-role">
      <div class="popup-head">
        <b>用户分配</b>
        <div class="icon-remove" @click="boxClose">
          <img src="../../../static/cha.png" alt="">
        </div>
      </div>
      <div class="role-box">
        <div class="tree-choose-box">
          <span class="tree-node cursor" @click="chooseLastNode(1)" :class="{active: choose === 1}">待选择</span>
          <span class="tree-node cursor" @click="chooseLastNode(2)" :class="{active: choose === 2}">已选择</span>
        </div>
        <div class="table">
          <table>
            <thead>
            <tr>
              <th style="width:10%;"></th>
              <th>登录名</th>
              <th>姓名</th>
              <th>性别</th>
              <th>在职状态</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in roleList" :class="{trbg: index % 2 === 0}">
              <td>
                <input type="checkbox" :id="user.sid" name="sid" @change="addSids(user.sid)">
              </td>
              <td v-text="user.loginName"></td>
              <td v-text="user.name"></td>
              <td v-text="SEX[user.sex]"></td>
              <td v-text="STATUS_LIST[user.status]"></td>
            </tr>
            </tbody>
          </table>
          <paginate :pageVo='pageVo' :pageSize='pageSize' :totalRecs='totalRecs' :currentPage='currentPage' :count='count' @changePage='changePage'></paginate>
        </div>
      </div>
      <div class="popup-submit-role">
        <el-button type="primary" @click="appliy" v-text="choose === 1 ? '应用' : '解绑'"></el-button>
      </div>
    </div>
    <div v-if="loginPopup">
      <login-popup @loginSuccess='loginSuccess'></login-popup>
    </div>
  </div>
</template>

<script>
  import config from '@/components/config'
  import loginPopup from '@/components/login-popup'
  import paginate from '@/components/paginate'

  export default {
    data () {
      return {
        currentPage: 1,
        count: 0,
        totalRecs: '',
        pageSize: 10,
        pageVo: {
          'prevText': '<<',
          'nextText': '>>'
        },
        STATUS_LIST: config.STATUS_LIST,
        SEX: config.SEX,
        role: {
          userSids: []
        },
        roleList: [],
        loginPopup: false,
        choose: 1
      }
    },
    mounted () {
      this.getRoleList()
    },
    props: ['assignUserVo'],
    components: {
      config,
      loginPopup,
      paginate
    },
    methods: {
      getRoleList (approach) {
        let url
        if (this.choose === 1) {
          url = '/api/user/mgt/not-have-role-users'
        } else if (this.choose === 2) {
          url = '/api/user/mgt/has-role-users'
        }
        this.role.roleSid = this.assignUserVo.sid
        this.axios({
          method: 'post',
          params: {'pageNo': approach === 'query' ? 1 : this.currentPage, 'pageSize': this.pageSize, 'roleSid': this.role.roleSid},
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.currentPage = data.result.pageNo // 当前页
            this.count = data.result.totalPages // 总页数
            this.totalRecs = data.result.totalRecs
            this.roleList = data.result.resultList
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      chooseLastNode (num) {
        this.choose = num
        this.getRoleList('query')
        this.getInit()
      },
      loginSuccess (result) { // 登入成功（从弹窗登入成功）
        this.loginPopup = false
        this.$emit('setLoginInfo', result)
        console.log('弹窗登入成功')
      },
      boxClose () {
        this.$emit('closeUserBox')
      },
      addSids (sids) {
        let sid = document.getElementById(sids)
        if (sid.checked === true) {
          this.role.userSids.push(sids)
        }
      },
      getInit () {
        this.getRoleList()
        let check = document.getElementsByName('sid')
        for (let i in check) {
          check[i].checked = false
        }
      },
      appliy () {
        let url
        if (this.choose === 1) {
          url = '/api/role/mgt/assign-role-to-users'
        } else if (this.choose === 2) {
          url = '/api/role/mgt/pick-off-role-from-users'
        }
        this.role.roleSid = this.assignUserVo.sid
        if (!this.role.roleSid || this.role.userSids.length === 0) {
          return
        }
        this.axios({
          method: 'post',
          data: this.role.userSids,
          params: {'roleSid': this.role.roleSid},
          url: url
        }).then((response) => {
          var data = response.data
          if (data.type === 1) {
            this.$message.success('修改成功')
            if (this.choose === 1) {
              this.chooseLastNode(2)
            } else {
              this.chooseLastNode(1)
            }
          } else if (data.type === 401) { // 登入信息验证失败
            config.gotoLogin()
            this.loginPopup = true
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      changePage (pageNo, pageSize) { // 切换页面
        console.log(pageNo)
        this.currentPage = pageNo
        this.pageSize = pageSize
        this.getRoleList()
      }
    }
  }
</script>


<style scoped>
  
/* 角色->用户分配 */
.popup-role {
  width: 800px;
  max-height: 600px;
  overflow-y: auto;
  z-index: 940;
  font-size:16px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgb(223, 223, 223);
}
.active {
  color: #fff !important;
  background-color: rgba(0,0,0,0.1) !important; 
}
.ts-box,.tt-box,.ct-box{
  left: 19px;
  position: relative;
}
.lastNode{
  left: 30px;
  position: relative;
}

.tree-node {
  width: 300px;
}
.role-box {
  width: 600px;
  margin: 0 auto;
  font-size:16px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgba(229,229,229,1);
}
.tree-choose-box {
  width: 600px;
  height: 33px;
  border: 1px solid #d1d1d1;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-top: 20px;
}
.popup-submit-role {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  top: 20px;
}
</style>
