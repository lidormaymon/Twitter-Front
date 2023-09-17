import { useEffect, useState } from "react"
import { ConversationList } from "./ConversationList"
import { useAppSelector } from "../../app/hooks"
import { selectUserData } from "../auth/authSlice"
import { useNavigate } from "react-router-dom"
import Loader from "../componets/Loader"



const MessageEmpty = () => {
  const BrowsingUser = useAppSelector(selectUserData)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!BrowsingUser.is_logged) {
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
    return <div className="relative left-80 top-38"><Loader isTextLoading={true} /></div>
  }
  
  return (
    <div className="message-container">
        <ConversationList />
    </div>
  )
}

export default MessageEmpty