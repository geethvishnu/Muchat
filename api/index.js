




// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const User = require('./models/user'); // Adjust path as per your project structure
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const bcrypt = require('bcryptjs');
// const ws = require('ws');
// const Message = require('./models/Message');
// const fs = require('fs');
// dotenv.config();
// const app = express();
// app.use('/uploads', express.static(__dirname + '/uploads'));

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     credentials: true,
//     origin: 'http://localhost:5173', // Adjust origin as per your frontend setup
//   })
// );

// mongoose.connect(process.env.MONGO_URL); // Connect to MongoDB
// const jwtSecret = process.env.JWT_SECRET;
// const bcryptSalt = bcrypt.genSaltSync(10);

// async function getUserDataFromRequest(req) {
//   return new Promise((resolve, reject) => {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json('No token provided');
//     }
//     jwt.verify(token, jwtSecret, {}, (err, userData) => {
//       if (err) {
//         console.error('Token verification error:', err);
//         return res.status(401).json('Invalid token');
//       }
//       resolve(userData);
//     });
//   });
// }

// // Test route
// app.get('/', (req, res) => {
//   res.json('Backend connection success');
// });

// // Messages route
// app.get('/messages/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const userData = await getUserDataFromRequest(req, res);
//   const ourUserId = userData.userId;
//   const messages = await Message.find({
//     sender: { $in: [userId, ourUserId] },
//     recipient: { $in: [userId, ourUserId] },
//   }).sort({ createdAt: 1 });
//   res.json(messages);
// });


