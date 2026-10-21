import React from 'react';
import { Outlet } from 'react-router-dom';

export const FullScreenLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#0A0A10' }}>
      <Outlet />
    </div>
  );
};
