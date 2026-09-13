import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const avatar = params.get('avatar');
    const githubUsername = params.get('githubUsername');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('userName', name);
      localStorage.setItem('userAvatar', avatar);
      localStorage.setItem('githubUsername', githubUsername);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Logging you in...</h2>
      <p>Please wait...</p>
    </div>
  );
}

export default AuthCallback;