import { useEffect, useState } from "react";
import FollowingTweets from "./Tweets/FollowingTweets";
import RecentTweets from "./Tweets/RecentTweets";
import { getUsers, selectLoggedStatus, selectUserData, selectUsers } from "./auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { postTweetData } from "./Tweets/slicer/tweetSlice";
import Button from "./componets/Button";
import ProfilePic from "./profile/componets/ProfilePic";
import EmojiPicker from 'emoji-picker-react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';


interface HeaderProps {
  activeTab: string;
  handleTabClick: any;
}

const Header = ({ activeTab, handleTabClick }: HeaderProps) => {
  const isLogged = useAppSelector(selectLoggedStatus)
  return (
    <div className="container  w-full sm:w-105 3xl:w-108">
      <div className="sticky top-0 ">
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
  const BrowsingUser = useAppSelector(selectUserData)
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectUsers)
  const BrowsingUserCreds = users.find((user) => user.id === BrowsingUser.id)
  const isLogged = useAppSelector(selectLoggedStatus)
  const [activeTab, setActiveTab] = useState("forYou")
  const [tweetText, setTweetText] = useState('')
  const [newTweet, setNewTweet] = useState(false)
  const [emojiMode, setEmojiMode] = useState(false)


  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetText(event.target.value);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  };

  const postTweet = (text: string) => {
    const data: any = { user_id: BrowsingUser.id, text: text }
    dispatch(postTweetData(data));
    setNewTweet(true)
    setTweetText('')
  };

  const toggleEmojis = () => {
    emojiMode ? setEmojiMode(false) : setEmojiMode(true)
  }

  const handleEmojiClick = (emoji: any) => {
    setTweetText((prevText) => prevText + emoji);
  }

  useEffect(() => {
    dispatch(getUsers())
  }, [])
  

  return (
    <div>
      <Header activeTab={activeTab} handleTabClick={handleTabClick} />
      {isLogged && (
        <div className="relative top-2 border-b-2 border-gray-600 h-44">
          <div className="relative bottom-4">
            <ProfilePic image={BrowsingUserCreds?.profile_image || ''} className="relative top-10 left-4" />
            <textarea
              className="bg-black border-b-1 border-gray-600 h-14 w-75 md:w-98 3xl:w-102 relative left-20 top-2 resize-none focus:outline-none"
              placeholder="What's happening today?!"
              onChange={handleTextInput}
              value={tweetText}
            />
            <SentimentSatisfiedAltIcon
              onClick={() => toggleEmojis()}
              className='absolute top-1/2 right-10 transform -translate-y-1/2 hover:text-gray-200 cursor-pointer'
            />
            <Button
              isLoading={false}
              text="Post"
              className={`relative top-4 left-72 md:left-105 3xl:left-110 font-semibol hover:bg-blue-800 ${tweetText.trim() === '' ? 'bg-blue-800' : 'hover:bg-blue-400'}`}
              disabled={tweetText.trim() === ''}
              onClick={() => postTweet(tweetText)}
            />
            <div className="relative top-96">
              {emojiMode && (
                <div style={{ position: 'absolute', bottom: '0px', right: '0', zIndex: '1' }}>
                  <EmojiPicker
                    width={300}
                    height={350}
                    onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject.emoji)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

      )}
      <div className="relative top-5">
        {activeTab === "forYou" ? <RecentTweets newTweet={newTweet} setNewTweet={setNewTweet} /> : <FollowingTweets newTweet={newTweet} setNewTweet={setNewTweet} />}
      </div>
    </div>
  );
};

export default Home;
