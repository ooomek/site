export type BlogStatus = 'draft' | 'published';

export type BlogPost = {
  id: string;
  slug: string;
  title_ru: string;
  title_en: string | null;
  excerpt_ru: string;
  excerpt_en: string | null;
  content_ru: string;
  content_en: string | null;
  cover_image_url: string | null;
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostInput = Pick<
  BlogPost,
  | 'slug'
  | 'title_ru'
  | 'title_en'
  | 'excerpt_ru'
  | 'excerpt_en'
  | 'content_ru'
  | 'content_en'
  | 'cover_image_url'
  | 'status'
> & {
  published_at?: string | null;
};
