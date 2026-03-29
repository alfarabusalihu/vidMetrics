'use client';

import { YoutubeVideo } from '@/types/youtube';
import { VideoCard } from './VideoCard';
import { AnimatePresence, motion } from 'framer-motion';

interface VideoGridProps {
  videos: YoutubeVideo[];
  onVideoClick: (video: YoutubeVideo) => void;
}

export function VideoGrid({ videos, onVideoClick }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pr-2">
      <AnimatePresence mode="popLayout">
        {videos.map((video: YoutubeVideo, idx: number) => (
          <motion.div
            key={video.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            <VideoCard video={video} onClick={onVideoClick} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
