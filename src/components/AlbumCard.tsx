import { motion } from 'framer-motion';
import { Folder, Trash2, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Album, useAlbums } from '@/hooks/useAlbums';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AlbumCardProps {
  album: Album;
  index: number;
}

export function AlbumCard({ album, index }: AlbumCardProps) {
  const { deleteAlbum } = useAlbums();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${album.name}"?`)) return;

    try {
      await deleteAlbum.mutateAsync(album.id);
      toast({
        title: 'Album deleted',
        description: `"${album.name}" has been removed.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

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
          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Image className="w-3.5 h-3.5" />
              View images
            </span>
            {user ? (
              <button
                onClick={handleDelete}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Delete album"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
