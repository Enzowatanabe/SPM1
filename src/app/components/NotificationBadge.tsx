import React from 'react';

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export default function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <span 
      className={`notification-badge ${className}`}
      style={{
        background: '#dc2626',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '10px',
        fontWeight: 'bold',
        minWidth: '16px',
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        zIndex: 10
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
} 