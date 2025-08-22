/**
 * Loading Spinner Component
 * Displays a spinning loader with optional message
 * Used throughout the app when waiting for API responses
 */

import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0'
    }}>
      <div className="spinner"></div>
      <p style={{
        color: '#6b7280',
        marginTop: '1rem',
        fontWeight: '500'
      }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;