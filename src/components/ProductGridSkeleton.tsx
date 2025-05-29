
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <Skeleton className="h-4 w-4" />
              <div className="flex space-x-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            
            <Skeleton className="aspect-square mb-4 rounded-lg" />
            
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