// // Login route
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user || !bcrypt.compareSync(password, user.password)) {
//       return res.status(401).json('Invalid credentials');
//     }

//     const token = jwt.sign({ userId: user._id, username }, jwtSecret, {});
//     res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true }).status(200).json({
//       id: user._id,
//       username,
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json('Login failed');
//   }
// });

// app.post('/logout', (req, res) => {
//   res.cookie('token', '', { httpOnly: true, sameSite: 'none', secure: true }).status(200).json('ok');
// });

// app.get('/people', async (req, res) => {
//   const users = await User.find({}, { '_id': 1, username: 1 });
//   res.json(users);
// });

// // Profile route
// app.get('/profile', (req, res) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json('No token provided');
//   }

//   jwt.verify(token, jwtSecret, {}, (err, userData) => {
//     if (err) {
//       console.error('Token verification error:', err);
//       return res.status(401).json('Invalid token');
//     }
//     res.json(userData);
//   });
// });

// // Registration route
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
//     const createdUser = await User.create({ username, password: hashedPassword });
//     const token = jwt.sign({ userId: createdUser._id, username }, jwtSecret, {});
//     res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true }).status(201).json({
//       id: createdUser._id,
//       username,
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json('Error creating user');
//   }
// });

// // Start server
// const server = app.listen(4000, () => {
//   console.log('Server is running on port 4000');
// });

// // WebSocket setup
// const wss = new ws.WebSocketServer({ server });

// // WebSocket connection handling
// wss.on('connection', (connection, req) => {

//   function broadcastOnlineUsers() {
//     const onlineUsers = [...wss.clients].map((client) => ({
//       userId: client.userId,
//       username: client.username,
//     }));

//     wss.clients.forEach((client) => {
//       client.send(JSON.stringify({ online: onlineUsers }));
//     });
//   }

//   connection.isAlive = true;
//   connection.timer = setInterval(() => {
//     connection.ping();
//     connection.deathTimer = setTimeout(() => {
//       connection.isAlive = false;
//       clearInterval(connection.timer);
//       connection.terminate();
//       broadcastOnlineUsers();
//       console.log('dead')
//     }, 1000);
//   }, 5000);

//   connection.on('pong', () => {
//     clearTimeout(connection.deathTimer);
//   });

//   const cookies = req.headers.cookie;
//   if (cookies) {
//     const tokenCookieString = cookies.split(';').find((str) => str.trim().startsWith('token='));
//     if (tokenCookieString) {
//       const token = tokenCookieString.split('=')[1];
//       if (token) {
//         jwt.verify(token, jwtSecret, {}, (err, userData) => {
//           if (err) {
//             console.error('Token verification error:', err);
//             throw err; // Handle or log the error as needed
//           }
//           const { userId, username } = userData;
//           connection.userId = userId;
//           connection.username = username;

//           // Broadcast online users to all clients
//           broadcastOnlineUsers();
//         });
//       }
//     }
//   }

//   connection.on('message', async (message) => {
//     const messageData = JSON.parse(message.toString());
//     const { recipient, text, file } = messageData;
//     let filename = null;
//     if (file) {
//       console.log('size', file.data.length);
//       const parts = file.name.split('.');
//       const ext = parts[parts.length - 1];
//       filename = Date.now() + '.' + ext;
//       const path = __dirname + '/uploads/' + filename;
//       const bufferData = new Buffer(file.data.split(',')[1], 'base64');
//       fs.writeFile(path, bufferData, () => {
//         console.log('file saved:' + path);
//       });
//     }
//     if (recipient && (text || file)) {
//       const messageDoc = await Message.create({
//         sender: connection.userId,
//         recipient,
//         text,
//         file: file ? filename : null,
//       });
//       [...wss.clients].filter(c => c.userId === recipient).forEach(c => c.send(JSON.stringify({
//         text,
//         sender: connection.userId,
//         recipient,
//         file: file ? filename : null,
//         _id: messageDoc._id,
//       })));
//     }
//   });

//   // Helper function to broadcast online users to all clients
//   broadcastOnlineUsers();
// });







// // 3 2 main 






// above main 
// the below one is important


// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const User = require('./models/user'); // Adjust path as per your project structure
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const bcrypt = require('bcryptjs');
// const ws = require('ws');
// const Message = require('./models/Message');
// const ScheduledMessage = require('./models/ScheduledMessage'); // Import the new model
// const fs = require('fs');
// const schedule = require('node-schedule'); // Add the node-schedule library

// dotenv.config();
// const app = express();
// app.use('/uploads', express.static(__dirname + '/uploads'));

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     credentials: true,
//     origin: 'http://localhost:5173', // Adjust origin as per your frontend setup
//   })
// );

// mongoose.connect(process.env.MONGO_URL); // Connect to MongoDB
// const jwtSecret = process.env.JWT_SECRET;
// const bcryptSalt = bcrypt.genSaltSync(10);

// async function getUserDataFromRequest(req) {
//   return new Promise((resolve, reject) => {
//     const token = req.cookies.token;
//     if (!token) {
//       return reject('No token provided');
//     }
//     jwt.verify(token, jwtSecret, {}, (err, userData) => {
//       if (err) {
//         console.error('Token verification error:', err);
//         return reject('Invalid token');
//       }
//       resolve(userData);
//     });
//   });
// }

// // Test route
// app.get('/', (req, res) => {
//   res.json('Backend connection success');
// });

// // Messages route
// app.get('/messages/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const userData = await getUserDataFromRequest(req, res);
//   const ourUserId = userData.userId;
//   const messages = await Message.find({
//     sender: { $in: [userId, ourUserId] },
//     recipient: { $in: [userId, ourUserId] },
//   }).sort({ createdAt: 1 });
//   res.json(messages);
// });

// // Login route
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user || !bcrypt.compareSync(password, user.password)) {
//       return res.status(401).json('Invalid credentials');
//     }

//     const token = jwt.sign({ userId: user._id, username }, jwtSecret, {});
//     res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true }).status(200).json({
//       id: user._id,
//       username,
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json('Login failed');
//   }
// });

// app.post('/logout', (req, res) => {
//   res.cookie('token', '', { httpOnly: true, sameSite: 'none', secure: true }).status(200).json('ok');
// });

// app.get('/people', async (req, res) => {
//   const users = await User.find({}, { '_id': 1, username: 1 });
//   res.json(users);
// });


// //new  biirthday route
// app.post('/schedule-wish', async (req, res) => {
//   try {
//     const { recipientId, date, time, message } = req.body;
//     const userData = await getUserDataFromRequest(req, res);
//     const { userId } = userData;

//     if (!recipientId || !date || !time || !message) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     const scheduledDate = new Date(`${date}T${time}:00`);
//     const scheduledMessage = await ScheduledMessage.create({
//       sender: userId,
//       recipient: recipientId,
//       text: message,
//       sendAt: scheduledDate,
//     });

//     // Schedule the job
//     schedule.scheduleJob(scheduledMessage._id.toString(), scheduledDate, async function() {
//       const messageDoc = await Message.create({
//         sender: scheduledMessage.sender,
//         recipient: scheduledMessage.recipient,
//         text: scheduledMessage.text,
//       });

//       [...wss.clients].filter(c => c.userId === scheduledMessage.recipient).forEach(c => c.send(JSON.stringify({
//         text: scheduledMessage.text,
//         sender: scheduledMessage.sender,
//         recipient: scheduledMessage.recipient,
//         _id: messageDoc._id,
//       })));
//     });

//     res.json({ success: true, message: 'Birthday wish scheduled successfully' });
//   } catch (error) {
//     console.error('Error scheduling birthday wish:', error);
//     res.status(500).json({ success: false, message: 'Failed to schedule wish' });
//   }
// });


// // Profile route
// app.get('/profile', (req, res) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json('No token provided');
//   }

//   jwt.verify(token, jwtSecret, {}, (err, userData) => {
//     if (err) {
//       console.error('Token verification error:', err);
//       return res.status(401).json('Invalid token');
//     }
//     res.json(userData);
//   });
// });

// // Registration route
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
//     const createdUser = await User.create({ username, password: hashedPassword });
//     const token = jwt.sign({ userId: createdUser._id, username }, jwtSecret, {});
//     res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true }).status(201).json({
//       id: createdUser._id,
//       username,
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json('Error creating user');
//   }
// });

// // Schedule birthday wish route
// app.post('/schedule-wish', async (req, res) => {
//   const { recipientId, date, time, message } = req.body;
//   const userData = await getUserDataFromRequest(req, res);
//   const { userId } = userData;
  
//   const scheduledDate = new Date(`${date}T${time}:00`);
//   const scheduledMessage = await ScheduledMessage.create({
//     sender: userId,
//     recipient: recipientId,
//     text: message,
//     sendAt: scheduledDate,
//   });

//   // Schedule the job
//   schedule.scheduleJob(scheduledMessage._id.toString(), scheduledDate, async function() {
//     const messageDoc = await Message.create({
//       sender: scheduledMessage.sender,
//       recipient: scheduledMessage.recipient,
//       text: scheduledMessage.text,
//     });

//     [...wss.clients].filter(c => c.userId === scheduledMessage.recipient).forEach(c => c.send(JSON.stringify({
//       text: scheduledMessage.text,
//       sender: scheduledMessage.sender,
//       recipient: scheduledMessage.recipient,
//       _id: messageDoc._id,
//     })));
//   });

//   res.json({ success: true, message: 'Birthday wish scheduled successfully' });
// });

// // Start server
// const server = app.listen(4000, () => {
//   console.log('Server is running on port 4000');
// });

// // WebSocket setup
// const wss = new ws.WebSocketServer({ server });

// // WebSocket connection handling
// wss.on('connection', (connection, req) => {

//   function broadcastOnlineUsers() {
//     const onlineUsers = [...wss.clients].map((client) => ({
//       userId: client.userId,
//       username: client.username,
//     }));

//     wss.clients.forEach((client) => {
//       client.send(JSON.stringify({ online: onlineUsers }));
//     });
//   }

//   connection.isAlive = true;
//   connection.timer = setInterval(() => {
//     connection.ping();
//     connection.deathTimer = setTimeout(() => {
//       connection.isAlive = false;
//       clearInterval(connection.timer);
//       connection.terminate();
//       broadcastOnlineUsers();
//       console.log('dead');
//     }, 1000);
//   }, 5000);

//   connection.on('pong', () => {
//     clearTimeout(connection.deathTimer);
//   });

//   const cookies = req.headers.cookie;
//   if (cookies) {
//     const tokenCookieString = cookies.split(';').find((str) => str.trim().startsWith('token='));
//     if (tokenCookieString) {
//       const token = tokenCookieString.split('=')[1];
//       if (token) {
//         jwt.verify(token, jwtSecret, {}, (err, userData) => {
//           if (err) {
//             console.error('Token verification error:', err);
//             throw err; // Handle or log the error as needed
//           }
//           const { userId, username } = userData;
//           connection.userId = userId;
//           connection.username = username;

//           // Broadcast online users to all clients
//           broadcastOnlineUsers();
//         });
//       }
//     }
//   }

//   connection.on('message', async (message) => {
//     const messageData = JSON.parse(message.toString());
//     const { recipient, text, file } = messageData;
//     let filename = null;
//     if (file) {
//       console.log('size', file.data.length);
//       const parts = file.name.split('.');
//       const ext = parts[parts.length - 1];
//       filename = Date.now() + '.' + ext;
//       const path = __dirname + '/uploads/' + filename;
//       const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
//       fs.writeFile(path, bufferData, () => {
//         console.log('file saved:' + path);
//       });
//     }
//     if (recipient && (text || file)) {
//       const messageDoc = await Message.create({
//         sender: connection.userId,
//         recipient,
//         text,
//         file: file ? filename : null,
//       });
//       [...wss.clients].filter(c => c.userId === recipient).forEach(c => c.send(JSON.stringify({
//         text,
//         sender: connection.userId,
//         recipient,
//         file: file ? filename : null,
//         _id: messageDoc._id,
//       })));
//     }
//   });

//   // Helper function to broadcast online users to all clients
//   broadcastOnlineUsers();
// });

// // // // dummy




const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/user'); // Adjust path as per your project structure
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const ws = require('ws');
const Message = require('./models/Message');
const ScheduledMessage = require('./models/ScheduledMessage'); // Import the new model
const fs = require('fs');
const schedule = require('node-schedule'); // Add the node-schedule library

dotenv.config();
const app = express();
app.use('/uploads', express.static(__dirname + '/uploads'));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173', // Adjust origin as per your frontend setup
  })
);

