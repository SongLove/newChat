const isDev = process.env.NODE_ENV === 'production' ? false : true

const config = {
  serverUrl: isDev ? 3300 : '',
  DB_URL: isDev ? 'mongodb://127.0.0.1/chat' : ''
}

module.exports = config