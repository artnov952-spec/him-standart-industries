import { productSearchMetadata, tagDefinitions } from "@/lib/product-tags";
export default function ProductTags({ productId, limit = 3 }: { productId: string; limit?: number }) {
  const ids = productSearchMetadata[productId]?.tags || [];
  const priority = ["agrochemistry", "water-treatment", "buffers", "microbiology", "quality-control", "solution-preparation", "analytics"];
  const tags = [...ids].sort((a, b) => priority.indexOf(a) - priority.indexOf(b)).map(id => tagDefinitions.find(tag => tag.id === id)).filter((tag): tag is (typeof tagDefinitions)[number] => Boolean(tag));
  if (!tags.length) return null;
  return <div className="product-tags" aria-label="Подбор по задаче">{tags.slice(0, limit).map(tag => <a key={tag.id} href={`/catalog?tag=${encodeURIComponent(tag.id)}`} title={tag.description}>{tag.label}</a>)}{tags.length > limit ? <a href={`/catalog/${productId}#applications`} className="product-tags-more" aria-label={`Все области применения: еще ${tags.length - limit}`}>+{tags.length - limit}</a> : null}</div>;
}
