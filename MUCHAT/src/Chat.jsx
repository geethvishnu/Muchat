


// import React, { useContext, useEffect, useRef, useState } from 'react';
// import Avatar from './Avatar';
// import { UserContext } from './UserContext';
// import Logo from './Logo';
// import { uniqBy } from 'lodash';
// import axios from 'axios';
// import Contact from './Contact';
// import ScheduleWish from './ScheduleWish';

// export default function Chat() {
//   const [ws, setWs] = useState(null);
//   const [onlinePeople, setOnlinePeople] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const { username, id, setId, setUsername } = useContext(UserContext);
//   const [newMessageText, setNewMessageText] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [offlinePeople, setOfflinePeople] = useState({});
//   const [showScheduleWish, setShowScheduleWish] = useState(false); // State to control the visibility of the ScheduleWish component
//   const [wishScheduled, setWishScheduled] = useState(false); // State to track if the wish is scheduled
//   const divUnderMessages = useRef();

//   useEffect(() => {
//     connectToWs();
//   }, []);

//   function connectToWs() {
//     const webSocket = new WebSocket('ws://localhost:4000');
//     setWs(webSocket);

//     webSocket.addEventListener('message', handleMessage);
//     webSocket.addEventListener('close', () => {
//       setTimeout(() => {
//         console.log('Disconnected trying to connect');
//         connectToWs();
//       }, 1000);
//     });
//   }

//   function handleMessage(ev) {
//     const messageData = JSON.parse(ev.data);
//     console.log({ ev, messageData });
//     if ('online' in messageData) {
//       const uniquePeople = messageData.online.filter(
//         (person, index, self) => self.findIndex((p) => p.userId === person.userId) === index
//       );
//       setOnlinePeople(uniquePeople);
//     } else {
//       setMessages((prev) => [...prev, { ...messageData }]);
//     }
//   }

//   function logout() {
//     axios.post('/logout').then(() => {
//       setWs(null);
//       setId(null);
//       setUsername(null);
//     });
//   }

//   function sendMessage(ev, file = null) {
//     if (ev) ev.preventDefault();
//     const message = {
//       recipient: selectedUserId,
//       text: newMessageText,
//       file,
//     };
//     ws.send(JSON.stringify(message));

//     if (file) {
//       const newMessage = {
//         ...message,
//         sender: id,
//         _id: Date.now(),
//         file: file.name,
//       };
//       setMessages((prev) => [...prev, newMessage]);
//       setNewMessageText('');
//     } else {
//       setNewMessageText('');
//       setMessages((prev) => [
//         ...prev,
//         {
//           ...message,
//           sender: id,
//           _id: Date.now(),
//         },
//       ]);
//     }
//   }

//   function sendFile(ev) {
//     const reader = new FileReader();
//     reader.readAsDataURL(ev.target.files[0]);
//     reader.onload = () => {
//       sendMessage(null, {
//         name: ev.target.files[0].name,
//         data: reader.result,
//       });
//     };
//   }

//   useEffect(() => {
//     const div = divUnderMessages.current;
//     if (div) {
//       div.scrollIntoView({ behavior: 'smooth', block: 'end' });
//     }
//   }, [messages]);

//   useEffect(() => {
//     axios
//       .get('/people')
//       .then((res) => {
//         const offlinePeopleArr = res.data
//           .filter((p) => p._id !== id)
//           .filter((p) => !onlinePeople.some((op) => op.userId === p._id));

//         const offlinePeople = {};
//         offlinePeopleArr.forEach((p) => {
//           offlinePeople[p._id] = p;
//         });

//         console.log(offlinePeople);
//         setOfflinePeople(offlinePeople);
//       })
//       .catch((err) => {
//         console.error('Error fetching people:', err);
//       });
//   }, [onlinePeople, id]);

//   useEffect(() => {
//     if (selectedUserId) {
//       axios.get('/messages/' + selectedUserId).then((res) => {
//         setMessages(res.data);
//       });
//     }
//   }, [selectedUserId]);

//   const messagesWithoutDupes = uniqBy(messages, '_id');

//   const handleWishScheduled = () => {
//     setWishScheduled(true);
//     setShowScheduleWish(false); // Close the schedule wish form after scheduling
//   };

