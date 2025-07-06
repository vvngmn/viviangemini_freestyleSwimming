// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectedItems: [],
    groupedItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadCollectedItems();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadCollectedItems();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '我的自由泳收藏 - 技巧与训练计划',
      path: '/pages/collect/collect'
    };
  },

  // 加载收藏的内容
  loadCollectedItems() {
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    
    // 对记录类型的收藏进行分组
    const groupedItems = this.groupRecordItems(collectedItems);
    
    // 更新记录组的计数
    groupedItems.forEach(item => {
      if (item.type === 'record_group') {
        item.count = this.getRecordGroupCount(item.id);
      }
    });
    
    this.setData({
      collectedItems: collectedItems,
      groupedItems: groupedItems
    });
  },

  // 对记录类型的收藏进行分组
  groupRecordItems(items) {
    const recordGroups = {};
    const otherItems = [];
    
    items.forEach(item => {
      if (item.type === 'record') {
        // 提取记录ID作为分组键
        const recordId = item.id;
        if (!recordGroups[recordId]) {
          recordGroups[recordId] = {
            id: recordId,
            type: 'record_group',
            title: item.title,
            summary: item.summary,
            createTime: item.createTime,
            collectTime: item.collectTime,
            count: 0,
            records: []
          };
        }
        recordGroups[recordId].count++;
        recordGroups[recordId].records.push(item);
      } else {
        otherItems.push(item);
      }
    });
    
    // 合并分组记录和其他项目
    return [...Object.values(recordGroups), ...otherItems];
  },

  // 获取记录组的总记录数
  getRecordGroupCount(recordId) {
    const records = wx.getStorageSync('myRecords') || [];
    let count = 0;
    
    records.forEach(record => {
      if (record.id === recordId || (record.isAppend && record.parentId === recordId)) {
        count++;
      }
    });
    
    return count;
  },

  // 取消收藏
  removeCollect(e) {
    const { index } = e.currentTarget.dataset;
    const groupedItems = this.data.groupedItems;
    const removedItem = groupedItems[index];
    
    if (removedItem) {
      // 从原始收藏数据中移除对应的项目
      const collectedItems = wx.getStorageSync('collectedItems') || [];
      let updatedCollectedItems;
      
      if (removedItem.type === 'record_group') {
        // 如果是记录组，移除所有相关的记录收藏
        updatedCollectedItems = collectedItems.filter(item => 
          !(item.type === 'record' && item.id === removedItem.id)
        );
      } else {
        // 其他类型直接移除
        updatedCollectedItems = collectedItems.filter(item => 
          !(item.id === removedItem.id && item.type === removedItem.type)
        );
      }
      
      // 更新存储
      wx.setStorageSync('collectedItems', updatedCollectedItems);
      
      // 重新加载收藏内容以更新显示
      this.loadCollectedItems();

      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1500
      });
    }
  },

  // 查看详情
  viewDetail(e) {
    const { item } = e.currentTarget.dataset;
    
    if (item.type === 'tip') {
      wx.navigateTo({
        url: `/pages/tipDetail/tipDetail?id=${item.id}`
      });
    } else if (item.type === 'training') {
      wx.navigateTo({
        url: `/pages/trainingDetail/trainingDetail?level=${item.id}`
      });
    } else if (item.type === 'record_group') {
      wx.navigateTo({
        url: `/pages/recordDetail/recordDetail?id=${item.id}`
      });
    } else if (item.type === 'article') {
      wx.showModal({
        title: '查看文章',
        content: '由于小程序限制，无法直接打开外部链接。是否通过客服获取文章链接？',
        confirmText: '联系客服',
        cancelText: '复制链接',
        success: (res) => {
          if (res.confirm) {
            this.sendArticleToCustomerService(item);
          } else {
            this.copyArticleLink(item);
          }
        }
      });
    }
  },

  // 清空收藏
  clearAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有收藏吗？',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('collectedItems', []);
          // 重新加载收藏内容以更新显示
          this.loadCollectedItems();
          wx.showToast({
            title: '已清空收藏',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 分享收藏
  shareCollection() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 分享单个收藏项
  shareItem(e) {
    const { item } = e.currentTarget.dataset;
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 复制文章链接
  copyArticleLink(article) {
    wx.setClipboardData({
      data: article.url,
      success: () => {
        wx.showModal({
          title: '链接已复制',
          content: `文章链接已复制到剪贴板！\n\n请打开浏览器粘贴链接访问：\n${article.title}`,
          showCancel: false,
          confirmText: '知道了'
        });
      }
    });
  },

  // 发送文章到客服
  sendArticleToCustomerService(article) {
    // 打开客服会话，传递文章ID
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc123456789' // 需要替换为实际的客服链接
      },
      corpId: 'your_corp_id', // 需要替换为实际的企业ID
      sessionFrom: `article_${article.id}`, // 传递文章ID给云函数
      success: () => {
        wx.showToast({
          title: '已打开客服会话',
          icon: 'success',
          duration: 2000
        });
        
        // 显示提示信息
        setTimeout(() => {
          wx.showModal({
            title: '文章链接已发送',
            content: `文章标题：${article.title}\n\n客服已为您发送文章链接，请查看客服消息。`,
            showCancel: false,
            confirmText: '知道了'
          });
        }, 1500);
      },
      fail: (err) => {
        console.error('打开客服会话失败:', err);
        wx.showModal({
          title: '无法打开客服',
          content: '客服会话打开失败，是否复制链接到剪贴板？',
          confirmText: '复制链接',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              this.copyArticleLink(article);
            }
          }
        });
      }
    });
  }
})