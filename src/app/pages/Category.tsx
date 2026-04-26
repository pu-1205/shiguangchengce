import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext } from '../store';
import { ArrowLeft, Play, Clock, FolderOpen, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { KnowledgeMap } from '../components/KnowledgeMap';

export function CategoryDetail() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { videos, cards, categories } = useAppContext();
  const [showMap, setShowMap] = useState(false);
  
  const categoryVideos = videos.filter(v => v.category === categoryName);
  const categoryInfo = categories.find(c => c.name === categoryName);
  const defaultMapVideoId = categoryVideos.find(v => v.video_id.startsWith('r'))?.video_id || 'r1';

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-safe">
      {/* Header Image & Gradient */}
      <div className="relative h-64 w-full">
        {categoryInfo && (
          <>
            <img src={categoryInfo.image} alt={categoryName} className="absolute inset-0 w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-t ${categoryInfo.bg} mix-blend-multiply opacity-80`} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-gray-50" />
          </>
        )}
        
        {/* Top Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-14 sm:pt-16 z-10">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMap(true)}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"
            aria-label="打开知识卡片爆炸图"
          >
            <GitBranch className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Title Area */}
        <div className="absolute bottom-6 left-6 text-white z-10">
          <h1 className="text-3xl font-black mb-1">{categoryName}</h1>
          <p className="text-sm opacity-90 font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-full inline-block border border-white/20">
            {categoryVideos.length} 个视频笔记
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 p-5 -mt-2 bg-gray-50 rounded-t-3xl relative z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-10 sm:pb-12">
        {categoryVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <FolderOpen className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">该分类下暂无内容</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {categoryVideos.map((video, index) => {
              const card = cards[video.video_id];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  key={video.video_id}
                  onClick={() => navigate(`/cover/${video.video_id}`)}
                  className="bg-white rounded-3xl p-4 flex gap-4 shadow-sm border border-gray-100 group cursor-pointer"
                >
                  <div className="w-28 h-28 rounded-2xl overflow-hidden relative flex-shrink-0">
                    <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur flex items-center justify-center border border-white/40">
                        <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 py-1">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">
                      {video.title}
                    </h3>
                    
                    {card && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-auto">
                        {card.cover.key_points[0]}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100/50">
                        {video.card_type === 'practice' ? '实操步骤' : '知识闪卡'}
                      </span>
                      {card && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                          <Clock className="w-3 h-3" />
                          {card.cover.duration_read}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <KnowledgeMap
        visible={showMap}
        onClose={() => setShowMap(false)}
        videos={videos}
        currentVideoId={defaultMapVideoId}
        onNavigate={(vid) => {
          setShowMap(false);
          navigate(`/cover/${vid}`);
        }}
      />
    </div>
  );
}
