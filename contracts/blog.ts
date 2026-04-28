export interface PostContent {
  title: string;
  subtitle: string;
  collection: string;
  content: string;
  detailContent: string;
}

export interface BlogPost {
  id: string | number;
  year: string;
  image: string;
  fr: PostContent;
  en: PostContent;
}

/**
 * Transform a database Post row from Supabase into the BlogPost shape the UI expects.
 */
export function toBlogPost(post: any): BlogPost {

  return {
    id: post.id,
    year: post.year,
    image: post.image,
    fr: {
      title: post.frTitle,
      subtitle: post.frSubtitle,
      collection: post.frCollection,
      content: post.frContent,
      detailContent: post.frDetailContent,
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
