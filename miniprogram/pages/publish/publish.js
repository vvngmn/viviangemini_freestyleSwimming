Page({
  data: { 
    content: '',
    appendToId: null,
    isDraft: false
  },
  
  onLoad(options) {
    // 检查是否有草稿
    const draft = wx.getStorageSync('draft') || '';
    if (draft) {
      this.setData({ 
        content: draft,
        isDraft: true
      });
    }
    
    // 检查是否是追加记录
    if (options.appendTo) {
      this.setData({ appendToId: options.appendTo });
    }
  },

  // 输入内容变化
  onInput(e) {
    this.setData({
      content: e.detail.value
    });
  },
  
  // 保存记录
  saveRecord() {
    const content = this.data.content.trim();
    
    // 如果内容为空，提示用户
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    const records = wx.getStorageSync('myRecords') || [];
    if (this.data.appendToId) {
      // 追加到现有记录
      const recordIndex = records.findIndex(r => r.id === parseInt(this.data.appendToId));
      if (recordIndex > -1) {
        records[recordIndex].content += '\n\n' + content;
        records[recordIndex].updateTime = this.formatTime(new Date());
        wx.setStorageSync('myRecords', records);
        wx.showToast({
          title: '追加成功',
          icon: 'success',
          duration: 1500
        });
      }
    } else {
      // 创建新记录
      const newRecord = {
        id: Date.now(),
        content: content,
        createTime: this.formatTime(new Date())
      };
      records.unshift(newRecord);
      wx.setStorageSync('myRecords', records);
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500
      });
    }
    // 清空草稿
    wx.setStorageSync('draft', '');
    // 清空输入框
    this.setData({ 
      content: '',
      isDraft: false,
      appendToId: null
    });
    // 延迟返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  // 保存草稿
  saveDraft() {
    wx.setStorageSync('draft', this.data.content);
    wx.showToast({
      title: '草稿已保存',
      icon: 'success',
      duration: 1500
    });
  },

  // 清空草稿
  clearDraft() {
    wx.setStorageSync('draft', '');
    this.setData({ 
      content: '',
      isDraft: false
    });
    wx.showToast({
      title: '草稿已清空',
      icon: 'success',
      duration: 1500
    });
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
  
  submit() {
    wx.cloud.callContainer({
      config: { env: 'prod-2gekgttq8daf0fa6' },
      path: '/api/publish',
      header: { 
        'X-WX-SERVICE': 'flask-47k1',
        'content-type': 'application/json'
      },
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        content: this.data.content
      },
      success: () => {
        wx.showToast({ title: '记录成功' })
        setTimeout(() => wx.switchTab({ url: '/pages/me/me' }), 1500)
      }
    })
  }
})
