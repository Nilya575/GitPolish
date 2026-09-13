import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import History from './Pages/History';
import Profile from './Pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Compare from './Pages/Compare';
import AuthCallback from './Pages/AuthCallback';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
        <Route path="/dashboard" element={
          
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><History /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;