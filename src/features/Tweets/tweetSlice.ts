import { RootState } from '../../app/store';
import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {  postLike, post, getTweetsPage, nextPageTweets, queryLikes } from './tweetAPI'

export interface TweetsTemp {
    id:number,
    created_time:string,
    user_id:number,
    comments:number,
    likes:number
    text:string
}
export interface TweetsLikeTemp {
    id:number,
    user_id:number,
    tweet_id:number,
    liked_by_me:boolean,
    created_time:string
}


export interface Tweets {
    TweetsAR:TweetsTemp[]
    likesAR:TweetsLikeTemp[]
}

const initialState: Tweets = {
    TweetsAR:[],
    likesAR:[]
}

export const postTweetData = createAsyncThunk(
    'tweet/post',
    async(data:any) => {
        const response = await post(data.text, data.user_id)
        return response.data
    }
)

export const getTweets = createAsyncThunk(
    'tweet/get',
    async() => {
        const response = await getTweetsPage()
        return response.data
    }
)

export const nextPage = createAsyncThunk(
    'tweet/nextPage',
    async(page:number) => {
        const response = await nextPageTweets(page)
        console.log(response.data,'twiterrr');
        return response.data
    }
)

export const likeTweet = createAsyncThunk(
    'tweet/like',
    async(data:any) => {
        const response = await postLike(data.user_id, data.tweet_id, data.likes)
        return response
    }
)

export const query_likes = createAsyncThunk(
    'query/like',
    async(data:any) => {
        const response = await queryLikes(data.user_id, data.tweet_id)
        return response.data
    }
)



export const tweetSlice = createSlice({
    name: 'tweet',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getTweets.fulfilled, ( state, action) => {
                state.TweetsAR = action.payload
                console.log(state.TweetsAR);
                
            })
        builder
            .addCase(nextPage.fulfilled, (state, action) => {
                state.TweetsAR.push(...action.payload)
                console.log(state.TweetsAR);
                
            })
        builder
            .addCase(likeTweet.fulfilled, (state, action) => {  
                const updatedLikeResponse = action.payload.incrementResponse.data;
                const likedTweetIndex = state.TweetsAR.findIndex(
                    tweet => tweet.id === updatedLikeResponse.id
                )
                if (likedTweetIndex !== -1) {
                    console.log('works');       
                    state.TweetsAR[likedTweetIndex].likes = updatedLikeResponse.likes;
                }
            })
    }
})


export const selectTweets = (state: RootState) => state.tweet.TweetsAR
export default tweetSlice.reducer