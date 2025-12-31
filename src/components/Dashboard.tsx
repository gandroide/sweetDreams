import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, Mic, Video, Music, Sparkles } from 'lucide-react';
import MediaPlayer from './MediaPlayer'; // <--- IMPORTANTE: Importamos el reproductor

interface DashboardProps {
  user: 'Joha' | 'Princesa';
  onBack: () => void;
}

// Definimos el tipo de dato para que TypeScript no se queje
interface ContentItem {
  type: 'audio' | 'video' | 'music';
  title: string;
  subtitle: string;
  icon: React.ElementType; // Tipo para los iconos de Lucide
  time: string;
  src: string; // URL del archivo multimedia
}

const Dashboard = ({ user, onBack }: DashboardProps) => {
  const isJoha = user === 'Joha';
  const themeColor = isJoha ? 'text-blue-300' : 'text-pink-300';
  const accentColor = isJoha ? 'bg-blue-500/20 text-blue-200' : 'bg-pink-500/20 text-pink-200';
  const glowColor = isJoha ? 'shadow-blue-500/20' : 'shadow-pink-500/20';

  // --- LÓGICA DE FADE-IN DE LA PÁGINA ---
  const [isVisible, setIsVisible] = useState(false);
  
  // --- ESTADO DEL REPRODUCTOR (NUEVO) ---
  // Si es null, el reproductor está cerrado. Si tiene un objeto, se abre.
  const [selectedMedia, setSelectedMedia] = useState<ContentItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // --- DATOS CON URLS DE EJEMPLO (SRC) ---
  // He añadido 'src' con enlaces de prueba públicos para que veas que funciona el player
  const content: ContentItem[] = isJoha ? [
    { 
      type: 'audio', 
      title: 'Nuestra Historia', 
      subtitle: 'Grabado por Ale', 
      icon: Mic, 
      time: '5 min',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Audio demo
    },
    { 
      type: 'audio', 
      title: 'Para que descanses', 
      subtitle: 'Meditación guiada', 
      icon: Music, 
      time: '15 min',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' 
    },
    { 
      type: 'audio', 
      title: 'Poema de noche', 
      subtitle: 'Voz suave', 
      icon: Mic, 
      time: '3 min',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
  ] : [
    { 
      type: 'video', 
      title: 'Cuento de la Luna', 
      subtitle: 'Video relajante', 
      icon: Video, 
      time: '10 min',
      src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' // Video demo
    },
    { 
      type: 'music', 
      title: 'Estrellita donde estás', 
      subtitle: 'Canción de cuna', 
      icon: Music, 
      time: '4 min',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    },
    { 
      type: 'video', 
      title: 'Ovejas saltando', 
      subtitle: 'Animación suave', 
      icon: Video, 
      time: '20 min',
      src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
    },
  ];

  return (
    <div className={`min-h-screen w-full bg-[#020617] text-white font-sans overflow-hidden relative transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* --- FONDO DE ESTRELLAS SUTIL --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-10 left-10 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
         <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-700" />
         <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-1000" />
         <div className={`absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 ${isJoha ? 'bg-blue-900' : 'bg-pink-900'}`} />
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        
        {/* Botón Volver */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 w-fit group"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs tracking-[0.2em] uppercase">Regresar</span>
        </button>

        {/* Encabezado */}
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

        {/* Lista de Contenidos */}
        <div className="space-y-4 pb-20 overflow-y-auto pr-2 custom-scrollbar">
          
          {content.map((item, index) => (
            <div 
              key={index}
              onClick={() => setSelectedMedia(item)} // <--- CLICK PARA ABRIR REPRODUCTOR
              className={`group relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-4 
                         hover:bg-white/10 transition-all duration-300 cursor-pointer flex items-center gap-5
                         backdrop-blur-sm shadow-lg ${glowColor} hover:shadow-xl hover:scale-[1.01]`}
            >
              <div className={`w-12 h-12 rounded-full ${accentColor} flex items-center justify-center shrink-0 shadow-inner`}>
                <item.icon size={20} className="fill-current opacity-80" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-medium text-white/90 font-serif tracking-wide group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
                  {item.subtitle}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                 <span className="text-xs text-white/60">{item.time}</span>
                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    <Play size={10} className="ml-0.5 fill-white text-white" />
                 </div>
              </div>
            </div>
          ))}

          <div className="mt-8 p-6 text-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
             <p className="text-white/30 text-sm font-light italic">
               "Pronto añadiré más historias mágicas para ti..." <br/>
               <span className="text-xs not-italic opacity-50 mt-2 block">— Ale</span>
             </p>
          </div>

        </div>
      </div>

      {/* --- REPRODUCTOR OVERLAY (SE MUESTRA SI HAY ALGO SELECCIONADO) --- */}
      {selectedMedia && (
        <MediaPlayer 
          item={selectedMedia} 
          onClose={() => setSelectedMedia(null)} 
        />
      )}

    </div>
  );
};

export default Dashboard;