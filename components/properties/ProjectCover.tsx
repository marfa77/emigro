import Image from "next/image";
import { ProjectPlate } from "@/components/properties/ProjectPlate";
import type { CatalogProject } from "@/lib/properties/catalog";

/** Cover photo with a small credit, or the drawn location plate when there is no photo. */
export function ProjectCover({
  project,
  sizes,
  priority,
  className = "",
}: {
  project: CatalogProject;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = project.photo;
  if (!photo) {
    return (
      <div className={`relative bg-slate-50 ${className}`}>
        <ProjectPlate project={project} compact className="absolute inset-0 h-full w-full" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      <span className="absolute bottom-1.5 right-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] leading-none text-white/90">
        фото: {photo.credit}
      </span>
    </div>
  );
}
