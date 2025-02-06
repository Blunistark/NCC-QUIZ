import React from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin, // Redirects user back to app
            },
        });

        if (error) {
            console.error('Google Sign-in Error:', error);
        } else {
            navigate('/home'); // Redirect after login
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <h1 className='text-2xl mb-4'>Login</h1>
            <button onClick={handleGoogleLogin} className='bg-red-500 text-white px-4 py-2 rounded'>
                Sign in with Google
            </button>
        </div>
    );
};

export default Login;
