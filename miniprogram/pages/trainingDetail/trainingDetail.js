Page({
  data: {
    levelId: '',
    levelTitle: '',
    trainingPlans: [],
    progress: 0,
    totalItems: 0,
    completedItems: 0,
    isCollected: false
  },

  onLoad(options) {
    const levelId = options.level;
    const levelTitles = {
      'beginner': '零基础小白',
      'intermediate': '业余爱好者',
      'advanced': '专业二级运动员'
    };

    this.setData({
      levelId: levelId,
      levelTitle: levelTitles[levelId] || '训练计划'
    });

    this.loadTrainingPlans();
  },

  onShow() {
    this.loadTrainingPlans();
    this.loadCollectStatus();
  },

  // 加载训练计划
  loadTrainingPlans() {
    const trainingPlans = this.getTrainingPlans(this.data.levelId);
    const trainingData = wx.getStorageSync('trainingData') || {};
    const levelData = trainingData[this.data.levelId] || {};

    // 为每个训练项目添加完成状态
    const plansWithStatus = trainingPlans.map(plan => ({
      ...plan,
      items: plan.items.map(item => {
        const itemData = levelData[item.id] || {};
        const completedSessions = itemData.completedSessions || [];
        const isCompleted = completedSessions.length >= item.sessions;
        
        return {
          ...item,
          completedSessions: completedSessions,
          isCompleted: isCompleted,
          currentSession: completedSessions.length + 1,
          progress: Math.round((completedSessions.length / item.sessions) * 100)
        };
      })
    }));

    // 计算总体进度
    let totalItems = 0;
    let completedItems = 0;

    plansWithStatus.forEach(plan => {
      plan.items.forEach(item => {
        totalItems++;
        if (item.isCompleted) {
          completedItems++;
        }
      });
    });

    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    this.setData({
      trainingPlans: plansWithStatus,
      progress: progress,
      totalItems: totalItems,
      completedItems: completedItems
    });
  },

  // 获取训练计划数据
  getTrainingPlans(levelId) {
    const plans = {
      beginner: [
        {
          id: 'basic_skills',
          title: '基础技能训练',
          icon: '🏊‍♂️',
          items: [
            { id: 'breathing_basic', title: '基础呼吸练习', description: '在浅水区练习呼吸节奏，学会在水中呼气，在空气中吸气', sessions: 3 },
            { id: 'floating', title: '漂浮练习', description: '学会在水中保持平衡，感受水的浮力', sessions: 2 },
            { id: 'kicking_basic', title: '基础踢腿', description: '使用踢腿板练习腿部动作，建立腿部力量', sessions: 4 },
            { id: 'arm_movement', title: '手臂动作', description: '在陆地上练习手臂划水动作，熟悉动作要领', sessions: 2 },
            { id: 'coordination', title: '协调性练习', description: '将手臂和腿部动作结合，建立协调性', sessions: 5 }
          ]
        },
        {
          id: 'water_confidence',
          title: '水中信心建立',
          icon: '💧',
          items: [
            { id: 'water_entry', title: '入水练习', description: '学会安全地进入水中，克服对水的恐惧', sessions: 2 },
            { id: 'submersion', title: '潜水练习', description: '练习将头部浸入水中，适应水下环境', sessions: 3 },
            { id: 'gliding', title: '滑行练习', description: '学会在水中滑行，感受水流', sessions: 4 },
            { id: 'turning', title: '转身练习', description: '练习在池边转身，提高游泳效率', sessions: 2 }
          ]
        },
        {
          id: 'freestyle_basics',
          title: '自由泳基础',
          icon: '🏊‍♀️',
          items: [
            { id: 'freestyle_arms', title: '自由泳手臂动作', description: '练习完整的手臂划水，建立正确的动作模式', sessions: 6 },
            { id: 'freestyle_breathing', title: '自由泳呼吸', description: '练习侧身呼吸技巧，建立呼吸节奏', sessions: 8 },
            { id: 'freestyle_coordination', title: '自由泳协调', description: '完整动作协调练习，提高游泳效率', sessions: 10 },
            { id: 'distance_swimming', title: '距离游泳', description: '练习连续游泳25米，建立耐力基础', sessions: 5 }
          ]
        }
      ],
      intermediate: [
        {
          id: 'technique_improvement',
          title: '技术提升训练',
          icon: '⚡',
          items: [
            { id: 'high_elbow', title: '高肘技术', description: '练习高肘划水技术，提高推进效率', sessions: 8 },
            { id: 'body_rotation', title: '身体转动', description: '练习身体转动技巧，减少阻力', sessions: 6 },
            { id: 'breathing_rhythm', title: '呼吸节奏', description: '建立稳定的呼吸节奏，提高耐力', sessions: 10 },
            { id: 'streamline', title: '流线型姿势', description: '练习流线型身体姿势，减少阻力', sessions: 5 }
          ]
        },
        {
          id: 'endurance_building',
          title: '耐力建设',
          icon: '💪',
          items: [
            { id: 'distance_increase', title: '距离增加', description: '逐步增加游泳距离，建立耐力基础', sessions: 12 },
            { id: 'interval_training', title: '间歇训练', description: '进行间歇性训练，提高心肺功能', sessions: 8 },
            { id: 'tempo_swimming', title: '节奏游泳', description: '练习不同速度的游泳，提高适应性', sessions: 6 },
            { id: 'recovery_swimming', title: '恢复游泳', description: '练习放松游泳技巧，促进恢复', sessions: 4 }
          ]
        },
        {
          id: 'speed_development',
          title: '速度发展',
          icon: '🚀',
          items: [
            { id: 'sprint_training', title: '冲刺训练', description: '短距离冲刺练习，提高爆发力', sessions: 8 },
            { id: 'turn_technique', title: '转身技术', description: '练习快速转身，提高比赛效率', sessions: 6 },
            { id: 'start_technique', title: '出发技术', description: '练习出发动作，提高比赛优势', sessions: 4 },
            { id: 'finish_technique', title: '到边技术', description: '练习到边触壁，提高比赛成绩', sessions: 3 }
          ]
        }
      ],
      advanced: [
        {
          id: 'advanced_technique',
          title: '高级技术训练',
          icon: '🏆',
          items: [
            { id: 'underwater_kick', title: '水下踢腿', description: '练习水下海豚踢，提高水下效率', sessions: 10 },
            { id: 'advanced_breathing', title: '高级呼吸', description: '练习双侧呼吸，提高呼吸效率', sessions: 8 },
            { id: 'stroke_efficiency', title: '划水效率', description: '提高划水效率，减少能量消耗', sessions: 12 },
            { id: 'body_position', title: '身体位置', description: '优化身体位置，提高游泳效率', sessions: 6 }
          ]
        },
        {
          id: 'competition_preparation',
          title: '比赛准备',
          icon: '🎯',
          items: [
            { id: 'race_strategy', title: '比赛策略', description: '制定比赛策略，提高比赛成绩', sessions: 5 },
            { id: 'mental_preparation', title: '心理准备', description: '心理训练和准备，提高比赛状态', sessions: 8 },
            { id: 'taper_training', title: '减量训练', description: '比赛前的减量训练，调整状态', sessions: 4 },
            { id: 'race_simulation', title: '比赛模拟', description: '模拟比赛环境，提高适应性', sessions: 6 }
          ]
        },
        {
          id: 'performance_optimization',
          title: '表现优化',
          icon: '📈',
          items: [
            { id: 'strength_training', title: '力量训练', description: '陆上力量训练，提高肌肉力量', sessions: 15 },
            { id: 'flexibility', title: '柔韧性', description: '提高身体柔韧性，减少受伤风险', sessions: 10 },
            { id: 'nutrition', title: '营养管理', description: '制定营养计划，优化身体状态', sessions: 8 },
            { id: 'recovery_management', title: '恢复管理', description: '制定恢复计划，提高训练效果', sessions: 6 }
          ]
        }
      ]
    };

    return plans[levelId] || [];
  },

  // 完成训练项目
  completeTrainingItem(e) {
    const { planId, itemId } = e.currentTarget.dataset;
    const trainingData = wx.getStorageSync('trainingData') || {};
    const levelData = trainingData[this.data.levelId] || {};
    const itemData = levelData[itemId] || {};
    
    const now = new Date();
    const completedSessions = itemData.completedSessions || [];
    
    // 添加完成记录
    completedSessions.push({
      session: completedSessions.length + 1,
      date: this.formatTime(now),
      timestamp: now.getTime()
    });

    // 更新数据
    levelData[itemId] = {
      ...itemData,
      completedSessions: completedSessions,
      completed: completedSessions.length >= this.getTrainingPlans(this.data.levelId)
        .find(plan => plan.id === planId)
        .items.find(item => item.id === itemId).sessions
    };

    trainingData[this.data.levelId] = levelData;
    wx.setStorageSync('trainingData', trainingData);

    // 重新加载数据
    this.loadTrainingPlans();

    // 显示完成提示
    wx.showToast({
      title: '训练完成！',
      icon: 'success',
      duration: 1500
    });
  },

  // 撤销上一次训练
  undoLastSession(e) {
    const { planId, itemId } = e.currentTarget.dataset;
    const trainingData = wx.getStorageSync('trainingData') || {};
    const levelData = trainingData[this.data.levelId] || {};
    const itemData = levelData[itemId] || {};
    
    const completedSessions = itemData.completedSessions || [];
    
    if (completedSessions.length === 0) {
      wx.showToast({
        title: '暂无记录可撤销',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    
    wx.showModal({
      title: '确认撤销',
      content: '确定要撤销上一次训练记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 移除最后一次记录
          completedSessions.pop();
          
          // 更新数据
          levelData[itemId] = {
            ...itemData,
            completedSessions: completedSessions,
            completed: completedSessions.length >= this.getTrainingPlans(this.data.levelId)
              .find(plan => plan.id === planId)
              .items.find(item => item.id === itemId).sessions
          };
          
          trainingData[this.data.levelId] = levelData;
          wx.setStorageSync('trainingData', trainingData);
          
          // 重新加载数据
          this.loadTrainingPlans();
          
          wx.showToast({
            title: '已撤销',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  // 加载收藏状态
  loadCollectStatus() {
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    const isCollected = collectedItems.some(item => 
      item.id === this.data.levelId && item.type === 'training'
    );
    this.setData({ isCollected });
  },

  // 切换收藏状态
  toggleCollect() {
    const { levelId, levelTitle, isCollected } = this.data;
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    
    if (isCollected) {
      // 取消收藏
      const itemIndex = collectedItems.findIndex(item => 
        item.id === levelId && item.type === 'training'
      );
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
        id: levelId,
        type: 'training',
        title: levelTitle + '训练计划',
        summary: `包含${this.data.totalItems}个训练项目，已完成${this.data.completedItems}个`,
        icon: '🏊‍♂️',
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

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 分享功能
  shareTraining() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: `${this.data.levelTitle}训练计划`,
      path: `/pages/trainingDetail/trainingDetail?level=${this.data.levelId}`
    };
  }
}); 