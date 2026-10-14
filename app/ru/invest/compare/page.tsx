import type { Metadata } from "next";
import { COMPARE_COPY, GoldenVisaComparePage } from "@/components/investment/GoldenVisaComparePage";
import { investMetadata } from "@/lib/investment/invest-seo";

export const metadata: Metadata = investMetadata({
  locale: "ru",
  key: "compare",
  title: COMPARE_COPY.ru.title,
  description: COMPARE_COPY.ru.description,
  aiDescription: COMPARE_COPY.ru.aiDescription,
  aiCategory: "investment-migration-comparison",
});

export default function RuGoldenVisaComparePage() {
  return <GoldenVisaComparePage locale="ru" />;
}
