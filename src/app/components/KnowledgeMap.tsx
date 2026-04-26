import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, BookOpen } from 'lucide-react';
import { Video } from '../store';

interface KnowledgeMapProps {
  visible: boolean;
  onClose: () => void;
  videos: Video[];
  currentVideoId: string;
  onNavigate: (videoId: string) => void;
}

// Define connections between cards
const CONNECTIONS: Record<string, string[]> = {
  r1: ['r2', 'r3', 'r4'],       // 5km入门 → 呼吸、跑姿、热身
  r2: ['r1', 'r3', 'r5'],       // 呼吸 → 入门、跑姿、马拉松
  r3: ['r1', 'r4', 'r5'],       // 跑姿 → 入门、热身、马拉松
  r4: ['r1', 'r3'],             // 热身 → 入门、跑姿
  r5: ['r2', 'r3'],             // 马拉松 → 呼吸、跑姿
  r6: ['r1', 'r3', 'r4'],       // 跑姿细节 → 入门、跑姿、热身
};

const NODE_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  r1: { bg: 'from-blue-500 to-cyan-400', border: 'border-blue-300', glow: 'shadow-blue-500/40' },
  r2: { bg: 'from-violet-500 to-purple-400', border: 'border-violet-300', glow: 'shadow-violet-500/40' },
  r3: { bg: 'from-emerald-500 to-green-400', border: 'border-emerald-300', glow: 'shadow-emerald-500/40' },
  r4: { bg: 'from-orange-500 to-amber-400', border: 'border-orange-300', glow: 'shadow-orange-500/40' },
  r5: { bg: 'from-rose-500 to-pink-400', border: 'border-rose-300', glow: 'shadow-rose-500/40' },
  r6: { bg: 'from-amber-500 to-yellow-400', border: 'border-amber-300', glow: 'shadow-amber-500/40' },
};

const SHORT_LABELS: Record<string, string> = {
  r1: '5km入门',
  r2: '呼吸法',
  r3: '正确跑姿',
  r4: '跑前热身',
  r5: '马拉松备赛',
  r6: '跑姿细节',
};

export function KnowledgeMap({ visible, onClose, videos, currentVideoId, onNavigate }: KnowledgeMapProps) {
  const runningVideos = videos.filter(v => v.video_id.startsWith('r'));

  // Explosion layout: current node center, others radiate out
  const centerIdx = runningVideos.findIndex(v => v.video_id === currentVideoId);
  const currentVideo = runningVideos.find(v => v.video_id === currentVideoId);
  const otherVideos = runningVideos.filter(v => v.video_id !== currentVideoId);

  // Calculate positions for explosion layout (center + orbiting nodes)
  const cx = 50; // center x %
  const cy = 46; // center y %
  const radius = 32; // orbit radius %

  const nodePositions: Record<string, { x: number; y: number }> = {};
  if (currentVideo) {
    nodePositions[currentVideo.video_id] = { x: cx, y: cy };
  }
  otherVideos.forEach((v, i) => {
    const angle = (i / otherVideos.length) * Math.PI * 2 - Math.PI / 2;
    nodePositions[v.video_id] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const connections = currentVideo ? (CONNECTIONS[currentVideo.video_id] || []) : [];

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="map-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[80]"
          />
          <motion.div
            key="map-content"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed inset-0 z-[85] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-14 sm:pt-16 pb-2 shrink-0">
              <div>
                <h2 className="text-white text-lg font-black flex items-center gap-2">
                  🧬 知识导图
                </h2>
                <p className="text-white/50 text-xs mt-0.5">点击节点跳转 · 连线表示关联</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative overflow-hidden">
              {/* SVG connection lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                {connections.map(targetId => {
                  const from = nodePositions[currentVideoId];
                  const to = nodePositions[targetId];
                  if (!from || !to) return null;
                  return (
                    <motion.line
                      key={`${currentVideoId}-${targetId}`}
                      x1={`${from.x}%`}
                      y1={`${from.y}%`}
                      x2={`${to.x}%`}
                      y2={`${to.y}%`}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  );
                })}
                {/* Also draw connections between non-center nodes */}
                {otherVideos.map(v => {
                  const vConns = CONNECTIONS[v.video_id] || [];
                  return vConns
                    .filter(tid => tid !== currentVideoId && nodePositions[tid])
                    .map(tid => {
                      const from = nodePositions[v.video_id];
                      const to = nodePositions[tid];
                      if (!from || !to) return null;
                      const key = [v.video_id, tid].sort().join('-');
                      return (
                        <motion.line
                          key={key}
                          x1={`${from.x}%`}
                          y1={`${from.y}%`}
                          x2={`${to.x}%`}
                          y2={`${to.y}%`}
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="1"
                          strokeDasharray="4 6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        />
                      );
                    });
                })}
              </svg>

              {/* Nodes */}
              {runningVideos.map((v, i) => {
                const pos = nodePositions[v.video_id];
                if (!pos) return null;
                const isCurrent = v.video_id === currentVideoId;
                const colors = NODE_COLORS[v.video_id] || NODE_COLORS.r1;
                const isConnected = connections.includes(v.video_id);
                const delay = isCurrent ? 0 : 0.15 + i * 0.08;

                return (
                  <motion.div
                    key={v.video_id}
                    initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                    animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                    transition={{ type: 'spring', damping: 16, stiffness: 200, delay }}
                    className="absolute z-10"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        if (!isCurrent) {
                          onClose();
                          onNavigate(v.video_id);
                        }
                      }}
                      className={`flex flex-col items-center gap-2 ${isCurrent ? '' : 'cursor-pointer'}`}
                    >
                      {/* Node circle */}
                      <div className={`relative ${isCurrent ? 'w-20 h-20' : 'w-14 h-14'} rounded-full overflow-hidden shadow-xl ${colors.glow} ${isCurrent ? 'ring-4 ring-white/30' : isConnected ? 'ring-2 ring-white/20' : 'ring-1 ring-white/10 opacity-60'}`}>
                        <img src={v.cover_url} alt="" className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-40`} />
                        {/* Type icon */}
                        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                          {v.card_type === 'practice' 
                            ? <Zap className="w-3 h-3 text-emerald-400" />
                            : <BookOpen className="w-3 h-3 text-indigo-400" />}
                        </div>
                      </div>
                      {/* Label */}
                      <span className={`text-[11px] font-bold max-w-[80px] text-center leading-tight ${isCurrent ? 'text-white' : isConnected ? 'text-white/70' : 'text-white/40'}`}>
                        {SHORT_LABELS[v.video_id] || v.title.slice(0, 6)}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] text-white/40 bg-white/10 px-2 py-0.5 rounded-full -mt-1">当前</span>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}

              {/* Decorative particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`p-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-white/20"
                  style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                  animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>

            {/* Bottom hint */}
            <div className="px-5 pb-10 pt-3 text-center shrink-0">
              <p className="text-white/30 text-xs">共 {runningVideos.length} 张卡片 · {Object.values(CONNECTIONS).flat().length / 2 | 0} 条知识关联</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
