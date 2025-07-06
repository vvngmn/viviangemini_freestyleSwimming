Page({
  data: {
    trainingLevels: [
      {
        id: 'beginner',
        title: '零基础小白',
        subtitle: '从不会游泳到学会自由泳',
        icon: '🏊‍♂️',
        description: '适合完全不会游泳的初学者，从基础动作开始学习',
        progress: 0,
        totalItems: 0,
        completedItems: 0
      },
      {
        id: 'intermediate',
        title: '业余爱好者',
        subtitle: '提升技术，游得更快更远',
        icon: '🏊‍♀️',
        description: '适合已掌握基本自由泳动作，想要提升技术的游泳者',
        progress: 0,
        totalItems: 0,
        completedItems: 0
      },
      {
        id: 'advanced',
        title: '专业二级运动员',
        subtitle: '竞技水平，追求卓越',
        icon: '🏆',
        description: '适合有一定基础，想要达到专业水平的游泳者',
        progress: 0,
        totalItems: 0,
        completedItems: 0
      }
    ]
  },

  onLoad() {
    this.loadProgress();
    this.loadCollectStatus();
  },

  onShow() {
    this.loadProgress();
    this.loadCollectStatus();
  },

  // 加载各等级的训练进度
  loadProgress() {
    const levels = this.data.trainingLevels.map(level => {
      const progress = this.getLevelProgress(level.id);
      return {
        ...level,
        progress: progress.progress,
        totalItems: progress.totalItems,
        completedItems: progress.completedItems
      };
    });

    this.setData({
      trainingLevels: levels
    });
  },

  // 加载收藏状态
  loadCollectStatus() {
    const collectedItems = wx.getStorageSync('collectedItems') || [];
    const levels = this.data.trainingLevels.map(level => ({
      ...level,
      isCollected: collectedItems.some(item => item.id === level.id && item.type === 'training')
    }));
    
    this.setData({ trainingLevels: levels });
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
      const level = this.data.trainingLevels.find(l => l.id === id);
      collectedItems.push({
        id: id,
        type: type,
        title: level.title,
        subtitle: level.subtitle,
        description: level.description,
        icon: level.icon,
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

  // 分享训练计划
  shareTraining(e) {
    const { id } = e.currentTarget.dataset;
    const level = this.data.trainingLevels.find(l => l.id === id);
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 获取某个等级的训练进度
  getLevelProgress(levelId) {
    const trainingData = wx.getStorageSync('trainingData') || {};
    const levelData = trainingData[levelId] || {};
    const trainingPlans = this.getTrainingPlans(levelId);
    
    let totalItems = 0;
    let completedItems = 0;

    trainingPlans.forEach(plan => {
      plan.items.forEach(item => {
        totalItems++;
        if (levelData[item.id] && levelData[item.id].completed) {
          completedItems++;
        }
      });
    });

    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      progress,
      totalItems,
      completedItems
    };
  },

  // 获取训练计划数据
  getTrainingPlans(levelId) {
    const plans = {
      beginner: [
        {
          id: 'basic_skills',
          title: '基础技能训练',
          items: [
            { id: 'breathing_basic', title: '基础呼吸练习', description: '在浅水区练习呼吸节奏', sessions: 3 },
            { id: 'floating', title: '漂浮练习', description: '学会在水中保持平衡', sessions: 2 },
            { id: 'kicking_basic', title: '基础踢腿', description: '使用踢腿板练习腿部动作', sessions: 4 },
            { id: 'arm_movement', title: '手臂动作', description: '在陆地上练习手臂划水动作', sessions: 2 },
            { id: 'coordination', title: '协调性练习', description: '将手臂和腿部动作结合', sessions: 5 }
          ]
        },
        {
          id: 'water_confidence',
          title: '水中信心建立',
          items: [
            { id: 'water_entry', title: '入水练习', description: '学会安全地进入水中', sessions: 2 },
            { id: 'submersion', title: '潜水练习', description: '练习将头部浸入水中', sessions: 3 },
            { id: 'gliding', title: '滑行练习', description: '学会在水中滑行', sessions: 4 },
            { id: 'turning', title: '转身练习', description: '练习在池边转身', sessions: 2 }
          ]
        },
        {
          id: 'freestyle_basics',
          title: '自由泳基础',
          items: [
            { id: 'freestyle_arms', title: '自由泳手臂动作', description: '练习完整的手臂划水', sessions: 6 },
            { id: 'freestyle_breathing', title: '自由泳呼吸', description: '练习侧身呼吸技巧', sessions: 8 },
            { id: 'freestyle_coordination', title: '自由泳协调', description: '完整动作协调练习', sessions: 10 },
            { id: 'distance_swimming', title: '距离游泳', description: '练习连续游泳25米', sessions: 5 }
          ]
        }
      ],
      intermediate: [
        {
          id: 'technique_improvement',
          title: '技术提升训练',
          items: [
            { id: 'high_elbow', title: '高肘技术', description: '练习高肘划水技术', sessions: 8 },
            { id: 'body_rotation', title: '身体转动', description: '练习身体转动技巧', sessions: 6 },
            { id: 'breathing_rhythm', title: '呼吸节奏', description: '建立稳定的呼吸节奏', sessions: 10 },
            { id: 'streamline', title: '流线型姿势', description: '练习流线型身体姿势', sessions: 5 }
          ]
        },
        {
          id: 'endurance_building',
          title: '耐力建设',
          items: [
            { id: 'distance_increase', title: '距离增加', description: '逐步增加游泳距离', sessions: 12 },
            { id: 'interval_training', title: '间歇训练', description: '进行间歇性训练', sessions: 8 },
            { id: 'tempo_swimming', title: '节奏游泳', description: '练习不同速度的游泳', sessions: 6 },
            { id: 'recovery_swimming', title: '恢复游泳', description: '练习放松游泳技巧', sessions: 4 }
          ]
        },
        {
          id: 'speed_development',
          title: '速度发展',
          items: [
            { id: 'sprint_training', title: '冲刺训练', description: '短距离冲刺练习', sessions: 8 },
            { id: 'turn_technique', title: '转身技术', description: '练习快速转身', sessions: 6 },
            { id: 'start_technique', title: '出发技术', description: '练习出发动作', sessions: 4 },
            { id: 'finish_technique', title: '到边技术', description: '练习到边触壁', sessions: 3 }
          ]
        }
      ],
      advanced: [
        {
          id: 'advanced_technique',
          title: '高级技术训练',
          items: [
            { id: 'underwater_kick', title: '水下踢腿', description: '练习水下海豚踢', sessions: 10 },
            { id: 'advanced_breathing', title: '高级呼吸', description: '练习双侧呼吸', sessions: 8 },
            { id: 'stroke_efficiency', title: '划水效率', description: '提高划水效率', sessions: 12 },
            { id: 'body_position', title: '身体位置', description: '优化身体位置', sessions: 6 }
          ]
        },
        {
          id: 'competition_preparation',
          title: '比赛准备',
          items: [
            { id: 'race_strategy', title: '比赛策略', description: '制定比赛策略', sessions: 5 },
            { id: 'mental_preparation', title: '心理准备', description: '心理训练和准备', sessions: 8 },
            { id: 'taper_training', title: '减量训练', description: '比赛前的减量训练', sessions: 4 },
            { id: 'race_simulation', title: '比赛模拟', description: '模拟比赛环境', sessions: 6 }
          ]
        },
        {
          id: 'performance_optimization',
          title: '表现优化',
          items: [
            { id: 'strength_training', title: '力量训练', description: '陆上力量训练', sessions: 15 },
            { id: 'flexibility', title: '柔韧性', description: '提高身体柔韧性', sessions: 10 },
            { id: 'nutrition', title: '营养管理', description: '制定营养计划', sessions: 8 },
            { id: 'recovery_management', title: '恢复管理', description: '制定恢复计划', sessions: 6 }
          ]
        }
      ]
    };

    return plans[levelId] || [];
  },

  // 跳转到训练详情页
  navigateToTrainingDetail(e) {
    const levelId = e.currentTarget.dataset.level;
    wx.navigateTo({
      url: `/pages/trainingDetail/trainingDetail?level=${levelId}`
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '自由泳训练计划 - 从零基础到专业水平',
      path: '/pages/dynamic/dynamic'
    };
  }
})
