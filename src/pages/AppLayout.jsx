import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
function AppLayout() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-800'>
      <Navbar/>
        <main className='flex-grow'>
            <Outlet />
        </main>

    </div>
  )
}

export default AppLayout
