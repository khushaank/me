import type { Post } from "@db/schema";

// Frontend-facing BlogPost shape — compatible with existing UI components
export interface PostContent {
  title: string;
  subtitle: string;
  collection: string;
  content: string;
  detailContent: string;
}

export interface BlogPost {
  id: number;
  year: string;
  image: string;
  zh: PostContent;
  en: PostContent;
}

/**
 * Transform a database Post row into the BlogPost shape the UI expects.
 */
export function toBlogPost(post: Post): BlogPost {
  return {
    id: post.id,
    year: post.year,
    image: post.image,
    zh: {
      title: post.zhTitle,
      subtitle: post.zhSubtitle,
      collection: post.zhCollection,
      content: post.zhContent,
      detailContent: post.zhDetailContent,
    },
    en: {
      title: post.enTitle,
      subtitle: post.enSubtitle,
      collection: post.enCollection,
      content: post.enContent,
      detailContent: post.enDetailContent,
    },
  };
}
