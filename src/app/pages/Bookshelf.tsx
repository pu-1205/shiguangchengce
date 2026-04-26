import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext } from '../store';
import { Search, Folder, BookOpen, ChevronRight, CheckCircle2, Dumbbell, Star } from 'lucide-react';

// 收藏夹数据
const FAVORITES = [
  {
    id: 'running',
    name: '跑步收藏夹',
    emoji: '🏃',
    cardCount: 6,
    completedCount: 5,
    desc: '从入门到马拉松的完整知识体系',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    tags: ['5公里计划', '跑姿矫正', '热身动作', '呼吸法', '马拉松'],
    route: '/folder/running',
    coverUrl: 'https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
];

export function Bookshelf() {
  const { categories, videos } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 p-5 pt-16 pb-24 min-h-[100dvh] flex-1">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">我的书架</h1>
        <p className="text-sm text-gray-500">将零散的收藏转化为知识体系</p>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索卡片、分类或视频..."
          className="w-full h-12 bg-white border border-gray-100 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* ===== 收藏夹 Section ===== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" /> 我的收藏夹
          </h2>
          <span className="text-xs text-gray-400 font-medium">{FAVORITES.length} 个合集</span>
        </div>

        <div className="flex flex-col gap-4">
          {FAVORITES.map((fav, index) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(fav.route)}
              className="relative rounded-3xl overflow-hidden shadow-sm cursor-pointer"
            >
              {/* Background image */}
              <div className="relative h-44 overflow-hidden">
                <img src={fav.coverUrl} alt={fav.name} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-br ${fav.gradient} opacity-75`} />

                {/* Completed badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500 px-2.5 py-1 rounded-full shadow">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-black text-white">全部完成</span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{fav.emoji}</span>
                    <div className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <span className="text-xs font-bold text-white">{fav.cardCount} 张卡片</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-1">{fav.name}</h3>
                    <p className="text-xs text-white/80 mb-3">{fav.desc}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {fav.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-white/90 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer stats strip */}
              <div className="bg-white px-5 py-3 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Dumbbell className="w-3.5 h-3.5 text-orange-500" />
                    <span className="font-medium">4 实践卡</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-medium">2 知识卡</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
                  查看详情 <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Video Horizontal Scroll */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">未分类收藏</h2>
          <span className="text-sm text-gray-400">去整理</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          {videos.filter(v => !v.video_id.startsWith('r')).map(video => (
            <motion.div
              whileTap={{ scale: 0.95 }}
              key={video.video_id}
              onClick={() => navigate(`/cover/${video.video_id}`)}
              className="w-48 flex-shrink-0 snap-start bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col gap-3"
            >
              <div className="w-full h-28 rounded-2xl overflow-hidden relative">
                <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-md">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">
                {video.title}
              </h3>
              <div className="text-[10px] text-gray-400 font-medium bg-gray-50 py-1 px-2 rounded-lg self-start">
                来自抖音收藏
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5 text-indigo-500" /> 知识分类
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
              key={category.id}
              onClick={() => navigate(`/category/${category.name}`)}
              className="relative h-40 rounded-3xl overflow-hidden shadow-sm group cursor-pointer border border-gray-100"
            >
              <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${category.bg} opacity-80 mix-blend-multiply`} />
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold tracking-tight mb-1">{category.name}</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium opacity-90 backdrop-blur-md bg-white/20 w-fit px-2 py-1 rounded-full">
                  <BookOpen className="w-3 h-3" />
                  {category.count} 张卡片
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}