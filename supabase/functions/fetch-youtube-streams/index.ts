import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')

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
    }
    liveStreamingDetails?: {
      concurrentViewers: string
    }
  }>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { category } = await req.json()
    console.log('Fetching streams for category:', category)

    // Search for live streams
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&q=${encodeURIComponent(category + ' live')}&key=${YOUTUBE_API_KEY}`
    )
    const searchData: YouTubeSearchResponse = await searchResponse.json()
    console.log('Found streams:', searchData.items.length)

    // Get additional details for each video
    const videoIds = searchData.items.map(item => item.id.videoId).join(',')
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )
    const videosData = await videosResponse.json()

    // Map the response to our Stream type
    const streams = searchData.items.map((item, index) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      category: category,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/embed/${item.id.videoId}`,
      isLive: true,
      viewerCount: parseInt(videosData.items[index]?.liveStreamingDetails?.concurrentViewers || '0'),
    }))

    return new Response(JSON.stringify({ streams }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching YouTube streams:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})