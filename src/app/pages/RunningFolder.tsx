import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext } from '../store';
import { ArrowLeft, CheckCircle2, BookOpen, Dumbbell, Timer, ChevronRight, Trophy, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { KnowledgeMap } from '../components/KnowledgeMap';

const RUNNING_IDS = ['r6', 'r1', 'r2', 'r3', 'r4', 'r5'];

const CARD_ACCENT = [
  { from: 'from-orange-500', to: 'to-red-500', bg: 'bg-orange-50', tag: 'bg-orange-100 text-orange-600' },
  { from: 'from-sky-500', to: 'to-blue-600', bg: 'bg-sky-50', tag: 'bg-sky-100 text-sky-600' },
  { from: 'from-violet-500', to: 'to-purple-600', bg: 'bg-violet-50', tag: 'bg-violet-100 text-violet-600' },
  { from: 'from-emerald-500', to: 'to-teal-600', bg: 'bg-emerald-50', tag: 'bg-emerald-100 text-emerald-600' },
  { from: 'from-rose-500', to: 'to-pink-600', bg: 'bg-rose-50', tag: 'bg-rose-100 text-rose-600' },
  { from: 'from-amber-500', to: 'to-yellow-500', bg: 'bg-amber-50', tag: 'bg-amber-100 text-amber-700' },
];

function CompletionBadge({ type }: { type: 'practice' | 'knowledge' }) {
  return type === 'practice' ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
      <Dumbbell className="w-2.5 h-2.5" /> 实践卡
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
      <BookOpen className="w-2.5 h-2.5" /> 知识卡
    </span>
  );
}

export function RunningFolder() {
  const { videos, cards } = useAppContext();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [mapCenterId, setMapCenterId] = useState('r6');

  const runningVideos = RUNNING_IDS.map(id => videos.find(v => v.video_id === id)).filter(Boolean);
  const runningCards = RUNNING_IDS.map(id => cards[id]).filter(Boolean);

  const totalCards = runningCards.length;
  const practiceCount = runningCards.filter(card => card.content.type === 'practice').length;
  const knowledgeCount = runningCards.filter(card => card.content.type === 'knowledge').length;
  const totalReadMinutes = runningCards.reduce((sum, card) => sum + (Number.parseInt(card.cover.duration_read, 10) || 0), 0);
  const completedCount = runningCards.filter(card => {
    if (card.content.type === 'practice') {
      return card.content.steps.every(s => s.completed);
    }
    return card.content.flash_cards.every(f => f.mastered);
  }).length;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 pt-16 pb-8 px-5">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />

        {/* Top row: Back + Map buttons */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setMapCenterId('r6'); setShowMap(true); }}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <GitBranch className="w-[18px] h-[18px] text-white" />
          </motion.button>
        </div>

        {/* Folder info */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🏃</span>
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Trophy className="w-3 h-3 text-yellow-300" />
              <span className="text-xs font-bold text-white">{completedCount === totalCards ? '全部完成' : '持续进步中'}</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">跑步收藏夹</h1>
          <p className="text-sm text-white/80 mb-5">从入门到马拉松的完整知识体系</p>

          {/* Progress bar */}
          <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white/90">掌握进度</span>
              <span className="text-xs font-black text-white">{completedCount}/{totalCards} 已完成</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalCards) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3 text-white/70" />
                <span className="text-[10px] text-white/70 font-medium">{practiceCount} 实践卡</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-white/70" />
                <span className="text-[10px] text-white/70 font-medium">{knowledgeCount} 知识卡</span>
              </div>
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3 text-white/70" />
                <span className="text-[10px] text-white/70 font-medium">约{totalReadMinutes}分钟阅读</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="flex-1 px-5 py-6 pb-28 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{totalCards} 张卡片组</p>

        {runningVideos.map((video, index) => {
          if (!video) return null;
          const card = cards[video.video_id];
          if (!card) return null;
          const accent = CARD_ACCENT[index];

          const isCompleted = card.content.type === 'practice'
            ? card.content.steps.every(s => s.completed)
            : card.content.flash_cards.every(f => f.mastered);

          const totalItems = card.content.type === 'practice'
            ? card.content.steps.length
            : card.content.flash_cards.length;

          const completedItems = card.content.type === 'practice'
            ? card.content.steps.filter(s => s.completed).length
            : card.content.flash_cards.filter(f => f.mastered).length;

          return (
            <motion.div
              key={video.video_id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/cover/${video.video_id}`)}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
            >
              {/* Card top image strip */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={video.cover_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${accent.from} ${accent.to} opacity-60`} />
                {/* Step counter pill */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                  <span className="text-[10px] font-black text-white">#{index + 1}</span>
                </div>
                {/* Completed badge */}
                {isCompleted && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 px-2.5 py-1 rounded-full shadow-lg">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-black text-white">已完成</span>
                  </div>
                )}
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-sm font-black text-white line-clamp-2 leading-snug">
                    {card.cover.cover_title}
                  </h3>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <CompletionBadge type={card.content.type} />
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" /> {card.cover.duration_read}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      card.cover.difficulty === '入门' ? 'bg-green-100 text-green-600' :
                      card.cover.difficulty === '进阶' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    } font-bold`}>
                      {card.cover.difficulty}
                    </span>
                  </div>
                </div>

                {/* Key points */}
                <div className="flex flex-col gap-1.5 mb-3">
                  {card.cover.key_points.map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-600 leading-snug">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Progress mini bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${accent.from} ${accent.to}`}
                      style={{ width: `${(completedItems / totalItems) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                    {completedItems}/{totalItems}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Knowledge Map Overlay */}
      <KnowledgeMap
        visible={showMap}
        onClose={() => setShowMap(false)}
        videos={videos}
        currentVideoId={mapCenterId}
        onNavigate={(vid) => { setShowMap(false); navigate(`/cover/${vid}`); }}
      />
    </div>
  );
}