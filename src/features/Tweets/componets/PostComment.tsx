import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import ProfilePic from "../../profile/componets/ProfilePic"
import { selectUserData } from "../../auth/authSlice"
import Button from "../../componets/Button"
import { postCommentAsync } from "../slicer/tweetSlice"


interface CommentProps {
  tweet_id:number
  comments:number
  className:string
  setnewComment?:React.Dispatch<React.SetStateAction<boolean>>
}

const PostComment: React.FC<CommentProps> = ({className, tweet_id, comments,  setnewComment}) => {
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  const BrowsingUserID = BrowsingUser.id

  const [commentText, setCommentText] = useState('')

  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  const commentTweet = (text: string) => {
    const data = { text, user_id:BrowsingUserID, tweet_id, comments  }
    console.log(data);
    dispatch(postCommentAsync(data))
    if (setnewComment) {
      setnewComment(true)
    }
    setCommentText('')
  }

  return (
    <div className={`container border-t border-gray-600 ${className}`}>
      <div className="border-b border-gray-600 p-5 w-full">
        <div className='flex flex-row'>
          <ProfilePic image={BrowsingUser.profile_image} className="w-11 sm:w-14" />
          <textarea
            className="bg-black mx-5 relative bottom-1 outline-none w-full"
            placeholder="Post your reply!"
            value={commentText}
            onChange={handleTextInput}
          />
        </div>
        <Button 
          text="Post"
          className={`h-8 w-20 relative left-67 md:h-10 md:w-20 md:left-105 ${commentText.trim() === '' ? 'bg-blue-800' : 'hover:bg-blue-400'}`}
          disabled={commentText.trim() === ''}
          onClick={()=> commentTweet(commentText)}
        />
      </div>
    </div>
  )
}

export default PostComment