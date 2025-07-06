// pages/tipsList/tipsList.js
Page({
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
    ]
  },

  onLoad() {
    this.loadCollectStatus();
  },

  onShow() {
    this.loadCollectStatus();
  },

  // 加载收藏状态
  loadCollectStatus() {
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    const tips = this.data.tips.map(tip => ({
      ...tip,
      isCollected: collectedItems.some(item => item.id === tip.id && item.type === 'tip')
    }));
    
    this.setData({ tips });
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

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '自由泳技巧大全 - 提升你的游泳技术',
      path: '/pages/tipsList/tipsList'
    };
  }
}); 