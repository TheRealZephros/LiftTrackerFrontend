import React from 'react'
import Hero from '../../Components/Hero/Hero'
import { useAuth } from '../../Context/useAuth';
import Tile from '../../Components/Tile/Tile';
import { Link } from 'react-router-dom';

interface CompanyPageProps {
}

const HomePage = () => {
    const {isLoggedIn, user, logout} = useAuth();
  return (
    <div className='bg-bg1 min-h-screen text-text1'>
        {isLoggedIn() ? (
          <>
            <Link to={'/programs'} className='block max-w-md mx-auto mt-10 min-w-[400px] max-w-md'>
              <Tile title="Training Programs" subTitle="Manage your workout programs" />
            </Link>
            <Link to={'/exercises'} className='block max-w-md mx-auto mt-10 min-w-[400px] max-w-md'>
              <Tile title="Exercises" subTitle="Manage your workout exercises" />
            </Link>
            <Link to={'/sessions'} className='block max-w-md mx-auto mt-10 min-w-[400px] max-w-md'>
              <Tile title="Workout Sessions" subTitle="Manage your workout sessions" />
            </Link>
          </>
        ) : (
          <Hero />
        )}
    </div>
  )
}

export default HomePage
