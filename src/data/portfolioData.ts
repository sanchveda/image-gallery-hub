import landscape1 from "@/assets/landscape-1.jpg";
import landscape2 from "@/assets/landscape-2.jpg";
import urban1 from "@/assets/urban-1.jpg";
import portrait1 from "@/assets/portrait-1.jpg";
import portrait2 from "@/assets/portrait-2.jpg";
import abstract1 from "@/assets/abstract-1.jpg";
import abstract2 from "@/assets/abstract-2.jpg";
import nature1 from "@/assets/nature-1.jpg";
import architecture1 from "@/assets/architecture-1.jpg";

export type Category = "All" | "Landscape" | "Portrait" | "Urban" | "Abstract" | "Nature" | "Architecture";

export interface PortfolioImage {
  id: string;
  src: string;
  title: string;
  category: Exclude<Category, "All">;
  aspectRatio: "landscape" | "portrait" | "square";
}

export const categories: Category[] = [
  "All",
  "Landscape",
  "Portrait",
  "Urban",
  "Abstract",
  "Nature",
  "Architecture",
];

export const portfolioImages: PortfolioImage[] = [
  {
    id: "1",
    src: landscape1,
    title: "Dawn Breaking",
    category: "Landscape",
    aspectRatio: "landscape",
  },
  {
    id: "2",
    src: urban1,
    title: "Night Wanderer",
    category: "Urban",
    aspectRatio: "square",
  },
  {
    id: "3",
    src: portrait1,
    title: "Gentle Bloom",
    category: "Portrait",
    aspectRatio: "portrait",
  },
  {
    id: "4",
    src: abstract1,
    title: "Prismatic Dreams",
    category: "Abstract",
    aspectRatio: "landscape",
  },
  {
    id: "5",
    src: nature1,
    title: "Ocean Patterns",
    category: "Nature",
    aspectRatio: "square",
  },
  {
    id: "6",
    src: architecture1,
    title: "Light & Shadow",
    category: "Architecture",
    aspectRatio: "portrait",
  },
  {
    id: "7",
    src: landscape2,
    title: "Mirror Lake",
    category: "Landscape",
    aspectRatio: "square",
  },
  {
    id: "8",
    src: portrait2,
    title: "Passage of Time",
    category: "Portrait",
    aspectRatio: "portrait",
  },
  {
    id: "9",
    src: abstract2,
    title: "Neon Geometry",
    category: "Abstract",
    aspectRatio: "landscape",
  },
];
