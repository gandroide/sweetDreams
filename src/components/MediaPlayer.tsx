import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface MediaItem {
  type: 'audio' | 'video' | 'music';
  title: string;
  subtitle: string;
  src: string; // La URL del archivo real
}

interface MediaPlayerProps {
  item: MediaItem;
  onClose: () => void;
}

const MediaPlayer = ({ item, onClose }: MediaPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determinar si es video
  const isVideo = item.type === 'video';
  const mediaRef = isVideo ? videoRef : audioRef;

  // Manejar Play/Pause
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

  // Actualizar barra de progreso
  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      const current = mediaRef.current.currentTime;
      const total = mediaRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  // Auto-play al abrir con efecto suave
  useEffect(() => {
    const timer = setTimeout(() => {
        togglePlay();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Fondo oscuro con blur (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-500 animate-in fade-in">
      
      {/* Botón Cerrar (Absolute top-right) */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white p-2 z-50"
      >
        <X size={32} />
      </button>

      {/* Contenedor del Player */}
      <div className="w-full max-w-lg bg-[#1a1a2e] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
        
        {/* --- VISUALIZADOR --- */}
        <div className="h-64 relative bg-gradient-to-b from-indigo-900/40 to-[#1a1a2e] flex items-center justify-center overflow-hidden">
          
          {isVideo ? (
            // Si es video, mostramos el elemento video
            <video 
              ref={videoRef}
              src={item.src}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              loop={false} // O true si quieres que se repita
            />
          ) : (
            // Si es audio, mostramos una animación visual
            <div className="relative z-10">
               {/* Círculos pulsantes decorativos */}
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-xl transition-all duration-1000 ${isPlaying ? 'scale-150 opacity-50' : 'scale-100 opacity-20'}`} />
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-pink-500/20 rounded-full blur-lg transition-all duration-700 ${isPlaying ? 'scale-125 opacity-60' : 'scale-100 opacity-30'}`} />
               
               {/* Icono Central */}
               <Volume2 size={48} className="text-white/80 relative z-20" />
            </div>
          )}

          {/* Elemento Audio invisible (solo lógica) */}
          {!isVideo && (
            <audio 
                ref={audioRef} 
                src={item.src} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>

        {/* --- CONTROLES --- */}
        <div className="p-8 pt-4">
          
          {/* Info del Track */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif italic text-white mb-1">{item.title}</h3>
            <p className="text-sm text-white/40 uppercase tracking-widest">{item.subtitle}</p>
          </div>

          {/* Barra de Progreso */}
          <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-blue-400 to-pink-400 transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
            />
          </div>

          {/* Botones de Control */}
          <div className="flex items-center justify-center gap-8">
            <button className="text-white/30 hover:text-white transition-colors">
                <SkipBack size={24} />
            </button>
            
            <button 
                onClick={togglePlay}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
                {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
            </button>

            <button className="text-white/30 hover:text-white transition-colors">
                <SkipForward size={24} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;