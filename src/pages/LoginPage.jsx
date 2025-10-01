import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = useCallback(async (googleIdToken) => {
    try {
      setLoading(true);
      const { user } = await loginWithGoogle(googleIdToken);
      const role = user?.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'manager') navigate('/manager');
      else navigate('/student');
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error?.message || 'Login failed'}</div>}
      <button onClick={() => handleGoogleSuccess(window.__MOCK_GOOGLE_ID_TOKEN__ || 'demo-google-id-token')} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
}

