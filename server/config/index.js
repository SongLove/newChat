const isDev = process.env.NODE_ENV === 'production' ? false : true

const config = {
  serverUrl: isDev ? 3300 : 3300,
  DB_URL: isDev ? 'mongodb://admin:520.mnbx@www.tanggeek.top/chat' : 'mongodb://admin:520.mnbx@www.tanggeek.top/chat'
}

module.exports = config