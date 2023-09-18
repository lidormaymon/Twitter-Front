import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectUserData } from '../auth/authSlice'
import { formatDistanceToNow, parseISO } from 'date-fns';
import TweetImage from '../componets/DisplayImage';

interface MessageFormProps {
  messages: {
    id: number,
    sender_id: number,
    conversation_id: number,
    text: string,
    timestamp: string,
    image:string
  }
}

const MessageForm: React.FC<MessageFormProps> = ({ messages }) => {
  const BrowsingUser = useAppSelector(selectUserData)
  const parsedDate = parseISO(messages.timestamp)
  const formattedDate =
    new Date().getTime() - parsedDate.getTime() < 24 * 60 * 60 * 1000 // doing if statement to check if its less than 24 hours
      ? formatDistanceToNow(parsedDate, { addSuffix: false }) // if it is using formatdistancenow to display is as hr/mins/seconds ago
      : parsedDate.toLocaleDateString()


  return (
    <div className='flex flex-col relative top-5 py-3'>
      {BrowsingUser.id === messages.sender_id ? (
        <>
          <div className="flex justify-end mb-4">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              {messages.image !== null && (
                <TweetImage image={messages.image} />
              )}
              {messages.text.trim() !== "" && (
                <p>{messages.text}</p>
              )}
            </div>
          </div>
          <div className='flex justify-end relative bottom-2 mb-4'>
            <p className='text-xs font-semibold'>{formattedDate}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-start mb-4">
            <div className="bg-gray-400 text-white p-2 rounded-lg">
            {messages.image !== null && (
                <TweetImage image={messages.image} />
              )}
              {messages.text.trim() !== "" && (
                <p>{messages.text}</p>
              )}
            </div>
          </div>
          <div className='flex justify-start relative bottom-2 mb-4'>
            <p className='text-xs font-semibold'>{formattedDate}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default MessageForm