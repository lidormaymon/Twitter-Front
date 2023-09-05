import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useEffect, useState } from "react"
import { getUsers, selectUserData, selectUsers } from "../auth/authSlice"
import ProfilePic from "./componets/ProfilePic"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format } from 'date-fns';
import { ProfilePosts } from "./ProfilePosts"
import ProfileLikes from "./ProfileLikes"
import Button from "../componets/Button"
import {
    countFollowersFollowingAsync, deleteFollowAsync, fetchFollowersAsync,
    postFolloweAsync, isFollowingAsync, selectFollowers,
    selectFollowersData, selectFollowStatusList
}
    from "./Slicer/FollowersSlice"
import VerifiedIcon from '@mui/icons-material/Verified';
import Loader from "../componets/Loader"
import ProfileHeader from "./componets/ProfileHeader"
import { Link } from "react-router-dom";
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const Profile = () => {
    const { id } = useParams<{ id: string }>()
    const profile_id = Number(id)
    const users = useAppSelector(selectUsers)
    const BrowsingUser = useAppSelector(selectUserData)
    const profileCreds = users.find((user: any) => user.id === profile_id)
    const isFollowing = useAppSelector(selectFollowStatusList)
    const isFollowingEntry = isFollowing.find(
      (status) => status.from_user_id === BrowsingUser.id && status.to_user_id === profile_id
    );
    
    const isUserFollowing = isFollowingEntry ? isFollowingEntry.isFollowing : false;
    const followersData = useAppSelector(selectFollowersData)
    const [followFlag, setFollowFlag] = useState(false)
    const [activeTab, setActiveTab] = useState('posts')
    const dispatch = useAppDispatch()
    const followersAR = useAppSelector(selectFollowers)
    const [hovered, setHovered] = useState(false);
    const handleHover = () => {
        setHovered(!hovered);
    };
    const joinedData = profileCreds?.date_joined
    const formattedJoinedDate = joinedData
        ? format(new Date(joinedData), 'MMMM dd, yyyy')
        : '';

    const follow = () => {

        dispatch(postFolloweAsync({ from_user_id: BrowsingUser.id, to_user_id: profile_id }))
    }

    const unFollow = () => {
        setFollowFlag(true)
        const index = followersAR.findIndex(
            (follower) => follower.from_user_id === BrowsingUser.id && follower.to_user_id === profile_id
        )
        const follower_id = followersAR[index]['id']
        dispatch(deleteFollowAsync(follower_id))
        console.log(isUserFollowing);
    }

    useEffect(() => {
        dispatch(getUsers())
    }, [])

    useEffect(() => {
        dispatch(fetchFollowersAsync())
        dispatch(countFollowersFollowingAsync(profile_id))
        if (followFlag) {
            console.log('heyyyy')
            setFollowFlag(false)
        }
        if (BrowsingUser.is_logged) {
            if (BrowsingUser.id !== profile_id) {
                dispatch(isFollowingAsync({ from_user_id: BrowsingUser.id, to_user_id: profile_id }))
            }
        }
    }, [BrowsingUser.is_logged, profile_id, BrowsingUser.id, followFlag, followersData.followers, followersData.following])



    return (
        <div>
            <div>
                <div>
                    <div className="flex flex-row relative top-6 mx-4">
                        <ProfileHeader
                            display_name={profileCreds?.display_name || ''}
                            is_verified={profileCreds?.is_verified || false}
                            profile_id={profile_id}
                        />
                        {profileCreds?.id === BrowsingUser.id && (
                            <div className="relative left-44 sm:left-98 top-12">
                                <Button text="Edit" className="hover:bg-blue-400" />
                            </div>
                        )}
                        {profile_id !== BrowsingUser.id && (
                            <>
                                {BrowsingUser.is_logged && (
                                    <div className="relative flex left-48 sm:left-98 3xl:left-100 top-12">
                                        <Link to={`/messages/${profileCreds?.id}`} className="relative right-4 top-2 border-1 border-gray-600 rounded-full h-10 w-8">
                                            <MailOutlineIcon className="relative top-1 left-1" />
                                        </Link>
                                        {isUserFollowing ? (
                                            <Button
                                                onMouseEnter={handleHover}
                                                onMouseLeave={handleHover}
                                                text={hovered && isFollowing ? 'Unfollow' : isFollowing ? 'Following' : 'Follow'}
                                                className="hover:bg-blue-400"
                                                onClick={() => unFollow()}
                                            />
                                        ) : (
                                            <Button
                                                text="Follow"
                                                onClick={() => follow()}
                                            />
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="relative top-10 left-5 w-20">
                        <ProfilePic className="w-18 sm:w-24" image={profileCreds?.profile_image} />
                        <div className="relative top-4">
                            <div>
                                <div className="flex">
                                    <p className="font-bold text-xl">{profileCreds?.display_name}</p>
                                    {profileCreds?.is_verified && (
                                        <>
                                            <VerifiedIcon className="relative top-1" />
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="font-semibold text-gray-500">@{profileCreds?.username}</p>
                        </div>
                        <div className="flex flex-row relative top-8 space-x-3 w-48">
                            <CalendarMonthIcon className="text-gray-500" fontSize="small" />
                            <p className="font-semibold text-gray-500 text-sm">Joined {formattedJoinedDate}</p>
                        </div>
                        <div className="relative top-10">
                            <div className="flex flex-row space-x-3">
                                <div className="flex flex-row space-x-1">
                                    <p className="font-bold">{followersData.followers}</p>
                                    <Link to={`/profile/${profile_id}/followers`}>
                                        <p className="text-sm text-gray-500 font-semibold cursor-pointer hover:underline">Followers</p>
                                    </Link>
                                </div>
                                <div className="flex flex-row space-x-1">
                                    <p className="font-bold">{followersData.following}</p>
                                    <Link to={`/profile/${profile_id}/following`}>
                                        <p className="text-sm text-gray-500 font-semibold cursor-pointer hover:underline">Following</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative top-28">
                    <div className="flex flex-row w-full relative text-center text-gray-500 font-semibold border-b border-gray-600 h-18">
                        <p className={`w-1/2 hover:bg-gray-700 p-2  cursor-pointer ${activeTab === 'posts' && 'text-white'}`} onClick={() => setActiveTab('posts')}>Posts</p>
                        <p className={`w-1/2 hover:bg-gray-700 p-2 cursor-pointer ${activeTab === 'likes' && 'text-white'}`} onClick={() => setActiveTab('likes')}>Likes</p>
                    </div>
                    <div className="relative top-5 ">
                        {activeTab === 'posts' && (<ProfilePosts profile_id={profile_id} />)}
                        {activeTab === 'likes' && (<ProfileLikes profile_id={profile_id} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile