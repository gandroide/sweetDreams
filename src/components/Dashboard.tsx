import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, Mic, Video, Music, Sparkles, Loader2, Ear } from 'lucide-react';
import MediaPlayer from './MediaPlayer';
import { supabase } from '../lib/supabaseClient';

interface DashboardProps {
  user: 'Joha' | 'Princesa';
  onBack: () => void;
}

interface ContentItem {
  id: number;
  created_at: string;
  title: string;
  subtitle: string;
  type: 'audio' | 'video' | 'music';
  target_user: string;
  src: string;
  duration: string;
}

const Dashboard = ({ user, onBack }: DashboardProps) => {
  const isJoha = user === 'Joha';
  const themeColor = isJoha ? 'text-blue-300' : 'text-pink-300';
  const accentColor = isJoha ? 'bg-blue-500/20 text-blue-200' : 'bg-pink-500/20 text-pink-200';
  const glowColor = isJoha ? 'shadow-blue-500/20' : 'shadow-pink-500/20';

  const [isVisible, setIsVisible] = useState(false);
  
  // --- ESTADOS DEL PLAYER ---
  const [selectedMedia, setSelectedMedia] = useState<ContentItem | null>(null);
  const [startInEarMode, setStartInEarMode] = useState(false); // <--- Nuevo estado para controlar el modo

  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('target_user', user)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando audios:', error);
      } else {
        setContentList((data as any) || []);
      }
      setLoading(false);
    };

    fetchContent();
  }, [user]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'music': return Music;
      case 'audio': default: return Mic;
    }
  };

  // --- FUNCIONES DE APERTURA ---
  const openNormal = (item: ContentItem) => {
    setStartInEarMode(false);
    setSelectedMedia(item);
  };

  const openEarMode = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation(); // Evita que se active el clic de la tarjeta entera
    setStartInEarMode(true);
    setSelectedMedia(item);
  };

  return (
    <div className={`min-h-screen w-full bg-[#020617] text-white font-sans overflow-hidden relative transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* FONDO */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-10 left-10 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
         <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-700" />
         <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-1000" />
         <div className={`absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 ${isJoha ? 'bg-blue-900' : 'bg-pink-900'}`} />
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        
        {/* Header */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 w-fit group"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs tracking-[0.2em] uppercase">Regresar</span>
        </button>

        <div className="mb-10 pl-2">
          <div className="flex items-center gap-2 mb-2">
             <Sparkles size={14} className={`${isJoha ? 'text-blue-400' : 'text-pink-400'} opacity-70`} />
             <h2 className="text-xs text-white/50 tracking-[0.3em] uppercase">Espacio de Sueño</h2>
          </div>
          <h1 className={`text-4xl md:text-5xl font-serif italic ${themeColor} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
            Dulces Sueños,<br />
            <span className="opacity-90">{user}</span>
          </h1>
        </div>

        {/* Lista */}
        <div className="space-y-4 pb-20 overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
          
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-3">
              <Loader2 className="animate-spin" size={24} />
              <p className="text-xs tracking-widest uppercase">Buscando historias...</p>
            </div>
          )}

          {!loading && contentList.length === 0 && (
            <div className="mt-8 p-6 text-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
              <p className="text-white/30 text-sm font-light italic">
                "Aún no hay historias aquí..." <br/>
                <span className="text-xs not-italic opacity-50 mt-2 block">Pronto llegarán</span>
              </p>
            </div>
          )}

          {!loading && contentList.map((item) => {
            const IconComponent = getIcon(item.type);
            const isAudio = item.type !== 'video'; // Solo mostramos oreja si no es video

            return (
              <div 
                key={item.id}
                onClick={() => openNormal(item)}
                className={`group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-4 
                           hover:bg-white/10 transition-all duration-300 cursor-pointer flex items-center gap-4
                           backdrop-blur-sm shadow-lg ${glowColor} hover:shadow-xl hover:scale-[1.01]`}
              >
                {/* Icono Izquierdo */}
                <div className={`w-12 h-12 rounded-full ${accentColor} flex items-center justify-center shrink-0 shadow-inner`}>
                  <IconComponent size={20} className="fill-current opacity-80" />
                </div>
                
                {/* Título y Subtítulo */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-white/90 font-serif tracking-wide truncate pr-2 group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest mt-1 truncate">
                    {item.subtitle || 'Especial para ti'}
                  </p>
                </div>

                {/* Acciones Derecha (Duración + Botones) */}
                <div className="flex items-center gap-3 shrink-0">
                   {/* Duración */}
                   <span className="text-xs text-white/40 hidden sm:block">{item.duration}</span>

                   {/* BOTÓN OREJA (Solo audio) */}
                   {isAudio && (
                     <button
                        onClick={(e) => openEarMode(e, item)}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10 group/ear"
                        title="Modo Oído (Pantalla apagada)"
                     >
                        <Ear size={18} className="text-white/50 group-hover/ear:text-blue-300 transition-colors" />
                     </button>
                   )}

                   {/* BOTÓN PLAY */}
                   <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white/20 transition-colors">
                      <Play size={14} className="ml-0.5 fill-white text-white" />
                   </div>
                </div>

              </div>
            );
          })}

          {!loading && contentList.length > 0 && (
             <div className="mt-8 p-6 text-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                <p className="text-white/30 text-xs font-light tracking-widest">
                  FIN DE LA LISTA
                </p>
             </div>
          )}

        </div>
      </div>

      {/* REPRODUCTOR */}
      {selectedMedia && (
        <MediaPlayer 
          item={selectedMedia} 
          onClose={() => setSelectedMedia(null)} 
          initialEarMode={startInEarMode} // <--- Pasamos la preferencia al reproductor
        />
      )}

    </div>
  );
};

export default Dashboard;