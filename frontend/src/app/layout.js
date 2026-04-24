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
        <title>EduRate - Hệ thống đánh giá giảng viên</title>
        <meta name="description" content="Hệ thống đánh giá giảng viên trực tuyến - Xếp hạng, đánh giá và tìm kiếm giảng viên" />
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
