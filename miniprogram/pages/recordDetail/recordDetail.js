Page({
  data: {
    record: null,
    relatedRecords: [],
    isCollected: false,
    showAppendModal: false,
    appendContent: ''
  },

  onLoad(options) {
    const recordId = parseInt(options.id);
    this.loadRecord(recordId);
    this.loadCollectStatus(recordId);
  },

  onShow() {
    if (this.data.record) {
      this.loadRecord(this.data.record.id);
      this.loadCollectStatus(this.data.record.id);
    }
  },

  // 加载记录详情
  loadRecord(recordId) {
    const records = wx.getStorageSync('myRecords') || [];
    const record = records.find(r => r.id === recordId);
    
    if (record) {
      // 查找所有相关的记录（包括追加的记录）
      const relatedRecords = this.getRelatedRecords(records, recordId).map(r => ({
        ...r,
        displayContent: this.sanitizeContent(r.content || '')
      }));
      
      this.setData({ 
        record,
        relatedRecords
      });
    } else {
      wx.showToast({
        title: '记录不存在',
        icon: 'error',
        duration: 2000
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  },

  // 获取相关记录
  getRelatedRecords(records, recordId) {
    const relatedRecords = [];
    
    // 添加原始记录
    const originalRecord = records.find(r => r.id === recordId);
    if (originalRecord) {
      relatedRecords.push(originalRecord);
    }
    
    // 添加追加记录
    const appendRecords = records.filter(r => r.isAppend && r.parentId === recordId);
    relatedRecords.push(...appendRecords);
    
    // 按时间排序
    return relatedRecords.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
  },

  // 加载收藏状态
  loadCollectStatus(recordId) {
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    const isCollected = collectedItems.some(item => item.id === recordId && item.type === 'record');
    this.setData({ isCollected });
  },

  // 切换收藏状态
  toggleCollect() {
    const { record, isCollected } = this.data;
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    
    if (isCollected) {
      // 取消收藏
      const itemIndex = collectedItems.findIndex(item => item.id === record.id && item.type === 'record');
      if (itemIndex > -1) {
        collectedItems.splice(itemIndex, 1);
      }
      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1500
      });
    } else {
      // 添加收藏
      collectedItems.push({
        id: record.id,
        type: 'record',
        title: record.content.substring(0, 20) + (record.content.length > 20 ? '...' : ''),
        summary: record.content,
        createTime: record.createTime,
        collectTime: new Date().toISOString()
      });
      wx.showToast({
        title: '已添加到收藏',
        icon: 'success',
        duration: 1500
      });
    }
    
    wx.setStorageSync('collectedItems', collectedItems);
    this.setData({ isCollected: !isCollected });
  },

  // 分享记录
  shareRecord() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 删除记录
  deleteRecord() {
    const { record } = this.data;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录及其所有追加记录吗？',
      success: (res) => {
        if (res.confirm) {
          const records = wx.getStorageSync('myRecords') || [];
          // 删除原记录和所有追加记录
          const updatedRecords = records.filter(r => 
            r.id !== record.id && !(r.isAppend && r.parentId === record.id)
          );
          wx.setStorageSync('myRecords', updatedRecords);
          
          // 同时从收藏中删除
          const collectedItems = wx.getStorageSync('collectedItems') || [];
          const updatedCollectedItems = collectedItems.filter(item => 
            !(item.id === record.id && item.type === 'record')
          );
          wx.setStorageSync('collectedItems', updatedCollectedItems);
          
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          });
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  },

    // 导航到编辑页面
  navigateToEdit(e) {
    const { record } = e.currentTarget.dataset;
    
    // 无论是原始记录还是追加记录，都进入编辑模式
    wx.navigateTo({
      url: `/pages/recordEdit/recordEdit?id=${record.id}`
    });
  },



  // 追加新记录
  appendRecord() {
    this.setData({ 
      showAppendModal: true,
      appendContent: ''
    });
  },

  // 关闭追加弹窗
  closeAppendModal() {
    this.setData({ 
      showAppendModal: false,
      appendContent: ''
    });
  },

  // 追加内容输入变化
  onAppendInput(e) {
    this.setData({
      appendContent: e.detail.value
    });
  },

  // 保存追加内容
  saveAppendContent() {
    const { record, appendContent } = this.data;
    
    if (!appendContent.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    const records = wx.getStorageSync('myRecords') || [];
    
    // 创建新记录
    const newRecord = {
      id: Date.now(),
      content: appendContent.trim(),
      createTime: this.formatTime(new Date()),
      parentId: record.id, // 关联到原记录
      isAppend: true
    };
    
    // 将新记录插入到原记录后面
    const recordIndex = records.findIndex(r => r.id === record.id);
    if (recordIndex > -1) {
      records.splice(recordIndex + 1, 0, newRecord);
      wx.setStorageSync('myRecords', records);
      
      wx.showToast({
        title: '追加成功',
        icon: 'success',
        duration: 1500
      });
      
      // 关闭弹窗并重新加载记录
      this.setData({
        showAppendModal: false,
        appendContent: ''
      });
      
      // 重新加载记录和相关记录
      this.loadRecord(record.id);
    }
  },



  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const { record } = this.data;
    return {
      title: record ? record.content.substring(0, 30) + '...' : '我的游泳记录',
      path: `/pages/recordDetail/recordDetail?id=${record.id}`
    };
  },

  // 记录详情页点击url-link
  onUrlTap(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.setClipboardData({
        data: url,
        success() {
          wx.showModal({
            title: '提示',
            content: '链接已复制，请到浏览器打开',
            showCancel: false
          });
        }
      });
    }
  },

  // 内容点击处理：智能识别URL和普通文字
  onContentTap(e) {
    const content = e.currentTarget.dataset.content;
    const record = e.currentTarget.dataset.record;
    
    // 检查内容中是否包含URL
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlPattern);
    
    if (urls && urls.length > 0) {
      // 如果内容包含URL，显示选择弹窗
      wx.showActionSheet({
        itemList: ['编辑内容', '复制链接'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 编辑内容
            this.navigateToEdit({ currentTarget: { dataset: { record } } });
          } else if (res.tapIndex === 1) {
            // 复制第一个URL
            const url = urls[0];
            wx.setClipboardData({
              data: url,
              success() {
                wx.showModal({
                  title: '提示',
                  content: '链接已复制，请到浏览器打开',
                  showCancel: false
                });
              }
            });
          }
        },
        fail: (err) => {
          // 如果用户取消，不做任何操作
          console.log('用户取消了操作');
        }
      });
    } else {
      // 没有URL，直接跳转编辑
      this.navigateToEdit({ currentTarget: { dataset: { record } } });
    }
  },

  // 清理内容中的HTML标签
  sanitizeContent(content) {
    return content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
  },
}); 