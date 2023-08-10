import ProfilePic from "../auth/ProfilePic"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserData, selectUsers } from "../auth/authSlice";
import { likeTweet, query_likes } from "./tweetSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


interface TweetFormProps {
  tweet_data: {
    id: number,
    created_time: string,
    comments: number,
    likes: number,
    text: string,
    user_id: number
  },
}


const TweetForm: React.FC<TweetFormProps> = ({ tweet_data }) => {
  const users = useAppSelector(selectUsers)
  const user_data = users.find((user: any) => user.id === tweet_data['user_id'])
  const parsedDate = parseISO(tweet_data['created_time'])
  const tweet_id = tweet_data['id']
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectUserData)
  const user_id = user.id
  const formattedDate =
    new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000
      ? formatDistanceToNow(parsedDate, { addSuffix: false })
      : parsedDate.toLocaleDateString()
  const [likedByMe, setLikedByMe] = useState(false)
  const [isLikedCheck, setisLikedCheck] = useState(false)

  
  const tweetLike = (tweet_id: number, likes: number) => {
    const user_id = user.id
    if (user.is_logged) {
      dispatch(likeTweet({ user_id, tweet_id, likes }))
    } else {
      navigate('/login')
    }
  }

  const isLikedByMe = async (user_id: number, tweet_id: number) => {
    try {
      const res = await dispatch(query_likes({ user_id, tweet_id }))
      const response = res.payload;
  
      if (response['like_exists'] === true) {
        setLikedByMe(true);
      } else {
        setLikedByMe(false);
      }
    } catch (error) {
      console.error("An error occurred while fetching like status:", error);
    }
  };
  
  useEffect(() => {
    if (user.is_logged) {
      isLikedByMe(user_id, tweet_data['id'])
    } else {
      setLikedByMe(false);
    }

  }, [user_id, tweet_data['id'], user.is_logged]);




  return (
    <div className="border-b-2 border-gray-600 w-full shrink relative  sm:bottom-5">
      <div className="container  w-95  sm:w-97% p-6 sm:p-8 max-h-max cursor-pointer">
        <div className="flex flex-row flex-shrink">
          <ProfilePic image={user_data?.profile_image || ''} className="relative bottom-4 right-3 cursor-pointer" />
          <div className="flex flex-row relative bottom-4 space-x-1">
            <p className="font-bold hover:underline cursor-pointer text-sm sm:text-base">{user_data?.display_name}</p>
            {user_data?.is_verified && (
              <VerifiedIcon />
            )}
            <p className="text-gray-500 font-semibold font-sans text-sm sm:text-base cursor-pointer">@{user_data?.username}</p>
            <p className="relative left-1 text-gray-500 font-semibold font-sans text-sm sm:text-base">
              <span className="relative right-1 bottom-1 font-bold text-">.</span>
              {formattedDate}</p>
          </div>
        </div>
        <div className="ml-13 w-75 relative bottom-10 left-2">
          <p>{tweet_data['text']}</p>
        </div>
        <div className="flex w-40 flex-row gap-x-4 relative left-14">
          {tweet_data['likes']}
          {likedByMe ? (
            <div>
              <FavoriteIcon className="text-red-500" />
            </div>
          ) :
            <FavoriteBorderIcon
              onClick={() => tweetLike(tweet_id, tweet_data['likes'])}
              className="cursor-pointer hover:text-red-500"
            />
          }
          {tweet_data['comments']}
          <ChatBubbleOutlineIcon className="cursor-pointer hover:text-gray-400" />

        </div>
      </div>
    </div>
  );
};

export default TweetForm;