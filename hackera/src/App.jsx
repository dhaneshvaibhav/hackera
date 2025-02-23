import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './component/loginpage';
import Signin from './component/signin';
import Navbar from './component/navbar';
import Home from './component/home';





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
      path: '/login',
      element: (
        <>
          <Navbar />
          <Login />
        </>
      ),
    }])

  return (
    <>
      <div>
        <RouterProvider router={router}/>

      </div>
      
    </>
  )
}

export default App
