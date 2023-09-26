import { useEffect, useRef, useState } from "react";
import FollowingTweets from "./Tweets/FollowingTweets";
import RecentTweets from "./Tweets/RecentTweets";
import { getUsers, selectLoggedStatus, selectUserData, selectUsers } from "./auth/Slicer/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { postTweetData } from "./Tweets/slicer/tweetSlice";
import Button from "./componets/Button";
import ProfilePic from "./profile/componets/ProfilePic";
import EmojiPicker from 'emoji-picker-react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';


interface HeaderProps {
  activeTab: string;
  handleTabClick: any;
}

const Header = ({ activeTab, handleTabClick }: HeaderProps) => {
  const isLogged = useAppSelector(selectLoggedStatus)
  return (
    <div className={`sticky top-9 sm:top-0 h-fit self-start z-50 bg-black border-r-1 border-gray-600 container  w-full sm:w-105 3xl:w-108`}>
      <div className="sticky top-0 ">
        <div className="border-b border-gray-600">
          <h1 className="font-bold font- text-xl mx-2 px-2 py-4">Home</h1>
          <div className="container flex flex-row">
            <div
              className={`${isLogged === true ? 'w-1/2 p-4 py-5 cursor-pointer hover:bg-gray-600' : 'w-full p-4 py-5 cursor-pointer hover:bg-gray-600'} `}
              onClick={() => handleTabClick("forYou")}
            >
              <div className="flex flex-col">
                <p className={`text-center ${activeTab === 'forYou' ? "text-white relative" : "text-gray-400"}`}>For you</p>
                <div className="flex flex-row w-full justify-center ">
                  <div className={`${activeTab === 'forYou' && "w-14 h-2 rounded-full bg-blue-500 center relative top-5  sm:top-5 "}
                  ${!isLogged && 'w-14 h-2 rounded-full bg-blue-500  relative top-5 sm:top-5'}`}></div> {/* this div */}
                </div>
              </div>
            </div>
            {isLogged && (
              <div
                className={`w-1/2 p-4 py-5 cursor-pointer hover:bg-gray-600 `}
                onClick={() => handleTabClick("following")}
              >
                <div>
                  <p className={`text-center ${activeTab !== 'forYou' ? "text-white" : "text-gray-400"}`}>Following</p>
                  <div className="flex flex-row self w-full justify-center">
                    <div className={`${activeTab !== 'forYou' && "w-14 h-2 rounded-full bg-blue-500  relative top-5 sm:top-5"}`}></div>
                  </div>
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
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)


  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetText(event.target.value);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null);
    }
  };

  // Function to trigger the hidden file input
  const triggerFileInput = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const postTweet = (text: string) => {
    const data = { user_id: BrowsingUser.id, text: text }
    if (selectedFile !== null) { //checking if image was selected to know if to attach it
      const data = { user_id: BrowsingUser.id, text: text, image: selectedFile }
      dispatch(postTweetData(data))
    } else dispatch(postTweetData(data))
    setNewTweet(true)
    setTweetText('')
    setSelectedFile(null)
  };

  const toggleEmojis = () => {
    emojiMode ? setEmojiMode(false) : setEmojiMode(true)
  }

  const handleEmojiClick = (emoji: any) => {
    setTweetText((prevText) => prevText + emoji);
  }

  const isButtonDisabled = () => {
    if (tweetText.trim() === "" && selectedFile === null) {
      return true
    }
  };

  useEffect(() => {
    dispatch(getUsers())
  }, [])

  useEffect(() => {

  }, [selectedFile])



  return (
    <div>
      <Header activeTab={activeTab} handleTabClick={handleTabClick} />
      {isLogged && (
        <div className="relative top-2 border-b-2 border-gray-600 h-44">
          <div className="relative bottom-4">
            <ProfilePic image={BrowsingUserCreds?.profile_image || ''} className="relative top-10 left-4" />
            <div className="relative">
              {selectedFile && (
                <>
                  <CloseIcon onClick={() => setSelectedFile(null)} className="absolute top-18 left-44 cursor-pointer" />
                  <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="absolute top-18 left-28 h-14 w-14" />
                </>
              )}
              <div className="flex flex-row">
                <textarea
                  className="bg-black border-b-1 border-gray-600 h-14 w-75 sm:w-[30rem] md:w-98 3xl:w-102 pl-5 relative left-20 top-2  focus:outline-none"
                  placeholder="What's happening today?!"
                  onChange={handleTextInput}
                  value={tweetText}
                />
                <div className="w-fit z-40">
                  <SentimentSatisfiedAltIcon
                    onClick={() => toggleEmojis()}
                    className='flex flex-row flex-end hover:text-gray-200 cursor-pointer'
                  />
                </div>
              </div>
            </div>



            <div className="flex">
              <Button
                isLoading={false}
                text="Post"
                className={`relative top-4 left-72 md:left-105 3xl:left-110 font-semibol hover:bg-blue-800
                   ${isButtonDisabled() ? 'bg-blue-800' : 'hover:bg-blue-400'}`}
                disabled={isButtonDisabled()}
                onClick={() => postTweet(tweetText)}
              />
              <ImageIcon className="relative top-7 right-5 cursor-pointer" onClick={triggerFileInput} />
              <input
                onChange={handleFileInputChange}
                className="hidden"
                ref={hiddenFileInput}
                type="file"
                accept="image/jpg, image/jpeg, image/png"
              />
            </div>

            <div className="relative top-96">
              {emojiMode && (
                <div className="absolute bottom-0 right-0 z-10">
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
