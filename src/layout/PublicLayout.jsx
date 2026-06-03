import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/ambassador' ||
    location.pathname.startsWith('/ambassador/');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;