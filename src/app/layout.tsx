import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Precision Attendance | Shift Intelligence',
  description: 'Enterprise-grade attendance and shift management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased bg-slate-50`}>
        {/* Provider wraps the entire app state */}
          <div className="min-h-full">
            {children}
          </div>
          {/* Global Notification Toast Container */}
          <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}