export type ArticleCoverAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  srcSet?: string;
};

// Editorial illustrations, not photographs of HIM STANDART premises or documents.
export const articleCovers: Record<string, ArticleCoverAsset> = {
  specification: {
    src: "/assets/articles/specification-cover-v1.webp",
    srcSet: "/assets/articles/specification-cover-v1-640.webp 640w, /assets/articles/specification-cover-v1-960.webp 960w, /assets/articles/specification-cover-v1.webp 1280w",
    width: 1280,
    height: 640,
    alt: "Тематическая иллюстрация: лабораторный стол со списком закупки и образцами реактивов",
  },
  "purity-and-packaging": {
    src: "/assets/articles/purity-and-packaging-cover-v1.webp",
    srcSet: "/assets/articles/purity-and-packaging-cover-v1-640.webp 640w, /assets/articles/purity-and-packaging-cover-v1-960.webp 960w, /assets/articles/purity-and-packaging-cover-v1.webp 1280w",
    width: 1280,
    height: 640,
    alt: "Тематическая иллюстрация: лабораторные флаконы и кристаллы для сравнения фасовки",
  },
  "coa-and-sds": {
    src: "/assets/articles/coa-and-sds-cover-v1.webp",
    srcSet: "/assets/articles/coa-and-sds-cover-v1-640.webp 640w, /assets/articles/coa-and-sds-cover-v1-960.webp 960w, /assets/articles/coa-and-sds-cover-v1.webp 1280w",
    width: 1280,
    height: 640,
    alt: "Тематическая иллюстрация: лабораторная документация рядом с образцами реактивов",
  },
  "water-analysis": {
    src: "/assets/articles/water-analysis-cover-v1.webp",
    srcSet: "/assets/articles/water-analysis-cover-v1-640.webp 640w, /assets/articles/water-analysis-cover-v1-960.webp 960w, /assets/articles/water-analysis-cover-v1.webp 1280w",
    width: 1280,
    height: 640,
    alt: "Тематическая иллюстрация: образцы воды в лабораторной посуде",
  },
  "agro-laboratory": {
    src: "/assets/articles/agro-laboratory-cover-v1.webp",
    srcSet: "/assets/articles/agro-laboratory-cover-v1-640.webp 640w, /assets/articles/agro-laboratory-cover-v1-960.webp 960w, /assets/articles/agro-laboratory-cover-v1.webp 1280w",
    width: 1280,
    height: 640,
    alt: "Тематическая иллюстрация: образец почвы и лабораторная посуда для анализа",
  },
  "buffer-selection": {
    src: "/assets/articles/buffer-selection-cover-v1.webp",
    srcSet: "/assets/articles/buffer-selection-cover-v1-640.webp 640w, /assets/articles/buffer-selection-cover-v1-960.webp 960w, /assets/articles/buffer-selection-cover-v1.webp 1280w",
    width: 1280,
    height: 640,
    alt: "Тематическая иллюстрация: лабораторные растворы для работы с буферными системами",
  },
};

export function getArticleCover(slug: string) {
  return articleCovers[slug] || articleCovers.specification;
}
