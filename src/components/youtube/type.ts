export interface YouTubeSource {
  id: string;
  type: 'channel' | 'playlist' | 'video';
  value: string;
  category_id: string;
  active: boolean;
}
