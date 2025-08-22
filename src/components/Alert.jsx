/**
 * Alert Component
 * Displays different types of alert messages (success, error, warning, info)
 * Provides consistent styling and optional dismiss functionality
 */

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onDismiss }) => {
  // Icon mapping for different alert types
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[type];

  const alertStyles = {
    info: { backgroundColor: '#eff6ff', borderLeftColor: '#60a5fa', color: '#1e40af' },
    success: { backgroundColor: '#f0fdf4', borderLeftColor: '#4ade80', color: '#166534' },
    error: { backgroundColor: '#fef2f2', borderLeftColor: '#f87171', color: '#991b1b' },
    warning: { backgroundColor: '#fffbeb', borderLeftColor: '#fbbf24', color: '#92400e' }
  };

  return (
    <div style={{
      ...alertStyles[type],
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      borderLeft: '4px solid',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem'
    }}>
      <Icon style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.125rem', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            flexShrink: 0,
            padding: '0.25rem',
            borderRadius: '4px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <X style={{ width: '1rem', height: '1rem' }} />
        </button>
      )}
    </div>
  );
};

export default Alert;