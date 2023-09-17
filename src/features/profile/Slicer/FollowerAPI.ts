import axios from "axios";

const API_SERVER = 'http://127.0.0.1:8000/'

export const fetchFollowersAPI = () =>{
    return axios.get(API_SERVER + 'followers/')
}

export const postFollowAPI = (from_user_id:number, to_user_id:number) => {
    const data = {from_user_id, to_user_id}
    return axios.post(API_SERVER + 'followers/', data)
}

export const deleteFollowAPI = (follow_id:number) => {
    return axios.delete(API_SERVER + `followers/${follow_id}`)
}

export const isFollowingAPI = (from_user_id:number, to_user_id:number) => {
    const data = {from_user_id, to_user_id}
    return axios.post(API_SERVER + 'query-followers/', data)
}

export const countFollowersFollowingAPI = (user_id:number) => {
    return axios.post(API_SERVER + 'followers-following-count/', {user_id})
}

export const fetchFollowersListAPI = (user_id:number) => {
    return axios.post(API_SERVER + 'followers-list/', {user_id})
}