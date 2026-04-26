import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useAppContext } from '../store';
import { ArrowLeft, Check, RefreshCw, Layers, GitBranch } from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { KnowledgeMap } from '../components/KnowledgeMap';

export function KnowledgeCard() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { videos, cards, markCardMastered, addActionLog } = useAppContext();
  
  const video = videos.find(v => v.video_id === videoId);
  const card = video ? cards[video.video_id] : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [startTime] = useState(Date.now());
  const [showMap, setShowMap] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  if (!video || !card || card.content.type !== 'knowledge') {
    return <div className="flex justify-center items-center h-full">无效的内容类型</div>;
  }

  const flashCards = card.content.flash_cards;
  const currentFlashCard = flashCards[currentIndex];
  
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      handleMastered(true);
    } else if (info.offset.x < -100) {
      handleMastered(false);
    }
  };

  const handleMastered = (mastered: boolean) => {
    markCardMastered(video.video_id, currentFlashCard.id, mastered);
    setFlipped(false);
    
    if (currentIndex < flashCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finished all cards
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const durationMin = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      addActionLog({
        video_id: video.video_id,
        card_title: card.cover.cover_title,
        action_type: '学习闪卡',
        duration_min: durationMin
      });
      setTimeout(() => navigate(-1), 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 pb-safe overflow-hidden relative flex-1">
      {/* Background blurred cover */}
      <div className="absolute inset-0 z-0">
        <img src={video.cover_url} alt="bg" className="w-full h-full object-cover opacity-20 filter blur-3xl" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-4 py-3 flex items-center justify-between pt-14 sm:pt-16">
        <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="font-medium text-white/90 truncate flex-1 text-center px-4">
          {card.cover.cover_title}
        </div>
        <button
          onClick={() => setShowMap(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors"
          aria-label="打开知识卡片爆炸图"
        >
          <GitBranch className="w-5 h-5" />
        </button>
      </header>

      {/* Progress Line */}
      <div className="relative z-50 h-1 bg-white/10 w-full mb-8">
        <motion.div 
          className="h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex) / flashCards.length) * 100}%` }}
        />
      </div>

      {/* Card Swipe Area */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-6 w-full max-w-md mx-auto">
        <AnimatePresence>
          {currentIndex < flashCards.length && (
            <motion.div
              key={currentFlashCard.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ x, rotate, opacity, perspective: 1000 }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              onClick={() => setFlipped(!flipped)}
              className="absolute w-[calc(100%-3rem)] aspect-[3/4] max-h-[70vh] cursor-pointer touch-none"
            >
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front Side */}
                <div className="absolute inset-0 bg-white rounded-[32px] p-8 flex flex-col justify-center items-center text-center shadow-2xl border border-gray-100/50 backface-hidden">
                  <div className="absolute top-6 left-6 text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Question {currentIndex + 1}
                  </div>
                  
                  <h2 className="text-3xl font-black text-gray-900 leading-tight mb-8 text-balance">
                    {currentFlashCard.question}
                  </h2>
                  
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-pulse opacity-50">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" /> 点击翻转查看答案
                    </span>
                  </div>
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 bg-indigo-600 rounded-[32px] p-8 flex flex-col justify-center items-center text-center shadow-2xl border border-indigo-400/30 text-white"
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    WebkitBackfaceVisibility: 'hidden', 
                    transform: 'rotateY(180deg)' 
                  }}
                >
                  <div className="absolute top-6 left-6 text-indigo-200 bg-indigo-900/50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Answer
                  </div>
                  
                  <div className="overflow-y-auto no-scrollbar w-full max-h-full py-12">
                    <p className="text-xl font-medium leading-relaxed text-indigo-50 px-2 text-balance">
                      {currentFlashCard.answer}
                    </p>
                  </div>
                  
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-70">
                    <span className="text-[10px] font-bold text-indigo-200 bg-indigo-900/50 px-4 py-2 rounded-full uppercase tracking-wider">
                      左右滑动选择掌握程度
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Swipe Controls */}
      <div className="relative z-50 px-8 pb-12 pt-4 flex justify-between items-center">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => handleMastered(false)}
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-xl"
        >
          <RefreshCw className="w-6 h-6" />
        </motion.button>
        <span className="text-white/50 text-xs font-medium bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
          滑卡记忆法
        </span>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => handleMastered(true)}
          className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 text-white"
        >
          <Check className="w-8 h-8 stroke-[3]" />
        </motion.button>
      </div>

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
