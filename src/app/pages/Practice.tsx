import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../store';
import { ArrowLeft, Check, CheckCircle2, ChevronDown, ListTodo, Save, GitBranch } from 'lucide-react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { KnowledgeMap } from '../components/KnowledgeMap';

export function PracticeCard() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { videos, cards, updateStepCompleted, addActionLog } = useAppContext();
  
  const video = videos.find(v => v.video_id === videoId);
  const card = video ? cards[video.video_id] : null;

  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [startTime] = useState(Date.now());
  const [showMap, setShowMap] = useState(false);

  if (!video || !card || card.content.type !== 'practice') {
    return <div className="flex justify-center items-center h-full">无效的内容类型</div>;
  }

  const steps = card.content.steps;
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const allCompleted = completedCount === steps.length;

  useEffect(() => {
    if (allCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [allCompleted]);

  const toggleComplete = (stepNo: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = steps.find(s => s.step_no === stepNo)?.completed || false;
    updateStepCompleted(video.video_id, stepNo, !current);
  };

  const handleFinish = () => {
    const durationMin = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    addActionLog({
      video_id: video.video_id,
      card_title: card.cover.cover_title,
      action_type: '完成实践',
      duration_min: durationMin,
      completed_steps: completedCount
    });
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-safe relative flex-1">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex flex-col pt-14 sm:pt-16">
        <div className="flex items-center justify-between mb-3 mt-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-bold text-gray-900 line-clamp-1 flex-1 text-center px-4">
            {card.cover.cover_title}
          </div>
          <button
            onClick={() => setShowMap(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="打开知识卡片爆炸图"
          >
            <GitBranch className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1.5 border border-gray-100">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ml-2 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full"
            />
          </div>
          <span className="text-xs font-bold text-gray-500 mr-2 tabular-nums">
            {completedCount}/{steps.length}
          </span>
        </div>
      </header>

      {/* Main content - Steps List */}
      <main className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        {steps.map((step) => {
          const isExpanded = expandedStep === step.step_no;
          
          return (
            <motion.div 
              layout
              key={step.step_no}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${step.completed ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              {/* Step Header */}
              <div 
                className="p-5 flex gap-4 items-start cursor-pointer"
                onClick={() => setExpandedStep(isExpanded ? null : step.step_no)}
              >
                {/* Custom Checkbox */}
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => toggleComplete(step.step_no, e)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 transition-colors ${
                    step.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <AnimatePresence>
                    {step.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                {/* Title */}
                <div className="flex-1">
                  <h3 className={`font-bold text-[17px] mb-1 leading-tight transition-colors ${
                    step.completed ? 'text-indigo-900 line-through opacity-60' : 'text-gray-900'
                  }`}>
                    {step.step_no}. {step.title}
                  </h3>
                  {!isExpanded && (
                    <p className={`text-sm line-clamp-1 ${step.completed ? 'text-indigo-400 opacity-60' : 'text-gray-500'}`}>
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Chevron */}
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-gray-400 mt-1">
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Step Body (Expanded) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 pl-16">
                      {(step.image_urls?.length || step.image_url) && (
                        <div className="mb-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(step.image_urls || [step.image_url || '']).filter(Boolean).map((img, imgIdx) => (
                              <img
                                key={`${step.step_no}-${imgIdx}`}
                                src={img}
                                alt={`${step.title} 示例图 ${imgIdx + 1}`}
                                className="w-full rounded-xl border border-gray-100 object-cover"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-2xl mb-3 border border-gray-100">
                        {step.description}
                      </p>
                      
                      <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100/50">
                        <div className="w-1 h-auto bg-amber-400 rounded-full" />
                        <div>
                          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">💡 小贴士</p>
                          <p className="text-xs text-amber-900/80 leading-relaxed">{step.tips}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </main>

      {/* Footer sticky bar */}
      <AnimatePresence>
        {allCompleted && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-8 sm:bottom-10 left-6 right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFinish}
              className="w-full bg-gray-900 text-white font-bold h-14 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              打卡完成，保存记录
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <KnowledgeMap
        visible={showMap}
        onClose={() => setShowMap(false)}
        videos={videos}
        currentVideoId={video.video_id}
        onNavigate={(vid) => {
          setShowMap(false);
          navigate(`/cover/${vid}`);
        }}
      />
    </div>
  );
}
