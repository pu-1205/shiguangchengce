import { createContext, useContext, useState, ReactNode } from 'react';

// Models
export interface Video {
  video_id: string;
  title: string;
  description: string;
  cover_url: string;
  duration: number; // in seconds
  author: string;
  tags: string[];
  category: string;
  card_type: 'practice' | 'knowledge';
}

export interface Card {
  card_id: string;
  video_id: string;
  cover: {
    cover_title: string;
    key_points: string[];
    duration_read: string;
    difficulty: string;
  };
  content: PracticeContent | KnowledgeContent;
}

export interface PracticeContent {
  type: 'practice';
  total_time: string;
  steps: {
    step_no: number;
    title: string;
    description: string;
    tips: string;
    image_url?: string;
    image_urls?: string[];
    completed: boolean;
  }[];
}

export interface KnowledgeContent {
  type: 'knowledge';
  flash_cards: {
    id: number;
    question: string;
    answer: string;
    mastered: boolean;
  }[];
}

export interface ActionLog {
  log_id: string;
  video_id: string;
  card_title: string;
  action_type: '完成实践' | '学习闪卡' | '浏览内容';
  duration_min: number;
  completed_steps?: number;
  timestamp: string;
}

// Initial Mock Data
const MOCK_VIDEOS: Video[] = [
  {
    video_id: 'v1',
    title: '10分钟学会腹肌训练全套动作',
    description: '每天10分钟，跟着我一起练出马甲线！无需任何器械。',
    cover_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    duration: 600,
    author: '健身教练Mike',
    tags: ['健身', '腹肌', '无器械'],
    category: '健身',
    card_type: 'practice',
  },
  {
    video_id: 'v2',
    title: '普通人如何利用复利思维实现财富自由',
    description: '复利是世界第八大奇迹，今天教你如何运用在生活和投资中。',
    cover_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    duration: 450,
    author: '理财老炮儿',
    tags: ['理财', '复利', '财富'],
    category: '理财',
    card_type: 'knowledge',
  },
  {
    video_id: 'v3',
    title: '新手烘焙：零失败的巴斯克芝士蛋糕',
    description: '风靡全球的巴斯克蛋糕，搅一搅就能烤，新手必学。',
    cover_url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    duration: 320,
    author: '甜品小当家',
    tags: ['烘焙', '蛋糕', '甜品'],
    category: '烹饪',
    card_type: 'practice',
  },
  // 跑步收藏夹
  {
    video_id: 'r1',
    title: '零基础跑者：5公里入门完整训练计划',
    description: '从0到5km，8周科学跑步计划，适合完全零基础的新手。',
    cover_url: 'https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    duration: 720,
    author: '跑步教练张伟',
    tags: ['跑步', '入门', '5公里'],
    category: '跑步',
    card_type: 'practice',
  },
  {
    video_id: 'r2',
    title: '跑步呼吸节奏训练：告别跑步岔气',
    description: '掌握2:2节奏呼吸法，让你跑得更远更轻松。',
    cover_url: 'https://images.unsplash.com/photo-1587056946549-b4a1b679e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    duration: 380,
    author: '运动科学君',
    tags: ['跑步', '呼吸', '技巧'],
    category: '跑步',
    card_type: 'knowledge',
  },
  {
    video_id: 'r3',
    title: '正确跑姿全解析：避免受伤的关键动作',
    description: '从头到脚拆解正确跑姿，保护膝盖从姿势开始。',
    cover_url: 'https://images.unsplash.com/photo-1637045569815-3eead486ed85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    duration: 540,
    author: '跑步教练张伟',
    tags: ['跑步', '跑姿', '膝盖保护'],
    category: '跑步',
    card_type: 'practice',
  },
  {
    video_id: 'r4',
    title: '跑前5分钟热身：减少90%运动损伤',
    description: '正式跑步前必做的动态热身动作，科学激活肌肉。',
    cover_url: 'https://images.unsplash.com/photo-1774748855472-aee13a133fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    duration: 300,
    author: '物理治疗师李明',
    tags: ['跑步', '热身', '损伤预防'],
    category: '跑步',
    card_type: 'practice',
  },
  {
    video_id: 'r5',
    title: '挑战马拉松：16周完整备赛知识体系',
    description: '从半马到全马，系统讲解训练周期、配速策略与补给计划。',
    cover_url: 'https://images.unsplash.com/photo-1770129749675-5a4b43feb7d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    duration: 960,
    author: '马拉松完赛者老陈',
    tags: ['马拉松', '备赛', '配速'],
    category: '跑步',
    card_type: 'knowledge',
  },
  {
    video_id: 'r6',
    title: '跑姿细节实战：头部、肩膀、摆臂与髋部',
    description: '从视线、肩颈放松、摆臂轨迹到髋部前倾启动，系统修正跑姿。',
    cover_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    duration: 650,
    author: '跑步教练张伟',
    tags: ['跑步', '跑姿', '姿态训练'],
    category: '跑步',
    card_type: 'practice',
  },
];

const MOCK_CARDS: Record<string, Card> = {
  v1: {
    card_id: 'c1',
    video_id: 'v1',
    cover: {
      cover_title: '10分钟无器械腹肌训练',
      key_points: ['无需器械，适合家庭训练', '核心3个动作：卷腹/平板支撑/抬腿', '每周3次，坚持4周见效'],
      duration_read: '2分钟',
      difficulty: '入门',
    },
    content: {
      type: 'practice',
      total_time: '10分钟',
      steps: [
        { step_no: 1, title: '热身准备', description: '开合跳50次，活动手脚腕，放松肌肉', tips: '保持呼吸均匀，不要急', completed: false },
        { step_no: 2, title: '标准卷腹', description: '20次一组，做3组', tips: '下背部贴紧地面，用腹部发力', completed: false },
        { step_no: 3, title: '俄罗斯挺身', description: '左右各15次为一组，做3组', tips: '核心收紧，目光随双手转动', completed: false },
        { step_no: 4, title: '平板支撑', description: '保持60秒', tips: '身体呈一条直线，不要塌腰', completed: false },
      ],
    },
  },
  v2: {
    card_id: 'c2',
    video_id: 'v2',
    cover: {
      cover_title: '复利思维：普通人的财富密码',
      key_points: ['复利的本质是时间×收益率', '尽早开始比本金更重要', '警惕生活中的负复利陷阱'],
      duration_read: '3分钟',
      difficulty: '进阶',
    },
    content: {
      type: 'knowledge',
      flash_cards: [
        { id: 1, question: '什么是复利效应？', answer: '复利是指利息再投资产生的收益。长期来看增长效果极为显著。', mastered: false },
        { id: 2, question: '复利的核心要素有哪些？', answer: '本金、收益率、时间。其中时间是最容易被普通人忽略但最重要的要素。', mastered: false },
        { id: 3, question: '生活中的负复利有哪些？', answer: '比如过度消费导致的信用卡利息，或者长期熬夜对健康的透支。', mastered: false },
      ],
    },
  },
  v3: {
    card_id: 'c3',
    video_id: 'v3',
    cover: {
      cover_title: '零失败巴斯克蛋糕',
      key_points: ['所需材料极少，只需奶油奶酪、鸡蛋、糖', '不需要打发，搅拌均匀即可', '表面微焦是巴斯克的特色'],
      duration_read: '2分钟',
      difficulty: '入门',
    },
    content: {
      type: 'practice',
      total_time: '35分钟',
      steps: [
        { step_no: 1, title: '软化奶酪', description: '将250g奶油奶酪室温软化至顺滑', tips: '如果冬天可以隔温水软化', completed: false },
        { step_no: 2, title: '加入糖和蛋', description: '加入60g细砂糖搅拌均匀，分三次加入2个鸡蛋', tips: '每次都要完全融合再加下一次', completed: false },
        { step_no: 3, title: '烘烤', description: '220度烤25分钟', tips: '烤到表面焦黑是正常现象，这就是巴斯克的灵魂', completed: false },
      ],
    },
  },
  // 跑步收藏夹卡片
  r1: {
    card_id: 'rc1',
    video_id: 'r1',
    cover: {
      cover_title: '5公里入门跑：8周科学计划',
      key_points: ['前4周以走跑结合为主，心率不超过140', '第5-8周逐步延长持续跑步时间', '完成后可轻松完成5公里不停跑'],
      duration_read: '3分钟',
      difficulty: '入门',
    },
    content: {
      type: 'practice',
      total_time: '8周',
      steps: [
        { step_no: 1, title: '第1-2周：走跑结合', description: '跑1分钟走2分钟，循环8次，每周3次', tips: '配速要慢，能说话为标准', completed: true },
        { step_no: 2, title: '第3-4周：延长跑步段', description: '跑3分钟走1分钟，循环6次，每周3次', tips: '关注呼吸节奏，避免岔气', completed: true },
        { step_no: 3, title: '第5-6周：建立基础', description: '持续慢跑20分钟，每周3次', tips: '此阶段最重要的是保持一致性', completed: true },
        { step_no: 4, title: '第7-8周：冲刺目标', description: '持续慢跑30分钟或5公里，每周3次', tips: '完成第8周第3跑，你就是5公里跑者了！', completed: true },
      ],
    },
  },
  r2: {
    card_id: 'rc2',
    video_id: 'r2',
    cover: {
      cover_title: '跑步呼吸法：告别岔气烦恼',
      key_points: ['2:2节奏呼吸法是跑步黄金法则', '用鼻吸口呼，深腹式呼吸', '岔气时减速并按压患处'],
      duration_read: '2分钟',
      difficulty: '入门',
    },
    content: {
      type: 'knowledge',
      flash_cards: [
        { id: 1, question: '什么是2:2跑步呼吸法？', answer: '跑步时每2步吸气、每2步呼气，形成稳定的节律，可有效减少岔气和疲劳感。', mastered: true },
        { id: 2, question: '跑步时应该用鼻子还是嘴巴呼吸？', answer: '轻松跑用鼻吸鼻呼；速度加快后可鼻吸口呼；高强度时可用口吸口呼，增大通气量。', mastered: true },
        { id: 3, question: '跑步岔气了怎么办？', answer: '减速至走步，用手指按压疼痛部位，做深长呼气，通常1-2分钟内可缓解。', mastered: true },
        { id: 4, question: '腹式呼吸对跑步有什么好处？', answer: '腹式呼吸能充分利用膈肌，增加肺活量，相比胸式呼吸可多摄入30%的氧气。', mastered: true },
      ],
    },
  },
  r3: {
    card_id: 'rc3',
    video_id: 'r3',
    cover: {
      cover_title: '正确跑姿：保护膝盖从今天开始',
      key_points: ['步频目标：180步/分钟', '脚落点在重心正下方，避免跨步', '核心收紧，上身微前倾5-10度'],
      duration_read: '3分钟',
      difficulty: '进阶',
    },
    content: {
      type: 'practice',
      total_time: '4周矫正期',
      steps: [
        { step_no: 1, title: '检测当前步频', description: '慢跑1分钟，数右脚落地次数×2，即为当前步频', tips: '大多数初跑者步频在150-160之间', completed: true },
        { step_no: 2, title: '落地方式训练', description: '练习前脚掌或中足落地，避免脚跟先着地', tips: '光脚在草地上小步跑，能快速感受正确落脚点', completed: true },
        { step_no: 3, title: '躯干姿势调整', description: '核心收紧，肩膀放松下沉，身体整体前倾而非弯腰', tips: '想象头顶有一根绳子向上拉着你', completed: true },
        { step_no: 4, title: '手臂摆动优化', description: '肘关节弯曲90度，手臂前后摆动不过身体中线', tips: '握拳要轻，如手心夹着一颗鸡蛋', completed: true },
      ],
    },
  },
  r4: {
    card_id: 'rc4',
    video_id: 'r4',
    cover: {
      cover_title: '跑前5分钟黄金热身',
      key_points: ['动态热身比静态拉伸更适合跑前', '重点激活臀部、股四头肌和小腿', '5分钟热身可减少90%运动损伤'],
      duration_read: '2分钟',
      difficulty: '入门',
    },
    content: {
      type: 'practice',
      total_time: '5分钟',
      steps: [
        { step_no: 1, title: '原地高抬腿', description: '快速原地高抬腿30秒，激活心肺和腿部肌肉', tips: '抬腿高度至少到腰部，手臂配合摆动', completed: true },
        { step_no: 2, title: '弓步髋部旋转', description: '每侧10次，打开髋关节活动度', tips: '前腿膝盖不超过脚尖，后腿接近地面', completed: true },
        { step_no: 3, title: '腿部摆动', description: '扶墙，前后摆腿各15次/侧，动态拉伸腿筋', tips: '控制动作幅度，不要甩腿', completed: true },
        { step_no: 4, title: '踝关节活化', description: '顺逆时针各转动10圈，垫脚尖抬落20次', tips: '跑步时踝关节承受体重3倍冲击，务必充分热身', completed: true },
      ],
    },
  },
  r5: {
    card_id: 'rc5',
    video_id: 'r5',
    cover: {
      cover_title: '马拉松备赛：系统知识体系',
      key_points: ['全马备赛建议至少需要16-20周', '80%训练量应为轻松跑（能对话配速）', '比赛日配速宜慢不宜快，前半程保留体力'],
      duration_read: '4分钟',
      difficulty: '高阶',
    },
    content: {
      type: 'knowledge',
      flash_cards: [
        { id: 1, question: '什么是80/20训练法则？', answer: '80%的跑量应为低强度有氧跑，20%为高强度训练。大多数跑者犯的错误是高强度比例过高。', mastered: true },
        { id: 2, question: '马拉松减量期（Taper）是什么？', answer: '赛前2-3周逐步降低训练量的阶段。减量让肌肉充分恢复，糖原储量达到最高，是比赛发挥的关键。', mastered: true },
        { id: 3, question: '比赛中如何补给？', answer: '每45-60分钟补充一次能量胶或运动饮料；每个补给站都要喝水；不要在比赛中尝试从未在训练中用过的补给。', mastered: true },
        { id: 4, question: '什么是"撞墙"现象？', answer: '约在35公里处，糖原耗尽导致体力骤降。通过足够长的备赛训练、适当配速和充分补给可有效预防。', mastered: true },
        { id: 5, question: '如何设定合理的完赛目标？', answer: '以近期半马成绩×2+10分钟估算全马；新手首马建议以"完赛"为目标，不追求时间。', mastered: true },
      ],
    },
  },
  r6: {
    card_id: 'rc6',
    video_id: 'r6',
    cover: {
      cover_title: '跑姿细节矫正：头肩摆臂与髋部联动',
      key_points: ['视线看前方约20米，耳肩保持垂直对齐', '耸肩时先甩臂放松，再回到自然摆臂', '双手不越身体中线，利用前倾启动跑步'],
      duration_read: '3分钟',
      difficulty: '进阶',
    },
    content: {
      type: 'practice',
      total_time: '25分钟',
      steps: [
        { step_no: 1, title: '头部与视线校准（3分钟）', description: '[00:31] 抬眼看前方地平线，目视约20米处；避免低头看脚下或仰头。并检查耳朵与肩膀是否在同一条垂直线上，避免头前伸。', tips: '跑前先原地走30秒进行自检：下巴微收、颈部放长。', image_url: '/running-posture/r6-01.png', image_urls: ['/running-posture/r6-01.png', '/running-posture/r6-02.png'], completed: false },
        { step_no: 2, title: '肩膀放松重置（4分钟）', description: '[00:46] 当出现耸肩时，先把双臂自然垂下轻甩10-15秒，放松上斜方肌，再抬回跑步位。重复4轮。', tips: '关注“肩膀下沉、锁骨展开”的感觉，不要含胸。', image_url: '/running-posture/r6-03.png', image_urls: ['/running-posture/r6-03.png'], completed: false },
        { step_no: 3, title: '摆臂轨迹训练（6分钟）', description: '[01:06] 保持手肘贴近身体两侧但不过度夹紧；大拇指朝上；想象身体中间有一条中线，摆臂绝不越线。', tips: '先做1分钟原地摆臂，再做2组慢跑摆臂，每组2分钟。', image_url: '/running-posture/r6-04.png', image_urls: ['/running-posture/r6-04.png', '/running-posture/r6-05.png', '/running-posture/r6-06.png'], completed: false },
        { step_no: 4, title: '髋部打开与前倾启动（7分钟）', description: '[01:58] 想象脖子被一根绳子向上拉，保持躯干挺拔，打开髋关节。随后做“前倾启动”热身：站直、双手交叉、目视前方、踮脚并缓慢前倾，在挺拔状态下顺势迈步跑出。', tips: '前倾来自脚踝而非弯腰，核心保持轻收紧。', image_url: '/running-posture/r6-07.png', image_urls: ['/running-posture/r6-07.png', '/running-posture/r6-08.png', '/running-posture/r6-09.png'], completed: false },
        { step_no: 5, title: '整合慢跑实践（5分钟）', description: '以轻松配速跑5分钟，依次检查：视线-头位、肩膀放松、摆臂不过中线、髋部挺拔前倾。每1分钟做一次自我口令提醒。', tips: '建议用手机侧拍10-15秒，回看是否出现头前伸或耸肩。', image_url: '/running-posture/r6-09.png', image_urls: ['/running-posture/r6-01.png', '/running-posture/r6-06.png', '/running-posture/r6-09.png'], completed: false },
      ],
    },
  },
};

const MOCK_CATEGORIES = [
  { id: 'cat1', name: '健身', count: 12, bg: 'from-orange-400 to-rose-400', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat2', name: '理财', count: 8, bg: 'from-blue-400 to-cyan-400', image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat3', name: '技能', count: 5, bg: 'from-indigo-400 to-purple-400', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat4', name: '烹饪', count: 15, bg: 'from-emerald-400 to-teal-400', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat5', name: '跑步', count: 6, bg: 'from-red-400 to-pink-400', image: 'https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?auto=format&fit=crop&w=400&q=80' },
];

const INITIAL_LOGS: ActionLog[] = [
  {
    log_id: 'l1',
    video_id: 'v1',
    card_title: '10分钟无器械腹肌训练',
    action_type: '完成实践',
    duration_min: 10,
    timestamp: new Date().toISOString(),
  }
];

// Context Type
interface AppContextType {
  videos: Video[];
  cards: Record<string, Card>;
  categories: typeof MOCK_CATEGORIES;
  logs: ActionLog[];
  mood: string;
  setMood: (mood: string) => void;
  updateStepCompleted: (videoId: string, stepNo: number, completed: boolean) => void;
  markCardMastered: (videoId: string, cardId: number, mastered: boolean) => void;
  addActionLog: (log: Omit<ActionLog, 'log_id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [videos] = useState(MOCK_VIDEOS);
  const [cards, setCards] = useState(MOCK_CARDS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [mood, setMood] = useState('😊');

  const updateStepCompleted = (videoId: string, stepNo: number, completed: boolean) => {
    setCards(prev => {
      const card = prev[videoId];
      if (!card || card.content.type !== 'practice') return prev;
      
      const newSteps = card.content.steps.map(s => 
        s.step_no === stepNo ? { ...s, completed } : s
      );

      return {
        ...prev,
        [videoId]: {
          ...card,
          content: { ...card.content, steps: newSteps }
        }
      };
    });
  };

  const markCardMastered = (videoId: string, cardId: number, mastered: boolean) => {
    setCards(prev => {
      const card = prev[videoId];
      if (!card || card.content.type !== 'knowledge') return prev;
      
      const newFlashCards = card.content.flash_cards.map(c => 
        c.id === cardId ? { ...c, mastered } : c
      );

      return {
        ...prev,
        [videoId]: {
          ...card,
          content: { ...card.content, flash_cards: newFlashCards }
        }
      };
    });
  };

  const addActionLog = (log: Omit<ActionLog, 'log_id' | 'timestamp'>) => {
    const newLog: ActionLog = {
      ...log,
      log_id: `l${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      videos, cards, categories, logs, mood, setMood,
      updateStepCompleted, markCardMastered, addActionLog
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}