import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './Components/ErrorPage/ErrorPage';
import Root from './Components/Root/Root';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import { HelmetProvider } from 'react-helmet-async';
import AuthProvider from './Components/AuthProvider/AuthProvider';
import WhyUs from './Components/WhyUS/WhyUs';
import Dashboard from './Components/Dashboard/Dashboard';
import PrivateRoute from './Components/Routes/PrivateRoute';
import Income from './Components/Income/Income';
import Expense from './Components/Expense/Expense';
import Goals from './Components/Goals/Goals';
import Visuals from './Components/Visuals/Visuals';

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage/>,
    element: <Root/>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: "/register",
        element: <Register/>,
      },
      {
        path: "/whyus",
        element: <WhyUs/>,
      },
      {
        path:"/dashboard",
        element: <PrivateRoute><Dashboard/></PrivateRoute>,
        children: [
          // {
          //   path: "/dashboard/profile",
          //   element: <p>Home<p/>,
          // },
          {
            path: "/dashboard/income",
            element: <Income/>,
          },
          {
            path: "/dashboard/expenses",
            element: <Expense/>,
          },
          {
            path: "/dashboard/goals",
            element: <Goals/>,
          },
          {
            path: "/dashboard/visuals",
            element: <Visuals/>,
          },
        ]
      }
  ]}]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
