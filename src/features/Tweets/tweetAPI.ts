import axios from "axios";


const API_SERVER = 'http://127.0.0.1:8000/'

export const post = (text:string, user_id:number) => {
    const data = { text, user_id}
    return axios.post(API_SERVER + 'tweets/', data)
}

export const getTweetsPage = () => {  
    return axios.get(API_SERVER + 'page-tweets?page=1')
};

export const nextPageTweets = (page:number) => {
    const params = { page }
    return axios.get(API_SERVER + 'page-tweets', { params });
}


export const postLike = (user:number, tweet:number, likes:number) => {
    const data = { user, tweet }
    const likesData = { likes:likes + 1}
    const postLikeRequest = axios.post(API_SERVER + 'tweet-like/', data)
    const incrementLikesRequest = axios.put(API_SERVER + `tweets/${tweet}/`, likesData)
    

    return axios.all([postLikeRequest, incrementLikesRequest])
        .then(axios.spread((likeResponse, incrementResponse) => {
            return { likeResponse, incrementResponse }
        }))
        .catch(error => {
            throw error
        });
};


export const queryLikes = (user_id:number, tweet_id:number) => {
    return axios.post(API_SERVER + 'query-likes/', {user_id, tweet_id})
}

export const removeLike = (like_id:number, tweet:number, likes:number) => {

    const likesData = { likes:likes - 1}
    const postLikeRequest = axios.delete(API_SERVER + 'tweet-like/', )
    const incrementLikesRequest = axios.put(API_SERVER + `tweets/${tweet}/`, likesData)
}