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

export interface CategorySource {
  category: string;
  channelIds: string[];
  searchTerms?: string[];
}

// Add preset channel configurations
export const categorySourceConfig: CategorySource[] = [
  {
    category: "Swimming",
    channelIds: [
      "UCyu7apf_VsBIOOcu53hhgcA", // Olympics Aquatics channel
    ],
    searchTerms: ["Swimming", "swimming competition"]
  },

    {
    category: "Taekwondo",
    channelIds: [
      "UCjJQVnxyMiv1B_kPhC4hzEw", // World Taekwondo channel
    ],
    searchTerms: ["taekwondo competition", "taekwondo match", "taekwondo championship"]
  },
  
  // Add more categories as needed, for example:
  {
    category: "Pickleball",
    channelIds: [
      "UC1PgAGEpZvB1mHPP8Z5dThA", // Pro Pickleball channel
    ],
    searchTerms: ["pickleball tournament", "pickleball live", "professional pickleball"]
  }
];
