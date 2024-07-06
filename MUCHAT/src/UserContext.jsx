
// import { createContext, useEffect, useState } from "react";
// import axios from 'axios';

// export const UserContext = createContext({});
// export function UserContextProvider({ children }) {
//     const [username, setUsername] = useState(null);
//     const [id, setId] = useState(null);

//     useEffect(() => {
//         axios.get('/profile')
//             .then(response => {
//                 setId(response.data.userId);
//                 setUsername(response.data.username);
//             })
//             .catch(error => {
//                 if (error.response && error.response.status === 401) {
//                     console.log('Unauthorized, please login');
//                     // Optionally handle unauthorized access here, e.g., clear user data
//                     setUsername(null);
//                     setId(null);
//                 } else {
//                     console.error('Error fetching profile:', error);
//                 }
//             });
//     }, []);

//     return (
//         <UserContext.Provider value={{ username, setUsername, id, setId }}>
//             {children}
//         </UserContext.Provider>
//     );
// }


import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});
export function UserContextProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/profile');
                setId(response.data.userId);
                setUsername(response.data.username);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('Unauthorized, please login');
                    setUsername(null);
                    setId(null);
                } else {
                    console.error('Error fetching profile:', error);
                }
            }
        };
        fetchProfile();
    }, []);

    const logout = () => {
        setUsername(null);
        setId(null);
        // Optionally clear cookies or localStorage
    };

    return (
        <UserContext.Provider value={{ username, setUsername, id, setId, logout }}>
            {children}
        </UserContext.Provider>
    );
}
