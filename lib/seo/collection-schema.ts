type CollectionItem = {
  url: string;
  name: string;
  position?: number;
};

/**
 * CollectionPage + ItemList @graph — Barakhlo pattern for hub/category pages.
 * Declares the page as a curated collection, not a single product.
 */
export function buildCollectionPageItemListSchema(input: {
  name: string;
  url: string;
  description?: string;
  inLanguage?: string;
  items: CollectionItem[];
  about?: Record<string, unknown>;
}): Record<string, unknown> | null {
  if (input.items.length === 0) return null;

  const itemList: Record<string, unknown> = {
    "@type": "ItemList",
    "@id": `${input.url}#listings`,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      url: item.url,
      name: item.name,
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${input.url}#page`,
        url: input.url,
        name: input.name,
        ...(input.description ? { description: input.description } : {}),
        ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
        ...(input.about ? { about: input.about } : {}),
        mainEntity: { "@id": `${input.url}#listings` },
      },
      itemList,
    ],
  };
}
