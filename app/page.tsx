"use client";
import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import SecureDropzone from '../components/SecureDropzone';

export default function Home() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-sans antialiased">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <HeroSection isOffline={isOffline} />
        <div className="mt-12">
          <SecureDropzone />
        </div>
        <footer className="mt-20 text-center text-slate-400 text-sm">
          <p>© 2026 LocalVoid. 基于极致隐私构建！🚀</p>
        </footer>
      </div>
    </main>
  );
}
