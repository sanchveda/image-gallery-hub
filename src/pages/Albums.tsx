import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, LogIn, LogOut } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { AlbumCard } from '@/components/AlbumCard';
import { AuthModal } from '@/components/AuthModal';
import { CreateAlbumModal } from '@/components/CreateAlbumModal';
import { useAuth } from '@/hooks/useAuth';
import { useAlbums } from '@/hooks/useAlbums';

const Albums = () => {
  const { user, loading, signOut } = useAuth();
  const { albums, isLoading } = useAlbums();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12"
          >
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Albums
              </h1>
              <p className="mt-2 text-muted-foreground">
                {user ? 'Organize your images into custom collections' : 'Sign in to create and manage your albums'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {loading ? null : user ? (
                <>
                  <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Album
                  </Button>
                  <Button variant="outline" onClick={() => signOut()} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowAuthModal(true)} className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>

          {!user ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg mb-6">
                Sign in to start creating your own albums
              </p>
              <Button onClick={() => setShowAuthModal(true)} size="lg" className="gap-2">
                <LogIn className="w-5 h-5" />
                Get Started
              </Button>
            </motion.div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : albums.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg mb-6">
                You haven't created any albums yet
              </p>
              <Button onClick={() => setShowCreateModal(true)} size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create Your First Album
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, index) => (
                <AlbumCard key={album.id} album={album} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <CreateAlbumModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </main>
  );
};

export default Albums;
