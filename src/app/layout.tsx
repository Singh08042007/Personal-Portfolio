import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deepinder Singh | AI Researcher & Founder',
  description: 'B.Tech AI & Data Science student, Founder & CEO at Zanqir. Engineering the next generation of intelligent systems.',
  icons: {
    icon: 'https://i.postimg.cc/RhFFpxdP/Round-Profile-image.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} dark scroll-smooth`}>
      <head>
        {/* Google Material Symbols Outlined Icon Font */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
        <link rel="icon" href="https://i.postimg.cc/RhFFpxdP/Round-Profile-image.png" />
      </head>
      <body className="bg-background text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container font-sans min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}
