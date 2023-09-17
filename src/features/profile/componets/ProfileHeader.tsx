import React, { useEffect, useState } from 'react'
import BackButton from '../../componets/BackButton'
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAppDispatch } from '../../../app/hooks';
import { fetchUserPostsAsync } from '../../auth/authSlice';

interface ProfileHeaderProps {
    display_name:string,
    is_verified:boolean,
    profile_id:number
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({display_name, is_verified, profile_id}) => {
    const dispatch = useAppDispatch()
    const [userPosts, setUserPosts] = useState(0)



    useEffect(() => {
        dispatch(fetchUserPostsAsync(profile_id)).then(
            (res: any) => setUserPosts(res.payload.post_count))
    }, [userPosts, profile_id])
    
    return (
        <div className="flex flex-row">
            <BackButton />
            <div className="flex flex-col relative left-8 bottom-2">
                <div className="flex flex-row space-x-1">
                    <p className="font-bold text-xl">{display_name}</p>
                    {is_verified && (
                        <>
                            <VerifiedIcon className="relative top-1" />
                        </>
                    )}
                </div>
                <p className="text-xs font-semibold text-gray-500">{userPosts} posts</p>
            </div>
        </div>
    )
}

export default ProfileHeader