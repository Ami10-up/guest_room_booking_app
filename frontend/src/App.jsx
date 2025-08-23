import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BookingForm from './components/BookingForm';
import BookingHistory from './components/BookingHistory';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return (
      <div style={{maxWidth:400,margin:'2rem auto'}}>
        {showRegister ? (
          <>
            <RegisterForm onRegister={setUser} />
            <p>Already have an account? <button onClick={() => setShowRegister(false)}>Login</button></p>
          </>
        ) : (
          <>
            <LoginForm onLogin={setUser} />
            <p>Don&apos;t have an account? <button onClick={() => setShowRegister(true)}>Register</button></p>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{maxWidth:600,margin:'2rem auto'}}>
      <h2>Welcome, {user.fullName || user.username}!</h2>
      <p>Role: {user.role}</p>
      <button onClick={() => { setUser(null); localStorage.removeItem('token'); }}>Logout</button>
      <hr />
      {user.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <>
          <BookingForm onBooked={() => {}} />
          <hr />
          <BookingHistory user={user} />
        </>
      )}
    </div>
  );
}

export default App;
