import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageGallery } from "@/components/ImageGallery";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div id="gallery">
        <ImageGallery />
      </div>
      <Footer />
    </main>
  );
};

export default Index;
