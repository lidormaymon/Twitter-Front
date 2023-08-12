import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getTweets, nextPage, selectTweets } from "./tweetSlice";
import { getUsers, selectUsers } from "../auth/authSlice";
import ProfilePic from "../auth/ProfilePic";
import TweetForm from "./TweetForm";
import Button from "../componets/Button";

interface RecentTweetsProps {
  newTweet: boolean;
  setNewTweet: React.Dispatch<React.SetStateAction<boolean>>
}

const RecentTweets: React.FC<RecentTweetsProps> = ({ newTweet, setNewTweet }) => {
  const dispatch = useAppDispatch()
  const tweets = useAppSelector(selectTweets)
  const [currentPage, setCurrentPage] = useState(1)

  const [isNextPage, setNextPage] = useState(false)

  const loadMoreTweets = () => {
    setCurrentPage(currentPage + 1)
    setNextPage(true)
  };

  

  useEffect(() => {
    dispatch(getTweets())
    dispatch(getUsers())
    if (newTweet) {
      setNewTweet(false)
    }
  }, [newTweet])

  useEffect(() => {
    if (isNextPage) {
      dispatch(nextPage(currentPage))
      setNextPage(false)
    }
  }, [isNextPage, currentPage])


  return (
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
        <div className="relative sm:bottom-5 sm:h-105 sm:border-b 3xl:h-130 sm:border-gray-600">
          <p className="mx-4 relative top-3">No tweets have been posted yet.</p>
        </div>
      )}
    </div>
  );
};

export default RecentTweets;
