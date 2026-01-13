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
  image_thumb: string;
  image_title: string;
  image_category: string;
  display_order: number;
  created_at: string;
}

interface AlbumWithImages extends Album {
  images: AlbumImage[];
}

const EPOCH = new Date(0).toISOString();

const toTitle = (value: string) =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const imageModules = import.meta.glob('@/assets/albums/**/*.{jpg,jpeg,png,webp,avif,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const thumbModules = import.meta.glob('@/assets/albums/**/thumbs/**/*.{jpg,jpeg,png,webp,avif,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const albumsById = new Map<string, AlbumWithImages>();
const thumbsByKey = new Map<string, string>();

Object.entries(thumbModules).forEach(([path, url]) => {
  const match = path.match(/\/albums\/([^/]+)\/thumbs\/(.+)$/);
  if (!match) return;
  thumbsByKey.set(`${match[1]}::${match[2]}`, url as string);
});

Object.entries(imageModules).forEach(([path, url]) => {
  if (path.includes("/thumbs/")) return;
  const match = path.match(/\/albums\/([^/]+)\/(.+)$/);
  if (!match) return;

  const albumId = match[1];
  const filename = match[2];
  const albumName = toTitle(albumId);
  const imageTitle = toTitle(filename.replace(/\.[^/.]+$/, ''));
  const thumbKey = `${albumId}::${filename}`;
  const imageThumb = thumbsByKey.get(thumbKey) ?? (url as string);

  const album = albumsById.get(albumId) ?? {
    id: albumId,
    user_id: 'public',
    name: albumName,
    description: null,
    cover_image: null,
    created_at: EPOCH,
    updated_at: EPOCH,
    images: [],
  };

  album.images.push({
    id: `${albumId}-${filename}`,
    album_id: albumId,
    image_src: url as string,
    image_thumb: imageThumb,
    image_title: imageTitle || albumName,
    image_category: albumName,
    display_order: album.images.length,
    created_at: EPOCH,
  });

  albumsById.set(albumId, album);
});

const finalizedAlbums = Array.from(albumsById.values())
  .filter((album) => album.images.length > 0)
  .map((album) => ({
    ...album,
    cover_image: album.images[0]?.image_thumb ?? null,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const albums: Album[] = finalizedAlbums;

export const getAlbumImages = (albumId: string): AlbumImage[] => {
  const album = albumsById.get(albumId);
  if (!album) return [];
  return [...album.images].sort((a, b) => a.display_order - b.display_order);
};
