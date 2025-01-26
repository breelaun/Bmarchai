import React, { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

interface InfiniteScrollProps<T> {
  fetchFunction: (pageParam: number) => Promise<{ data: T[], nextPage?: number }>;
  renderItem: (item: T) => React.ReactNode;
  itemKeyExtractor?: (item: T) => string | number;
}

function InfiniteScroll<T>({ 
  fetchFunction, 
  renderItem, 
  itemKeyExtractor = (item: any) => item.id 
}: InfiniteScrollProps<T>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['infiniteData'],
    queryFn: ({ pageParam = 1 }) => fetchFunction(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1
  });

  const handleScroll = useCallback(() => {
    const scrolledToBottom = 
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100;

    if (scrolledToBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error fetching data</div>;

  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.data.map((item) => (
            <div key={itemKeyExtractor(item)}>
              {renderItem(item)}
            </div>
          ))}
        </React.Fragment>
      ))}
      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}

export default InfiniteScroll;
