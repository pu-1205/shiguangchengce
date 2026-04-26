import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext } from '../store';
import { ArrowLeft, Sparkles, Clock, Compass, ChevronRight, Zap, Award, BookOpen, X, CheckCircle2, Circle, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { KnowledgeMap } from '../components/KnowledgeMap';

export function CoverCard() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { videos, cards } = useAppContext();
  const [showContent, setShowContent] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const video = videos.find(v => v.video_id === videoId);
  const card = video ? cards[video.video_id] : null;

  if (!video || !card) {
    return <div className="flex justify-center items-center h-full">加载中...</div>;
  }

  const handleStart = () => {
    if (video.card_type === 'practice') {
      navigate(`/practice/${videoId}`);
    } else {
      navigate(`/knowledge/${videoId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-black text-white relative h-full flex-1">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover scale-105 filter blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-14 sm:pt-16 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMap(true)}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
          >
            <GitBranch className="w-[18px] h-[18px]" />
          </motion.button>
          <span className="text-xs font-medium text-white/50 border border-white/20 bg-white/5 px-3 py-1 rounded-full">
            来源：{video.author}
          </span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-6 z-10 w-full relative h-full">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="w-full h-full max-h-[80%] flex flex-col"
        >
          <div className="w-full rounded-[40px] bg-white text-gray-900 shadow-2xl overflow-hidden flex flex-col flex-1 border-[6px] border-white/20 relative">

            {/* Upper Section */}
            <div className="relative h-2/5 min-h-[220px]">
              <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white flex items-center gap-1.5 border border-white/10 shadow-lg">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold tracking-wider">AI摘要</span>
              </div>

              {/* Title positioned at bottom of image area */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-2">
                <h1 className="text-2xl font-black text-gray-900 leading-tight mb-3">
                  {card.cover.cover_title}
                </h1>

                <div className="flex gap-2">
                  <span className="flex items-center gap-1 bg-gray-100/80 backdrop-blur text-gray-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {card.cover.duration_read}
                  </span>
                  <span className="flex items-center gap-1 bg-indigo-50/80 backdrop-blur text-indigo-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <Compass className="w-3.5 h-3.5" /> {card.cover.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Lower Section */}
            <div className="p-5 flex-1 flex flex-col justify-start overflow-y-auto no-scrollbar bg-white pt-4">
              {!showContent ? (
                <>
                  <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 flex items-center gap-2">
                    核心观点 <div className="h-px bg-gray-100 flex-1 ml-2" />
                  </h2>

                  <div className="space-y-4">
                    {card.cover.key_points.map((point, i) => (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        key={i}
                        className="flex gap-4 items-start group"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 font-black text-sm flex items-center justify-center flex-shrink-0 shadow-inner group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                          {i + 1}
                        </div>
                        <p className="text-[15px] font-medium text-gray-700 leading-relaxed pt-1 w-full">
                          {point}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-sm font-black text-gray-900">
                        {card.content.type === 'practice' ? '🗂️ 实践步骤内容' : '🧠 知识闪卡内容'}
                      </h2>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {card.content.type === 'practice'
                          ? `共 ${card.content.steps.length} 个步骤 · ${card.content.total_time}`
                          : `共 ${card.content.flash_cards.length} 张卡片`}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowContent(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {card.content.type === 'practice' ? (
                    <div className="flex flex-col gap-2.5">
                      {card.content.steps.map((step, i) => (
                        <motion.div
                          key={step.step_no}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-2xl p-3 border bg-gray-50 border-gray-100"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-black bg-white border-2 border-gray-200 text-gray-400">
                              {step.step_no}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[13px] font-black text-gray-900 mb-1">{step.title}</h3>
                              <p className="text-xs text-gray-600 leading-relaxed mb-2">{step.description}</p>
                              {(step.image_urls?.length || step.image_url) && (
                                <div className="mb-2">
                                  <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x pb-1">
                                    {(step.image_urls || [step.image_url || '']).filter(Boolean).map((img, idx) => (
                                      <img
                                        key={`${step.step_no}-img-${idx}`}
                                        src={img}
                                        alt={`${step.title} 示例图 ${idx + 1}`}
                                        className="w-[72%] max-w-[220px] flex-shrink-0 snap-start rounded-xl border border-gray-100 object-cover aspect-video bg-gray-100"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="flex items-start gap-1.5 bg-amber-50 rounded-xl px-2.5 py-2">
                                <span className="text-amber-500 text-[11px] mt-0.5">💡</span>
                                <p className="text-[11px] text-amber-700 leading-relaxed">{step.tips}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {card.content.flash_cards.map((fc, i) => (
                        <motion.div
                          key={fc.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-2xl p-3 border bg-gray-50 border-gray-100"
                        >
                          <p className="text-[13px] font-black text-gray-900 mb-2 leading-snug">Q: {fc.question}</p>
                          <div className="bg-white rounded-xl px-3 py-2 border border-gray-100">
                            <p className="text-xs text-gray-600 leading-relaxed">A: {fc.answer}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ===== Sticky Bottom Actions — Two Buttons ===== */}
            <div className="px-4 pb-8 sm:pb-10 pt-3 bg-white border-t border-gray-100 shrink-0 flex gap-3">
              {/* 查看内容 */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowContent(prev => !prev)}
                className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-700 bg-gray-100 border border-gray-200"
              >
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{showContent ? '收起内容' : '查看内容'}</span>
              </motion.button>

              {/* 开始实践 / 学习知识 */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className={`flex-[1.6] h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-white shadow-lg
                  ${video.card_type === 'practice'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 shadow-indigo-500/30'}`}
              >
                {video.card_type === 'practice' ? (
                  <><Zap className="w-4 h-4 fill-white" /><span className="text-sm">开始实践</span></>
                ) : (
                  <><Award className="w-4 h-4 fill-white" /><span className="text-sm">学习闪卡</span></>
                )}
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ===== Knowledge Map Overlay ===== */}
      <KnowledgeMap
        visible={showMap}
        onClose={() => setShowMap(false)}
        videos={videos}
        currentVideoId={videoId || ''}
        onNavigate={(vid) => navigate(`/cover/${vid}`)}
      />
    </div>
  );
}