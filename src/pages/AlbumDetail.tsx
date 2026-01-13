import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAlbums, useAlbumImages } from '@/hooks/useAlbums';

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { albums, isLoading: albumsLoading } = useAlbums();
  const { images, isLoading } = useAlbumImages(id ?? null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showActualSize, setShowActualSize] = useState(false);

  const album = albums.find((a) => a.id === id);

  useEffect(() => {
    if (images.length === 0) return;
    if (currentImageIndex >= images.length) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, images.length]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setShowActualSize(false);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1));
      } else if (event.key === 'Escape') {
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length, lightboxOpen]);

  useEffect(() => {
    if (lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (images.length === 0) return;
      if (event.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (event.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length, lightboxOpen]);

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
                This album is empty.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="relative overflow-visible">
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentImageIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/80 text-foreground shadow-sm transition-opacity disabled:opacity-40 md:left-0 md:-translate-x-[120%]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1))}
                  disabled={currentImageIndex >= images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/80 text-foreground shadow-sm transition-opacity disabled:opacity-40 md:right-0 md:translate-x-[120%]"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="relative overflow-hidden rounded-2xl border border-border">
                  <div
                    className="absolute inset-0 scale-105 opacity-25 blur-lg pointer-events-none"
                    style={{
                      backgroundImage: `url(${images[currentImageIndex].image_thumb})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                  <div className="relative z-10 block w-full">
                    <img
                      src={images[currentImageIndex].image_thumb}
                      alt={images[currentImageIndex].image_title}
                      className="relative z-10 w-full h-[65vh] object-contain cursor-zoom-in"
                      onClick={() => openLightbox(currentImageIndex)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border transition-all ${
                      index === currentImageIndex
                        ? 'border-2 border-primary scale-[1.06] shadow-md'
                        : 'border border-border hover:border-primary/60'
                    }`}
                    aria-label={`View ${image.image_title}`}
                  >
                    <img
                      src={image.image_thumb}
                      alt={image.image_title}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images[currentImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            {currentImageIndex > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentImageIndex((prev) => Math.max(prev - 1, 0))}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            ) : null}
            {currentImageIndex < images.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1))}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setShowActualSize((prev) => !prev)}
              className="absolute top-6 left-6 px-3 py-2 rounded-full bg-card/80 text-xs font-medium text-foreground hover:bg-card transition-colors z-10"
            >
              {showActualSize ? 'Fit to screen' : 'View actual size'}
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative w-full h-full ${showActualSize ? 'overflow-auto' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentImageIndex].image_src}
                alt={images[currentImageIndex].image_title}
                className={
                  showActualSize
                    ? 'block mx-auto my-0 max-w-none max-h-none'
                    : 'w-full h-full object-contain'
                }
              />
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default AlbumDetail;
