import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryFilter } from "./CategoryFilter";
import { Lightbox } from "./Lightbox";
import { portfolioImages, type Category, type PortfolioImage } from "@/data/portfolioData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export function ImageGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return portfolioImages;
    return portfolioImages.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Reset carousel when category changes
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
      setCurrent(0);
    }
  }, [activeCategory, api]);

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

        {/* Carousel */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative px-12"
        >
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "center",
            }}
            className="w-full"
          >
            {/* Navigation Arrows */}
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredImages.map((image, index) => (
                <CarouselItem
                  key={image.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-4/5 lg:basis-3/5"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative cursor-pointer overflow-hidden rounded-xl aspect-[4/3]"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
                          {image.category}
                        </p>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <p className="text-center text-muted-foreground text-sm mt-4">
            {current + 1} / {count}
          </p>
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
