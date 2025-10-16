import React from 'react'
import Hero from '../../Components/Hero/Hero'
import { useAuth } from '../../Context/useAuth';

interface CompanyPageProps {
}

const HomePage = () => {
    const {isLoggedIn, user, logout} = useAuth();
  return (
    <div className='bg-gray-900 min-h-screen text-white'>
        {isLoggedIn() ? (
          <Hero />
        ) : (
          <Hero />
        )}
        
    </div>
  )
}

export default HomePage
