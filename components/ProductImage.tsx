import type { Product } from "@/lib/catalog";
import { productPhotoPresentation } from "@/lib/photo-presentation";

export function getProductPhoto(product: Product) {
  const presentation = productPhotoPresentation[product.image];
  const generic = /не фотография выбранного|иллюстрация физической формы|иллюстрация формы вещества/i.test(product.imageCaption || "");
  return { src: presentation?.src || product.image, srcSet: presentation?.srcSet, width: presentation?.width || 1254, height: presentation?.height || 1254, alt: generic ? product.imageAlt || product.name : presentation?.alt || product.imageAlt || product.name, caption: generic ? product.imageCaption : presentation?.caption || product.imageCaption, credit: presentation?.credit || product.imageCredit };
}
export default function ProductImage({ product, variant = "card", eager = false }: { product: Product; variant?: "card" | "detail"; eager?: boolean }) {
  const photo = getProductPhoto(product);
  const shortCaption = /не фотография выбранного|иллюстрация физической формы|иллюстрация формы вещества/i.test(photo.caption || "") ? "Иллюстрация формы вещества" : /упаковк|емкости/i.test(photo.caption || "") ? "Пример упаковки" : "Иллюстрация вещества";
  const sizes = variant === "detail" ? "(max-width: 520px) calc(100vw - 96px), (max-width: 800px) 40vw, 480px" : "(max-width: 520px) calc(100vw - 96px), (max-width: 800px) calc(50vw - 64px), 336px";
  return <div className={`product-media product-media--${variant}`}><div className="product-media-stage"><img src={photo.src} srcSet={photo.srcSet} sizes={sizes} width={photo.width} height={photo.height} loading={eager ? "eager" : "lazy"} decoding="async" alt={photo.alt} /></div><span className="product-media-caption">{variant === "card" ? shortCaption : photo.caption || "Иллюстрация реактива"}</span></div>;
}
