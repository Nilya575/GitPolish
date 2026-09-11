import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import History from './Pages/History';
import Profile from './Pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><History /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;