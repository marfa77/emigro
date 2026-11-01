import type { Metadata } from "next";
import { PortugalCalendarPage, calendarMetadata } from "@/components/satellite/PortugalCalendarPage";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return calendarMetadata("porto");
}

export default function Page({
  searchParams,
}: {
  searchParams?: { when?: string; tag?: string; theme?: string; city?: string; place?: string };
}) {
  return <PortugalCalendarPage place="porto" searchParams={searchParams} />;
}
