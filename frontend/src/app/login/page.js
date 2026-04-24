'use client';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import styles from './page.module.css';

export default function LoginPage() {
  const { googleLogin } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await googleLogin(credentialResponse.credential);
      toast.success(`Xin chào, ${user.name}!`);
      if (['admin', 'manager'].includes(user.role)) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      toast.error('Đăng nhập Google thất bại');
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Đăng nhập</h1>
          <p className={styles.authDesc}>Chào mừng bạn đến với EduRate</p>
        </div>

        {/* Google Sign In Only */}
        <div className={styles.googleSection}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Đăng nhập Google thất bại')}
            size="large"
            width="100%"
            text="signin_with"
            shape="rectangular"
            theme="filled_blue"
          />
          <p className={styles.googleNote}>Chỉ hỗ trợ đăng nhập bằng tài khoản Google</p>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerText}>
            Hệ thống quản lý đánh giá giảng viên
          </span>
        </div>
      </div>
    </div>
  );
}
