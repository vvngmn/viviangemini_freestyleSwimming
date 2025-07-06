// pages/index/index.js
Page({

  /**
   * 处理外链的客服机器人
   */
  handleContact(e) {
    const articleId = e.detail.path.replace('article_','')
    wx.setStorageSync('current_article', articleId)
  },

  /**
   * 页面的初始数据
   */
  data: {
    tips: [
      {
        id: 1,
        title: '保持头部中立位置',
        summary: '在自由泳中，保持头部与身体其他部位在一条直线上，并直接看向池底。',
        icon: '👁️'
      },
      {
        id: 2,
        title: '学会按压浮力',
        summary: '在自由泳中保持良好平衡的关键是学会如何"按压浮力"。',
        icon: '⚖️'
      },
      {
        id: 3,
        title: '呼吸时不要抬头',
        summary: '在转向侧面呼吸之前，不要向前抬头。这个常见错误会导致臀部和腿部下沉。',
        icon: '🫁'
      },
      {
        id: 4,
        title: '在侧面游泳',
        summary: '在划水周期中，让你的身体从一侧滚动到另一侧。',
        icon: '🔄'
      },
      {
        id: 5,
        title: '在水中呼气',
        summary: '要发展有效的自由泳划水，你需要在脸在水中时持续呼气。',
        icon: '💨'
      },
      {
        id: 6,
        title: '使用高肘位置',
        summary: '在手臂划水开始时使用高肘位置，增加推进力并减少肩部压力。',
        icon: '💪'
      },
      {
        id: 7,
        title: '恢复手臂时不要伸得太远',
        summary: '当你在水面上恢复手臂时，不要完全向前伸展，然后立即掉入水中。',
        icon: '🤲'
      },
      {
        id: 8,
        title: '长距离游泳使用两拍踢腿',
        summary: '使用放松的两拍踢腿对于长距离游泳是理想的，因为它节省能量。',
        icon: '🦵'
      },
      {
        id: 9,
        title: '不要向前推水',
        summary: '在恢复期间向前伸展手臂时，确保保持手掌平坦并与水面平行。',
        icon: '✋'
      },
      {
        id: 10,
        title: '使用鼻夹是可以的',
        summary: '在学习自由泳时，使用鼻夹可以帮助防止水进入鼻子。',
        icon: '👃'
      }
    ],
    articles: [
      {
        id: 1,
        title: '【viviangemini】自由泳弱侧换气全攻略：告别"半面窒息"的游泳体验',
        summary: '掌握弱侧换气技巧，让你的自由泳更加流畅自然',
        isOfficialAccount: true,
        url: 'https://mp.weixin.qq.com/s/JQyJqfJHc6LspFaQOF56TA',
        type: 'mp',
        qrcode: '/images/viviangemini-qrcode.jpg'
      }
    ],
    records: []
  },

  /**
   * 跳转到贴士详情页
   */
  navigateToDetail(e) {
    const tipId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/tipDetail/tipDetail?id=${tipId}`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadCollectStatus();
    this.loadRecords();
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
    // 彻底清空本地推荐号缓存
    wx.removeStorageSync('recommendList');
    this.loadCollectStatus();
    this.loadRecords();
    // 检查是否有通过"用小程序工具打开"带入的公众号文章
    const pendingArticle = wx.getStorageSync('pendingArticle');
    if (pendingArticle) {
      wx.showModal({
        title: '保存文章',
        content: `检测到新文章：${pendingArticle.title || '公众号文章'}，是否保存到推荐号？`,
        success: (res) => {
          if (res.confirm) {
            // 保存到本地推荐号列表
            let articles = wx.getStorageSync('recommendList') || [];
            // 避免重复
            if (!articles.some(a => a.url === pendingArticle.url)) {
              articles.unshift(pendingArticle);
              wx.setStorageSync('recommendList', articles);
            }
            // 彻底过滤所有相关关键词
            articles = articles.filter(a => {
              const t = (a.title || '') + (a.url || '') + (a.type || '') + (a.qrcode || '');
              return !/海洋339|bilibili|ocean339/i.test(t);
            });
            wx.setStorageSync('recommendList', articles);
            this.setData({
              articles: articles
            });
            wx.removeStorageSync('pendingArticle');
          } else {
            wx.removeStorageSync('pendingArticle');
          }
        }
      });
    } else {
      // 正常加载推荐号列表
      let articles = wx.getStorageSync('recommendList') || this.data.articles;
      // 彻底过滤所有相关关键词
      articles = articles.filter(a => {
        const t = (a.title || '') + (a.url || '') + (a.type || '') + (a.qrcode || '');
        return !/海洋339|bilibili|ocean339/i.test(t);
      });
      wx.setStorageSync('recommendList', articles);
      this.setData({
        articles
      });
    }
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
      title: '自由泳技巧大全 - 提升你的游泳技术',
      path: '/pages/index/index'
    };
  },

  // 加载收藏状态
  loadCollectStatus() {
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    const tips = this.data.tips.map(tip => ({
      ...tip,
      isCollected: collectedItems.some(item => item.id === tip.id && item.type === 'tip')
    }));
    
    const articles = this.data.articles.map(article => ({
      ...article,
      isCollected: collectedItems.some(item => item.id === article.id && item.type === 'article')
    }));
    
    this.setData({ tips, articles });
  },

  // 切换收藏状态
  toggleCollect(e) {
    const { id, type } = e.currentTarget.dataset;
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    const itemIndex = collectedItems.findIndex(item => item.id === id && item.type === type);
    
    if (itemIndex > -1) {
      // 取消收藏
      collectedItems.splice(itemIndex, 1);
      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1500
      });
    } else {
      // 添加收藏
      const tip = this.data.tips.find(t => t.id === id);
      collectedItems.push({
        id: id,
        type: type,
        title: tip.title,
        summary: tip.summary,
        icon: tip.icon,
        collectTime: new Date().toISOString()
      });
      wx.showToast({
        title: '已添加到收藏',
        icon: 'success',
        duration: 1500
      });
    }
    
    wx.setStorageSync('collectedItems', collectedItems);
    this.loadCollectStatus();
  },

  // 分享贴士
  shareTip(e) {
    const { id } = e.currentTarget.dataset;
    const tip = this.data.tips.find(t => t.id === id);
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 加载记录
  loadRecords() {
    const records = wx.getStorageSync('myRecords') || [];
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    
    // 对记录进行分组，只显示最早的记录
    const groupedRecords = this.groupRecords(records);
    
    // 添加收藏状态
    const recordsWithCollectStatus = groupedRecords.map(record => ({
      ...record,
      isCollected: collectedItems.some(item => item.id === record.id && item.type === 'record')
    }));
    
    this.setData({ records: recordsWithCollectStatus });
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

  // 跳转到记录详情页
  navigateToRecordDetail(e) {
    const recordId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/recordDetail/recordDetail?id=${recordId}`
    });
  },

  // 切换记录收藏状态
  toggleRecordCollect(e) {
    const { id } = e.currentTarget.dataset;
    const records = this.data.records;
    const recordIndex = records.findIndex(r => r.id === id);
    
    if (recordIndex > -1) {
      const record = records[recordIndex];
      const isCollected = !record.isCollected;
      
      // 更新本地状态
      records[recordIndex].isCollected = isCollected;
      this.setData({ records });
      
      // 更新收藏数据
      const collectedItems = wx.getStorageSync('collectedItems') || [];
      
      if (isCollected) {
        // 添加到收藏
        const collectItem = {
          id: record.id,
          type: 'record',
          title: record.content.substring(0, 30) + (record.content.length > 30 ? '...' : ''),
          summary: record.content,
          createTime: record.createTime,
          collectTime: this.formatTime(new Date())
        };
        collectedItems.push(collectItem);
        wx.showToast({
          title: '已收藏',
          icon: 'success',
          duration: 1500
        });
      } else {
        // 从收藏中移除
        const updatedCollectedItems = collectedItems.filter(item => 
          !(item.id === record.id && item.type === 'record')
        );
        collectedItems.length = 0;
        collectedItems.push(...updatedCollectedItems);
        wx.showToast({
          title: '已取消收藏',
          icon: 'none',
          duration: 1500
        });
      }
      
      wx.setStorageSync('collectedItems', collectedItems);
    }
  },

  // 分享记录
  shareRecord(e) {
    const { id } = e.currentTarget.dataset;
    const records = this.data.records;
    const record = records.find(r => r.id === id);
    
    if (record) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
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

  // 跳转到技巧贴士列表页
  navigateToTipsList() {
    wx.navigateTo({
      url: '/pages/tipsList/tipsList'
    });
  },

  // 跳转到我的记录列表页
  navigateToMyRecords() {
    wx.navigateTo({
      url: '/pages/myRecords/myRecords'
    });
  },

  // 打开推荐号或外部链接
  openArticle(e) {
    const { url } = e.currentTarget.dataset;
    const articles = this.data.articles;
    const article = articles.find(a => a.url === url);
    if (!article) return;
    // 仅弹出二维码，无任何弹窗
    wx.previewImage({ urls: [article.qrcode], current: article.qrcode });
  },

  // 切换文章收藏状态
  toggleArticleCollect(e) {
    const { index } = e.currentTarget.dataset;
    const articles = this.data.articles;
    const article = articles[index];
    const isCollected = !article.isCollected;
    
    // 更新本地状态
    articles[index].isCollected = isCollected;
    this.setData({ articles });
    
    // 更新收藏数据
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    
    if (isCollected) {
      // 添加到收藏
      const collectItem = {
        id: article.id,
        type: 'article',
        title: article.title,
        summary: article.summary,
        url: article.url,
        collectTime: this.formatTime(new Date())
      };
      collectedItems.push(collectItem);
      wx.showToast({
        title: '已收藏',
        icon: 'success',
        duration: 1500
      });
    } else {
      // 从收藏中移除
      const updatedCollectedItems = collectedItems.filter(item => 
        !(item.id === article.id && item.type === 'article')
      );
      collectedItems.length = 0;
      collectedItems.push(...updatedCollectedItems);
      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1500
      });
    }
    
    wx.setStorageSync('collectedItems', collectedItems);
  },

  // 分享文章
  shareArticle(e) {
    const { index } = e.currentTarget.dataset;
    const articles = this.data.articles;
    const article = articles[index];
    
    if (article) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
  }
})