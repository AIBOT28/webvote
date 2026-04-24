'use client';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <title>Review gv HUIT</title>
        <meta name="description" content="Review gv HUIT" />
      </head>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 64px)' }}>
                {children}
              </main>
            </ToastProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
