export interface Stream {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  url: string;
  isLive: boolean;
  viewerCount: number;
}

export interface Category {
  name: string;
  isFavorite: boolean;
}