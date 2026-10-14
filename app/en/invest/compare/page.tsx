import type { Metadata } from "next";
import { COMPARE_COPY, GoldenVisaComparePage } from "@/components/investment/GoldenVisaComparePage";
import { investMetadata } from "@/lib/investment/invest-seo";

export const metadata: Metadata = investMetadata({
  locale: "en",
  key: "compare",
  title: COMPARE_COPY.en.title,
  description: COMPARE_COPY.en.description,
  aiDescription: COMPARE_COPY.en.aiDescription,
  aiCategory: "investment-migration-comparison",
});

export default function EnGoldenVisaComparePage() {
  return <GoldenVisaComparePage locale="en" />;
}
