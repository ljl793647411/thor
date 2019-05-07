<script>
  import axios from 'axios'
  import moment from 'moment'
  const oneDayMs = 24 * 60 * 60 * 1000 // 一天的毫秒数
  const deptType = 'LD'
  const deptCode = 'XAJWD'
  const RBType = 'RB'
  const RBCode = 'XATLJ'
  const STATUS_LIST = {
    '1': '在职',
    '2': '离职',
    '3': '离退休',
    '4': '脱产学习培训',
    '5': '长期休假',
    '6': '其他'
  }
  const SEX = {
    '1': '男',
    '2': '女'
  }
  const LM_TYPE_LIST = [{
    value: '',
    label: '全部'
  }, {
    value: 'DLM',
    label: '内燃机车'
  }, {
    value: 'DCLM',
    label: '直流机车'
  }, {
    value: 'ACLM',
    label: '交流机车'
  }]
  const LM_TYPES = {
    'DLM': '内燃机车',
    'DCLM': '直流机车',
    'ACLM': '交流机车'
  }
  const TRAIN_TYPE_SELECT = [{
    value: '',
    label: '全部'
  }, {
    value: 'COMM',
    label: '普速列车'
  }, {
    value: 'EMU',
    label: '动车'
  }]
  const TRAIN_TYPES = {
    'COMM': '普速列车',
    'EMU': '动车'
  }
  const VOD_SOURCES = [
    {
      value: 'A',
      label: '音频分析'
    },
    {
      value: 'V',
      label: '视频分析'
    },
    {
      value: 'LKJ',
      label: 'LKJ分析'
    },
    {
      value: 'EOAS',
      label: 'EOAS分析'
    }
  ]
  const VOD_SOURCE_LIST = {
    'A': '音频分析',
    'V': '视频分析',
    'LKJ': 'LKJ分析',
    'EOAS': 'EOAS分析'
  }
  const DEPT_TYPE = [
    {
      value: '',
      label: '全部'
    },
    {
      value: 'RB',
      label: '铁路局'
    },
    {
      value: 'LD',
      label: '机务段'
    }, {
      value: 'TS',
      label: '车间'
    },
    {
      value: 'TT',
      label: '车队'
    },
    {
      value: 'CT',
      label: '指导组'
    }, {
      value: 'OMTS',
      label: '检修车间'
    },
    {
      value: 'OMT',
      label: '检修班组'
    },
    {
      value: 'OMP',
      label: '检修岗位'
    }
  ]
  const DEPT_TYPE_LIST = {
    'RB': '铁路局',
    'LD': '机务段',
    'TS': '车间',
    'TT': '车队',
    'CT': '指导组',
    'OMTS': '检修车间',
    'OMT': '检修班组',
    'OMP': '检修岗位'
  }
  const LIST_NO_DATA_TEXT = '当前页面无数据'
  const DASHBOARD_COLOR = ['#0C77ED', '#f7a35c', '#8085e9',
    '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1']
  
  export default { // 存放公共方法
    DASHBOARD_COLOR,
    TRAIN_TYPE_SELECT,
    LIST_NO_DATA_TEXT,
    oneDayMs,
    deptType,
    deptCode,
    RBType,
    RBCode,
    STATUS_LIST,
    SEX,
    LM_TYPE_LIST,
    LM_TYPES,
    TRAIN_TYPES,
    VOD_SOURCES,
    DEPT_TYPE,
    DEPT_TYPE_LIST,
    VOD_SOURCE_LIST,
    name: 'config',
    components: {
      axios
    },
    state: {
      count: 1,
      flag: true
    },
    mutations: {
      increment (state) {
        state.count++
      }
    },
    gotoLogin () { // 回退到登入页面
//  console.log(axios)
      axios.defaults.headers.post['accessToken'] = ''
      axios.defaults.headers.get['accessToken'] = ''
    },
    getCookie (name) { // 读取cookie，返回cookie的值
      let arr = new RegExp('(^| )' + name + '=([^;]*)(;|$)') // 正则匹配
      let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      if (document.cookie.match(reg)) {
        arr = document.cookie.match(reg)
        console.log(unescape(arr[2]) + '1')
        return unescape(arr[2])
      } else {
        console.log('没有找到cookie: ' + name)
        return '' // 不能返回 null， null是object, undefind是字符串。
      }
    },
    delCookie (name) { // 删除cookie
      let exp = new Date()
      exp.setTime(exp.getTime() - 1)
      let cval = this.getCookie(name)
      if (cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
      }
    },
    getStorage (name) {
      let storage = localStorage.getItem(name)
      storage = JSON.parse(storage)
      return storage
    },
    setStorage (k, v) {
      var obj = JSON.stringify(v)
      let storage = localStorage.setItem(k, obj)
      return storage
    },
    dateToString (dateTime, format) { // 时间格式化
      var d, k, o
      o = {
        'M+': dateTime.getMonth() + 1,
        'd+': dateTime.getDate(),
        'h+': dateTime.getHours(),
        'm+': dateTime.getMinutes(),
        's+': dateTime.getSeconds(),
        'q+': Math.floor((dateTime.getMonth() + 3) / 3),
        'S': dateTime.getMilliseconds()
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (dateTime.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (k in o) {
        d = o[k]
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? d : ('00' + d).substr(('' + d).length))
        }
      }
      return format
    },
    getScrollTop (id) {
      let scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
//  console.dir('scrollTop: ' + scrollTop)
      return scrollTop
    },
    getAdmin () {
      let userInfo = this.getStorage('loginResult')
      if (userInfo && userInfo.admin) {
        return true
      }
    },
    containsPrivilege (code) {
      let userInfo = this.getStorage('loginResult')
      if (userInfo && userInfo.admin) {
        return true
      }
      let privileges = this.getStorage('PRIVILEGES')
      return privileges && privileges.includes(code)
    },
    containsAnyPrivilege (codes) {
      let userInfo = this.getStorage('loginResult')
      if (userInfo && userInfo.admin) {
        return true
      }
      let privileges = this.getStorage('PRIVILEGES')
      if (privileges && codes) {
        for (let index in codes) {
          if (privileges.includes(codes[index])) {
            return true
          }
        }
      }
      return false
    },
    /*
     * 如果当前时间已经超过了timeStr + configCode指定的分钟数，返回分钟数，否则返回false
     *
     * @param timeStr       时间字符串，格式yyyy-MM-dd HH:mm:ss
     * @param configCode    配置代码，用于从保存在local storage中的EDIT_TIME_LIMITS中取得配置值
     * @param defaultConfig 默认的配置值，可以没有
     */
    getTimeLimit (timeStr, configCode, defaultConfig) {
      let configs = this.getStorage('EDIT_TIME_LIMITS')
      let config = configs[configCode] || defaultConfig || 15
      let format = 'YYYY-MM-DD hh:mm:ss'
      let time = moment(timeStr)
      let limit = time.add(config, 'minutes')
      let now = new moment()
      console.log(config, time.format(format), limit.format(format), now.format(format), limit.isBefore(now))
      if (moment(timeStr).add(config, 'minutes').isBefore(new moment())) {
        return config
      } else {
        return false
      }
    },
    getIsAdmin () {
      let login = this.getStorage('loginResult')
      return login.admin
    },
    getLoginName () {
      let login = this.getStorage('loginResult')
      return login.name
    }
  }
</script>
