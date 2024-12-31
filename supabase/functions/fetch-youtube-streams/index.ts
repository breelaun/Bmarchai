import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string }
    snippet: {
      title: string
      thumbnails: { medium: { url: string } }
      channelTitle: string
      publishedAt: string
    }
    liveStreamingDetails?: {
      concurrentViewers: string
    }
  }>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { category } = await req.json()
    console.log('Fetching streams for category:', category)

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    // Construct a more specific search query
    const searchQuery = `${category} sports game match competition live`;
    console.log('Using search query:', searchQuery);

    // First, search for live streams
    const liveSearchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}&maxResults=10&relevanceLanguage=en`
    )

    if (!liveSearchResponse.ok) {
      const error = await liveSearchResponse.text()
      console.error('YouTube API error:', error)
      throw new Error(`YouTube API error: ${error}`)
    }

    const liveSearchData: YouTubeSearchResponse = await liveSearchResponse.json()
    console.log('Found live streams:', liveSearchData.items.length)

    // If no live streams found, search for recent videos
    if (liveSearchData.items.length === 0) {
      console.log('No live streams found, fetching recent videos')
      const recentSearchQuery = `${category} sports highlights game match competition`;
      const recentVideosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(recentSearchQuery)}&key=${YOUTUBE_API_KEY}&maxResults=10&order=date&relevanceLanguage=en`
      )

      if (!recentVideosResponse.ok) {
        const error = await recentVideosResponse.text()
        console.error('YouTube API error (recent videos):', error)
        throw new Error(`YouTube API error getting recent videos: ${error}`)
      }

      const recentVideosData: YouTubeSearchResponse = await recentVideosResponse.json()
      
      // Map recent videos to our Stream type
      const streams = recentVideosData.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        category: category,
        thumbnail: item.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/embed/${item.id.videoId}`,
        isLive: false,
        viewerCount: 0,
        publishedAt: item.snippet.publishedAt
      }))

      return new Response(
        JSON.stringify({ streams }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get additional details for live streams
    const videoIds = liveSearchData.items.map(item => item.id.videoId).join(',')
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )

    if (!videosResponse.ok) {
      const error = await videosResponse.text()
      console.error('YouTube API error (video details):', error)
      throw new Error(`YouTube API error getting video details: ${error}`)
    }

    const videosData = await videosResponse.json()

    // Map live streams
    const streams = liveSearchData.items.map((item, index) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      category: category,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/embed/${item.id.videoId}`,
      isLive: true,
      viewerCount: parseInt(videosData.items[index]?.liveStreamingDetails?.concurrentViewers || '0'),
      publishedAt: item.snippet.publishedAt
    }))

    return new Response(
      JSON.stringify({ streams }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in fetch-youtube-streams:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})