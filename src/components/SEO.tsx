import { useEffect } from "react";

type SEOProps = {
  title: string;
  description?: string;
  canonical?: string;
};

export function SEO({ title, description, canonical }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    if (description) metaDesc.setAttribute("content", description);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    if (canonical) link.href = canonical;

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonical]);
  return null;
}
