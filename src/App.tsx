import Home from "./features/Home";
import SideNav from "./features/Navbars/SideNav"
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './app/hooks'
import { checkRefresh, credsCheck, getUserData, selectAdminStatus, selectLoggedStatus } from "./features/auth/authSlice";
import { useEffect } from "react";
import Login from "./features/auth/Login";
import SignUp from "./features/auth/SignUp";
import MobileMenu from "./features/Navbars/MoblieMenu";
import FooterMenu from "./features/Navbars/FooterMenu";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  }, {
    path: '/login',
    element: <Login />,
  }, {
    path: '/register',
    element: < SignUp />
  }
]);

function App() {
  const isLogged = useAppSelector(selectLoggedStatus)
  const session = sessionStorage.getItem('session')
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectAdminStatus)
  const refreshToken = localStorage.getItem('refresh')

  useEffect(() => {
    const credsValidChk = () => {
      if (session) {
        const sessionData = JSON.parse(session)
        dispatch(credsCheck(sessionData)).
          then((res) => {
            if (res.payload === 200) {
              dispatch(getUserData())
            } else {
              if (refreshToken) {
                dispatch(checkRefresh(refreshToken)).then((res) => console.log('refreshhhhh1', res))
              }
            }
          })
      } else {
        if (refreshToken) {

          dispatch(checkRefresh(refreshToken)).then((res) => console.log('refreshhhhh2', res.payload))
        }
      }
      console.log('user logged status = ', isLogged);
    }
    credsValidChk()
  }, [isLogged, session, getUserData, isAdmin, refreshToken])


  return (
    <div>
      <MobileMenu />
      <div className="hidden container xl:ml-80 3xl:ml-96  h-screen  sm:flex ">
        <SideNav />
        <div>
          <RouterProvider router={router} />
        </div>
      </div>
      <div className="container mx-auto lg:ml-96 flex flex-col h-screen sm:hidden">
        <div className="flex-grow">
          <SideNav />
          <RouterProvider router={router} />
        </div>
        {isLogged && (
          <FooterMenu />
        )}
      </div>
    </div>

  );
}

export default App;
