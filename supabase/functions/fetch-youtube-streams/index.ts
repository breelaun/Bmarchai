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

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    // Search for live streams
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&q=${encodeURIComponent(category + ' live')}&key=${YOUTUBE_API_KEY}&maxResults=10`
    )

    if (!searchResponse.ok) {
      const error = await searchResponse.text()
      console.error('YouTube API error:', error)
      throw new Error(`YouTube API error: ${error}`)
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json()
    console.log('Found streams:', searchData.items.length)

    if (searchData.items.length === 0) {
      return new Response(
        JSON.stringify({ 
          streams: [],
          message: 'No live streams found for this category' 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get additional details for each video
    const videoIds = searchData.items.map(item => item.id.videoId).join(',')
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )

    if (!videosResponse.ok) {
      const error = await videosResponse.text()
      console.error('YouTube API error (video details):', error)
      throw new Error(`YouTube API error getting video details: ${error}`)
    }

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