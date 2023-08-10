import { useEffect, useState } from "react";
import FollowingTweets from "./Tweets/FollowingTweets";
import RecentTweets from "./Tweets/RecentTweets";
import {  selectLoggedStatus,  selectUserData } from "./auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getTweets, postTweetData } from "./Tweets/tweetSlice";
import Button from "./componets/Button";
import ProfilePic from "./auth/ProfilePic";


interface HeaderProps {
  activeTab: string;
  handleTabClick: any;
}

const Header = ({ activeTab, handleTabClick }: HeaderProps) => {
  const isLogged = useAppSelector(selectLoggedStatus)
  return (
    <div className="container  w-full sm:w-105 3xl:w-108">
      <div className="sticky top-0">
        <div className="border-b border-gray-600">
          <h1 className="font-bold font- text-xl mx-2 px-2 py-4">Home</h1>
          <div className="container flex flex-row">
            <div
              className={`${isLogged === true ? 'w-1/2 p-4 py-5 cursor-pointer hover:bg-gray-600' : 'w-full p-4 py-5 cursor-pointer hover:bg-gray-600'} `}
              onClick={() => handleTabClick("forYou")}
            >
              <div>
                <p className={`text-center ${activeTab === 'forYou' ? "text-white relative" : "text-gray-400"}`}>For you</p>
                <span>
                  <div className={`${activeTab === 'forYou' ? "w-14 h-2 rounded-full bg-blue-500  relative top-5 left-12 sm:top-5 sm:left-29 3xl:left-32" : ""}
                  ${!isLogged && 'w-14 h-2 rounded-full bg-blue-500  relative top-5 left-38 sm:top-5 sm:left-67 3xl:left-69'}`}></div>
                </span>
              </div>
            </div>
            {isLogged && (
              <div
                className={`w-1/2 p-4 py-5 cursor-pointer hover:bg-gray-600 `}
                onClick={() => handleTabClick("following")}
              >
                <div>
                  <p className={`text-center ${activeTab !== 'forYou' ? "text-white" : "text-gray-400"}`}>Following</p>
                  <span>
                    <div className={`${activeTab !== 'forYou' ? "w-14 h-2 rounded-full bg-blue-500  relative top-5 left-12 sm:top-5 sm:left-28 3xl:left-32" : ""}`}></div>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const user = useAppSelector(selectUserData)
  const dispatch = useAppDispatch()
  const isLogged = useAppSelector(selectLoggedStatus)
  const [activeTab, setActiveTab] = useState("forYou");
  const [tweetText, setTweetText] = useState('')
  const [newTweet, setNewTweet] = useState(false);


  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetText(event.target.value);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const postTweet = (text: string) => {
    const data: any = { user_id: user.id, text: text };
    dispatch(postTweetData(data));
    setNewTweet(true); 
    setTweetText('')
  };

  return (
    <div className="relative sm:border-l border-gray-600 sm:border-r sm:bordezr-gray-600 h-fit max-h-max w-screen sm:w-105 3xl:w-108">
      <Header activeTab={activeTab} handleTabClick={handleTabClick} />
      {isLogged && (
        <div className="relative top-2 border-b-2 border-gray-600 h-44">
          <div className="relative bottom-4">
            <ProfilePic image={user.profile_image} className="relative top-10 left-4" />
            <textarea
              className="bg-black border-b-1 border-gray-600 h-14 w-75 md:w-98 3xl:w-102 relative left-20 top-2 resize-none focus:outline-none"
              placeholder="What's happening today?!"
              onChange={handleTextInput}
              value={tweetText}
            />
            <Button
              text="Post"
              className="relative top-4 left-72 md:left-105 3xl:left-110 font-semibold hover:bg-blue-400"
              onClick={()=> postTweet(tweetText)}
            />
          </div>
        </div>

      )}
      <div className="relative top-5">
        {activeTab === "forYou" ? <RecentTweets newTweet={newTweet} setNewTweet={setNewTweet} /> : <FollowingTweets />}
      </div>
    </div>
  );
};

export default Home;
