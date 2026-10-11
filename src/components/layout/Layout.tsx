import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import Header from './Header';
import Footer from '../footer/Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col font-arabic text-brand-brown">
      <Header />
      <main className={`flex-grow ${!isHome ? 'pt-[76px] md:pt-[92px]' : ''}`}>{children}</main>
      <Footer />
    </div>
  );
}
