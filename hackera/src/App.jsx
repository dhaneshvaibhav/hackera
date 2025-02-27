import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './component/loginpage';
import Signin from './component/signin';
import Navbar from './component/navbar';
import Home from './component/home';
import Profile from './component/profile';
import Explore from './component/explore';
import Timer from './component/timer';





function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <Home />
        </>
      ),
    },
    {
      path: '/signin',
      element: (
        <>
          <Navbar />
          <Signin />
        </>
      ),
    },
    {
      path: '/explore',
      element: (
        <>
          <Navbar />
          <Explore />
        </>
      ),
    },
    {
      path: '/timer',
      element: (
        <>
          
          <Timer />
        </>
      ),
    },
    {
      path: '/profile',
      element: (
        <>
          <Navbar />
          <Profile />
        </>
      ),
    },{
      path: '/login',
      element: (
        <>
          <Navbar />
          <Login />
        </>
      ),
    }
  ])

  return (
    <>
      <div>
        <RouterProvider router={router}/>

      </div>
      
    </>
  )
}

export default App
