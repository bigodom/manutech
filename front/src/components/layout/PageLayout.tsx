import React from 'react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  align?: 'center' | 'top';
}

export default function PageLayout({ title, subtitle, children, align = 'top' }: PageLayoutProps) {
  return (
    <div className={`p-8 h-full w-full overflow-auto ${align === 'center' ? 'flex flex-col items-center justify-center min-h-screen' : ''}`}>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {subtitle && <span className="block mb-6">{subtitle}</span>}
      {children}
    </div>
  );
} 