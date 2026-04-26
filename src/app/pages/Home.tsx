import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext } from '../store';
import { ChevronRight, Award, Flame, Calendar, Activity, Zap } from 'lucide-react';

const MOODS = ['😊', '😎', '🤔', '💪', '😴'];

export function Home() {
  const { mood, setMood, logs, videos, cards } = useAppContext();
  const navigate = useNavigate();
  
  const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString());
  const totalMinutes = todayLogs.reduce((acc, log) => acc + log.duration_min, 0);

  return (
    <div className="flex flex-col gap-6 p-5 pt-16 pb-24 min-h-[100dvh] flex-1">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">你好, 开心每一天 👋</h1>
          <p className="text-sm text-gray-500 mt-1">今天想学习点什么？</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-gray-100">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200" alt="User avatar" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Mood Selector */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-900">今日状态</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {MOODS.map(m => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={m}
              onClick={() => setMood(m)}
              className={`text-2xl w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all ${mood === m ? 'bg-indigo-100 ring-2 ring-indigo-500 ring-offset-2' : 'bg-white shadow-sm border border-gray-100 opacity-60'}`}
            >
              {m}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-lg shadow-indigo-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 opacity-80" />
            <span className="text-sm font-medium opacity-90">连续打卡</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">12</span>
            <span className="text-sm opacity-80">天</span>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Activity className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">今日专注</span>
          </div>
          <div className="flex items-baseline gap-1 text-gray-900">
            <span className="text-3xl font-bold">{totalMinutes}</span>
            <span className="text-sm text-gray-500">分钟</span>
          </div>
        </div>
      </div>

      {/* Bookshelf Quick Access */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">最近收藏</h2>
          <button 
            onClick={() => navigate('/bookshelf')}
            className="text-sm text-indigo-600 font-medium flex items-center hover:opacity-80"
          >
            去书架 <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          {videos.slice(0, 2).map(video => {
            const card = cards[video.video_id];
            return (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                key={video.video_id}
                onClick={() => navigate(`/cover/${video.video_id}`)}
                className="bg-white rounded-[24px] p-4 flex gap-4 shadow-sm border border-gray-100/50 relative overflow-hidden group"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative">
                  <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white flex items-center gap-1">
                    {video.card_type === 'practice' ? <Zap className="w-3 h-3 text-yellow-400" /> : <Award className="w-3 h-3 text-blue-400" />}
                    {video.card_type === 'practice' ? '实操' : '知识'}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{video.description}</p>
                  <div className="flex gap-2 text-[10px] font-medium mt-auto">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{video.category}</span>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">可读 {card.cover.duration_read}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Activity Log */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">今日行动记录</h2>
        </div>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          {todayLogs.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">今天还没有行动记录，快去学习吧</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayLogs.map(log => (
                <div key={log.log_id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                    <div className="w-px h-full bg-gray-200 mt-2" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm font-medium text-gray-900">{log.action_type}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{log.card_title}</p>
                    <div className="mt-2 text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md inline-block">
                      +{log.duration_min} 分钟
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
