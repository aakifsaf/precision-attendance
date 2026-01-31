import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Precision Attendance | Shift Intelligence',
  description: 'Professional attendance and shift management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeProvider>
          <div className="min-h-full">
            <RoleSwitcher />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}