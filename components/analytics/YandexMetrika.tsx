"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  yandexMetrikaCounterId,
  yandexMetrikaHit,
  yandexMetrikaPageUrl,
} from "@/lib/analytics/yandex-metrika";

/** Yandex Metrika — page views, PF signals, Webmaster crawl-by-counter. */
export function YandexMetrika() {
  const counterId = yandexMetrikaCounterId();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipFirstHit = useRef(true);

  useEffect(() => {
    if (!counterId) return;

    const query = searchParams.toString();
    const url = yandexMetrikaPageUrl(pathname, query);

    if (skipFirstHit.current) {
      skipFirstHit.current = false;
      return;
    }

    yandexMetrikaHit(counterId, url);
  }, [counterId, pathname, searchParams]);

  if (!counterId) return null;

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${counterId}", "ym");
ym(${counterId}, "init", {
  ssr:true,
  webvisor:true,
  clickmap:true,
  ecommerce:"dataLayer",
  referrer: document.referrer,
  url: location.href,
  accurateTrackBounce:true,
  trackLinks:true
});`,
        }}
      />
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
