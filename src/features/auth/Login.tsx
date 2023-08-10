import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as icons from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginCheck, selectLoggedStatus } from './authSlice';
import Button from '../componets/Button';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLogged = useAppSelector(selectLoggedStatus);
    const [wrongCredMSG, setWrongCredMSG] = useState(false);
    const [inputType, setInputType] = useState('password');
    const [rememberMe, setRememberMe] = useState(false);
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

    const handleLogin = () => {
        dispatch(loginCheck(loginData)).then((res) => {
            console.log('ssssss', res);
            if (res.type === 'auth/login/fulfilled') {
                if (rememberMe) {
                    localStorage.setItem('refresh', res.payload.refresh);
                }
                navigate('/');
            } else {
                setWrongCredMSG(true);
            }
        });
    };

    useEffect(() => {
        if (isLogged) {
            navigate('/');
        }
    }, [isLogged]);

    return (
        <div className="container mx-auto p-4 border-gray-600 border-2 w-72 md:w-100 h-96 flex flex-col relative 2xl:left-16 3xl:left-40 top-20 left-10 items-center justify-center rounded-lg">
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
                {wrongCredMSG && (
                    <p className='text-xs text-red-500 relative right-2'>Wrong username or password</p>
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
                <Button text='Login' className="w-36" onClick={handleLogin} />
            </div>
        </div>
    );
};

export default Login;
