import React from 'react';
import { motion, type PanInfo } from 'framer-motion';

interface DraggableMoonProps {
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  onMoonMove: (x: number, y: number) => void;
  // NUEVO: Función para avisar que se soltó la luna
  onDragEnd: () => void;
}

const DraggableMoon = ({ constraintsRef, onMoonMove, onDragEnd }: DraggableMoonProps) => {

  const handleDrag = (_: any, info: PanInfo) => {
    if (constraintsRef.current) {
        const rect = constraintsRef.current.getBoundingClientRect();
        const relativeX = info.point.x - rect.left;
        const relativeY = info.point.y - rect.top;
        onMoonMove(relativeX, relativeY);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.2}
      dragMomentum={false}
      onDrag={handleDrag}
      // NUEVO: Conectamos el evento final
      onDragEnd={onDragEnd}
      initial={{ x: "-50%", y: "-50%", left: "50%", top: "50%" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95, cursor: "grabbing" }}
      className="absolute z-50 w-24 h-24 rounded-full bg-yellow-100 cursor-grab
                 shadow-[0_0_60px_rgba(255,255,200,0.8),inset_0_0_20px_rgba(255,220,100,0.5)]
                 flex items-center justify-center border-4 border-yellow-50/30 backdrop-blur-md"
    >
        <div className="w-16 h-16 rounded-full bg-yellow-200/20 absolute top-1 left-2" />
        <div className="w-8 h-8 rounded-full bg-yellow-200/30 absolute bottom-3 right-4" />
    </motion.div>
  );
};

export default DraggableMoon;