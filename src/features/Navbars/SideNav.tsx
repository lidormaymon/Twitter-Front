import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLoggedStatus, logOut } from "../auth/authSlice";
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LogoutIcon from '@mui/icons-material/Logout';

const SideNav = () => {
    const dispatch = useAppDispatch();
    const isLogged = useAppSelector(selectLoggedStatus);

    return (
        <div className=" sm:sticky sm:top-0 self-start z-10 hidden sm:block">
            <ul className="relative top-6 sm:left-3 2xl:right-8 right-20 h-full px-2 py-4">
                <div className="relative  lg:right-2">
                    <span>
                        <a href='/'>
                            <p className="text-blue-400 font-bold font-serif text-2xl relative right-4">Twitter</p>
                        </a>
                    </span>
                    <img src="../twiter-logo.png" width={'25px'} className="relative bottom-6 left-20" />
                </div>
                <div className="flex flex-col gap-y-7 relative top-5">
                    <div className="flex items-center links">                
                        <a href='/'><HomeIcon className="relative right-2" />Home</a>
                    </div>
                    {isLogged === false ? (
                        <>
                            <div className="flex items-center links"> 
                                <a href='/login'><LoginIcon className="relative right-2" />Sign in</a>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center links">
                                <a href="#"><PersonIcon className="relative  right-2" />Profile</a>
                            </div>
                            <div className="flex items-center links">
                                <a href="#"><MailOutlineIcon className="relative  right-2" />Messages</a>
                            </div>
                            <div className="flex items-center links">
                                <a href='/' onClick={() => dispatch(logOut())}><LogoutIcon className="relative right-2" />Log out</a>
                            </div>
                        </>
                    )}
                </div>
            </ul>
        </div>
    );
};

export default SideNav;
