import type { Messages } from './en.ts';

export const zh: Messages = {
  appName: '驾驶练习',
  rotateNote: '把手机或平板横过来就可以开车了。',
  starsLabel: (filled: number, total: number) => `${total} 颗星中的 ${filled} 颗`,

  home: {
    intro: '简短、轻松的练习，专练窄路、停车和倒车。每个车轮怎么走，都看得清清楚楚。',
    progress: (stars: number, total: number) => `${stars} / ${total} 颗星`,
    language: '语言',
    wheelOnLeft: '方向盘在左边',
    wheelOnRight: '方向盘在右边',
    start: '开始',
    playAgain: '再玩一次',
    lockedNote: '完成上一关即可解锁。',
  },

  levelOf: (chapter: string, number: number) => `${chapter}，第 ${number} 关`,
  levelOfTotal: (chapter: string, number: number, total: number) => `${chapter}，第 ${number} 关（共 ${total} 关）`,

  hud: {
    levels: '关卡',
    guides: '辅助线',
    trail: '轨迹',
    wholeArea: '全景',
    followCar: '跟随车辆',
    slow: '慢速',
    restart: '重来',
    menu: '选项',
    tips: '提示',
    frontWheels: '前轮',
    straight: '回正',
    steerLeft: (degrees: number) => `左 ${degrees}°`,
    steerRight: (degrees: number) => `右 ${degrees}°`,
    time: '用时',
    touches: '碰撞',
    speedUnit: 'km/h',
    keyHint: 'W 油门 · S 刹车 · R/D/P 挡位',
  },

  controls: {
    steeringWheel: '方向盘',
    gear: '挡位',
    park: '驻车',
    reverse: '倒车',
    drive: '前进',
    gas: '油门',
    brake: '刹车',
  },

  legend: {
    title: '辅助线',
    rear: '后轮',
    front: '前轮',
    swing: '车头外摆',
    pivot: '转向中心',
    pivotLabel: '转向中心',
  },

  hints: {
    chooseGear: '选 D 往前开，选 R 倒车。',
    holdStill: '保持不动……',
    linedUp: '位置对好了。踩住刹车完成。',
    almost: '差一点。把车摆正，和框里的箭头方向一致。',
    driveGap: (number: number, total: number) => `穿过标记的第 ${number} 个空档（共 ${total} 个）。`,
  },

  toasts: {
    stopFirst: '先把车停稳，再换挡。',
    gapDone: (number: number, total: number) => `第 ${number} 个空档完成（共 ${total} 个）。`,
    allGapsDone: '所有空档都过了。现在开进框里。',
  },

  bump: {
    into: {
      kerb: '轻轻碰到了路缘。',
      wall: '轻轻碰到了墙。',
      hedge: '轻轻碰到了树篱。',
      building: '轻轻碰到了建筑。',
      car: '轻轻碰到了停着的车。',
      cone: '轻轻碰到了锥桶。',
      pillar: '轻轻碰到了柱子。',
      post: '轻轻碰到了门柱。',
      planter: '轻轻碰到了树。',
      edge: '轻轻碰到了练习场边缘。',
    },
    allowed: (touches: number, limit: number) => `已碰 ${touches} 次，最多可碰 ${limit} 次。`,
    backOff: '稍微退一点，再试一次。',
    insideRear: '车尾从弯道内侧切进去了。这就是内轮差：后轮走的线比前轮更靠里，所以多往前开一点再转。',
    frontSwing: '车头外角甩得太开了。转弯时，车头会甩出车轮的路线之外，所以外侧要多留点空间。',
    frontSwingReverse: '倒车时车头甩出去了。倒车转弯时，车头会往反方向摆，所以要留意那一侧。',
  },

  intro: {
    allowedTouches: (limit: number) => `允许碰撞：${limit} 次。`,
    startDriving: '开始驾驶',
    howTurningWorks: '转弯原理',
  },

  result: {
    perfect: '完美',
    nicelyDone: '做得好',
    madeIt: '成功了',
    time: '用时',
    touches: '碰撞',
    position: '位置',
    aimFor: (time: string) => `目标 ${time}`,
    noTouches: '零碰撞',
    touchCount: (touches: number) => `${touches} 次碰撞`,
    great: '停得很正',
    good: '停正了',
    crooked: '有点歪',
    tryAgain: '再试一次',
    allLevels: '全部关卡',
    nextLevel: '下一关',
    failTitle: '这关再来一次吧',
    failBody: '这个位置多碰了一次。开慢一点，多看辅助线。',
  },

  lesson: {
    title: '转弯原理',
    steps: {
      paths: '向右转时，后轮（蓝色）走在前轮（白色）的内侧，这就是内轮差；车头外角（黄色）则向外甩出。',
      pillarHit: '在柱子旁边转得太早，车头过去了，后门却会撞上柱子。',
      pillarClear: '多往前开一点再转，车尾也能顺利绕过柱子。',
      reverse: '倒车转弯时，方向盘往哪打，车尾就往哪走，车头则往反方向甩。',
    },
    stepOf: (number: number, total: number) => `${number} / ${total}`,
    replay: '重播',
    back: '上一步',
    next: '下一步',
    done: '明白了',
  },

  chapters: {
    basics: {
      title: '熟悉车辆',
      summary: '在空旷场地练习油门、刹车、方向盘和倒车。',
    },
    turning: {
      title: '转弯',
      summary: '路口、大门和急弯。注意后轮往里切。',
    },
    reversing: {
      title: '倒车',
      summary: '倒车绕过路口，倒进狭窄的入口。',
    },
    parking: {
      title: '停车',
      summary: '超市车位、斜列车位，以及路边侧方停车。',
    },
    'tight-spots': {
      title: '日常窄位',
      summary: '死胡同、车库、坡道，还有停得不好的邻居。',
    },
  },

  levels: {
    'stop-on-the-line': {
      title: '起步和停车',
      goal: '往前开，让整辆车停在绿色框内。',
      tips: [
        '点 D 选择前进挡。',
        '松开油门，车也会慢慢往前溜，和真的自动挡车一样。',
        '踩住刹车，停在框内。',
      ],
    },
    'gentle-curve': {
      title: '平缓弯道',
      goal: '沿着道路过弯，停在框内。',
      tips: [
        '方向盘稍微转一点并保持住，车就会走出一条平稳的弧线。',
        '蓝线显示后轮将要走的路线。',
        '道路变直时，把方向盘回正。',
      ],
    },
    'full-circle': {
      title: '方向盘打死绕圈',
      goal: '绕着安全岛开一整圈，再停回框内。',
      tips: [
        '把方向盘向左打死并保持住。',
        '黄线显示车头外角在外侧甩出的路线。',
        '后轮画出的圈比前轮小。',
      ],
    },
    'reverse-straight': {
      title: '倒进框内',
      goal: '倒车进入画好的框内并停下。',
      tips: [
        '点 R 选择倒车挡，车会慢慢往后退。',
        '蓝线显示车尾的去向。',
        '方向盘基本保持回正，小幅修正即可。',
      ],
    },
    'street-corner': {
      title: '路口转弯',
      goal: '右转进入小路，不要碰到路缘。',
      tips: [
        '稍微开过路口一点再转。',
        '后轮会走在前轮内侧，所以注意内侧的路缘。',
        '车身和新路对齐时，把方向盘回正。',
      ],
    },
    'pillar-turn': {
      title: '绕过柱子转弯',
      goal: '右转进入下一条通道，不要碰到拐角的柱子。',
      tips: [
        '一直往前开，等你的座位过了柱子再转。',
        '转得太早，即使车头已经过去，后门也会刮到柱子。',
        '看蓝线：它显示后轮将要走的路线。',
      ],
    },
    'narrow-gate': {
      title: '穿过窄门',
      goal: '转弯穿过大门进入院子，停在框内。',
      tips: [
        '靠道路的另一侧行驶，留出转进去的空间。',
        '快到大门前就开始转。',
        '在门柱前把车摆正，然后慢慢开过去。',
      ],
    },
    'cone-slalom': {
      title: '绕锥桶',
      goal: '在锥桶之间左右穿行，通过每个标记的空档。',
      tips: [
        '早一点、小幅度地打方向，比晚了再大幅度打更好。',
        '快到每个锥桶前就开始回方向。',
        '看黄线：车头外角甩出的幅度比你想的更大。',
      ],
    },
    'u-turn': {
      title: '宽路掉头',
      goal: '一次掉头成功，停在对面的框内。',
      tips: [
        '从道路右侧开始，转弯空间最大。',
        '起步前先把方向盘向左打死。',
        '留意车头外角和对面路缘的距离。',
      ],
    },
    'reverse-corner': {
      title: '倒车过路口',
      goal: '倒车绕过路口，进入小路。',
      tips: [
        '倒车时，想让车尾往哪走，方向盘就往哪打。',
        '后轮到达路口时开始转。',
        '车头会往反方向甩，所以要留意它。',
      ],
    },
    'reverse-driveway': {
      title: '倒进车道',
      goal: '在两根门柱之间倒进车道。',
      tips: [
        '开过车道口，停车，然后选 R。',
        '方向盘往车道方向打，让车尾进去。',
        '车身和车道方向一致后，把方向盘回正。',
      ],
    },
    'reverse-out': {
      title: '倒出车位',
      goal: '从车位倒出来，沿着通道开走。',
      tips: [
        '直着倒，直到前保险杠越过两边的车。',
        '然后转方向，让车尾朝你来的方向摆。',
        '车头会朝旁边的车甩过去，所以注意黄线。',
      ],
    },
    'bay-forward': {
      title: '车头进车位',
      goal: '往前开进左边的空车位。',
      tips: [
        '靠通道右侧行驶，转弯空间更大。',
        '前保险杠过了车位近端的线，就把方向盘打死。',
        '后轮会往里切，所以注意内侧的车。',
      ],
    },
    'bay-reverse': {
      title: '倒车入库',
      goal: '倒进左边两辆车之间的空车位。',
      tips: [
        '继续往前开，直到车位在你后面大约一个车身的位置。',
        '选 R，方向盘向左打死，让车尾进入车位。',
        '车身和车位线平行时，把方向盘回正。',
      ],
    },
    'angled-bay': {
      title: '斜列停车',
      goal: '转进空着的斜列车位。',
      tips: [
        '斜列车位只需要轻轻转一下。',
        '你的座位和车位近端的线齐平时开始转。',
        '车身和车位对齐时，把方向盘回正。',
      ],
    },
    'parallel-park': {
      title: '侧方停车',
      goal: '倒进两辆停着的车之间的空位，靠近路缘。',
      tips: [
        '停在前车旁边，两车后保险杠对齐。',
        '方向盘向右打死倒车，直到车身大约成 45 度。',
        '然后向左打死，继续倒车，把车头收进来。',
      ],
    },
    'leave-parallel': {
      title: '侧方位驶出',
      goal: '从车位开出来，进入前方车道。',
      tips: [
        '先稍微倒一点，给前面留出空间。',
        '往前开之前，先把方向盘向左打死。',
        '看黄线是否避开前车，同时注意车尾会朝路缘摆。',
      ],
    },
    'three-point-turn': {
      title: '三点掉头',
      goal: '在死胡同里掉头，停在框内。',
      tips: [
        '方向盘向左打死往前开，在路缘前停下。',
        '方向盘向右打死倒车，在另一边路缘前停下。',
        '然后再往前开。车停着的时候也可以转方向盘。',
      ],
    },
    'garage-pillars': {
      title: '地下车库',
      goal: '倒进柱子旁边的车位。',
      tips: [
        '柱子在车位里面，所以入口比车位线更窄。',
        '倒车前，比平时多往前开过车位一点。',
        '留意车尾外角绕过柱子。',
      ],
    },
    'home-garage': {
      title: '狭窄的家用车库',
      goal: '开进车库，在后墙前停下。',
      tips: [
        '趁车道上还有空间，先把车摆正。',
        '方向盘小幅调整，然后让车直着走。',
        '慢慢开进去，在后墙前停下。',
      ],
    },
    'ramp-turn': {
      title: '停车场坡道',
      goal: '沿着半圆坡道行驶，停在框内。',
      tips: [
        '保持平稳的慢速，过弯时方向盘不要动。',
        '走中间：车头外角会往外甩，后轮会往里切。',
        '出弯时把方向盘回正。',
      ],
    },
    'crooked-neighbour': {
      title: '停歪的邻居',
      goal: '倒进那辆压线车旁边的车位。',
      tips: [
        '右边的车压线了，所以稍微靠左边的车近一点。',
        '和普通车位一样规划转弯。',
        '这关要算数：碰撞超过两次就要重来。',
      ],
    },
  },
};
