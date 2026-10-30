import { getArticleCover } from "@/lib/article-covers";

export default function ArticleCover({ slug }: { slug: string }) {
  const cover = getArticleCover(slug);
  return <img className="article-cover-image" src={cover.src} srcSet={cover.srcSet} sizes="(max-width: 520px) calc(100vw - 32px), (max-width: 800px) calc((100vw - 64px) / 2), (max-width: 1400px) calc((100vw - 144px) / 3), 432px" width={cover.width} height={cover.height} loading="lazy" decoding="async" alt={cover.alt} />;
}
