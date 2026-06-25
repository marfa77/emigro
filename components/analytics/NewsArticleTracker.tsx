"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/client";

export function NewsArticleTracker({ slug, topicKey }: { slug: string; topicKey: string }) {
  useEffect(() => {
    trackEvent("news_article_view", { slug, topic_key: topicKey });
  }, [slug, topicKey]);
  return null;
}
