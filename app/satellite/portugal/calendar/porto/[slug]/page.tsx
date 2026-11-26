import { permanentRedirect } from "next/navigation";
import { portugalCalendarPath } from "@/lib/satellite/paths";

/** City pages used to link events under the city path. Event pages live at /calendar/<slug>. */
export default function CityEventRedirect({ params }: { params: { slug: string } }) {
  permanentRedirect(portugalCalendarPath(params.slug));
}
