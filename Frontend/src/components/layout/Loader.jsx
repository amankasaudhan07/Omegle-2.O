import React from 'react';

const SkeletonItem = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
);

const LayoutLoader = () => {
  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-4rem)]">
      {/* Sidebar (hidden on xs, visible from sm) */}
      <div className="hidden sm:block sm:col-span-4 md:col-span-3 h-full">
        <SkeletonItem className="h-full" />
      </div>
      
      {/* Main content */}
      <div className="col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-6 h-full">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonItem key={index} className="h-20" />
          ))}
        </div>
      </div>
      
      {/* Right sidebar (hidden on xs and sm, visible from md) */}
      <div className="hidden md:block md:col-span-4 lg:col-span-3 h-full">
        <SkeletonItem className="h-full" />
      </div>
    </div>
  );
};

const TypingLoader = () => {
  return (
    <div className="flex justify-center items-center space-x-2 p-2">
      {[0.1, 0.2, 0.3, 0.4].map((delay, index) => (
        <div
          key={index}
          className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}s` }}
        ></div>
      ))}
    </div>
  );
};

export { TypingLoader, LayoutLoader };