App({
  // 小程序初始化完成时触发（全局只触发一次）
  onLaunch(options) {
    console.log('小程序初始化', options);
    wx.cloud.init({ env: 'prod-2gekgttq8daf0fa6' });
    // 可在此处执行登录校验、获取设备信息等初始化操作
    this.handleReferrerInfo(options);
  },

  // 小程序显示时触发（从后台进入前台）
  onShow(options) {
    console.log('小程序进入前台', options.scene);
    // 适合执行数据刷新、重新连接WebSocket等操作
    this.handleReferrerInfo(options);
  },

  // 小程序隐藏时触发（从前台进入后台）
  onHide() {
    console.log('小程序进入后台');
    // 可在此暂停定时器、保存临时数据
  },

  // 小程序发生脚本错误或API调用失败时触发
  onError(error) {
    console.error('全局错误捕获:', error);
    // 建议在此上报错误日志到服务器
  },

  // 自定义全局数据（所有页面共享）
  globalData: {
    userInfo: null,
    systemInfo: wx.getSystemInfoSync() // 获取设备信息
  },

  handleReferrerInfo(options) {
    if (options && options.referrerInfo && options.referrerInfo.extraData) {
      // 公众号文章信息
      const articleInfo = options.referrerInfo.extraData;
      // 存储到本地，供推荐号页面读取
      wx.setStorageSync('pendingArticle', articleInfo);
    }
  }
})
