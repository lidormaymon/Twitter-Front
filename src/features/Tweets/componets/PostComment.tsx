import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import ProfilePic from "../../profile/componets/ProfilePic"
import { getUsers, selectUserData, selectUsers } from "../../auth/authSlice"
import Button from "../../componets/Button"
import { postCommentAsync } from "../slicer/tweetSlice"
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import EmojiPicker from 'emoji-picker-react';


interface CommentProps {
  tweet_id: number
  comments: number
  className: string
  setnewComment?: React.Dispatch<React.SetStateAction<boolean>>
}

const PostComment: React.FC<CommentProps> = ({ className, tweet_id, comments, setnewComment }) => {
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  const users = useAppSelector(selectUsers)
  const BrowsingUserCreds = users.find((user) => user.id === BrowsingUser.id)
  const [commentText, setCommentText] = useState('')
  const [emojiMode, setEmojiMode] = useState(false)

  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  }

  const commentTweet = (text: string) => {
    const data = { text, user_id: BrowsingUser.id, tweet_id, comments }
    console.log(data);
    dispatch(postCommentAsync(data))
    if (setnewComment) {
      setnewComment(true)
    }
    setCommentText('')
  }

  const toggleEmojis = () => {
    emojiMode ? setEmojiMode(false) : setEmojiMode(true)
  }

  const handleEmojiClick = (emoji: any) => {
    setCommentText((prevText) => prevText + emoji);
  }

  useEffect(() => {
    dispatch(getUsers())
  }, [])
  

  return (
    <div className={`container border-t border-gray-600 ${className}`}>
      <div className="border-b border-gray-600 p-5 w-full">
        <div className='flex flex-row'>
          <ProfilePic image={BrowsingUserCreds?.profile_image || ''} className="w-11 sm:w-14" />
          <div className="relative">
            {emojiMode && (
              <div className="absolute bottom-10 z-10 left-0 sm:left-60" >
                <EmojiPicker
                  width={300}
                  height={350}
                  onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject.emoji)}
                />
              </div>
            )}
          </div>
          <textarea
            className="bg-black mx-5 relative bottom-1 outline-none w-full"
            placeholder="Post your reply!"
            value={commentText}
            onChange={handleTextInput}
          />
        </div>
        <SentimentSatisfiedAltIcon
          onClick={() => toggleEmojis()}
          className='relative left-60 top-7 sm:left-102 hover:text-gray-200 cursor-pointer'
        />
        <Button
          isLoading={false}
          text="Post"
          className={`h-8 w-20 relative left-67 md:h-10 md:w-20 md:left-105 ${commentText.trim() === '' ? 'bg-blue-800' : 'hover:bg-blue-400'}`}
          disabled={commentText.trim() === ''}
          onClick={() => commentTweet(commentText)}
        />
      </div>
    </div>
  )
}

export default PostComment