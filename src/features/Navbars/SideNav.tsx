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

const SideNav = () => {
    const dispatch = useAppDispatch();
    const BrowsingUser = useAppSelector(selectUserData)
    const isLogged = useAppSelector(selectLoggedStatus);

    return (
        <div className="sm:sticky sm:top-0 h-fit self-start z-50 hidden sm:block border-red-500 ">
            <ul className="relative top-0 sm:left-3 2xl:right-8 right-20 h-full px-2 py-4">
                <div className="relative  lg:right-2">
                    <span>
                        <Link to='/'>
                            <p className="text-blue-400 font-bold font-serif text-2xl relative">Litter</p>
                        </Link>
                    </span>
                    <img src={logo} width={'25px'} className="relative bottom-6 left-20" />
                </div>
                <div className="flex flex-col gap-y-7 relative top-5">
                    <div className="flex items-center links">
                        <Link to={'/'}><HomeIcon className="relative right-2" />Home</Link>
                    </div>
                    {isLogged === false ? (
                        <>
                            <div className="flex items-center links">
                                <Link to={'/login'}><LoginIcon className="relative right-2" />Sign in</Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/register'}><LoginIcon className="relative right-2" />Sign up</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center links">
                                <Link to={`/profile/${BrowsingUser.id}`}><PersonIcon className="relative  right-2" />Profile</Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/messages'}><MailOutlineIcon className="relative  right-2" />Messages</Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'#'}><NotificationsIcon className="relative right-2" />Notifications</Link>
                            </div>
                            <div className="flex items-center links">
                                <Link to={'/'} onClick={() => dispatch(logOut())}><LogoutIcon className="relative right-2" />Log out</Link>
                            </div>
                        </>
                    )}
                </div>
            </ul>
        </div>
    );
};

export default SideNav;
