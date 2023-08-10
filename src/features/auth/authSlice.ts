import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { checkCredsValid, chkRefreshToken, login, register, getImageUrl, getUsersData } from './authAPI';


export interface userDataState {
    id: number,
    is_superuser: any,
    username: string,
    display_name:string,
    first_name: string,
    last_name: string,
    email: string,
    is_verified:boolean
    is_staff: any,
    date_joined: any
    profile_image: string,
    is_logged: boolean
}

export interface Users {
    UsersAR:userDataState[]
}

const initialState: userDataState & Users  = {
    is_logged: false,
    id: 0,
    is_superuser: false,
    display_name:'',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_staff: false,
    date_joined: null,
    profile_image:'',
    is_verified:false,
    UsersAR:[]
}

export const loginCheck = createAsyncThunk(
    'auth/login',
    async (cred: any) => {
        const response = await login(cred.username, cred.password)
        return response.data
    }
)

export const credsCheck = createAsyncThunk( 
    'auth/credsCheck',
    async (token:any) => {
        const response = await checkCredsValid(token)  
        console.log(response.status);
        return response.status
    }
)

export const checkRefresh = createAsyncThunk(
    'auth/chkRefresh',
    async (refresh: any) => {
        const response = await chkRefreshToken(refresh)   
        return response.data
    }
)

 export const registerUser = createAsyncThunk(
    'auth/signUp',
    async ( data:any) => {
        console.log(data,'slice');
        const response = await register(data.username, data.password , data.email, data.display_name, data.image)
        return response.data
    }
 )

 export const getPic = createAsyncThunk(
    'auth/getPic',
    async (path: string) => {
      const response = await getImageUrl(path);
      return response 
    }
  );

export const getUsers = createAsyncThunk(
    'auth/users',
    async () => {
        const response = await getUsersData()
        return response.data
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut(state) {
            localStorage.removeItem('refresh')
            sessionStorage.removeItem('session')
            state.is_logged = false
            state.is_staff = false
        },
        getUserData(state) {
            const session = sessionStorage.getItem('session')
            if (session) {
                const token = JSON.parse(atob(session.split(".")[1]))
                console.log('token', token);
                state.username = token['username']
                console.log(token)  
                state.email = token['email']
                state.is_staff = token['staff']
                state.is_superuser = token['super_user']
                state.id = token['user_id']
                state.profile_image = token['image']
                state.display_name = token['display_name']
                state.is_verified = token['is_verified']
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginCheck.fulfilled, (state, action) => {
                state.is_logged = true
                const token = action.payload.access
                sessionStorage.setItem('session', JSON.stringify(token ));
                console.log('check from builder slicer', state.is_logged);
            })
        builder
            .addCase(credsCheck.fulfilled, (state, action) => {
                const status = action.payload
                if (status === 200) {
                    state.is_logged = true
                }else {
                    localStorage.removeItem('session')
                    console.log('bulbul');
                    
                }
            })
        builder
            .addCase(checkRefresh.fulfilled, (state, action) => {
                localStorage.setItem('refresh', JSON.stringify(action.payload.refresh))
                sessionStorage.setItem('session', JSON.stringify(action.payload.access))
            })
        builder
            .addCase(getPic.fulfilled, (state, action) => {
                state.profile_image = action.payload;
              });
        builder
              .addCase(getUsers.fulfilled, (state, action) => {
                state.UsersAR = action.payload
                
                
              })
    }
})

export const { logOut, getUserData } = authSlice.actions
export const selectUserData = (state: RootState) => state.auth;
export const selectAdminStatus = (state: RootState) => state.auth.is_staff
export const selectUsers = (state: RootState) => state.auth.UsersAR
export const selectLoggedStatus = (state: RootState) => state.auth.is_logged
export const selectProfilePic = (state: RootState) => state.auth.profile_image
export default authSlice.reducer