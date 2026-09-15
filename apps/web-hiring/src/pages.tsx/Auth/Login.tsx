import { useState } from 'react';
import { authClient } from '../../../lib/auth-client';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        const res = await authClient.signIn.email({
            email,
            password
        })

        console.log(res.data);
    }

    return (
        <>
        <div className='text-center'>
        <h1>
            SignIn
        </h1>

        <div>
            <label htmlFor='email'>
                Email:{" "}

                <input 
                type='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </label>
        </div>

        <div>
            <label htmlFor='password'>
                Password:{" "}

                <input 
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </label>


        </div>

        <button 
        onClick={signIn}
        className='cursor-pointer'
        >
            Submit
        </button>
        </div>
        </>
    )
}