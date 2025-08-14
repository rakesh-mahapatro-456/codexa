import React from 'react';
import NavBar from '../custom/NavBar';

export default function UserLayout({ children }) {
  return (
    <div>
      {children}
      <NavBar />
    </div>
  );
}
