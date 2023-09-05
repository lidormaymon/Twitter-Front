import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import ProfileHeader from "./componets/ProfileHeader";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUsers, selectUserData, selectUsers, userDataState } from "../auth/authSlice";
import {
  deleteFollowAsync, fetchFollowersAsync, fetchFollowersListAsync,
  postFolloweAsync, isFollowingAsync, selectFollowers,
  selectFollowersListAR, selectFollowingListAR, selectFollowStatusList
}
  from "./Slicer/FollowersSlice";
import ProfilePic from "./componets/ProfilePic";
import VerifiedIcon from '@mui/icons-material/Verified';
import Button from "../componets/Button";
import { Link } from "react-router-dom";

interface FollowerListFormProps {
  user_list_id: number,
  users: userDataState[]
}

const FollowListForm: React.FC<FollowerListFormProps> = ({ user_list_id, users }) => {
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  const followsCreds = users.find((user: any) => user.id === user_list_id)
  const isFollowing = useAppSelector(selectFollowStatusList)
  const isFollowingEntry = isFollowing.find(
    (status) => status.from_user_id === BrowsingUser.id && status.to_user_id === followsCreds?.id
  );
  const isUserFollowing = isFollowingEntry ? isFollowingEntry.isFollowing : false;
  const [followFlag, setFollowFlag] = useState(false)
  const followersAR = useAppSelector(selectFollowers)
  const [hovered, setHovered] = useState(false);
  const handleHover = () => {
    setHovered(!hovered);
  };

  const follow = () => {
    setFollowFlag(true)
    dispatch(postFolloweAsync({ from_user_id: BrowsingUser.id, to_user_id: followsCreds?.id }))
  }

  const unFollow = () => {
    setFollowFlag(true)
    const index = followersAR.findIndex(
      (follower) => follower.from_user_id === BrowsingUser.id && follower.to_user_id === followsCreds?.id
    )
    const follower_id = followersAR[index]['id']
    dispatch(deleteFollowAsync(follower_id))
  }



  useEffect(() => {
    if (BrowsingUser.is_logged) {
      dispatch(fetchFollowersAsync())
      if (followFlag) {
        console.log('flag on');
        setFollowFlag(false)
      }
      if (BrowsingUser.is_logged) {
        if (BrowsingUser.id !== followsCreds?.id) {
          dispatch(isFollowingAsync({ from_user_id: BrowsingUser.id, to_user_id: followsCreds?.id }))
        }
      }
    }
  }, [BrowsingUser.is_logged, BrowsingUser.id, followsCreds?.id, followFlag])


  return (
    <div className="container flex flex-row p-6 border-b border-gray-600 h-auto ">
      <div className="mx-2 flex relative bottom-5">
        <Link to={`/profile/${followsCreds?.id}`}>
          <ProfilePic image={followsCreds?.profile_image} width={'45px'} className="relative right-2" />
        </Link>
        <div className="flex-col mx-2">
          <p className="font-bold">
            <Link to={`/profile/${followsCreds?.id}`}>
              <p className="hover:underline">{followsCreds?.display_name}</p>
            </Link>
            {followsCreds?.is_verified && (<VerifiedIcon fontSize="small" className="relative bottom-1" />)}
          </p>
          <p className="text-sm font-semibold text-gray-500 relative bottom-1 right-1">@{followsCreds?.username}</p>
        </div>
        <div className="relative left-36 sm:left-96">
          {BrowsingUser.is_logged && (
            <>
              {BrowsingUser.id !== followsCreds?.id && (
                <>
                  <div>
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
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const FollowersList = () => {
  const dispatch = useAppDispatch()
  const { id: id, status: status } = useParams<{ id: string, status: string }>()
  const list_status = status
  const profile_id = Number(id)
  const [activeTab, setActiveTab] = useState('')
  const [pageNotFound, setPageNotFound] = useState(false)
  const users = useAppSelector(selectUsers)
  const profileCreds = users.find(
    (user: any) => user.id === profile_id
  )
  const FollowersList = useAppSelector(selectFollowersListAR)
  const FollowingList = useAppSelector(selectFollowingListAR)

  useEffect(() => {
    dispatch(fetchFollowersListAsync(profile_id))


  }, [profile_id])

  useEffect(() => {
    dispatch(getUsers())
    dispatch(fetchFollowersAsync())
    if (list_status === 'followers') {
      setActiveTab('followers')
    } else if (list_status === 'following') {
      setActiveTab('following')
    } else if (list_status === 'mutal-followers') {
      setActiveTab('mutal-frends')
    } else {
      setPageNotFound(true)
    }
  }, [profile_id, status])

  return (
    <div className='my-container'>
      {pageNotFound ? (
        <div className="ml-40 mt-40 sm:ml-80 sm:mt-40">
          <p className="text-2xl font-bold">404</p>
          <p className="relative right-10 font-semibold">Page not found :(</p>
        </div>
      ) : <div>
        <div className="flex flex-row relative top-6 mx-4">
          <ProfileHeader
            display_name={profileCreds?.display_name || ''}
            is_verified={profileCreds?.is_verified || false}
            profile_id={profile_id}
          />
        </div>
        <div className="flex flex-row relative top-7 text-gray-400 cursor-pointer border-b border-gray-600">
          <p onClick={() => setActiveTab('followers')} className={`w-1/2 text-center p-4 hover:bg-gray-600 ${activeTab === 'followers' && ' text-white'}`}>Followers</p>
          <p onClick={() => setActiveTab('following')} className={`w-1/2 text-center p-4 hover:bg-gray-600 ${activeTab === 'following' && ' text-white'}`}>Following</p>
        </div>
        {activeTab === 'followers' && (
          FollowersList.length > 0 ? (
            <div>
              {FollowersList.map((data: any, index) => {
                return (
                  <div key={index} className="relative top-10">
                    <FollowListForm users={users} user_list_id={data['user_id']} />
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <p className="relative top-12 left-5">No followers yet</p>
            </div>
          )
        )}
        {activeTab === 'following' && (
          FollowingList.length > 0 ? (
            <div>
              {FollowingList.map((data: any, index) => {
                return (
                  <div key={index} className="relative top-10">
                    <FollowListForm users={users} user_list_id={data['user_id']} />
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <p className="relative top-12 left-5">No following yet</p>
            </div>
          )
        )}
      </div>}
    </div>
  )
}

export default FollowersList