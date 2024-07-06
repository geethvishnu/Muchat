

import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export function RegisterAndLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('Login');

    async function handleSubmit(e) {
        e.preventDefault();
        const url = isLoginOrRegister === 'register' ? '/register' : '/login';
        try {
            const { data } = await axios.post(url, { username, password });
            setLoggedInUsername(data.username);
            setId(data.id);
        } catch (error) {
            console.error(`${isLoginOrRegister} failed:`, error);
        }
    }

    return (
        <div className="bg-gradient-to-r from-gray-100 to-gray-300 h-screen flex items-center justify-center">
            <form className="w-96 p-8 bg-white rounded-lg shadow-2xl" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="block w-full p-4 mb-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="block w-full p-4 mb-6 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="mt-4 text-center">
                    {isLoginOrRegister === 'register' ? (
                        <div>
                            Already a member?{' '}
                            <button type="button" onClick={() => setIsLoginOrRegister('login')} className="text-blue-600 underline">Login here</button>
                        </div>
                    ) : (
                        <div>
                            Not a member?{' '}
                            <button type="button" onClick={() => setIsLoginOrRegister('register')} className="text-blue-600 underline">Register here</button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
