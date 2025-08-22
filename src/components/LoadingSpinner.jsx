/**
 * Loading Spinner Component
 * Displays a spinning loader with optional message
 * Used throughout the app when waiting for API responses
 */

import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="spinner"></div>
      <p className="text-gray-600 mt-4 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;