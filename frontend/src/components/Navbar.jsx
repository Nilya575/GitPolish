import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/history">History</Link>
        <Link to="/profile">Profile</Link>
      </div>
      
      {userName && (
        <div className="nav-right">
          <img 
  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=6c5ce7`}
  alt="avatar"
  className="navbar-avatar"
/>
<span>{userName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;