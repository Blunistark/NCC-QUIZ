import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [regimentalNumber, setRegimentalNumber] = useState('');
    const [school, setSchool] = useState('');
    const [unit, setUnit] = useState('');
    const [group, setGroup] = useState('');
    const [directorate, setDirectorate] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevents default form submission

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setErrorMsg(error.message);
            console.error('Sign Up Error:', error);
            return;
        }

        if (data.user) {
            await supabase.from('users').insert([
                {
                    id: data.user.id,
                    email,
                    name,
                    regimental_number: regimentalNumber,
                    school,
                    unit,
                    group,
                    directorate
                }
            ]);

            navigate('/home');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <h1 className='text-2xl mb-4'>Sign Up</h1>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            <form onSubmit={handleSignup} className="flex flex-col">
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='border p-2 mb-2' required/>
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='border p-2 mb-2' required/>
                <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} className='border p-2 mb-2' required/>
                <input type='text' placeholder='Regimental Number' value={regimentalNumber} onChange={(e) => setRegimentalNumber(e.target.value)} className='border p-2 mb-2' required/>
                <input type='text' placeholder='School/University' value={school} onChange={(e) => setSchool(e.target.value)} className='border p-2 mb-2' required/>
                <input type='text' placeholder='Unit' value={unit} onChange={(e) => setUnit(e.target.value)} className='border p-2 mb-2' required/>
                <input type='text' placeholder='Group' value={group} onChange={(e) => setGroup(e.target.value)} className='border p-2 mb-2' required/>
                <input type='text' placeholder='Directorate' value={directorate} onChange={(e) => setDirectorate(e.target.value)} className='border p-2 mb-2' required/>
                <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded'>Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
