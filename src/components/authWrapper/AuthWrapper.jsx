'use client'
import { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import Login from '../login/Login'
import './authwrapper.css'
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Inner component to consume context
function AuthContent({ children }) {
  const { token } = useAuth(); // get token from context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // token already loaded in context's useEffect
  }, []);

  if (loading) {
    return (
      <div className='loading-container'>
        <p className='loading-text'>Loading...</p>
      </div>
    )
  }

  return token ? (
    <section className='dashboard-layout'>
      <main className='main-content-area'>
        <Navbar />
        {children}
      </main>
    </section>
  ) : (
    <Login />
  );
}

export default function AuthWrapper({ children }) {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  )
}
