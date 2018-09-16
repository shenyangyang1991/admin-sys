module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '嗨范儿社区管理系统',
    meta: [
      {charset: 'utf-8'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#3B8070'},
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['qiniu-js', '~/plugins/antd-vue']
  },
  plugins: [
    { src: '~/plugins/antd-vue', ssr: true }
  ],
  /*
  ** Module configuration
   */
  modules: [
    '@nuxtjs/axios'
  ],
  /*
  ** axios proxy configuration
   */
  axios: {
    proxy: true
  },
  proxy: {
    '/api/': {target: 'https://api.hfc.highfaner.com', pathRewrite: {'^/api/': ''}}
  }
}

