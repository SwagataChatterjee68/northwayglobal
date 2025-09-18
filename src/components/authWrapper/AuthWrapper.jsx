'use client'
import { useEffect, useState } from 'react'
import DashboardNavbar from '../navbar/Navbar' // renamed import
import Login from '../login/Login'
import './authwrapper.css'
import { AuthProvider, useAuth } from '@/context/AuthContext'

// Inner component
function AuthContent ({ children }) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className='loading-container'>
        <p className='loading-text'>Loading...</p>
      </div>
    )
  }

  return token ? (
    <section>
      <main className='flex  min-h-screen '>
     
        <section className='w-[18%] bg-amber-50 '>
          <DashboardNavbar />
        </section>
        <section className='w-[82%] bg-white '>{children}</section>
      </main>
    </section>
  ) : (
    <Login />
  )
}

export default function AuthWrapper ({ children }) {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  )
}
