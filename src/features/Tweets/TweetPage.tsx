import { useAppDispatch, useAppSelector } from "../../app/hooks"
import ProfilePic from "../profile/componets/ProfilePic"
import { getUsers, selectUserData, selectUsers } from "../auth/authSlice"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VerifiedIcon from '@mui/icons-material/Verified'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { likeTweet, query_likes, undoLike, selectLikes, getLikes, selectTweets, getTweet, getPageComments, selectTweetComments, selectTweetIsLoading, deleteTweetAsync } from "./slicer/tweetSlice"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Loader from "../componets/Loader"
import PostComment from "./componets/PostComment"
import Comment from "./componets/Comment"
import BackButton from "../componets/BackButton"
import { Link } from "react-router-dom";



const TweetPage = () => {
  const { id } = useParams<{ id: string }>() // Use type annotation to indicate the parameter type
  const tweet_id = Number(id)
  const isLoading = useAppSelector(selectTweetIsLoading)
  const tweet_comments = useAppSelector(selectTweetComments)
  const tweets = useAppSelector(selectTweets)
  const tweetData = tweets[0] 
  const users = useAppSelector(selectUsers)
  const posterCreds = tweetData ? users.find((user: any) => user.id === tweetData.user_id) : null; // getthing the user data of the poster of the tweet by using getting it from tweet_data
  const likedByMe = tweetData?.liked_by_me
  const likes_data = useAppSelector(selectLikes)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const BrowsingUser = useAppSelector(selectUserData)
  const [toggleOptionsFlag, setToggleOptionsFlag] = useState(false)
  const BrowsingUserID = BrowsingUser.id
  const parsedDate = parseISO(tweetData?.created_time || '')
  const [newComment, setnewComment] = useState(false)
  const formattedDate =
    new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000 // doing if statement to check if its less than 24 hours
      ? formatDistanceToNow(parsedDate, { addSuffix: false }) // if it is using formatdistancenow to display is as hr/mins/seconds ago
      : parsedDate.toLocaleDateString()

  const tweetLike = (tweet_id: number, likes: number) => {
    if (BrowsingUser.is_logged) {
      dispatch(likeTweet({ BrowsingUserID, tweet_id, likes }))
    } else {
      navigate('/login')
    }
  }
  console.log(tweets);
  

  const unLike = (tweet_id: number, likes: number) => {
    const index = likes_data.findIndex(
      (like) => like.user_id === BrowsingUserID && like.tweet_id === tweet_id
    )
    const likeID = likes_data[index]['id']
    console.log('Found like ID:', likeID);
    dispatch(undoLike({ likeID, tweet_id, likes }))
  }

  const toggleOption = (event: React.MouseEvent) => {
    event.preventDefault()
    if (toggleOptionsFlag) {
      setToggleOptionsFlag(false)
      console.log('lidor');
    } else {
      setToggleOptionsFlag(true)
    }
  }

  const deleteTweet = (event: React.MouseEvent, tweet_id: number) => {
    event.preventDefault()
    dispatch(deleteTweetAsync(tweet_id))
    setToggleOptionsFlag(false)
  }

  useEffect(() => {
    dispatch(getTweet(tweet_id))
    dispatch(getPageComments(tweet_id))
    dispatch(getUsers())
    if (newComment) {
      setnewComment(false)
    }
  }, [newComment])

  useEffect(() => {
    dispatch(getLikes())
  }, [])
  

  useEffect(() => {
    if (BrowsingUser.is_logged) {
      dispatch(query_likes({ BrowsingUserID, tweet_id }))
    }
  }, [ tweet_id, BrowsingUser.is_logged, likedByMe, BrowsingUserID])

  if (!tweetData || !tweetData.user_id) {
    return <div className="relative left-44 top-44 sm:left-72"><Loader /></div>; // Render a loading indicator
  }

 

  return (
    <div className="my-container">
      <div className="mx-2 sm:mx-10 relative top-10 h-">
        <div className="felx flex row relative bottom-5 sm:right-4 space-x-4">
            <BackButton />
            <p className="text-xl font-bold">Post</p>
        </div>
        <div className="flex relative bottom-3 sm:bottom-0 sm:right-4">
          <Link to={`/profile/${posterCreds?.id}`}>
            <ProfilePic image={posterCreds?.profile_image} className="sm:w-14" alt="profile image" />
          </Link>
          <div className="mx-5 flex">
            <Link to={`/profile/${posterCreds?.id}`}>
              <p className="text-lg font-bold hover:underline">{posterCreds?.display_name}</p>
            </Link>
            {posterCreds?.is_verified && (
              <VerifiedIcon className="mx-1" />
            )}
            <Link to={`/profile/${posterCreds?.id}`}>
              <p className="text-gray-500 font-semibold hover:underline " >@{posterCreds?.username}</p>
            </Link>
            <p className="text-gray-500 relative bottom-1 font-bold mx-1">.</p>
            <p className="text-gray-500 font-semibold">{formattedDate}</p>
            <div className="flex items-center">
                {(BrowsingUserID === posterCreds?.id || BrowsingUser.is_staff) && (
                  <>
                    {toggleOptionsFlag ? (
                      <div className="flex">
                        <div className="w-16 rounded-md text-gray-400 font-semibold bg-gray-800 relative -left-1 sm:-left-1 text-center">
                          {BrowsingUser.id === posterCreds?.id && (
                            <p className="border-b border-gray-600 hover:bg-gray-600">Edit</p>
                          )}
                          <p onClick={(event) => deleteTweet(event, tweet_id)} className="hover:bg-gray-600">Delete</p>
                        </div>
                      </div>
                    ) : null}
                    <MoreHorizIcon
                      className="flex flex-row text-gray-600 cursor-pointer relative bottom-4"
                      onClick={(event) => toggleOption(event)}
                    />
                  </>
                )}
              </div>
          </div>
        </div>
        <div className="relative left-20 bottom-5 w-72">
          {tweetData.text}
        </div>
        <div className="flex w-40 flex-row gap-x-4 relative left-14">
          {tweetData.likes}
          {likedByMe ? (
            <div>
              <FavoriteIcon
                className="cursor-pointer text-red-500"
                onClick={() => unLike(tweet_id, tweetData.likes)}
              />
            </div>
          ) :
            <FavoriteBorderIcon
              onClick={() => tweetLike(tweet_id, tweetData.likes)}
              className="cursor-pointer hover:text-red-500"
            />
          }
          {tweetData.comments}
          <ChatBubbleOutlineIcon className="cursor-pointer hover:text-gray-400" />
        </div>
        <div className="relative right-10 w-97 sm:w-105 border-b border-gray-600 h-4 sm:h-6" />
        {BrowsingUser.is_logged && (
          <PostComment setnewComment={setnewComment} comments={tweetData.comments} tweet_id={tweet_id} className="border-t-0 relative right-4 sm:right-10 w-96 sm:w-105"  />
        )}
      </div>
      {tweet_comments.map((data:any, index:any) => (
          <div key={index} >
              <Comment  tweet_comments={data} />
          </div>
        ))}
    </div>
  )
}

export default TweetPage