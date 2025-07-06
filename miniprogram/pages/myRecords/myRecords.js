Page({
  data: {
    records: []
  },

  onLoad() {
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  // 加载记录
  loadRecords() {
    const records = wx.getStorageSync('myRecords') || [];
    // 新增：处理内容，去除HTML标签和"引用"二字
    const cleanRecords = records.map(record => {
      let cleanContent = record.content || '';
      // 去除所有HTML标签
      cleanContent = cleanContent.replace(/<[^>]+>/g, '');
      // 去除"引用"二字
      cleanContent = cleanContent.replace(/引用/g, '');
      return { ...record, content: cleanContent };
    });
    // 对记录进行分组，只显示最早的记录
    const groupedRecords = this.groupRecords(cleanRecords);
    
    this.setData({ records: groupedRecords });
  },

  // 对记录进行分组
  groupRecords(records) {
    const recordGroups = {};
    
    records.forEach(record => {
      if (record.isAppend && record.parentId) {
        // 追加记录，归入父记录组
        if (!recordGroups[record.parentId]) {
          const parentRecord = records.find(r => r.id === record.parentId);
          if (parentRecord) {
            recordGroups[record.parentId] = {
              ...parentRecord,
              count: 1
            };
          }
        }
        if (recordGroups[record.parentId]) {
          recordGroups[record.parentId].count++;
        }
      } else if (!record.isAppend) {
        // 原始记录
        if (!recordGroups[record.id]) {
          recordGroups[record.id] = {
            ...record,
            count: 1
          };
        }
      }
    });
    
    // 转换为数组并按时间排序
    return Object.values(recordGroups).sort((a, b) => {
      return new Date(b.createTime) - new Date(a.createTime);
    });
  },

  // 跳转到记录编辑页
  navigateToDetail(e) {
    const recordId = e.currentTarget.dataset.id;
    const record = this.data.records.find(r => r.id === recordId);
    
    if (record) {
      // 检查内容中是否包含URL
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      const urls = record.content.match(urlPattern);
      
      if (urls && urls.length > 0) {
        // 如果内容包含URL，显示选择弹窗
        wx.showActionSheet({
          itemList: ['编辑内容', '复制链接'],
          success: (res) => {
            if (res.tapIndex === 0) {
              // 编辑内容
              wx.navigateTo({
                url: `/pages/recordEdit/recordEdit?id=${recordId}`
              });
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
          }
        });
      } else {
        // 没有URL，直接跳转编辑
        wx.navigateTo({
          url: `/pages/recordEdit/recordEdit?id=${recordId}`
        });
      }
    }
  },

  // 删除记录
  deleteRecord(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录及其所有追加记录吗？',
      success: (res) => {
        if (res.confirm) {
          const records = wx.getStorageSync('myRecords') || [];
          // 删除原记录和所有追加记录
          const updatedRecords = records.filter(r => 
            r.id !== id && !(r.isAppend && r.parentId === id)
          );
          wx.setStorageSync('myRecords', updatedRecords);
          
          // 同时从收藏中删除
          const collectedItems = wx.getStorageSync('collectedItems') || [];
          const updatedCollectedItems = collectedItems.filter(item => 
            !(item.id === id && item.type === 'record')
          );
          wx.setStorageSync('collectedItems', updatedCollectedItems);
          
          // 重新加载记录
          this.loadRecords();
          
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 清空所有记录
  clearAllRecords() {
    if (this.data.records.length === 0) {
      wx.showToast({
        title: '暂无记录',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('myRecords', []);
          
          // 同时清空收藏中的记录
          const collectedItems = wx.getStorageSync('collectedItems') || [];
          const updatedCollectedItems = collectedItems.filter(item => item.type !== 'record');
          wx.setStorageSync('collectedItems', updatedCollectedItems);
          
          this.setData({ records: [] });
          
          wx.showToast({
            title: '清空成功',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '我的游泳记录',
      path: '/pages/myRecords/myRecords'
    };
  }
}); 