//   const handleCloseScheduleWish = () => {
//     setShowScheduleWish(false); // Close the schedule wish form when back button is clicked
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="bg-green-150 w-1/4 flex flex-col border-r">
//         <div className="flex-grow overflow-y-auto">
//           <Logo />
//           {onlinePeople.map((user) => (
//             <Contact
//               key={user.userId}
//               id={user.userId}
//               online={true}
//               username={user.username}
//               onClick={() => setSelectedUserId(user.userId)}
//               selected={user.userId === selectedUserId}
//             />
//           ))}
//           {Object.keys(offlinePeople).map((userId) => (
//             <Contact
//               key={userId}
//               id={userId}
//               online={false}
//               username={offlinePeople[userId].username}
//               onClick={() => setSelectedUserId(userId)}
//               selected={userId === selectedUserId}
//             />
//           ))}
//         </div>
//         <div className="p-4 text-center flex items-center justify-center border-t">
//           <span className="mr-2 text-sm text-gray-600 flex items-center">
//             <Avatar username={username} userId={id} />
//             {username}
//           </span>
//           <button onClick={logout} className="text-sm bg-blue-500 text-white py-1 px-2 rounded">
//             Logout
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col bg-gray-100 w-3/4 p-4">
//         {!!selectedUserId && (
//           <div className="flex items-center mb-4 p-2 bg-white shadow-md rounded-lg relative">
//             <Avatar
//               username={
//                 offlinePeople[selectedUserId]?.username ||
//                 onlinePeople.find((user) => user.userId === selectedUserId)?.username
//               }
//               userId={selectedUserId}
//             />
//             <span className="ml-2 text-lg font-semibold">
//               {offlinePeople[selectedUserId]?.username ||
//                 onlinePeople.find((user) => user.userId === selectedUserId)?.username}
//             </span>
//             <button
//               onClick={() => setShowScheduleWish((prev) => !prev)}
//               className={`absolute right-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200 ${
//                 wishScheduled ? 'bg-green-500' : ''
//               }`}
//             >
//               {wishScheduled ? 'Wish Scheduled🤗' : 'Timely Wishes'}
//             </button>
//           </div>
//         )}
//         {showScheduleWish && (
//           <ScheduleWish
//             selectedUserId={selectedUserId}
//             onWishScheduled={handleWishScheduled}
//             onClose={handleCloseScheduleWish} // Pass the handleClose function to the ScheduleWish component
//           />
//         )}
//         <div className="flex-grow overflow-y-auto">
//           {!selectedUserId && (
//             <div className="flex h-full items-center justify-center text-gray-400">
//               &larr; Select a person from the sidebar
//             </div>
//           )}
//           {!!selectedUserId && (
//             <div className="relative h-full bg-white-200">
//               <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-4">
//                 {messagesWithoutDupes.map((message) => (
//                   <div key={message._id} className={`${message.sender === id ? 'text-right' : 'text-left'}`}>
//                     <div
//                       className={`inline-block p-3 my-2 rounded-lg shadow-sm ${
//                         message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
//                       }`}
//                     >
//                       {message.text}
//                       {message.file && (
//                         <div>
//                           <a
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="underline"
//                             href={axios.defaults.baseURL + '/uploads/' + message.file}
//                           >
//                             {message.file}
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={divUnderMessages}></div>
//               </div>
//             </div>
//           )}
//         </div>
//         {!!selectedUserId && (
//           <form className="flex gap-2 mt-2" onSubmit={sendMessage}>
//             <input
//               type="text"
//               value={newMessageText}
//               onChange={(ev) => setNewMessageText(ev.target.value)}
//               placeholder="Type your message here"
//               className="bg-white flex-grow border p-2 rounded shadow-sm"
//             />
//             <label className="bg-gray-200 p-2 text-gray-600 cursor-pointer rounded shadow-sm border">
//               <input type="file" className="hidden" onChange={sendFile} />
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="w-6 h-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M3 16.5V19.5A2.25 2.25 0 005.25 21.75H18.75A2.25 2.25 0 0021 19.5V16.5M3 16.5L12 3 21 16.5M3 16.5H21"
//                 />
//               </svg>
//             </label>
//             <button type="submit" className="bg-blue-500 p-2 text-white rounded shadow-sm">
//               Send
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useContext, useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import { UserContext } from './UserContext';
import Logo from './Logo';
import { uniqBy } from 'lodash';
import axios from 'axios';
import Contact from './Contact';
import ScheduleWish from './ScheduleWish';

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [offlinePeople, setOfflinePeople] = useState({});
  const [showScheduleWish, setShowScheduleWish] = useState(false); // State to control the visibility of the ScheduleWish component
  const [wishScheduledFor, setWishScheduledFor] = useState(null); // State to track who the wish is scheduled for
  const divUnderMessages = useRef();

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const webSocket = new WebSocket('ws://localhost:4000');
    setWs(webSocket);

    webSocket.addEventListener('message', handleMessage);
    webSocket.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected trying to connect');
        connectToWs();
      }, 1000);
    });
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });
    if ('online' in messageData) {
      const uniquePeople = messageData.online.filter(
        (person, index, self) => self.findIndex((p) => p.userId === person.userId) === index
      );
      setOnlinePeople(uniquePeople);
    } else {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function logout() {
    axios.post('/logout').then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }

  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    const message = {
      recipient: selectedUserId,
      text: newMessageText,
      file,
    };
    ws.send(JSON.stringify(message));

    if (file) {
      const newMessage = {
        ...message,
        sender: id,
        _id: Date.now(),
        file: file.name,
      };
      setMessages((prev) => [...prev, newMessage]);
      setNewMessageText('');
    } else {
      setNewMessageText('');
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          sender: id,
          _id: Date.now(),
        },
      ]);
    }
  }

  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    axios
      .get('/people')
      .then((res) => {
        const offlinePeopleArr = res.data
          .filter((p) => p._id !== id)
          .filter((p) => !onlinePeople.some((op) => op.userId === p._id));

        const offlinePeople = {};
        offlinePeopleArr.forEach((p) => {
          offlinePeople[p._id] = p;
        });

        console.log(offlinePeople);
        setOfflinePeople(offlinePeople);
      })
      .catch((err) => {
        console.error('Error fetching people:', err);
      });
  }, [onlinePeople, id]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get('/messages/' + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const messagesWithoutDupes = uniqBy(messages, '_id');

  const handleWishScheduled = () => {
    setWishScheduledFor(selectedUserId);
    setShowScheduleWish(false); // Close the schedule wish form after scheduling
  };

  const handleCloseScheduleWish = () => {
    setShowScheduleWish(false); // Close the schedule wish form when back button is clicked
  };

  return (
    <div className="flex h-screen">
      <div className="bg-green-150 w-1/4 flex flex-col border-r">
        <div className="flex-grow overflow-y-auto">
          <Logo />
          {onlinePeople.map((user) => (
            <Contact
              key={user.userId}
              id={user.userId}
              online={true}
              username={user.username}
              onClick={() => setSelectedUserId(user.userId)}
              selected={user.userId === selectedUserId}
            />
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}
        </div>
        <div className="p-4 text-center flex items-center justify-center border-t">
        <span className="mr-2 text-lg text-gray-800 flex items-center">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
  {username}
</span>

          <button onClick={logout} className="text-sm bg-blue-500 text-white py-1 px-2 rounded">
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col bg-gray-100 w-3/4 p-4">
        {!!selectedUserId && (
          <div className="flex items-center mb-4 p-2 bg-white shadow-md rounded-lg relative">
            <Avatar
              username={
                offlinePeople[selectedUserId]?.username ||
                onlinePeople.find((user) => user.userId === selectedUserId)?.username
              }
              userId={selectedUserId}
            />
            <span className="ml-2 text-lg font-semibold">
              {offlinePeople[selectedUserId]?.username ||
                onlinePeople.find((user) => user.userId === selectedUserId)?.username}
            </span>
            {wishScheduledFor === selectedUserId && (
              <button
                onClick={() => setShowScheduleWish((prev) => !prev)}
                className={`absolute right-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200 bg-green-500`}
              >
                {'Wish Scheduled🤗'}
              </button>
            )}
            {wishScheduledFor !== selectedUserId && (
              <button
                onClick={() => setShowScheduleWish((prev) => !prev)}
                className={`absolute right-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-200`}
              >
                {'Timely Wishes'}
              </button>
            )}
          </div>
        )}
        {showScheduleWish && (
          <ScheduleWish
            selectedUserId={selectedUserId}
            onWishScheduled={handleWishScheduled}
            onClose={handleCloseScheduleWish} // Pass the handleClose function to the ScheduleWish component
          />
        )}
        <div className="flex-grow overflow-y-auto">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center text-gray-400">
              &larr; Select a person from the sidebar
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full bg-white-200">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-4">
                {messagesWithoutDupes.map((message) => (
                  <div key={message._id} className={`${message.sender === id ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-3 my-2 rounded-lg shadow-sm ${
                        message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                      }`}
                    >
                      {message.text}
                      {message.file && (
                        <div>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                            href={axios.defaults.baseURL + '/uploads/' + message.file}
                          >
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2 mt-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              placeholder="Type your message here"
              className="bg-white flex-grow border p-2 rounded shadow-sm"
            />
           <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
              <input type="file" className="hidden" onChange={sendFile} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
              </svg>
            </label>
            <button type="submit" className="bg-blue-500 p-2 text-white rounded shadow-sm">
              Send
            </button>
          </form>
        )}
      </div>

    </div>
  );
}

