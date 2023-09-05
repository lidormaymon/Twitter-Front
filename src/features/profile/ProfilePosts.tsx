import React, { useEffect, useState } from 'react'
import TweetForm from '../Tweets/componets/TweetForm'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchProfileTweetsAsync, nextPageProfileTweetsAsync, selectTweets  } from '../Tweets/slicer/tweetSlice'
import { getUsers } from '../auth/authSlice'
import Button from '../componets/Button'

interface profilePostProps {
  profile_id: number
}

export const ProfilePosts: React.FC<profilePostProps> = ({ profile_id }) => {
  const dispatch = useAppDispatch()
  const profileTweets = useAppSelector(selectTweets)
  const [currentPage, setCurrentPage] = useState(1)
  const [isNextPage, setNextPage] = useState(false)

  
  const loadMoreTweets = () => {
    setCurrentPage(currentPage + 1)
    setNextPage(true)
  };

  useEffect(() => {
    dispatch(fetchProfileTweetsAsync(profile_id))
    dispatch(getUsers())
  }, [profile_id])

  useEffect(() => {
    if (isNextPage) {
      dispatch(nextPageProfileTweetsAsync({currentPage, profile_id}))
      console.log('test');
      
      setNextPage(false)
    }
  }, [isNextPage, currentPage, profile_id])

  return (
    <div>
      {profileTweets.length > 0 ? (
        <>
          {profileTweets.map((data: any, index: any) => {
            return (
              <div key={index}>
                <TweetForm
                  tweet_data={data}
                />
              </div>
            );
          })}
          {profileTweets.length > 9 && (
            <div className="mx-auto mt-4 h-20  sm:border-b sm:border-gray-600 border-r border-l relative sm:bottom-5">
              <Button
                text="Load more"
                className="relative left-38  sm:left-67 top-1 font-semibold"
                onClick={() => loadMoreTweets()}
              />
            </div>
          )}
        </>
      ) : (
        <div className="relative sm:bottom-5 sm:h-105 sm:border-b 3xl:h-120 sm:border-gray-600">
          <p className="mx-4 relative top-3 text-center">No tweets have been posted yet.</p>
        </div>
      )}
    </div>
  )
}