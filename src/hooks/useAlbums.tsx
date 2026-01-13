import { useQuery, useMutation } from '@tanstack/react-query';
import { albums, getAlbumImages } from '@/data/albumsData';
import type { Album, AlbumImage } from '@/data/albumsData';

export type { Album, AlbumImage };

export function useAlbums() {
  const albumsQuery = useQuery({
    queryKey: ['albums-static'],
    queryFn: async () => {
      return albums;
    },
  });

  const createAlbum = useMutation({
    mutationFn: async () => {
      throw new Error('Albums are read-only in this portfolio build.');
    },
  });

  const updateAlbum = useMutation({
    mutationFn: async () => {
      throw new Error('Albums are read-only in this portfolio build.');
    },
  });

  const deleteAlbum = useMutation({
    mutationFn: async () => {
      throw new Error('Albums are read-only in this portfolio build.');
    },
  });

  return {
    albums: albumsQuery.data ?? [],
    isLoading: albumsQuery.isLoading,
    error: albumsQuery.error,
    createAlbum,
    updateAlbum,
    deleteAlbum,
  };
}

export function useAlbumImages(albumId: string | null) {
  const imagesQuery = useQuery({
    queryKey: ['album-images-static', albumId],
    queryFn: async () => {
      if (!albumId) return [];
      return getAlbumImages(albumId);
    },
    enabled: !!albumId,
  });

  const addImage = useMutation({
    mutationFn: async ({
      album_id,
      image_src,
      image_title,
      image_category,
    }: {
      album_id: string;
      image_src: string;
      image_title: string;
      image_category: string;
    }) => {
      throw new Error('Album images are read-only in this portfolio build.');
    },
  });

  const removeImage = useMutation({
    mutationFn: async (id: string) => {
      throw new Error('Album images are read-only in this portfolio build.');
    },
  });

  return {
    images: imagesQuery.data ?? [],
    isLoading: imagesQuery.isLoading,
    error: imagesQuery.error,
    addImage,
    removeImage,
  };
}
