export const STORY_GENRES = ["triumph", "failure", "hot_take", "lifehack"] as const;
export type StoryGenre = (typeof STORY_GENRES)[number];

export const STORY_ROLES = ["it", "retiree", "entrepreneur", "family", "student", "other"] as const;
export type StoryRole = (typeof STORY_ROLES)[number];

export const STORY_VERIFICATION = ["personal", "emigro_reviewed"] as const;
export type StoryVerification = (typeof STORY_VERIFICATION)[number];

export type StoryFrontmatter = {
  slug: string;
  title: string;
  seo_title?: string;
  seo_description?: string;
  excerpt?: string;
  genre: StoryGenre;
  role: StoryRole;
  country: string;
  author_display: string;
  relocation_year?: number;
  related_guide_slugs?: string[];
  verification: StoryVerification;
  backlink_url?: string;
  date_published?: string;
  date_modified?: string;
  estimated_minutes?: number;
};

export type StoryArticle = StoryFrontmatter & {
  bodyHtml: string;
};
