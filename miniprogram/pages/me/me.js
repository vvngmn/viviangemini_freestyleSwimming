({
  data: { posts: [] },

  onLoad() {
    wx.cloud.callContainer({
      config: { env: 'your-env-id' },
      path: '/api/my-posts',
      header: { 
        'X-WX-SERVICE': 'flask-47k1',
        'X-WX-OPENID': wx.getStorageSync('openid')
      },
      method: 'GET',
      success: res => {
        this.setData({ posts: res.data.data })
      }
    })
  }
})
