
// 将时间戳转换为yy-mm-dd
function normalTime(time) {
  if (time) {
    time = new Date(time)
    let newDate = Date.parse(new Date())
    let diffTime = Math.abs(newDate - time)
    let data = new Date(time)
    let y = data.getFullYear()
    let m = data.getMonth() + 1
    m = add0(m)
    let d = data.getDate()
    d = add0(d)
    let h = data.getHours()
    h = add0(h)
    let minute = data.getMinutes()
    let second = data.getSeconds()
    minute = add0(minute)
    second = add0(second)
    return {
      m,
      d,
      h,
      minute,
      diffTime
    }
    // if (diffTime > 24 * 3600 * 1000) {
    //   return m + '-' + d + ' ' + h + ':' + minute;
    // } else {
    //   return h + ':' + minute;
    // }
  }
}

export default {
  fomatTime(time) {
    let { m, d, h, minute, diffTime } = normalTime(time)
    if (diffTime < 7 * 24 * 3600 * 1000 && diffTime > 24 * 3600 * 1000) {
      // 一周之内 一天之前
      let dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000))
      return dayNum + ' 天前'
    } else if (diffTime < 24 * 3600 * 1000 && diffTime > 3600 * 1000) {
      // 一天之内
      let dayNum = Math.floor(diffTime / (60 * 60 * 1000))
      return dayNum + ' 小时前'
    } else if (diffTime < 3600 * 1000 && diffTime > 0) {
      // 一小时之内
      let dayNum = Math.floor(diffTime / (60 * 1000)) || 1
      return dayNum + ' 分钟前'
    }
  },
  normalTimeFilter(time) {
    let { m, d, h, minute, diffTime } = normalTime(time)
    if (diffTime > 24 * 3600 * 1000) {
      return m + '-' + d + ' ' + h + ':' + minute;
    } else {
      return h + ':' + minute;
    }
  },
  weekTime(time) {
    let { m, d, h, minute, diffTime } = normalTime(time)
    let weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    if (diffTime < 24 * 3600 * 1000) {
      return h + ':' + minute;
    } else if (diffTime < 2 * 24 * 3600 * 1000 && diffTime > 24 * 3600 * 1000) {
      return '昨天'
    } else if (diffTime < 3 * 24 * 3600 * 1000 && diffTime > 2 * 24 * 3600 * 1000) {
      return '前天'
    } else if (diffTime < 7 * 24 * 3600 * 1000 && diffTime > 3 * 24 * 3600 * 1000) {
      let dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000))
      return weeks[dayNum]
    } else if (diffTime > 24 * 3600 * 1000) {
      return m + '-' + d + ' ' + h + ':' + minute;
    }
  }
}

// 补0
function add0(val) {
  if (val < 10) return '0' + val
  else return val
}