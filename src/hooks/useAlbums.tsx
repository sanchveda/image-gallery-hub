import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Album {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlbumImage {
  id: string;
  album_id: string;
  image_src: string;
  image_title: string;
  image_category: string;
  display_order: number;
  created_at: string;
}

export function useAlbums() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const albumsQuery = useQuery({
    queryKey: ['albums', user?.id ?? 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Album[];
    },
  });

  const createAlbum = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('albums')
        .insert({ name, description, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Album;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  const updateAlbum = useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      cover_image,
    }: {
      id: string;
      name?: string;
      description?: string;
      cover_image?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('albums')
        .update({ name, description, cover_image })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Album;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  const deleteAlbum = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const imagesQuery = useQuery({
    queryKey: ['album-images', albumId, user?.id ?? 'public'],
    queryFn: async () => {
      if (!albumId) return [];
      const { data, error } = await supabase
        .from('album_images')
        .select('*')
        .eq('album_id', albumId)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as AlbumImage[];
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
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('album_images')
        .insert({
          album_id,
          image_src,
          image_title,
          image_category,
          display_order: 0,
        })
        .select()
        .single();
      if (error) throw error;
      return data as AlbumImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['album-images'] });
    },
  });

  const removeImage = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('album_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['album-images'] });
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
