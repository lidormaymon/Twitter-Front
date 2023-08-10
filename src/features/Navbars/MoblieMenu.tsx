import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import { useAppSelector } from '../../app/hooks';
import { selectLoggedStatus } from '../auth/authSlice';


const MobileMenu = () => {
    const isLogged = useAppSelector(selectLoggedStatus)
    return (
        <div className="sticky top-0 z-20 bg-black">
            <div className="flex flex-row  sm:hidden shrink border-none  sticky top-0">
                <div className="flex flex-row w-full ">
                    <img src="../twiter-logo.png" width={'30px'} className="relative left-2" />
                    <div className="ml-auto ">
                        <a href='/'>
                            <HomeIcon className="relative top-1 right-2" fontSize="large" />
                        </a>
                        {!isLogged && (
                            <a href='/login'>
                                <LoginIcon className='relative top-1 right-1' fontSize='large' />
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <div className='relative top-1 w-full sm:hidden border-b-1 border-gray-400 ' />
        </div>
    );
};

export default MobileMenu;


