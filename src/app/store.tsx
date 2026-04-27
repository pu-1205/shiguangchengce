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
  // 跑步收藏夹（r6 置顶：跑姿细节实战）
  {
    video_id: 'r6',
    title: '跑姿细节实战：头部、肩膀、摆臂与髋部',
    description: '从视线、肩颈放松、摆臂轨迹到髋部前倾启动，系统修正跑姿。',
    cover_url: '/covers/r6-card-cover.png',
    duration: 650,
    author: '跑步教练张伟',
    tags: ['跑步', '跑姿', '姿态训练'],
    category: '跑步',
    card_type: 'practice',
  },
  {
    video_id: 'r1',
    title: '零基础如何正确开始跑步',
    description: '装备与场地、走跑结合、强度与恢复——第一次开跑也能稳稳完成。',
    cover_url: '/covers/running-r1-beginner.jpg',
    duration: 300,
    author: '跑步教练张伟',
    tags: ['跑步', '新手', '开跑指南'],
    category: '跑步',
    card_type: 'practice',
  },
  {
    video_id: 'r2',
    title: '跑步送髋：5分钟教会你',
    description: '用原地与慢跑的小剂量练习，找到骨盆前倾带腿、臀部发力的感觉。',
    cover_url: '/covers/running-r2-hip-5min.jpg',
    duration: 300,
    author: '跑步教练张伟',
    tags: ['跑步', '送髋', '技术入门'],
    category: '跑步',
    card_type: 'practice',
  },
  {
    video_id: 'r3',
    title: '正确跑步：为什么跑姿很重要',
    description: '跑姿决定受力方向与关节负荷；先建立理念，再落到每一步的可执行要点。',
    cover_url: '/covers/running-r3-form-matters.jpg',
    duration: 300,
    author: '跑步教练张伟',
    tags: ['跑步', '跑姿', '损伤预防'],
    category: '跑步',
    card_type: 'knowledge',
  },
  {
    video_id: 'r4',
    title: '慢跑送髋教程',
    description: '在慢跑里练习送髋感知：小步频、骨盆稳定、轻前倾，把髋“交给”步幅。',
    cover_url: '/covers/running-r4-jog-hip.jpg',
    duration: 300,
    author: '跑步教练张伟',
    tags: ['跑步', '送髋', '慢跑'],
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
      cover_title: '零基础：如何正确开始跑步',
      key_points: ['跑鞋与路面以稳、防滑为先，循序渐进加量', '走跑结合建立心肺与腿部耐受', '疼痛即减速：休息与调整比硬撑更重要'],
      duration_read: '5分钟',
      difficulty: '入门',
    },
    content: {
      type: 'practice',
      total_time: '约4周起步',
      steps: [
        { step_no: 1, title: '开跑前检查清单', description: '选一双合脚跑鞋（比平时大半码亦可），衣物透气；选平坦、照明良好的路线；告知家人大致往返时间。', tips: '新手不必追求配速表，先保证“跑得完、走得回”。', completed: false },
        { step_no: 2, title: '第1周：走跑结合（每周3次）', description: '慢跑1分钟 + 快走2分钟，循环8轮；总时长约25–30分钟。全程用鼻口自然呼吸，能断续说短句即可。', tips: '小腿前侧或膝盖前方刺痛应立刻改为快走或结束当日训练。', completed: false },
        { step_no: 3, title: '第2–3周：拉长跑步段', description: '将比例逐步调到跑2走1、再过渡到跑3走1；每周仍保持3次，单次总时长不超过45分钟。', tips: '每周总跑量增幅建议不超过10%，给身体适应窗口。', completed: false },
        { step_no: 4, title: '安全与恢复', description: '跑后慢走5分钟，做小腿、大腿后侧轻度拉伸；补水与少量碳水；若连续两天同一部位疼痛，停跑并排查鞋与步幅。', tips: '睡眠与蛋白质摄入和训练同等重要。', completed: false },
      ],
    },
  },
  r2: {
    card_id: 'rc2',
    video_id: 'r2',
    cover: {
      cover_title: '5分钟送髋入门',
      key_points: ['送髋是骨盆轻微前倾带动抬腿，而非扭腰', '臀部有“推进感”，小腿少代偿', '先原地找感觉，再带进慢跑'],
      duration_read: '5分钟',
      difficulty: '入门',
    },
    content: {
      type: 'practice',
      total_time: '5分钟',
      steps: [
        { step_no: 1, title: '站姿校准（45秒）', description: '双脚与肩同宽，肋骨微收、骨盆中立；想象头顶向上延伸，胸廓朝前不挺腰。', tips: '扶墙或椅背可减轻紧张感。', completed: false },
        { step_no: 2, title: '原地“骨盆钟摆”（1分钟）', description: '双手叉腰，骨盆缓慢前后倾各10次，再左右轻摆各8次，唤醒髋关节活动度。', tips: '幅度小、速度慢，避免用膝盖去“顶”出摆动。', completed: false },
        { step_no: 3, title: '原地高抬腿+前倾（1.5分钟）', description: '轻扶固定物，交替抬膝至髋高度，感受大腿前侧与臀肌协同；随后身体从脚踝处整体微前倾2–3度，保持核心轻收。', tips: '前倾来自“脚踝—髋”这条线，不是弯腰低头。', completed: false },
        { step_no: 4, title: '慢跑20米×4组（2分钟）', description: '用比平时略小的步幅、略高的步频慢跑；每10步默念一次“轻落—臀推”。', tips: '若小腿立刻发胀，缩小步幅并放慢速度。', completed: false },
      ],
    },
  },
  r3: {
    card_id: 'rc3',
    video_id: 'r3',
    cover: {
      cover_title: '跑姿为什么决定你能不能一直跑',
      key_points: ['跑姿影响落地冲击链：膝、踝、足底都会分担负荷', '好的排列让肌肉做功更经济，推迟疲劳', '理念先行：知道“为什么”更容易坚持改动作'],
      duration_read: '5分钟',
      difficulty: '入门',
    },
    content: {
      type: 'knowledge',
      flash_cards: [
        { id: 1, question: '为什么说跑姿比“跑得快”更基础？', answer: '跑姿决定每一步的受力方向与大小。排列不佳时，关节与肌腱会先承受异常剪切力，短期能跑，长期更容易出现髌骨、跟腱、足底等问题。', mastered: false },
        { id: 2, question: '跨步过大为什么伤膝？', answer: '脚落在身体重心前方会形成“刹车式”落地，膝关节需吸收更大的冲击与扭转。缩小步幅、提高步频通常能立刻降低膝前不适概率。', mastered: false },
        { id: 3, question: '“上身稳定”和速度有什么关系？', answer: '躯干稳定能让摆臂与髋部发力更有效率，减少左右晃动带来的能量浪费；同等配速下心率更低、体感更轻松。', mastered: false },
        { id: 4, question: '我该如何把理念落到训练里？', answer: '每次训练只改一个要点（如步幅或摆臂），用轻松配速练习10–15分钟，并用手机侧拍10秒回看，比一次改十个点更有效。', mastered: false },
      ],
    },
  },
  r4: {
    card_id: 'rc4',
    video_id: 'r4',
    cover: {
      cover_title: '慢跑中的送髋跟练',
      key_points: ['小步幅、轻落地，给髋部“空间”工作', '骨盆像水平托盘：少左右晃、少后仰', '用臀推进，每2分钟自检一次'],
      duration_read: '5分钟',
      difficulty: '进阶',
    },
    content: {
      type: 'practice',
      total_time: '5分钟',
      steps: [
        { step_no: 1, title: '配速降到“能完整说一句话”', description: '用轻松慢跑2分钟热身，刻意把步幅缩短10–15%，步频略提高，让脚更接近重心下方落地。', tips: '送髋练习不适合用冲刺配速。', completed: false },
        { step_no: 2, title: '骨盆“托盘”自检（1分钟）', description: '双手轻扶髋骨两侧，感受骨盆是否左右摆动过大；想象托盘里的水尽量不洒，核心轻收、肩放松。', tips: '若肩膀耸起，先甩臂放松再继续。', completed: false },
        { step_no: 3, title: '臀推口令跑（2分钟）', description: '每落地一次心里默念“落—推”，推来自臀部轻微伸展，而不是用力蹬直膝盖；保持小腿相对放松。', tips: '胫骨前侧发紧时，再缩小步幅。', completed: false },
        { step_no: 4, title: '收束：节奏跑1分钟', description: '回到自然慢跑，只保留一个意象：身体整体轻微前移，脚轻触地即离地。', tips: '练后若髋或臀酸痛属轻度适应；膝关节锐痛应停止并评估。', completed: false },
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