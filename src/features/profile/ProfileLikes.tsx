import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchProfileLikedTweetsAsync, nextPageProfileLikedTweetsAsync, selectTweets } from "../Tweets/slicer/tweetSlice"
import { getUsers } from "../auth/authSlice"
import TweetForm from "../Tweets/componets/TweetForm"
import Button from "../componets/Button"


interface profileLikeProps {
  profile_id: number
}

const ProfileLikes: React.FC<profileLikeProps> = ({profile_id}) => {
  const dispatch = useAppDispatch()
  const profileTweets = useAppSelector(selectTweets)
  const [currentPage, setCurrentPage] = useState(1)
  const [isNextPage, setNextPage] = useState(false)

  const loadMoreTweets = () => {
    setCurrentPage(currentPage + 1)
    setNextPage(true)
  };

  useEffect(() => {
    dispatch(fetchProfileLikedTweetsAsync(profile_id))
    dispatch(getUsers())
  }, [])

  useEffect(() => {
    if (isNextPage) {
      dispatch(nextPageProfileLikedTweetsAsync({currentPage, profile_id}))
      setNextPage(false)
    }
  }, [isNextPage, currentPage, profile_id])

  return (
    <div>
      {profileTweets.length > 0 ? (
        <div>
          {profileTweets.map((data:any, index:any) => {
            return (
              <div key={index}>
                 <TweetForm
                  tweet_data={data}
                />
              </div>
            )
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
        </div>
      ) : (
        <div>
          <p className="text-center">No tweets have been liked yet.</p>
        </div>
      ) }
    </div>
  )
}

export default ProfileLikes