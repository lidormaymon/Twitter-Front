import axios from "axios";

const API_SERVER = 'http://127.0.0.1:8000/'

export function loginAPI(username:string, password:string){
    const creds = {username, password}
    console.log(creds);
    
    return axios.post(API_SERVER + 'login/' , creds)
}

export function checkCredsValid (token:any) {
    return axios.get(API_SERVER + 'user', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export function register(username: string, password: string, email: string, display_name: string, image: File) {
  const userData = new FormData();
  userData.append('username', username);
  userData.append('password', password);
  userData.append('email', email);
  userData.append('display_name', display_name);
  userData.append('image', image);

  return axios.post(API_SERVER + 'register/', userData);
}

export const chkRefreshToken = (refresh:any) => {   
    const data = {
        "refresh":refresh
    }
    
    return axios.post(API_SERVER + 'refresh/' , data)
}

export const getUsersData = () => {
    return axios.get(API_SERVER + 'user' )
}

export const fetchUserPostsAPI = (user_id:number) => {
    return axios.post(API_SERVER + `user-posts/`, { user_id: user_id})
}

export function searchUsersAPI(searchQuery: string) {
  return axios.get(API_SERVER + 'search-users/?query=' + searchQuery);
}