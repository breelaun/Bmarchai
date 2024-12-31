export interface Stream {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  url: string;
  isLive: boolean;
  viewerCount: number;
  publishedAt: string;
}

export interface Category {
  name: string;
  isFavorite: boolean;
}