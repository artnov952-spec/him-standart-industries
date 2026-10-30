import type { Metadata } from "next";

export const SITE_URL = "https://him-standart-industries-demo.artnov952.chatgpt.site";
export const IS_DEMO = true;
export const SITE_MARK = "/assets/site-mark.png";
export const BRAND_SOCIAL_IMAGE = { url: "/assets/og/site.png", width: 1200, height: 630, alt: "HIM STANDART Industries: демонстрационный каталог химических реактивов в Узбекистане" };
export type SocialImage = { url: string; width: number; height: number; alt: string };
type PageMetaOptions = { image?: SocialImage; type?: "website" | "article"; selectionOnly?: boolean };

export function articleSocialImage(slug: string, title: string): SocialImage {
  return { url: `/assets/og/${slug}.png`, width: 1200, height: 630, alt: `HIM STANDART Industries: ${title}` };
}

export function pageMeta(title: string, description: string, path = "/", options: PageMetaOptions = {}): Metadata {
  const image = options.image || BRAND_SOCIAL_IMAGE;
  const imageUrl = new URL(image.url, SITE_URL).href;
  return {
    title,
    description,
    alternates: { canonical: SITE_URL + path },
    openGraph: { title, description, url: SITE_URL + path, siteName: "HIM STANDART INDUSTRIES", locale: "ru_UZ", type: options.type || "website", images: [{ ...image, url: imageUrl }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: imageUrl, alt: image.alt }] },
    robots: { index: !IS_DEMO && !options.selectionOnly, follow: true },
  };
}
