'use client';

import { motion } from 'framer-motion';

interface LoadingDiamondProps {
  loading: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20'
};

const innerSizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export function LoadingDiamond({ loading, onClick, className = '', size = 'md' }: LoadingDiamondProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative ${sizeMap[size]} flex items-center justify-center transition-all ${
        loading ? 'cursor-wait' : 'cursor-pointer hover:bg-neutral-100'
      } rounded-xl group ${className}`}
    >
      <div className={`relative ${innerSizeMap[size]}`}>
        {/* The Diamond Shape */}
        <motion.div
          animate={
            loading
              ? { 
                  rotate: [45, 135, 225, 315, 405],
                  scale: [1, 1.2, 1],
                  borderRadius: ["2px", "4px", "2px"]
                }
              : { 
                  rotate: 0,
                  scale: 1,
                  borderRadius: "2px"
                }
          }
          transition={
            loading
              ? { 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }
              : { duration: 0.4, ease: "backOut" }
          }
          className={`absolute inset-0 bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)] ${
            !loading && 'opacity-0 scale-0'
          }`}
          style={{ 
            rotate: 45,
            width: '100%',
            height: '100%'
          }}
        />

        {/* The "X" Icon (Morph target) */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-4 h-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-500 rounded-full rotate-45 transform -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-500 rounded-full -rotate-45 transform -translate-y-1/2" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Subtle background glow when loading */}
      {loading && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-sky-500/10 rounded-xl blur-md"
        />
      )}
    </button>
  );
}
