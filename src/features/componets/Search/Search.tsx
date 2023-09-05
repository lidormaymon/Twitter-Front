import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getUsers, searchUsers, selectUsers } from '../../auth/authSlice';
import Profile from '../../profile/Profile';
import ProfilePic from '../../profile/componets/ProfilePic';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useAppDispatch();
  const [queryUsers, setQueryUsers] = useState([])
  const users = useAppSelector(selectUsers)
  const [isClicked, setIsClicked] = useState(false)

  const handleSearchInput = (event: any) => {
    const query = event.target.value
    setSearchQuery(query);
    dispatch(searchUsers(query)).then((res: any) => setQueryUsers(res.payload.usernames))
  };

  const navigateProfile = () => {
    setIsClicked(true)
    setSearchQuery('')
  }

  useEffect(() => {
    dispatch(getUsers())
    if (isClicked) {
      setIsClicked(false)
    }
  }, [queryUsers])

  return (
    <div className='sticky top-0 hidden sm:flex'>
      <div className='relative left-5 top-5'>
        <input
          className='pl-12 w-69 h-10 rounded-full bg-gray-800 outline-none'
          placeholder='Search'
          value={isClicked ? '' : searchQuery}
          onChange={handleSearchInput}
        />
        <SearchIcon className='absolute top-2 left-3 text-gray-500' />
      </div>
      
      {/* Display the matching users */}
      <div>
        {searchQuery.trim() !== ''  && (
          <div className='relative top-12 right-67 bg-gray-900 rounded-3xl w-68'>
            {queryUsers.map((id: number) => {
              const user = users.find((user) => user.id === id);
              if (user) {
                return (
                  <div key={user.id} className='flex items-center my-5'>
                    <Link
                      to={`profile/${user.id}`}
                      className='hover:bg-gray-600 w-full rounded-3xl'
                      onClick={() => navigateProfile()}>
                      <div className='flex flex-row mx-2 bg'>
                        <ProfilePic
                          width={'45px'}
                          image={user.profile_image}
                          alt={`${user.username}'s profile`}
                        />
                        <p className='relative left-2 top-2'>{user.username}</p>
                      </div>
                    </Link>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
