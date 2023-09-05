import axios from "axios";

const API_SERVER = 'http://127.0.0.1:8000/'

// <----------------------------------- Converstaions API ------------------------------------------>

export const isConverstaionExistAPI = (BrowsingUserID:number, RecipientUserID:number) => {
    const data = {BrowsingUserID, RecipientUserID}
    return axios.post(API_SERVER + 'is-conversation-exist/', data)
}

export const postCoverstaionMessageAPI = async (browsingUserID:number, RecipientID:number, messageContent:number, token:string) => {
    try {
        // Check if the conversation already exists
        const response = await isConverstaionExistAPI(browsingUserID, RecipientID);

        if (response.data.conversation_exists) {
            // If the conversation exists, get the conversation ID
            const conversation_id = response.data.id;
            const data = { text: messageContent, conversation_id, sender_id:browsingUserID }

            // Post the message to the existing conversation
            return axios.post(API_SERVER + `messages/`, data , {
                headers: {
                    Authorization:  `Bearer ${token}`
                }
            });
        } else {
            // If the conversation doesn't exist, create it
            const conversationResponse = await axios.post(API_SERVER + 'conversation/', {
                user1: browsingUserID,
                user2: RecipientID
            });

            // Get the conversation ID from the response
            const conversation_id = conversationResponse.data.id;
            const data = { text: messageContent, conversation_id, sender_id:browsingUserID }

            // Post the message to the newly created conversation
            return axios.post(API_SERVER + `messages/`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        // Handle errors here
        console.error(error);
    }
}

export const findConversationIdAPI = (BrowsingUserID:number, RecipientUserID:number, token:string) => {
    return axios.post(API_SERVER + 'find-conversation-id/', {BrowsingUserID, RecipientUserID}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const fetchUserConversationsAPI = (BrowsingUserID:number, token:string) => {
    return axios.get(API_SERVER + `find-user-conversations/?user_id=${BrowsingUserID}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }) 
}

// <----------------------------------- Messages API ------------------------------------------>

export const fetchMessagesAPI = (conversation_id:number) => {
    return axios.get(API_SERVER + `page-messages/${conversation_id}/?page=1`)
}