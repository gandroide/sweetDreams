import { useRef, useState, useEffect } from 'react';
import DraggableMoon from './DraggableMoon';

interface LandingPageProps {
  onSelection: (selected: 'Joha' | 'Princesa') => void;
}

const LandingPage = ({ onSelection }: LandingPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [pendingSelection, setPendingSelection] = useState<'Joha' | 'Princesa' | null>(null);

  const handleUpdateLightPos = (xPix: number, yPix: number) => {
      if (pendingSelection) return;
      if (containerRef.current) {
         const { width, height } = containerRef.current.getBoundingClientRect();
         const xPercent = (xPix / width) * 100;
         const yPercent = (yPix / height) * 100;
         setLightPos({ x: xPercent, y: yPercent });
      }
  }

  const isLeftZone = lightPos.x < 40; 
  const isRightZone = lightPos.x > 60; 

  const handleDragEnd = () => {
    if (isLeftZone) setPendingSelection('Princesa');
    else if (isRightZone) setPendingSelection('Joha');
  };

  useEffect(() => {
    if (pendingSelection) {
      // Temporizador de 3.1s para permitir que la animación de 3s termine suavemente
      const timer = setTimeout(() => {
        onSelection(pendingSelection);
      }, 2100); 
      return () => clearTimeout(timer);
    }
  }, [pendingSelection, onSelection]);

  const focusOnPrincesa = lightPos.x < 45; 
  const focusOnJoha = lightPos.x > 55;     

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-[#020617] font-sans text-white touch-none select-none">
      
      {/* 1. FONDO (Imagen) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
            src="../../public/princessDream.png" 
            alt="Fondo Onírico" 
            // Se desenfoca y aleja suavemente, pero dejamos que el Velo Negro se encargue de oscurecerla visualmente
            className={`w-full h-full object-cover transition-all duration-[3000ms] ease-in-out
                ${pendingSelection ? 'scale-95 blur-xl' : 'scale-100 blur-0 opacity-40'}`}
        />
      </div>

      {/* 2 y 3. SOMBRAS LATERALES */}
      <div className={`absolute inset-0 z-[5] pointer-events-none bg-gradient-to-r from-transparent via-black/40 to-black transition-opacity duration-1000 ease-in-out ${focusOnPrincesa && !pendingSelection ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute inset-0 z-[5] pointer-events-none bg-gradient-to-l from-transparent via-black/40 to-black transition-opacity duration-1000 ease-in-out ${focusOnJoha && !pendingSelection ? 'opacity-100' : 'opacity-0'}`} />

      {/* 4. LINTERNA (La luz del fondo) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-all duration-[3000ms] ease-in-out" // ease-in-out para suavidad
        style={{
            background: `radial-gradient(circle 350px at ${lightPos.x}% ${lightPos.y}%, rgba(255, 230, 150, 0.4) 0%, rgba(100, 100, 255, 0.05) 50%, transparent 70%)`,
            mixBlendMode: 'screen',
            // CAMBIO: Ahora sí la apagamos (opacity 0) progresivamente en 3 segundos
            opacity: pendingSelection ? 0 : 1 
        }}
      />

      {/* 5. TEXTOS */}
      <div className={`absolute top-16 w-full text-center z-20 pointer-events-none px-4 transition-opacity duration-[2000ms] ${pendingSelection ? 'opacity-0' : 'opacity-100'}`}>
         <h1 className="text-4xl md:text-6xl font-serif italic text-white/90 drop-shadow-[0_4px_15px_rgba(255,255,255,0.3)]">
            Buenas Noches
         </h1>
      </div>
      
      <div className={`absolute bottom-24 w-full flex justify-around z-20 pointer-events-none px-4 md:px-20 font-serif tracking-widest transition-opacity duration-[2000ms] ${pendingSelection ? 'opacity-0' : 'opacity-100'}`}>
         <span className={`text-2xl md:text-4xl font-bold transition-all duration-700 ease-in-out transform ${focusOnPrincesa ? 'text-pink-200 opacity-100 scale-110' : 'text-gray-600 opacity-30 scale-90 blur-[2px]'}`}>
            Princesa
         </span>
         <span className={`text-2xl md:text-4xl font-bold transition-all duration-700 ease-in-out transform ${focusOnJoha ? 'text-blue-200 opacity-100 scale-110' : 'text-gray-600 opacity-30 scale-90 blur-[2px]'}`}>
            Joha
         </span>
      </div>

      {/* 6. LUNA (El objeto arrastrable) */}
      {/* CAMBIO: Envolvemos la luna en un div que maneja su desaparición gradual */}
      <div className={`transition-opacity duration-[3000ms] ease-in-out ${pendingSelection ? 'opacity-0' : 'opacity-100'}`}>
        <DraggableMoon constraintsRef={containerRef} onMoonMove={handleUpdateLightPos} onDragEnd={handleDragEnd} />
      </div>

      {/* 7. VELO FINAL (El Telón Negro) */}
      {/* Sube de opacidad lentamente cubriendo cualquier residuo visual */}
      <div className={`absolute inset-0 z-50 pointer-events-none bg-[#020617] transition-opacity duration-[3000ms] ease-in-out ${pendingSelection ? 'opacity-100' : 'opacity-0'}`} />

    </div>
  );
};

export default LandingPage;