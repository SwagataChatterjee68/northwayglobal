// app/_components/AuthWrapper.jsx

'use client'
import { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import Login from '../login/Login'
import './authwrapper.css'

export default function AuthWrapper ({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsLoggedIn(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className='loading-container'>
        <p className='loading-text'>Loading...</p>
      </div>
    )
  }

  return isLoggedIn ? (
    <section className='dashboard-layout'>
      <Navbar />
      <main className='main-content-area'>
        {children}
      </main>
    </section>
  ) : (
    <Login />
  )
}