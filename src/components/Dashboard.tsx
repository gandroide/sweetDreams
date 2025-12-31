import { useEffect, useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';

interface DashboardProps {
  user: 'Joha' | 'Princesa';
  onBack: () => void;
}

const Dashboard = ({ user, onBack }: DashboardProps) => {
  const isJoha = user === 'Joha';
  const themeColor = isJoha ? 'text-blue-300' : 'text-pink-300';
  const bgColor = isJoha ? 'bg-blue-500/20' : 'bg-pink-500/20';

  // --- LÓGICA DE FADE-IN (Entrada Suave) ---
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Al montar el componente, esperamos un instante y activamos la visibilidad
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Aplicamos transition-opacity para que entre suavemente desde el negro
    <div className={`min-h-screen w-full bg-[#020617] text-white font-sans p-6 overflow-y-auto transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Botón Volver */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 mt-4"
      >
        <ArrowLeft size={20} />
        <span className="text-sm tracking-widest uppercase">Volver</span>
      </button>

      {/* Encabezado */}
      <div className="mb-10">
        <h2 className="text-sm text-white/40 tracking-[0.3em] uppercase mb-2">Espacio Personal</h2>
        <h1 className={`text-4xl font-serif italic ${themeColor} drop-shadow-lg`}>
          Hola, {user}
        </h1>
      </div>

      {/* Lista de Audios */}
      <div className="space-y-4">
        <h3 className="text-white/60 text-xs tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
          Sesiones Disponibles
        </h3>

        <div className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center shrink-0`}>
            <Play size={20} className="text-white fill-current ml-1" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-white/90">Meditación Profunda</h4>
            <p className="text-sm text-white/40">15 min • Para dormir mejor</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center shrink-0`}>
             <Play size={20} className="text-white fill-current ml-1" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-white/90">Sonidos de Lluvia</h4>
            <p className="text-sm text-white/40">30 min • Ruido blanco</p>
          </div>
        </div>
        
        <div className="p-8 text-center text-white/20 text-sm border-2 border-dashed border-white/5 rounded-xl mt-8">
           Próximamente más contenido para {user}...
        </div>
      </div>
    </div>
  );
};

export default Dashboard;