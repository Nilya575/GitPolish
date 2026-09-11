import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/signup', {
        name,
        email,
        password
      });

      alert('Signup successful! Ab login karo.');
      navigate('/login');

    } catch (err) {
      console.log(err);
      setError('Signup fail ho gaya, dobara try karo');
    }
  };

  return (
  <div className="container">
    <h2>Signup</h2>
    {error && <p className="error-text">{error}</p>}
    <form onSubmit={handleSignup}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button type="submit">Signup</button>
    </form>
    <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
  Already have an account? <Link to="/login">Login </Link>
</p>
  </div>
);
}

export default Signup;