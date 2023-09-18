import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLoggedStatus, logOut, selectUserData } from "../auth/authSlice";
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import logo from './logo.png'
import { Link } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';

const SideNav = () => {
    const dispatch = useAppDispatch();
    const BrowsingUser = useAppSelector(selectUserData)
    const isLogged = useAppSelector(selectLoggedStatus);

    return (
        <div className="sm:sticky sm:top-0 h-fit self-start z-50 hidden sm:block  ">
            <ul className="relative top-0 sm:left-3 2xl:right-8 right-20 h-full px-2 py-4">
                <div className="relative  lg:right-2">
                    <span>
                        <Link to='/'>
                            <p className="text-blue-400  font-bold font-serif text-2xl relative right-3 md:hidden xl:block xl:left-0">Litter</p>
                        </Link>
                    </span>
                    <img src={logo} width={'25px'} className="relative bottom-6 xl:bottom-6 md:left-0 md:bottom-0 left-20 xl:left-20" />
                </div>
                <div className="flex flex-col gap-y-7 relative top-5">
                    <div className="flex flex-row items-center links">
                        <Link to={'/'} className="flex">
                            <HomeIcon className="relative right-2 top-1" />
                            <p className="hidden xl:flex">Home</p>
                        </Link>
                    </div>
                    {isLogged === false ? (
                        <>
                            <div className="flex items-center links">
                                <Link to={'/login'} className="flex">
                                    <LoginIcon className="relative right-2 top-1" />
                                    <p className="hidden xl:block">Sign in</p>
                                </Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/register'} className="flex">
                                    <LoginIcon className="relative right-2 top-1" />
                                    <p className="hidden xl:block">Sign up</p>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="items-center links">
                                <Link to={`/profile/${BrowsingUser.id}`} className="flex">
                                    <PersonIcon className="relative  right-2 top-1" />
                                    <p className="hidden xl:block">Profile</p>
                                </Link>
                            </div>
                            <div className="flex items-center links  xl:hidden">
                                <Link to={'/search'} className="flex">
                                    <SearchIcon className="relative  right-2 top-1" fontSize='large' />
                                </Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/messages'} className="flex">
                                    <MailOutlineIcon className="relative  right-2 top-1"  />
                                    <p className="hidden xl:block">Messages</p>
                                </Link>
                            </div>
                            <div className="flex items-center links ">
                                <Link to={'#'} className="flex">
                                    <NotificationsIcon className="relative right-2 top-1" />
                                    <p className="hidden xl:block">Notifications</p>
                                </Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/'} onClick={() => dispatch(logOut())} className="flex">
                                    <LogoutIcon className="relative right-2 top-1" />
                                    <p className="hidden xl:block">Log out</p>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </ul>
        </div>
    );
};

export default SideNav;
