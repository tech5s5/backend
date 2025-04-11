import React from 'react';

function ResultSection({ originalText, simplifiedText }) {
  const isLoading = !simplifiedText || !simplifiedText.content || simplifiedText.content.trim() === "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 animate-slide-up">
      {/* Original Contract */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-red-50 dark:border-red-900/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Original Contract</h3>
        </div>
        <div className="prose dark:prose-invert max-h-[600px] overflow-y-auto border-t-2 border-red-50 dark:border-red-900/20 pt-4 text-gray-800 dark:text-gray-200">
          {originalText}
        </div>
      </div>

      {/* Simplified Version */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-green-50 dark:border-green-900/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Simplified Version</h3>
        </div>

        <div className="prose dark:prose-invert max-h-[600px] overflow-y-auto border-t-2 border-green-50 dark:border-green-900/20 pt-4 text-gray-800 dark:text-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <h1>{simplifiedText.content}</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultSection;
