import { motion } from "framer-motion";
import { categories, type Category } from "@/data/portfolioData";

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-wrap justify-center gap-3"
    >
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`category-pill ${
            activeCategory === category
              ? "category-pill-active"
              : "category-pill-inactive"
          }`}
        >
          {category}
        </button>
      ))}
    </motion.div>
  );
}
