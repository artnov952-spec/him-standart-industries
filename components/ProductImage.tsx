import type { Product } from "@/lib/catalog";
import { productPhotoPresentation } from "@/lib/photo-presentation";

export function getProductPhoto(product: Product) {
  const presentation = productPhotoPresentation[product.image];
  const generic = /не фотография выбранного|иллюстрация физической формы|иллюстрация формы вещества/i.test(product.imageCaption || "");
  return { src: presentation?.src || product.image, alt: generic ? product.imageAlt || product.name : presentation?.alt || product.imageAlt || product.name, caption: generic ? product.imageCaption : presentation?.caption || product.imageCaption, credit: presentation?.credit || product.imageCredit };
}
export default function ProductImage({ product, variant = "card", eager = false }: { product: Product; variant?: "card" | "detail"; eager?: boolean }) {
  const photo = getProductPhoto(product);
  const shortCaption = /не фотография выбранного|иллюстрация физической формы|иллюстрация формы вещества/i.test(photo.caption || "") ? "Иллюстрация формы вещества" : /упаковк|емкости/i.test(photo.caption || "") ? "Пример упаковки" : "Иллюстрация вещества";
  return <div className={`product-media product-media--${variant}`}><div className="product-media-stage"><img src={photo.src} width="1024" height="1024" loading={eager ? "eager" : "lazy"} alt={photo.alt} /></div><span className="product-media-caption">{variant === "card" ? shortCaption : photo.caption || "Иллюстрация реактива"}</span></div>;
}
