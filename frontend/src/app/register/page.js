'use client';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const { googleLogin } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await googleLogin(credentialResponse.credential);
      toast.success(`Chào mừng, ${user.name}!`);
      router.push('/');
    } catch (err) {
      toast.error('Đăng ký thất bại');
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Đăng ký</h1>
          <p className={styles.authDesc}>Tạo tài khoản sinh viên bằng Google</p>
        </div>

        <div className={styles.googleSection}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Đăng ký Google thất bại')}
            size="large"
            width="100%"
            text="signup_with"
            shape="rectangular"
            theme="filled_blue"
          />
          <p className={styles.googleNote}>Chỉ hỗ trợ đăng ký bằng tài khoản Google</p>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerText} onClick={() => router.push('/login')}>
            Đã có tài khoản? Đăng nhập
          </span>
        </div>
      </div>
    </div>
  );
}
