import { supabase } from "./client";

export const initializeStorage = async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === 'blog-images')) {
    const { data, error } = await supabase.storage.createBucket('blog-images', {
      public: true,
      fileSizeLimit: 500000, // 500KB
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
    }
  }

  if (!buckets?.find(bucket => bucket.name === 'profiles')) {
    const { data, error } = await supabase.storage.createBucket('profiles', {
      public: true,
      fileSizeLimit: 5000000, // 5MB
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
    }
  }
};

// Initialize storage when the app starts
initializeStorage();