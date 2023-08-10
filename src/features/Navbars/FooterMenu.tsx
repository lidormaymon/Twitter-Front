import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch } from '../../app/hooks';
import { logOut } from '../auth/authSlice';

const FooterMenu = () => {
  const dispatch = useAppDispatch()
  return (
    <div className=' sticky bottom-0 z-10 bg-black'>
      <div className='p-4 w-full space-x-18 border-t-1 border-gray-400 sm:hidden flex flex-row shrink'>
        <a href='#' className='w-1/4 hover:bg-gray-700'><PersonIcon fontSize='large' /></a>
        <a href='#' className='w-1/4 hover:bg-gray-700'><MailOutlineIcon fontSize='large' /></a>
        <a className='w-1/4 hover:bg-gray-700'><SearchIcon fontSize='large' /></a>
        <a href='/' onClick={() => dispatch(logOut())} className='w-1/4 hover:bg-gray-700'><LogoutIcon fontSize='large' /></a>
      </div>
    </div>
  )
}

export default FooterMenu