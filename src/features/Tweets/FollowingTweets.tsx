import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchFollowingTweetsAsync, nextPageFollowingTweetsAsync, selectTweets } from "./slicer/tweetSlice"
import { getUsers, selectUserData } from "../auth/authSlice"
import Button from "../componets/Button";
import TweetForm from "./componets/TweetForm";
import Loader from "../componets/Loader";

interface FollowingTweetsProps {
  newTweet: boolean;
  setNewTweet: React.Dispatch<React.SetStateAction<boolean>>
}

const FollowingTweets: React.FC<FollowingTweetsProps> = ({newTweet, setNewTweet}) => {
  const BrowsingUser = useAppSelector(selectUserData)
  const BrowsingUserID = BrowsingUser.id
  const tokenString = localStorage.getItem('token') 
  const tweets = useAppSelector(selectTweets)
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [isNextPage, setNextPage] = useState(false)
  const loadMoreTweets = () => {
    console.log(BrowsingUserID);
    
    setCurrentPage(currentPage + 1)
    setNextPage(true)
  };


  useEffect(() => {
    if (tokenString) {
      const token = JSON.parse(tokenString)
      dispatch(fetchFollowingTweetsAsync({user_id:BrowsingUser.id, token}))
    }
    dispatch(getUsers())
    if (newTweet) {
      setNewTweet(false)
    }
  }, [newTweet])  

  useEffect(() => {
    if (isNextPage) {
      dispatch(nextPageFollowingTweetsAsync({currentPage, BrowsingUserID}))
      setNextPage(false)
    }
  }, [isNextPage, currentPage])

  if (tweets === undefined) {
    return <div><Loader /></div>
  }
  
  return (
    <div>
          <div>
      {tweets.length > 0 ? (
        <>
          {tweets.map((data: any, index: any) => {          
            return (
              <div key={index}>
                <TweetForm
                  tweet_data={data}
                />
              </div>
            );
          })}
          {tweets.length > 9 && (
            <div className="mx-auto mt-4 h-20  sm:border-b sm:border-gray-600 relative sm:bottom-5">
              <Button
                text="Load more"
                className="relative left-38  sm:left-67 top-1 font-semibold"
                onClick={() => loadMoreTweets()}
              />
            </div>
          )}
        </>
      ) : (
        <div className="relative sm:bottom-5 sm:h-105 sm:border-b 3xl h-120 sm:border-gray-600">
          <p className="mx-4 relative top-3 text-center">No tweets have been posted yet.</p>
        </div>
      )}
    </div>
    </div>
  )
}

export default FollowingTweets