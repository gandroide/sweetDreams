import { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Ear } from 'lucide-react';

interface MediaItem {
  type: 'audio' | 'video' | 'music';
  title: string;
  subtitle: string;
  src: string;
}

interface MediaPlayerProps {
  item: MediaItem;
  onClose: () => void;
  initialEarMode?: boolean;
}

const MediaPlayer = ({ item, onClose, initialEarMode = false }: MediaPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Iniciamos el estado con la preferencia del usuario
  const [isEarMode, setIsEarMode] = useState(initialEarMode);
  const [lastTap, setLastTap] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = item.type === 'video';
  const mediaRef = isVideo ? videoRef : audioRef;

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      const current = mediaRef.current.currentTime;
      const total = mediaRef.current.duration;
      if (total) setProgress((current / total) * 100);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        togglePlay();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // --- LÓGICA DE DOBLE TOQUE (MODIFICADA) ---
  const handleEarModeClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; 
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // 1. Salimos del modo oído
      setIsEarMode(false);
      
      // 2. PAUSAMOS EL AUDIO AUTOMÁTICAMENTE
      if (mediaRef.current) {
        mediaRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setLastTap(now);
    }
  };

  return (
    <>
      {/* MODO OÍDO (PANTALLA NEGRA) */}
      {isEarMode && (
        <div 
          onClick={handleEarModeClick}
          className="fixed inset-0 z-[100] bg-black cursor-pointer flex items-center justify-center select-none touch-manipulation"
        >
          <div className="text-white/20 text-sm font-sans tracking-widest animate-pulse pointer-events-none text-center px-4">
            <Ear size={48} className="mx-auto mb-4 opacity-50" />
            <p>MODO OÍDO ACTIVO</p>
            <p className="text-xs mt-2 opacity-50">Doble toque para desbloquear y pausar</p>
          </div>
        </div>
      )}

      {/* REPRODUCTOR NORMAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-500 animate-in fade-in">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white p-2 z-50">
          <X size={32} />
        </button>

        <div className="w-full max-w-lg bg-[#1a1a2e] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
          
          <div className="h-64 relative bg-gradient-to-b from-indigo-900/40 to-[#1a1a2e] flex items-center justify-center overflow-hidden">
            {isVideo ? (
              <video 
                ref={videoRef} src={item.src} className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} playsInline
              />
            ) : (
              <div className="relative z-10">
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-xl transition-all duration-1000 ${isPlaying ? 'scale-150 opacity-50' : 'scale-100 opacity-20'}`} />
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-pink-500/20 rounded-full blur-lg transition-all duration-700 ${isPlaying ? 'scale-125 opacity-60' : 'scale-100 opacity-30'}`} />
                 <Volume2 size={48} className="text-white/80 relative z-20" />
              </div>
            )}
            {!isVideo && <audio ref={audioRef} src={item.src} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />}
          </div>

          <div className="p-8 pt-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif italic text-white mb-1">{item.title}</h3>
              <p className="text-sm text-white/40 uppercase tracking-widest">{item.subtitle}</p>
            </div>

            <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-pink-400 transition-all duration-300 ease-linear" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex items-center justify-center gap-6">
              <button className="text-white/30 hover:text-white transition-colors"><SkipBack size={24} /></button>
              <button onClick={togglePlay} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
              </button>
              <button className="text-white/30 hover:text-white transition-colors"><SkipForward size={24} /></button>
            </div>

            <div className="mt-8 flex justify-center">
              <button onClick={() => setIsEarMode(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/50 uppercase tracking-widest">
                <Ear size={14} />
                <span>Modo Oído</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaPlayer;