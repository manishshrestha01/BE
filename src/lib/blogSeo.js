import { setJSONLD, setLinkRel, setMeta, setTitle, removeElementById } from "./seo";

import { BLOG_BASE_URL } from "./blogCurriculum";

const DEFAULT_IMAGE = `${BLOG_BASE_URL}/logo-512.png`;

export function buildMetadata({
  title,
  description,
  canonicalPath,
  image = DEFAULT_IMAGE,
  type = "website",
}) {
  const canonical = `${BLOG_BASE_URL}${canonicalPath}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      siteName: "StudyMate",
      images: [{ url: image, alt: `${title} banner` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function applyMetadata(metadata) {
  setTitle(metadata.title);
  setMeta({ name: "description", content: metadata.description });
  setMeta({ name: "robots", content: "index, follow" });
  setLinkRel("canonical", metadata.alternates.canonical);

  setMeta({ property: "og:title", content: metadata.openGraph.title });
  setMeta({ property: "og:description", content: metadata.openGraph.description });
  setMeta({ property: "og:type", content: metadata.openGraph.type });
  setMeta({ property: "og:url", content: metadata.openGraph.url });
  setMeta({ property: "og:site_name", content: metadata.openGraph.siteName });
  setMeta({ property: "og:image", content: metadata.openGraph.images[0].url });
  setMeta({ property: "og:image:alt", content: metadata.openGraph.images[0].alt });

  setMeta({ name: "twitter:card", content: metadata.twitter.card });
  setMeta({ name: "twitter:title", content: metadata.twitter.title });
  setMeta({ name: "twitter:description", content: metadata.twitter.description });
  setMeta({ name: "twitter:image", content: metadata.twitter.images[0] });
}

export function applyOrganizationGraph() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BLOG_BASE_URL}/#organization`,
        name: "StudyMate",
        url: `${BLOG_BASE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: `${BLOG_BASE_URL}/logo-512.png`,
        },
        description: "PU notes for BE Computer Engineering students.",
      },
      {
        "@type": "WebSite",
        "@id": `${BLOG_BASE_URL}/#website`,
        url: `${BLOG_BASE_URL}/`,
        name: "StudyMate",
        publisher: {
          "@id": `${BLOG_BASE_URL}/#organization`,
        },
        inLanguage: "en-US",
      },
    ],
  };

  setJSONLD(graph, "json-ld-blog-org");
}

export function clearSeoScripts(ids = []) {
  ids.forEach((id) => removeElementById(id));
  removeElementById("json-ld-blog-org");
}

export function buildBreadcrumbList(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