mongoose.connect(process.env.MONGO_URL); // Connect to MongoDB
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;
    if (!token) {
      return reject('No token provided');
    }
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        console.error('Token verification error:', err);
        return reject('Invalid token');
      }
      resolve(userData);
    });
  });
}

// Test route
app.get('/', (req, res) => {
  res.json('Backend connection success');
});

// Messages route
app.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req, res);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id, username }, jwtSecret, {});
    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true }).status(200).json({
      id: user._id,
      username,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json('Login failed');
  }
});

// Logout route
app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, sameSite: 'none', secure: true }).status(200).json('ok');
});

// Get all users route
app.get('/people', async (req, res) => {
  const users = await User.find({}, { '_id': 1, username: 1 });
  res.json(users);
});

// Schedule birthday wish route
app.post('/schedule-wish', async (req, res) => {
  const { recipientId, date, time, message } = req.body;
  const userData = await getUserDataFromRequest(req, res);
  const { userId } = userData;
  
  const scheduledDate = new Date(`${date}T${time}:00`);
  const scheduledMessage = await ScheduledMessage.create({
    sender: userId,
    recipient: recipientId,
    text: message,
    sendAt: scheduledDate,
  });

  // Schedule the job
  schedule.scheduleJob(scheduledMessage._id.toString(), scheduledDate, async function() {
    const messageDoc = await Message.create({
      sender: scheduledMessage.sender,
      recipient: scheduledMessage.recipient,
      text: scheduledMessage.text,
    });

    // Broadcasting the scheduled message to recipient's WebSocket clients
    [...wss.clients].filter(c => c.userId === scheduledMessage.recipient).forEach(c => c.send(JSON.stringify({
      text: scheduledMessage.text,
      sender: scheduledMessage.sender,
      recipient: scheduledMessage.recipient,
      _id: messageDoc._id,
    })));
  });

  res.json({ success: true, message: 'Birthday wish scheduled successfully' });
});

