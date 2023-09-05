import { Link, useNavigate, useParams } from 'react-router-dom'
import { MessageLeftSide } from './MessageLeftSide'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUsers, selectUserData, selectUsers } from '../auth/authSlice'
import { useEffect, useState } from 'react'
import Loader from '../componets/Loader'
import ProfilePic from '../profile/componets/ProfilePic'
import VerifiedIcon from '@mui/icons-material/Verified';
import SendIcon from '@mui/icons-material/Send';
import { fetchMessagesAsync, findConversationIDAsync, postCoverstaionMessageAsync, selectMessages } from './slicer/chatsSlicer'
import MessageForm from './MessageForm'

const MessageChats = () => {
  const { id } = useParams<{ id: string }>()
  const RecipientUserID = Number(id)
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  const BrowsingUserID = BrowsingUser.id
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const users = useAppSelector(selectUsers)
  const recipientCreds = users.find((user) => user.id === RecipientUserID)
  const [inputText, setInputText] = useState('')
  const messages = useAppSelector(selectMessages)
  const tokenString = localStorage.getItem('token')

  const handleInputText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value)
  }

  const postMessage = () => {
    if (tokenString) {
      const token = JSON.parse(tokenString)
      dispatch(postCoverstaionMessageAsync({ BrowsingUserID, RecipientUserID, inputText, token }))
      setInputText('')
    }
  }

  useEffect(() => {
    dispatch(getUsers())
    if (tokenString) {
      const token = JSON.parse(tokenString)
      dispatch(findConversationIDAsync({ BrowsingUserID, RecipientUserID, token })).then(
        (res: any) => {
          const id = res.payload.conversation_id
          dispatch(fetchMessagesAsync(id))
        }
      )
    }
  }, [RecipientUserID, BrowsingUserID])


  useEffect(() => {
    if (isLoading) {
      return
    }
    if (!BrowsingUser.is_logged || BrowsingUser.id === RecipientUserID) {
      navigate('/')
    }
  }, [BrowsingUser.is_logged, isLoading])

  useEffect(() => {
    // Simulate loading of authentication state (replace with actual logic)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the delay as needed
  }, []);

  if (isLoading) {
    return <div className='relative left-80 top-38'><Loader /></div>
  }



  return (
    <div className="message-container">
      <div className='flex'>
        <MessageLeftSide />
        <div className='px-4 py-3 flex flex-col'>
          <div className='flex flex-row'>
            <ProfilePic image={recipientCreds?.profile_image} width={'45px'} />
            <Link to={`/profile /${recipientCreds?.id}`}>
              <p className='mx-3 text-lg font-bold hover:underline'>{recipientCreds?.display_name}</p>
            </Link>
            {recipientCreds?.is_verified && (
              <VerifiedIcon className='relative right-2' />
            )}

          </div>
          <div className='h-114 3xl:h-125'>
            {messages.length > 0 && (
              <>
                {messages.slice().reverse().map((data: any, index: any) => {
                  return (
                    <MessageForm messages={data} key={index} />
                  )
                })}
              </>
            )}
          </div>
          <div className='sticky bottom-0 flex'>
            <textarea
              onChange={(event) => handleInputText(event)}
              value={inputText}
              className='bg-black border-1 border-gray-600 rounded-full w-100  3xl:w-120 focus:outline-none pl-8 pr-8 pt-4 overflow-y-hidden'
              placeholder='Enter a message'
            />
            <SendIcon
              fontSize='small'
              className='relative right-8 top-5 cursor-pointer'
              onClick={() => postMessage()}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default MessageChats