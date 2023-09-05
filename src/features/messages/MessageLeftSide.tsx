import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUsers, selectUserData, selectUsers } from '../auth/authSlice'
import { fetchUserConversationsAsync, selectConverstaionsAR } from './slicer/chatsSlicer'
import ProfilePic from '../profile/componets/ProfilePic'
import { Link } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns';


interface ConversationsListProps {
  data: {
    conversation: {
      id: number,
      user1: number,
      user2: number,
      created_at: string
    }, last_message: {
      id: number,
      sender_id: number,
      text: string,
      timestamp: string,
      conversation_id: number
    }

  }
}

const ConversationsList: React.FC<ConversationsListProps> = ({ data }) => {
  const conversation = data.conversation
  const last_message = data.last_message
  const users = useAppSelector(selectUsers)
  const BrowsingUser = useAppSelector(selectUserData)
  const dispatch = useAppDispatch()
  const RecipientUserID = BrowsingUser.id !== conversation.user1 && conversation.user1 || BrowsingUser.id !== conversation.user2 && conversation.user2
  const RecipientUserCreds = users.find((user) => user.id === RecipientUserID)
  const parsedDate = parseISO(last_message.timestamp)
  const formattedDate =
    new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000 // doing if statement to check if its less than 24 hours
      ? formatDistanceToNow(parsedDate, { addSuffix: false }) // if it is using formatdistancenow to display is as hr/mins/seconds ago
      : parsedDate.toLocaleDateString()



  useEffect(() => {
    dispatch(getUsers())
  }, [])


  return (
    <div>
      <Link to={`/messages/${RecipientUserID}`}>
        <div className='flex relative top-5 h-20 sm:w-65'>
          <div className='flex mx-3'>
            <ProfilePic image={RecipientUserCreds?.profile_image} width={'50px'} />
            <div className='flex flex-col'>
              <div className='flex flex-row'>
                <p className='mx-4 font-bold text-lg'>{RecipientUserCreds?.display_name}</p>
                <p className='relative left-14 text-xs text-gray-400'>{formattedDate}</p>
              </div>
              <p className='mx-4 font-serif'>{last_message.text}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export const MessageLeftSide = () => {
  const dispatch = useAppDispatch()
  const BrowsingUser = useAppSelector(selectUserData)
  const BrowsingUserID = BrowsingUser.id
  const tokenString = localStorage.getItem('token')
  const conversations = useAppSelector(selectConverstaionsAR)


  useEffect(() => {
    if (tokenString) {
      const token = JSON.parse(tokenString)
      dispatch(fetchUserConversationsAsync({ BrowsingUserID, token }))
    }
  }, [BrowsingUserID])

  useEffect(() => {

    console.log(conversations)
  }, [conversations])

  return (
    <div className=" hidden sm:flex flex-row border-r border-gray-600 min-h-screen h-fit w-69 3xl:w-70">
      <div>
        <h1 className="px-5 py-5 text-2xl font-bold font-serif">Messages</h1>
        <div>
          SEARCH CHATS INPUT
        </div>
        <div className='py-3'>
          {conversations.length > 0 ? (
            <>
              {conversations.map((data: any, index: any) => {
                return (
                  <ConversationsList data={data} key={index} />
                )
              })}
            </>
          ) : (
            <div>
              <p>No active chats yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
