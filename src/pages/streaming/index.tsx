const fetchStreams = async () => {
  setIsLoading(true);
  try {
    // 1️⃣ Fetch all YouTube sources from Supabase
    const { data: sources, error } = await supabase.from("youtube_sources").select("*");

    if (error) throw error;
    if (!sources || sources.length === 0) {
      throw new Error("No sources found.");
    }

    let allStreams = [];

    for (const source of sources) {
      let apiUrl = "";

      // 2️⃣ Determine API URL based on type (channel, playlist, video)
      if (source.type === "channel") {
        apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&channelId=${source.value}&part=snippet&type=video&eventType=live`;
      } else if (source.type === "playlist") {
        apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&playlistId=${source.value}&part=snippet`;
      } else if (source.type === "video") {
        apiUrl = `https://www.googleapis.com/youtube/v3/videos?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&id=${source.value}&part=snippet,liveStreamingDetails`;
      }

      // 3️⃣ Fetch YouTube API Data
      const response = await fetch(apiUrl);
      const youtubeData = await response.json();

      if (youtubeData.items) {
        allStreams.push(...youtubeData.items);
      }
    }

    // 4️⃣ Update state with the combined results
    setStreams(allStreams);
  } catch (error) {
    console.error("Error fetching streams:", error);
    toast({
      title: "Error",
      description: "Failed to fetch live streams. Please try again later.",
      variant: "destructive",
    });
    setStreams([]);
  } finally {
    setIsLoading(false);
  }
};
