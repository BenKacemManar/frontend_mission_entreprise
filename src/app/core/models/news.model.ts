export type NewsCategory = 'natation' | 'water-polo' | 'plongeon' | 'eau-libre' | 'general' | 'annonce';

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  publishedAt: string;
  category: NewsCategory;
  imageUrl?: string;
  slug: string;
  authorId?: string;
  authorName?: string;
  isFeatured?: boolean;
}
