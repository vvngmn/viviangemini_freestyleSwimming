// pages/recordEdit/recordEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: null,
    editContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;
    this.loadRecord(id);
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
      title: '编辑游泳记录',
      path: '/pages/recordEdit/recordEdit'
    };
  },

  // 加载记录
  loadRecord(recordId) {
    const records = wx.getStorageSync('myRecords') || [];
    const record = records.find(r => r.id === parseInt(recordId));
    
    if (record) {
      this.setData({ 
        record,
        editContent: record.content
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

  // 输入内容变化
  onInput(e) {
    this.setData({
      editContent: e.detail.value
    });
  },

  // 保存编辑
  saveEdit() {
    const { record, editContent } = this.data;
    
    if (!editContent.trim()) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    const records = wx.getStorageSync('myRecords') || [];
    const recordIndex = records.findIndex(r => r.id === record.id);
    
    if (recordIndex > -1) {
      records[recordIndex].content = editContent.trim();
      records[recordIndex].updateTime = this.formatTime(new Date());
      wx.setStorageSync('myRecords', records);
      
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1500
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
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
  }
}); 