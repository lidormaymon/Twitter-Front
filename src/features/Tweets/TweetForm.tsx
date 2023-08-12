import ProfilePic from "../auth/ProfilePic"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserData, selectUsers } from "../auth/authSlice";
import { likeTweet, query_likes, undoLike, selectLikes, getLikes } from "./tweetSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


interface TweetFormProps {
  tweet_data: {
    id: number,
    created_time: string,
    comments: number,
    likes: number,
    text: string,
    user_id: number,
    liked_by_me:boolean
  },
}


const TweetForm: React.FC<TweetFormProps> = ({ tweet_data }) => {
  const users = useAppSelector(selectUsers)
  const tweeterCreds = users.find((user: any) => user.id === tweet_data['user_id']) // getthing the user data of the poster of the tweet by using getting it from tweet_data
  const parsedDate = parseISO(tweet_data['created_time'])
  const tweet_id = tweet_data['id']
  const likedByMe = tweet_data['liked_by_me']
  const likes_data = useAppSelector(selectLikes)
  const [newLike, setnewLike] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectUserData)
  const BrowsingUserID = user.id
  const formattedDate =
    new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000 // doing if statement to check if its less than 24 hours
      ? formatDistanceToNow(parsedDate, { addSuffix: false }) // if it is using formatdistancenow to display is as hr/mins/seconds ago
      : parsedDate.toLocaleDateString()


  
  const tweetLike = (tweet_id: number, likes: number) => {
    if (user.is_logged) {
      dispatch(likeTweet({ BrowsingUserID, tweet_id, likes }))
      setnewLike(true)
    } else {
      navigate('/login')
    }
  }
  


  const unLike = ( tweet_id: number, likes: number) => {
    console.log('tweet id',tweet_id,'browsing user id', BrowsingUserID);
    const index = likes_data.findIndex(
      (like) => like.user === BrowsingUserID && like.tweet === tweet_id
    )
    const likeID = likes_data[index]['id']
    console.log('Found like ID:', likeID); 
    try {
      dispatch(undoLike({ likeID, tweet_id, likes }))
    } catch (error) {
      console.log('An error occured while trying to unlike this tweet', error);

    }
  }

  useEffect(() => {
    dispatch(getLikes())

    if (newLike) {
      setnewLike(false)
    }
  }, [newLike])
  


  useEffect(() => {
    if (user.is_logged) {
      dispatch(query_likes({ BrowsingUserID, tweet_id }))
    } 
  }, [BrowsingUserID, tweet_data['id'], user.is_logged, likedByMe]);



  

  return (
    <div className="border-b-2 border-gray-600 w-full shrink relative  sm:bottom-5">
      <div className="container  w-95  sm:w-97% p-6 sm:p-8 max-h-max cursor-pointer">
        <div className="flex flex-row flex-shrink">
          <ProfilePic image={tweeterCreds?.profile_image || ''} className="relative bottom-4 right-3 cursor-pointer" />
          <div className="flex flex-row relative bottom-4 space-x-1">
            <p className="font-bold hover:underline cursor-pointer text-sm sm:text-base">{tweeterCreds?.display_name}</p>
            {tweeterCreds?.is_verified && (
              <VerifiedIcon />
            )}
            <p className="text-gray-500 font-semibold font-sans text-sm sm:text-base cursor-pointer">@{tweeterCreds?.username}</p>
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
              <FavoriteIcon 
                className="text-red-500"
                onClick={()=> unLike(tweet_data['id'], tweet_data['likes'])}
              />
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