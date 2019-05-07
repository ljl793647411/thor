<template>
<div class="nav-zhezhao">
  <div class="nav-inner-width">
    <div v-if="this.$route.name !== 'login'" class="all-nav">
      <div>
        <div class="right-nav">
          <div>{{'欢迎！' + this.loginResult.name}}</div>
          <div class="line"></div>
          <div @click="logout" class="cursor logout-class">注销</div>
        </div>
        <div class="nav">
          <nav class="nav-class">
            <div class="nav-div" v-for="lvl in loginResult.menus">
              <a :href="lvl.path ? lvl.path : 'javascript:;'" class="nav-lvl1">
                <span v-text="lvl.pathName"></span>
              </a>
              <ul v-if="lvl.children.length !== 0" class="lvl2-nav">
                <li v-for="lvl2 in lvl.children">
                  <a :href="lvl2.path ? lvl2.path : 'javascript:;'" class="lvl2-a">
                    <span v-text="lvl2.pathName"></span>
                    <i class="arrow-icon" v-if="lvl2.children.length !== 0">
                      <img src="../../static/right.png" alt="">
                    </i>
                    <ul v-if="lvl2.children.length !== 0" class="lvl3-nav">
                      <div class="arrow-icon-left">
                        <img src="../../static/jiantou.png" alt="">
                      </div>
                      <li v-for="lvl3 in lvl2.children">
                        <a :href="lvl3.path ? lvl3.path : 'javascript:;'" class="lvl3-a">
                          <span v-text="lvl3.pathName"></span>
                          <i class="arrow-icon" v-if="lvl3.children.length !== 0">
                            <img src="../../static/right.png" alt="">
                          </i>
                          <ul v-if="lvl3.children.length !== 0" class="lvl4-nav">
                            <div class="arrow-icon-left">
                              <img src="../../static/jiantou.png" alt="">
                            </div>
                            <li v-for="lvl4 in lvl3.children">
                              <a :href="lvl4.path ? lvl4.path : 'javascript:;'">
                                <span v-text="lvl4.pathName"></span>
                              </a>
                            </li>
                          </ul>
                        </a>
                      </li>
                    </ul>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div class="router-title" v-text="name" v-if="$route.path !== '/home'"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import config from '@/components/config'
export default {
  data () {
    return {
      navHtml: '',
      isLogin: true,
      name: ''
    }
  },
  props: ['loginResult', 'navFixed'],
  mounted () {
    this.$nextTick(() => {
      if (this.$route.path !== '/') {
        this.getPathName(config.getStorage('loginResult').menus)
      }
    })
  },
  components: {
    config
  },
  watch: {
    $route: 'changeRoute'
  },
  methods: {
    logout () {
      // 登出
      localStorage.clear()
      this.axios.defaults.headers.get['accessToken'] = this.axios.defaults.headers.post['accessToken'] = ''
      this.$router.push({ path: '/' })
    },
    changeRoute () {
      this.$emit('changeRoute', this.$route)
      if (this.$route.path !== '/') {
        this.getPathName(config.getStorage('loginResult').menus)
      }
    },
    getPathName (menu) {
      let path = '#' + this.$route.path
      console.log('path', path)
      for (let i in menu) {
        let arr = []
        arr.push(menu[i])
        while (arr.length !== 0) {
          let menu = arr.pop()
          if (path === menu.path) {
            this.name = menu.dispName
            return
          } else {
            for (let j = 0; j < menu.children.length; j++) {
              arr.push(menu.children[j])
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
ul {
  margin: 0;
  border-top: none;
  position: absolute;
  left: 3px;
  background: #000;
  border: 1px solid #fff;
}
li {
  display: block;
  margin: 0;
  line-height: 30px;
  font-size: 16px;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
}
img {
  width: 100%;
  height: 100%;
}
.nav-div:hover > .lvl2-nav {
  display: block;
  z-index: 11111;
  width: 162px;
  padding: 5px 0;
}
.lvl2-nav {
  display: none;
  z-index: 11111;
  width: 162px;
  padding: 5px 0;
}
.lvl2-nav a {
  display: block;
  height: 30px;
  width: 162px;
}
.lvl2-nav a:hover{
  transform: scale(1.1);
}
.lvl2-a:hover > .lvl3-nav {
  display: block;
}
.lvl2-a:hover > .arrow-icon {
  display: none;
}
.lvl3-nav {
  display: none;
  z-index: 22222;
  width: 163px;
  padding: 5px 0;
  left: 146px;
  top: -4px;
}
.lvl3-nav a {
  display: block;
  height: 30px;
  width: 162px;
}
.lvl3-nav a:hover {
  transform: scale(1.1)
}
.lvl3-a:hover > .lvl4-nav {
  display: block;
}
.lvl3-a:hover > .arrow-icon {
  display: none;
}
.lvl4-nav {
  display: none;
  z-index: 22223;
  width: 163px;
  padding: 5px 0;
  left: 146.5px;
  top: -4px;
}
.lvl4-nav a {
  display: block;
  height: 30px;
  width: 162px;
}
.lvl4-nav a:hover {
  transform: scale(1.1)
}


.arrow-icon {
  height: 10px;
  width: 10px;
  display: inline-block;
}
.arrow-icon-left {
  height: 15px;
  width: 15px;
  display: inline-block;
  position: absolute;
  left: -11px;
  z-index: 1;
}
.right-nav {
  float: right;
  margin-right: 5px;
  width: 190px;
  height: auto;
  line-height: 68px;
  font-size: 14px;
  font-family: HiraginoSansGB-W3;
  font-weight: normal;
  color: rgba(26, 26, 26, 1);
}
.line {
  border-left: 1px solid #1a1a1a;
  width: 1px;
  height: 14px;
  margin-top: 27px;
}
.right-nav div {
  float: left;
  margin-right: 10px;
}
.right-nav .logout-class:hover {
  color: #00bbee;
}
.nav {
  width: 1096px;
  height: 68px;
  float: left;
}
.nav-class {
  line-height: 68px;
}
.nav-div {
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin-left: 36px;
}
.lvl2-nav span {
  font-size:14px;
  font-family:HiraginoSansGB-W3;
  font-weight:normal;
  color:rgba(230,230,230,1);
}
.nav-div:hover > .nav-lvl1 {
  color: #00bbee;
}
.nav-zhezhao {
  width: 100%;
  height: 0;
  background: rgba(0,0,0,0.8);
}
.router-title {
  color: #fff;
  position: absolute;
  top: 89px;
  left: 55px;
  z-index: 1;
}
</style>
