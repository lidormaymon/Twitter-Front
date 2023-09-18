import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logOut, selectUserData } from '../auth/authSlice';
import { Link } from "react-router-dom";

const FooterMenu = () => {
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  return (
    <div className='sticky bottom-0 z-50 bg-black'>
      <div className='p-4 w-full space-x-18 border-t-1 border-gray-400 sm:hidden flex flex-row shrink'>
        <Link to={`/profile/${BrowsingUser.id}`} className='w-1/4 hover:bg-gray-700'><PersonIcon fontSize='large' /></Link>
        <Link to={'/messages'} className='w-1/4 hover:bg-gray-700'><MailOutlineIcon fontSize='large' /></Link>
        <Link to={'/search'} className='w-1/4 hover:bg-gray-700'><SearchIcon fontSize='large' /></Link>
        <Link to={'/'} onClick={() => dispatch(logOut())} className='w-1/4 hover:bg-gray-700'><LogoutIcon fontSize='large' /></Link>
      </div>
    </div>
  )
}

export default FooterMenu