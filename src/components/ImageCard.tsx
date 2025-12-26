import { motion } from "framer-motion";
import type { PortfolioImage } from "@/data/portfolioData";

interface ImageCardProps {
  image: PortfolioImage;
  index: number;
  onClick: () => void;
}

export function ImageCard({ image, index, onClick }: ImageCardProps) {
  const getGridSpan = () => {
    switch (image.aspectRatio) {
      case "landscape":
        return "col-span-2 row-span-1";
      case "portrait":
        return "col-span-1 row-span-2";
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`${getGridSpan()} group relative cursor-pointer overflow-hidden rounded-lg`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-card">
        <img
          src={image.src}
          alt={image.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      {/* Overlay */}
      <div className="image-overlay group-hover:opacity-100">
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
  );
}
