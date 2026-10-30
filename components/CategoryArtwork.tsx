const categoryArtwork = {
  solvents: {
    filename: "solvents-editorial-v1",
    alt: "Стеклянная посуда с бесцветной жидкостью, иллюстрация раздела растворителей",
  },
  salts: {
    filename: "salts-editorial-v1",
    alt: "Отдельные чашки с белыми и бледно-голубыми кристаллами, иллюстрация раздела солей",
  },
  "acids-bases": {
    filename: "acids-bases-editorial-v1",
    alt: "Раздельная лабораторная посуда с порошком, гранулами и бесцветной жидкостью, иллюстрация раздела кислот и щелочей",
  },
} as const;

export default function CategoryArtwork({ categoryId }: { categoryId: string }) {
  const artwork = categoryArtwork[categoryId as keyof typeof categoryArtwork];
  if (!artwork) return null;
  const base = `/assets/categories/${artwork.filename}`;
  return <div className="category-artwork"><img
    src={`${base}-768.webp`}
    srcSet={`${base}-480.webp 480w, ${base}-768.webp 768w`}
    sizes="(max-width: 520px) calc(100vw - 32px), (max-width: 800px) calc((100vw - 88px) / 3), (max-width: 1400px) calc((100vw - 160px) / 3), 405px"
    width={768}
    height={480}
    loading="lazy"
    decoding="async"
    alt={artwork.alt}
  /></div>;
}
