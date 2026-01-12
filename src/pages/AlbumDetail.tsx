import { useId, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAlbums, useAlbumImages } from '@/hooks/useAlbums';
import { portfolioImages } from '@/data/portfolioData';
import { useToast } from '@/hooks/use-toast';

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { albums, updateAlbum, isLoading: albumsLoading } = useAlbums();
  const { images, isLoading, addImage, removeImage } = useAlbumImages(id ?? null);
  const { toast } = useToast();
  const uploadInputId = useId();

  const [showAddModal, setShowAddModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const album = albums.find((a) => a.id === id);

  const handleAddImage = async (image: { src: string; title: string; category: string }) => {
    if (!id) return;

    try {
      await addImage.mutateAsync({
        album_id: id,
        image_src: image.src,
        image_title: image.title,
        image_category: image.category,
      });

      // Set as cover if first image
      if (images.length === 0 && album) {
        await updateAlbum.mutateAsync({ id: album.id, cover_image: image.src });
      }

      toast({
        title: 'Image added',
        description: `"${image.title}" has been added to the album.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      await removeImage.mutateAsync(imageId);
      toast({
        title: 'Image removed',
        description: 'The image has been removed from the album.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadFiles = Array.from(files);
      const dataUrls = await Promise.all(uploadFiles.map((file) => readFileAsDataUrl(file)));
      for (let index = 0; index < uploadFiles.length; index += 1) {
        const file = uploadFiles[index];
        const dataUrl = dataUrls[index];
        await handleAddImage({
          src: dataUrl,
          title: file.name,
          category: 'Uploaded',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message ?? 'Unable to upload image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const addedImageSrcs = new Set(images.map((img) => img.image_src));

  if (!albumsLoading && !album) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-20 px-6 text-center">
          <p className="text-muted-foreground">Album not found.</p>
          <Link
            to="/albums"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Albums
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/albums"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Albums
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  {album?.name ?? 'Loading...'}
                </h1>
                {album?.description && (
                  <p className="mt-2 text-muted-foreground">{album.description}</p>
                )}
              </div>

              {user ? (
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Images
                </Button>
              ) : null}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg mb-6">
                {user ? 'This album is empty. Add some images to get started!' : 'This album is empty.'}
              </p>
              {user ? (
                <Button onClick={() => setShowAddModal(true)} size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Add Images
                </Button>
              ) : null}
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.image_src}
                    alt={image.image_title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium text-foreground truncate">
                      {image.image_title}
                    </p>
                  </div>
                  {user ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(image.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive/80"
                      aria-label="Remove from album"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Add Images Modal */}
      <AnimatePresence>
        {showAddModal && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[80vh] p-6 bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Add Images to Album
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Upload from your computer</p>
                    <p className="text-xs text-muted-foreground">Images stay in this album unless you delete them.</p>
                  </div>
                  <input
                    id={uploadInputId}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={isUploading}
                    onChange={(event) => {
                      void handleUploadFiles(event.target.files);
                      event.currentTarget.value = '';
                    }}
                  />
                  <Button asChild variant="outline" className="gap-2" disabled={isUploading}>
                    <label htmlFor={uploadInputId} className="cursor-pointer">
                      <Plus className="w-4 h-4" />
                      {isUploading ? 'Uploading...' : 'Add Images'}
                    </label>
                  </Button>
                </div>

                <div className="overflow-y-auto max-h-[60vh] pr-2">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {portfolioImages.map((image) => {
                    const isAdded = addedImageSrcs.has(image.src);
                    return (
                      <button
                        key={image.id}
                        onClick={() => !isAdded && handleAddImage(image)}
                        disabled={isAdded || addImage.isPending}
                        className={`group relative aspect-square rounded-lg overflow-hidden ${
                          isAdded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:ring-2 hover:ring-primary'
                        }`}
                      >
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        {isAdded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                            <Check className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/80 to-transparent">
                          <p className="text-xs text-foreground truncate">{image.title}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images[currentImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentImageIndex].image_src}
                alt={images[currentImageIndex].image_title}
                className="w-full h-full object-contain rounded-lg"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent rounded-b-lg">
                <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
                  {images[currentImageIndex].image_category}
                </p>
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  {images[currentImageIndex].image_title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default AlbumDetail;
