

// import { useContext } from "react";
// import { RegisterAndLogin } from "./RegisterAndLoginForm";
// import { UserContext } from "./UserContext";

// export default function Routes() {
//     const { username, id } = useContext(UserContext);
//     if (username) {
//         return 'Logged in as ' + username;
//     }
//     return (
//         <RegisterAndLogin />
//     );
// }



import { useContext } from "react";
import { RegisterAndLogin } from "./RegisterAndLoginForm";
import { UserContext } from "./UserContext";
import Chat from "./Chat";

export default function Routes() {
    const { username, logout } = useContext(UserContext);

    if (username) {
        return (
            // <div>
            //     Logged in as {username}
            //     <button onClick={logout} className=" py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Logout</button>
            // </div>
            <Chat/>
        );
    }
    return <RegisterAndLogin />;
}