// Profile route
app.get('/profile', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json('No token provided');
  }

  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json('Invalid token');
    }
    res.json(userData);
  });
});

// Registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({ username, password: hashedPassword });
    const token = jwt.sign({ userId: createdUser._id, username }, jwtSecret, {});
    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true }).status(201).json({
      id: createdUser._id,
      username,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json('Error creating user');
  }
});

// Start server
const server = app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

// WebSocket setup
const wss = new ws.WebSocketServer({ server });

// WebSocket connection handling
wss.on('connection', (connection, req) => {

  function broadcastOnlineUsers() {
    const onlineUsers = [...wss.clients].map((client) => ({
      userId: client.userId,
      username: client.username,
    }));

    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ online: onlineUsers }));
    });
  }

  connection.isAlive = true;
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      broadcastOnlineUsers();
      console.log('dead');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find((str) => str.trim().startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) {
            console.error('Token verification error:', err);
            throw err; // Handle or log the error as needed
          }
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;

          // Broadcast online users to all clients
          broadcastOnlineUsers();
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;
    if (file) {
      console.log('size', file.data.length);
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + '.' + ext;
      const path = __dirname + '/uploads/' + filename;
      const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log('file saved:' + path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      [...wss.clients].filter(c => c.userId === recipient).forEach(c => c.send(JSON.stringify({
        text,
        sender: connection.userId,
        recipient,
        file: file ? filename : null,
        _id: messageDoc._id,
      })));
    }
  });

  // Helper function to broadcast online users to all clients
  broadcastOnlineUsers();
});
