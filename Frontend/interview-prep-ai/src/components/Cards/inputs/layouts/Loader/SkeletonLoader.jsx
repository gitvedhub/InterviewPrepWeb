import React from 'react';

const SkeletonLoader = () => {
  return (
    <>
      {/* First block */}
      <div role="status" className="animate-pulse space-y-4 max-w-3xl">
        <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-1/2"></div>

        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
          <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-10/12"></div>
          <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-11/12"></div>
        </div>
      </div>

      {/* Second block */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 space-y-2 mt-6">
        <div className="h-2.5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-2.5 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>

      {/* Third block */}
      <div role="status" className="animate-pulse space-y-4 max-w-xl mt-10">
        <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-1/2"></div>

        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
          <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-10/12"></div>
          <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-11/12"></div>
        </div>
      </div>

      {/* Fourth block */}
      <div className="space-y-2 mt-6">
        <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
        <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-10/12"></div>
        <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-11/12"></div>
      </div>

      {/* Fifth block */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 space-y-2">
        <div className="h-2.5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-2.5 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>

      {/* Sixth block */}
      <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-1/2 mt-8"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
        <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-10/12"></div>
        <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-11/12"></div>
      </div>
    </>
  );
};

export default SkeletonLoader;
