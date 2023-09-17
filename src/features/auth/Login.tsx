import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as icons from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginAsync, selectLoggedStatus } from './authSlice';
import Button from '../componets/Button'
import { GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLogged = useAppSelector(selectLoggedStatus);
    const [ErrorFlag, setErrorFlag] = useState(false)
    const [ErrorMsg, setErrorMsg] = useState('');
    const [inputType, setInputType] = useState('password');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setLoginData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const showPwd = () => {
        if (inputType === 'password') {
            setInputType('text');
        } else {
            setInputType('password');
        }
    };

    const handleLogin = async () => {
        setErrorFlag(false)
        setIsLoading(true); // Set isLoading to true before making the request
        try {
            const res = await dispatch(loginAsync(loginData));
            console.log('ssssss', res);
            if (loginData.username.trim() !== '' && loginData.password.trim() !== '') {
                if (res.type === 'auth/login/fulfilled') {
                    if (rememberMe) {
                        sessionStorage.setItem('refresh', JSON.stringify(res.payload.refresh));
                    }
                    navigate('/');
                } else {

                }
                toast.error('Wrong username or password!'), setErrorFlag(true), setErrorMsg('Wrong username or password.')
            }else toast.error('Must fill all the fields!'), setErrorFlag(true), setErrorMsg('Must fill all the fields.')
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };








    useEffect(() => {
        if (isLogged) {
            navigate('/');
        }
    }, [isLogged, isLoading]);

    return (
        <div className="container p-4 border-gray-600 border-2 w-72 md:w-100 h-96 flex flex-col relative left-14 2xl:left-16 3xl:left-40 top-20 items-center justify-center rounded-lg">
            <ToastContainer theme='colored' />
            <h1 className="text-2xl font-bold mb-4  underline relative right-20">Login</h1>
            <div className="flex flex-col items-center">
                <p className="font-semibold relative right-14">Username</p>
                <input className="input" placeholder="Enter username" name="username" onChange={handleInputChange} /><br />
                <p className="font-semibold relative right-14">Password</p>
                <div>
                    <input className="input" placeholder="Enter password" type={inputType} name="password" value={loginData.password} onChange={handleInputChange} />
                    {inputType === 'password' ? (
                        <icons.AiFillEye className="relative bottom-5 left-40" onClick={showPwd} />
                    ) : (
                        <icons.AiFillEyeInvisible className="relative bottom-5 left-40" onClick={showPwd} />
                    )}
                </div>
                {ErrorFlag && (
                    <p className='text-xs text-red-500 relative right-2'>{ErrorMsg}</p>
                )}<br />
                <div className="flex flex-row relative right-10 bottom-4">
                    <input
                        type='checkbox'
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <p className='text-xs font-semibold relative left-2'>Remember me?</p>
                </div>
                <a href='/register' className="text-xs text-blue-400 underline font-medium relative right-4">Doesn't have an account?</a><br />
                <div className='relative bottom-3'>
                    <div>
                        <div className='border-b-1 border-gray-600 w-20 relative top-1 right-10' />
                        <div className='border-b-1 border-gray-600 w-20 relative top-1 left-40 ' />
                        <p className='text-xs text-center text-gray-400 font-semibold relative bottom-1'>Or continue with</p>
                    </div>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            console.log(credentialResponse);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </div>
                <Button text='Login' isLoading={isLoading} className="w-36 hover:bg-blue-400" onClick={handleLogin} />
            </div>
        </div>
    );
};

export default Login;
