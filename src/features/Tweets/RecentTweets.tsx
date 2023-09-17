import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getTweetsPage, tweetNextPage, selectTweets } from "./slicer/tweetSlice";
import { getUsers, selectUsers } from "../auth/authSlice";

import TweetForm from "./componets/TweetForm";
import Button from "../componets/Button";
import Loader from "../componets/Loader";

interface RecentTweetsProps {
  newTweet: boolean;
  setNewTweet: React.Dispatch<React.SetStateAction<boolean>>
}

const RecentTweets: React.FC<RecentTweetsProps> = ({ newTweet, setNewTweet }) => {
  const dispatch = useAppDispatch()
  const tweets = useAppSelector(selectTweets)
  const [currentPage, setCurrentPage] = useState(1)
  const [isNextPage, setNextPage] = useState(false)
  const [sumbitEdited, setSumbitEdited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBtn, setisLoadingBtn] = useState(false)

  const loadMoreTweets = () => {
    setisLoadingBtn(true)
    try {
      setCurrentPage(currentPage + 1)
      setNextPage(true)
    } catch (error) {
      console.log(error);
    } finally {
      setisLoadingBtn(false)
    }
  }


  useEffect(() => {
    dispatch(getTweetsPage())
    dispatch(getUsers())
    if (newTweet) {
      setNewTweet(false)
    }
    if (sumbitEdited) {
      setSumbitEdited(false)
    }
  }, [newTweet, sumbitEdited, isLoading])

  useEffect(() => {
    if (isNextPage) {
      dispatch(tweetNextPage(currentPage))
      setNextPage(false)
    }
  }, [isNextPage, currentPage])

  if (isLoading) {
    return <div className="relative left-44 sm:left-80 top-20 sm:top-28 w-10"><Loader isTextLoading={true} /></div>
  }

  return (
    <div>
      {tweets.length > 0 ? (
        <>
          {tweets.map((data: any, index: any) => {
            return (
              <div key={index}>
                <TweetForm
                  tweet_data={data}
                  setSumbitEdited={setSumbitEdited}
                />
              </div>
            );
          })}
          {tweets.length > 9 && (
            <div className="mx-auto mt-4 h-20  sm:border-b sm:border-gray-600 relative sm:bottom-5">
              <Button
                isLoading={isLoadingBtn}
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
  );
};

export default RecentTweets;
