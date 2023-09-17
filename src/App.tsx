import Home from "./features/Home";
import SideNav from "./features/Navbars/SideNav"
import { Routes, Route, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './app/hooks'
import { checkRefresh, credsCheck, getUserData, selectAdminStatus, selectLoggedStatus } from "./features/auth/authSlice";
import { useEffect } from "react";
import Login from "./features/auth/Login";
import SignUp from "./features/auth/SignUp";
import MobileMenu from "./features/Navbars/MoblieMenu";
import FooterMenu from "./features/Navbars/FooterMenu";
import TweetPage from "./features/Tweets/TweetPage";
import Profile from "./features/profile/Profile";
import FollowersList from "./features/profile/FollowersList";
import RightSide from "./features/RightSide";
import SearchMobile from "./features/componets/Search/SearchMobile";
import  MessageEmpty  from "./features/messages/MessageEmpty";
import MessageChats from "./features/messages/MessageChats";
import EditProfile from "./features/profile/EditProfile";


function App() {
  const isLogged = useAppSelector(selectLoggedStatus)
  const token = localStorage.getItem('token')
  const session = sessionStorage.getItem('session')
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectAdminStatus)
  const location = useLocation();
  const authPages = location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/messages')


  useEffect(() => {
    const credsValidChk = () => {
      if (token) {
        const tokenData = JSON.parse(token)
        dispatch(credsCheck(tokenData)).
          then((res) => {
            if (res.payload === 200) {
              dispatch(getUserData())
            } else {
              if (session) {
                dispatch(checkRefresh(session)).then((res) => console.log('refreshhhhh1', res))
              }
            }
          })
      } else {
        if (session) {
          dispatch(checkRefresh(session)).then((res) => console.log('refreshhhhh2', res.payload))
        }
      }
      console.log('user logged status = ', isLogged);
    }
    credsValidChk()
  }, [isLogged, session, getUserData, isAdmin, session])



  return (
    <div>
      <MobileMenu />
      <div className="flex flex-col sm:flex-row container sm:ml-80 3xl:ml-96  h-screen   ">
        <SideNav />
        <div className={`${!authPages && 'my-container'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/tweet-post/:id" element={<TweetPage />} />
            <Route path='/profile/:id' element={<Profile />} />
            <Route path="/profile/:id/:status" element={<FollowersList />} />
            <Route path="/profile/:id/edit" element={<EditProfile />} />
            <Route path="/messages" element={<MessageEmpty />} />
            <Route path="/messages/:id" element={<MessageChats />} />
            <Route path="/search" element={<SearchMobile />} />
          </Routes>
        </div>
        {!authPages && <RightSide />}
        {isLogged && (
          <FooterMenu />
        )}
      </div>
    </div>

  );
}

export default App;
