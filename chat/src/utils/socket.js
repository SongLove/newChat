import config from '../config'
import { Toast } from 'vant'
import EventEmitter from 'mitt'

if (!('WebSocket' in window)) {
  alert('浏览器版本过低，请升级')
}

class Socket {
  static get Instance() {
    if (!Socket._instance) {
      Socket._instance = new Socket()
    }
    return Socket._instance
  }

  constructor() {
    // websocket 实例
    this._socket = null

    // 是否是超过最大错误
    this.isMaxError = false

    // 重连次数
    this.reTimes = 0

    // 事件
    this.emmiter = new EventEmitter()
    this.on = this.emmiter.on
    this.emit = this.emmiter.emit
    this.off = this.emmiter.off

    // 上次loading时间
    // this.lastTime = 0
    //this.init()
  }

  /**
   * 初始化weosocket
   * @param {string} type 初始化类型 如果是`error` 提示信息为`正在重新连接` 否则是`正在连接`
   */
  init(type) {
    // 错误超过最大连接次数
    if (this.isMaxError) return
    console.log('initwebsocket')

    // 清除心跳定时器
    // this._timer && clearInterval(this._timer)

    // 建立连接
    this._socket = new WebSocket(config.socketUrl)

    // for events
    this._socket.onmessage = this.onmessage.bind(this)
    this._socket.onopen = this.onOpen.bind(this)
    this._socket.onerror = this.onError.bind(this)
    this._socket.onclose = this.onClose.bind(this)

    // toast tips
    Toast.loading({
      message: type === 'error' ? '正在重新连接' : '正在连接',
      duration: 0
    })
  }

  /**
   * 连接成功
   */
  onOpen() {
    console.log('连接成功！')
    this.reTimes = 0
    Toast.clear()

    // 发送心跳包
    // this._timer = setInterval(() => {
    //   this.send(1)
    // }, config.hearBeat * 1000)
  }

  /**
   * 发送消息
   * @param {object} msg 消息内容
   */
  send(msg) {
    if (this._socket) {
      // let now = +new Date()
      if (msg === 1) {
        this._socket.send(1)
      } else {
        this._socket.send(JSON.stringify(msg))
        // if (now - this.lastTime > 700) {
        //   Toast.loading({ duration: 0 })
        // }
      }
      // this.lastTime = now
    }
  }

  /**
   * websocket收到的数据
   * @param {MessageEvent} e
   */
  onmessage(e) {
    // Toast.clear()
    let message = JSON.parse(e.data)
    console.group('from server msg')
    console.log(message)
    console.groupEnd('from server msg')
    if (message === 2) return
    let { cmd, data, code, msg } = message
    if (code !== 0 && msg) {
      Toast(msg)
      return
    }
    // fire an event
    this.emit(cmd, { data, msg })
  }

  /**
   * 连接websocket失败
   */
  onError() {
    this.reTimes += 1
    if (this.reTimes >= config.reConnectTimes) {
      console.log('超过最大连接次数...')
      this.isMaxError = true
      Toast.fail('重连失败')
    } else {
      console.log('连接失败，重试连接...')
      this.init('error')
    }
    clearInterval(this.timer)
  }

  /**
   * websocket关闭
   */
  onClose() {
    Toast('已断开连接')
    this.init('error')
  }
}

export default Socket
