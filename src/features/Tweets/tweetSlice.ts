import { RootState } from '../../app/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postLike, post, fetchTweetsPage, nextPageTweets, queryLikes, removeLike, fetchLikes } from './tweetAPI'

export interface TweetsTemp {
    id: number,
    created_time: string,
    user_id: number,
    comments: number,
    likes: number
    text: string
    liked_by_me: boolean
}
export interface TweetsLikeTemp {
    id: number,
    user: number,
    tweet: number,
    created_time: string
}


export interface Tweets {
    TweetsAR: TweetsTemp[]
    likesAR: TweetsLikeTemp[]
}

const initialState: Tweets = {
    TweetsAR: [],
    likesAR: []
}

export const postTweetData = createAsyncThunk(
    'tweet/post',
    async (data: any) => {
        const response = await post(data.text, data.user_id)
        return response.data
    }
)

export const getTweets = createAsyncThunk(
    'tweet/get',
    async () => {
        const response = await fetchTweetsPage()
        return response.data
    }
)

export const nextPage = createAsyncThunk(
    'tweet/nextPage',
    async (page: number) => {
        const response = await nextPageTweets(page)
        console.log(response.data, 'twiterrr');
        return response.data
    }
)

export const getLikes = createAsyncThunk(
    'getLikes/likes',
    async () => {
        const response = await fetchLikes()
        return response.data
    }
)

export const likeTweet = createAsyncThunk(
    'tweet/like',
    async (data: any) => {
        const response = await postLike(data.BrowsingUserID, data.tweet_id, data.likes)
        return response
    }
)

export const query_likes = createAsyncThunk(
    'query/like',
    async (data: any) => {
        const response = await queryLikes(data.BrowsingUserID, data.tweet_id)
        return response.data
    }
)

export const undoLike = createAsyncThunk(
    'delete/like',
    async (data: any) => {
        const response = await removeLike(data.likeID, data.tweet_id, data.likes)
        return response
    }
)



export const tweetSlice = createSlice({
    name: 'tweet',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getTweets.fulfilled, (state, action) => {
                state.TweetsAR = action.payload          
            })
        builder
            .addCase(nextPage.fulfilled, (state, action) => {
                state.TweetsAR.push(...action.payload)
            })
        builder
            .addCase(getLikes.fulfilled, ( state, action) => {
                state.likesAR = action.payload
            })
        builder
            .addCase(likeTweet.fulfilled, (state, action) => {
                const updatedLikeResponse = action.payload.incrementResponse.data
                
                const likedTweetIndex = state.TweetsAR.findIndex(
                    tweet => tweet.id === updatedLikeResponse.id
                )
                if (likedTweetIndex !== -1) {
                    state.TweetsAR[likedTweetIndex].likes = updatedLikeResponse.likes
                    state.TweetsAR[likedTweetIndex].liked_by_me = true
                    state.likesAR = action.payload.likeResponse.data          
                }
            })
        builder
            .addCase(undoLike.fulfilled, (state, action) => {
                const updatedLikeResponse = action.payload.decremenetLikesResponse.data
                const likedTweetIndex = state.TweetsAR.findIndex(
                    tweet => tweet.id === updatedLikeResponse.id
                )
                if (likedTweetIndex !== -1) {

                    state.TweetsAR[likedTweetIndex].likes = updatedLikeResponse.likes
                }
            })
        builder
            .addCase(query_likes.fulfilled, (state, action) => {
                const updatedLikeResponse = action.payload
                const likedTweetIndex = state.TweetsAR.findIndex(
                    tweet => tweet.id === updatedLikeResponse.tweet_id
                ) 
                const likeExists = updatedLikeResponse['like_exists'];
                if (likeExists === true) {
                    state.TweetsAR[likedTweetIndex].liked_by_me = likeExists;

                }
            })
    }
})


export const selectTweets = (state: RootState) => state.tweet.TweetsAR
export const selectLikes = ( state: RootState) => state.tweet.likesAR
export default tweetSlice.reducer