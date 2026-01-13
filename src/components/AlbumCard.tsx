import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Album } from '@/hooks/useAlbums';

interface AlbumCardProps {
  album: Album;
  index: number;
}

export function AlbumCard({ album, index }: AlbumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/albums/${album.id}`}
        className="group block relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
      >
        <div className="aspect-[4/3] relative">
          {album.cover_image ? (
            <img
              src={album.cover_image}
              alt={album.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Folder className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {album.name}
          </h3>
          {album.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {album.description}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between" />
        </div>
      </Link>
    </motion.div>
  );
}
