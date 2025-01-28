import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, X, Calendar, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVideo } from "@/contexts/VideoPlayerContext";
import { formatToLocalTime } from '@/utils/timezone';

// ... [keeping all interfaces the same]

const EnhancedVideoManager = () => {
  // ... [keeping all state and hooks the same]

  // Add loading state display
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading content" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner - Full width container */}
      <section className="relative w-full h-[500px] md:h-[750px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50">
          <img 
            src="/lovable-uploads/Banner01.jpg" 
            alt="Fitness and Sports Banner"
            className="w-full h-full object-cover -z-10"
          />
        </div>
        <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-heading mb-4">
            Your Ultimate Platform for
            <span className="text-gradient"> Fitness & Sports</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
            Transform your fitness journey with personalized meal plans, workout tracking, and expert guidance.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <div className="mx-auto py-4 px-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" 
              aria-label="Search icon"
            />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search videos"
            />
          </div>
          {selectedCategory && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {selectedCategory}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedCategory(null)}
                aria-label="Clear category filter"
              />
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="w-full">
          <div className="flex flex-col">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {[...page.arts, ...page.youtube].map((video) => (
                  <div 
                    key={video.id} 
                    className="relative flex items-stretch border-y border-muted py-2"
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => handleVideoClick(video)}>
                      <div className="aspect-video w-full">
                        <iframe
                          src={video.embed_url || `https://www.youtube.com/embed/${video.embed_id}`}
                          className="w-full h-full pointer-events-none"
                          allowFullScreen
                          title={video.title}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="writing-mode-vertical-rl rotate-180 h-auto py-4 flex items-center justify-center bg-black text-white hover:bg-[#f7bd00] hover:text-black transition-colors duration-200 rounded-none"
                      onClick={() => setSelectedCategory(
                        'arts_categories' in video 
                          ? video.arts_categories?.name || null
                          : video.category
                      )}
                      style={{ writingMode: 'vertical-rl' }}
                      aria-label={`Filter by category: ${
                        'arts_categories' in video 
                          ? video.arts_categories?.name || 'Uncategorized'
                          : video.category
                      }`}
                    >
                      {'arts_categories' in video 
                        ? video.arts_categories?.name || 'Uncategorized'
                        : video.category}
                    </Button>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="w-full">
          <div className="flex flex-col">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="relative flex items-stretch border-y border-muted py-2"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{session.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" aria-label="Session date" />
                          {formatToLocalTime(session.start_time, 'UTC')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" aria-label="Session duration" />
                          Duration: {session.duration}
                        </span>
                      </div>
                      {session.embed_url && (
                        <div className="aspect-video w-full cursor-pointer" onClick={() => handleVideoClick(session)}>
                          <iframe
                            src={session.embed_url}
                            className="w-full h-full pointer-events-none"
                            allowFullScreen
                            title={session.title}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Loading indicator */}
      <div ref={bottomRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading more content" />
        )}
      </div>
    </div>
  );
};

export default EnhancedVideoManager;
