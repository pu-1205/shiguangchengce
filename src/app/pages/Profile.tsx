import { useAppContext } from '../store';
import { Settings, Activity, Clock, Layers, ChevronRight, Award } from 'lucide-react';
import { motion } from 'motion/react';

const BADGES = [
  { id: 1, name: '初学乍练', description: '完成首次学习', icon: '💡', unlocked: true, color: 'bg-amber-100 text-amber-600' },
  { id: 2, name: '坚持不懈', description: '连续打卡3天', icon: '🏃', unlocked: true, color: 'bg-emerald-100 text-emerald-600' },
  { id: 3, name: '时间大师', description: '累计专注1000分钟', icon: '⏰', unlocked: false, color: 'bg-gray-100 text-gray-400' },
  { id: 4, name: '知识宝库', description: '掌握100张卡片', icon: '📚', unlocked: false, color: 'bg-gray-100 text-gray-400' },
];

export function Profile() {
  const { logs, cards } = useAppContext();

  // Calculate statistics
  const totalActions = logs.length;
  const totalDuration = logs.reduce((acc, log) => acc + log.duration_min, 0);
  const masteredCards = Object.values(cards).reduce((acc, card) => {
    if (card.content.type === 'knowledge') {
      return acc + card.content.flash_cards.filter(fc => fc.mastered).length;
    }
    return acc;
  }, 0);

  return (
    <div className="flex flex-col gap-6 p-5 pt-16 pb-24 min-h-[100dvh] flex-1">
      {/* Header Profile Info */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm border-2 border-white ring-2 ring-gray-50">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200" 
              alt="User avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">学习达人</h1>
            <p className="text-xs text-gray-500 font-medium mt-1 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
              加入 CardFlow 12 天
            </p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5" />
        </motion.button>
      </header>

      {/* Stats Grid */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 grid grid-cols-3 gap-4 divide-x divide-gray-50">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">行动记录</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">{totalActions}</span>
            <span className="text-[10px] text-gray-400">次</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">学习时长</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">{totalDuration}</span>
            <span className="text-[10px] text-gray-400">分钟</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">掌握卡片</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">{masteredCards}</span>
            <span className="text-[10px] text-gray-400">张</span>
          </div>
        </div>
      </section>

      {/* Badges & Achievements */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            我的勋章
          </h2>
          <button className="text-xs text-gray-400 font-medium flex items-center hover:text-gray-600">
            全部 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          {BADGES.map((badge) => (
            <motion.div 
              whileTap={{ scale: 0.95 }}
              key={badge.id} 
              className={`flex flex-col items-center gap-2 w-20 flex-shrink-0 snap-start ${!badge.unlocked ? 'opacity-60 grayscale' : ''}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm border border-gray-100 ${badge.color}`}>
                {badge.icon}
              </div>
              <span className="text-xs font-bold text-gray-800 text-center">{badge.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Actions */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">最近行动</h2>
        
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
          {logs.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">
              暂无学习记录，快去开启第一张卡片吧！
            </div>
          ) : (
            logs.slice(0, 5).map((log, index) => (
              <div key={log.log_id} className="flex gap-4 relative">
                {/* Timeline connector */}
                {index !== logs.length - 1 && index !== 4 && (
                  <div className="absolute left-4 top-10 bottom-[-20px] w-px bg-gray-100" />
                )}
                
                {/* Action Icon */}
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0 z-10 border-2 border-white relative mt-1">
                  {log.action_type === '完成实践' ? <Activity className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                </div>
                
                {/* Action Details */}
                <div className="flex-1 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-gray-900">
                      {log.action_type}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                    {log.card_title}
                  </p>
                  <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    +{log.duration_min} 分钟
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
