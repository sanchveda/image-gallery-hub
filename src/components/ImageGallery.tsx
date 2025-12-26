import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryFilter } from "./CategoryFilter";
import { ImageCard } from "./ImageCard";
import { Lightbox } from "./Lightbox";
import { portfolioImages, type Category, type PortfolioImage } from "@/data/portfolioData";

export function ImageGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return portfolioImages;
    return portfolioImages.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Collection
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse through curated visual stories across various categories
          </p>
        </motion.div>

        <div className="mb-12">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[280px] gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
