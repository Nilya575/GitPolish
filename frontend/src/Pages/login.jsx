import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://gitpolish-backend.onrender.com/api/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name);

      navigate('/dashboard');

    } catch (err) {
      console.log(err);
      setError('Email ya password galat hai');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div style={{ textAlign: 'center', margin: '15px 0' }}>
  <p style={{ color: '#636e72', fontSize: '13px', marginBottom: '10px' }}>
    --- OR ---
  </p>
  <button
    type="button"
    onClick={() => window.location.href = 'https://gitpolish-backend.onrender.com/api/auth/github'}
    style={{
      background: '#24292e',
      color: 'white',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }}
  >
    🐙 Login with GitHub
  </button>
</div>
      <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default Login;