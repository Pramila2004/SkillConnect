import React from 'react';

export default function RateLimit() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">429 - Too Many Requests</h1>
      <p className="text-lg text-gray-300 text-center">
        You have made too many requests. Please wait for 15 minutes and try again.
      </p>
    </div>
  );
}
