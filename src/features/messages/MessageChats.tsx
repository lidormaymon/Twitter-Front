import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConversationList } from './ConversationList'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUsers, selectUserData, selectUsers } from '../auth/authSlice'
import { useEffect, useRef, useState } from 'react'
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
  const token = tokenString ? JSON.parse(tokenString) : null
  const [conversation_id, setConversation_id] = useState(0)
  const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${conversation_id}/`)
  const [receivedMessages, setReceivedMessages] = useState<
    {
      text: string;
      sender_id: number;
      conversation_id: number;
      timestamp: string; // Use the appropriate date format
    }[]
  >([]);

  const [recieveMessages, setrecieveMessages] = useState<{
    text: string,
    sender_id: number,
    timestamp: string
  }[]>([])



  const handleInputText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value)
  }

  const postMessage = () => {
    dispatch(postCoverstaionMessageAsync({ BrowsingUserID, RecipientUserID, inputText, token }))
    const text = inputText
    const sender_id = BrowsingUserID
    const timestamp = new Date().toISOString();
    chatSocket.send(JSON.stringify({ text, sender_id, conversation_id, timestamp  }));
    setInputText('')
  }

  const handleTextareaKeyPress = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline character from being added
      postMessage(); // Call the function to send the message
    }
  };


  useEffect(() => {
    const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${conversation_id}/`);

    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      const message = data.message;
      const sender_id = data.sender_id; // Retrieve sender_id
      const timestamp = data.timestamp
      const conversation_id = data.conversation_id
      console.log(data);
      setrecieveMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender_id, timestamp, conversation_id } // Include sender_id in the message
      ]);
      console.log(receivedMessages);
    };

    chatSocket.onclose = function (event) {
      console.log("Connection closed: code=" + event.code + ", reason=" + event.reason);
    };

    return () => {
      // Clean up the WebSocket connection when the component unmounts.
      chatSocket.close();
    };
  }, [conversation_id]);


  useEffect(() => {
    dispatch(getUsers());
    if (tokenString) {
      const token = JSON.parse(tokenString);
      dispatch(findConversationIDAsync({ BrowsingUserID, RecipientUserID, token })).then(
        (res: any) => {
          setConversation_id(res.payload.conversation_id);
          dispatch(fetchMessagesAsync(res.payload.conversation_id)); // Use the updated conversation_id
        }
      );
    }
  }, [RecipientUserID, BrowsingUserID]);


  

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
    return <div className='relative left-80 top-38'><Loader isTextLoading={true} /></div>
  }



  return (
    <div className="message-container overflow-y-hidden">
      <div className='flex'>
        <ConversationList />
        <div className='px-4 py-3 flex flex-col w-95 sm:w-full'>
          <div className='flex flex-row'>
            <ProfilePic image={recipientCreds?.profile_image} width={'45px'} />
            <Link to={`/profile /${recipientCreds?.id}`}>
              <p className='mx-3 text-lg font-bold hover:underline'>{recipientCreds?.display_name}</p>
            </Link>
            {recipientCreds?.is_verified && (
              <VerifiedIcon className='relative right-2' />
            )}
          </div>
          <div className='h-114 sm:h-110 3xl:h-125 overflow-y-scroll scroll-smooth scroll-into-view-bot scroll custom-scrollbar'> 
            {messages.length > 0 && (
              <>
                {messages.slice().reverse().map((data: any, index: any) => {
                  return (
                    <MessageForm messages={data} key={index} />
                  );
                })}
              </>
            )}
            {recieveMessages.length > 0 && (
              <>
                {recieveMessages.map((data: any, index: any) => {
                  return (
                    <MessageForm messages={data} key={index} />
                  )
                })}
              </>
            )}
          </div>
          <div className='sticky bottom-0 flex'>
            <textarea
              onKeyPress={(event) => handleTextareaKeyPress(event)}
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