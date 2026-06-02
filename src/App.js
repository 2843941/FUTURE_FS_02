import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboards';
import ContactForm from './components/ContactForm';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div>
        {/* Simple Navigation Bar - shows different links based on login status */}
        <nav style={{
          backgroundColor: '#166534',
          padding: '1rem',
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Home (Contact Form)
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                Dashboard
              </Link>
              <button
                onClick={() => auth.signOut()}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  padding: '0 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Admin Login
            </Link>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<ContactForm />} />
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login onLogin={() => setUser(auth.currentUser)} />
          } />
          <Route path="/dashboard" element={
            user ? <Dashboard /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
