import { Server as SocketIO } from 'socket.io';
import connection from '../config.js';
import path from 'path';
import fs from 'fs/promises'; // Use fs.promises for async/await file operations



export default function initializeChatService(server) {
  //---------------------- Main Section start -----------------------------------

  const clients = {};
  const onlineUsers = new Map();
  const io = new SocketIO(server);

  io.on('connection', (socket) => {



    //----------------------------- user Connection with socket ----------------------
    socket.on('userConnected', async (userId) => {
      const con = await connection();
      try {
        
        console.log("User Connected -> ", userId);
        onlineUsers.set(socket.id, { userId, unreadMsgCount: 0 });
        const newStatus = 'online';
        await con.beginTransaction();
        const [result] = await con.query('UPDATE messages SET userStatus = ? WHERE user_from = ?', [newStatus, userId]);
        if (result) {
          console.log(userId, "..is Online.");
        }
        await con.commit();
        updateOnlineStatus(userId, true);
      } catch (error) {      
          await con.rollback();    
        console.error('Error in userConnected:', error);
      } finally {        
          con.release();      
      }
    });



    //---------------------- Sign In --------------------------------
    socket.on("signIn", async (id) => {
      console.log("logged in ", id);
      clients[id] = socket;
    });





            //------------------  Send and Receive Real-Time msg -------------------------------

              socket.on("message", async (msg) => {
                const con = await connection();
                try {
                  const data = msg;
                  console.log("time from user -> ", data.timestamp);
              
                  let targetId = msg.targetId;
                  console.log("to User -> ", targetId);
              
                  if (data.filename == '' || data.filePath == '' || data.mimetype == '') {
                    data.filename = "";
                    data.filePath = "";
                    data.thumbnail = '';
                    data.mimetype = "txt";
                  }
              
                  let kil = data.filePath;
                  if (data.mimetype == 'video') {
                    kil = data.thumbnail;
                    console.log("thumbnail..........", kil);
                    data.thumbnail = data.filePath;
                  }
              
                  console.log("data.mimetype--->>", data.mimetype);
              
                  const timestamp = Date.now();
              
               
                  await con.beginTransaction();
              
                  const formattedDateTime = formatTimestamp(timestamp);
              
                  let userStatus = '';
                  let readStatus = 'false';
              
                  if (clients[targetId]) {
                    readStatus = 'true';
                  }
              
                  const mainQuery = `
                    INSERT INTO messages
                      (user_from, user_to, message, filename, filePath, mimetype, thumbnail, timestamp, userStatus, readStatus)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              
                  const [insertedResult] = await con.query(mainQuery, [
                    data.sourceId, data.targetId, data.message, data.filename, kil,
                    data.mimetype, data.thumbnail, data.timestamp, userStatus, readStatus
                  ]);
              
                  if (insertedResult) {
                    await con.query('UPDATE messages SET userStatus = ? WHERE user_from = ?', ['online', data.sourceId]);
              
                    const insertedRowId = insertedResult.insertId;
                    const [latestMsg] = await con.query("SELECT * FROM messages WHERE id = ?", [insertedRowId]);
              
                    const formattedLatestMsg = formatTimestampInMessages(latestMsg);
              
                    if (clients[targetId]) {
                      console.log("Online TargetID ", targetId);
                      clients[targetId].emit("message", formattedLatestMsg);
                    } else {
                      console.log("Off-line TargetID", targetId);
                      // sendPushNotification(targetId, latestMsg[0].message, data.sourceId)
                    }
                  } else {
                    console.log("Insertion failed");
                  }
              
                  await con.commit();
                } catch (error) {
                  if (con) {
                    await con.rollback();
                  }
                  console.error('Error in message:', error);
                } finally {
                  if (con) {
                    con.release();
                  }
                }
              });
              
              function formatTimestamp(timestamp) {
                const date = new Date(timestamp);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const amPm = date.getHours() >= 12 ? 'PM' : 'AM';
                return `${formattedDate} ${formattedTime} ${amPm}`;
              }
              
              function formatTimestampInMessages(messages) {
                return messages.map(row => {
                  const timestamp = row.timestamp;
                  const date = new Date(timestamp);
                  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  row.timestamp = time;
                  console.log("latest msg time --> ", row.timestamp);
                  return row;
                });
              }





//------------------------ Delete Msgs ------------------------- 



socket.on('delete', async (messageIds, targetId) => {
  try {
    console.log(messageIds);

    const con = await connection();

    if (!Array.isArray(messageIds)) {
      console.error('Invalid messageIds. Expected an array.');
      return;
    }

    await con.beginTransaction();


    const filePathsToDelete = await Promise.all(messageIds.map(async (messageId) => {
      const [[msg]] = await con.query('SELECT * from messages where id = ? ', [messageId]);

      if (msg && msg.mimetype !== 'txt') {
        const filepath = path.join('public', 'chatUploads', msg.filename);
        await fs.unlink(filepath);
      } else {
        return;
      }
    }));

    // Delete the messages with the given messageIds from the "messages" table
    const deleteQuery = 'DELETE FROM messages WHERE id IN (?)';
    const [result] = await con.query(deleteQuery, [messageIds]);



    if (result) {
      if (clients[targetId]) {
        clients[targetId].emit("messagesDeleted", messageIds);
      } else {
        socket.emit('messagesDeleted', messageIds);
      }
      await con.commit();
    } else {
      console.error('Error deleting messages:', err);
      await con.rollback();
      return;
    }
  } catch (error) {
    console.error('Error in delete:', error);
  } finally {
    if (con) {
      con.release();
    }
  }
});




//-------------- Chat History -------------------

socket.on('chatHistory', async (data) => {
  const con = await connection();
  try {
    console.log(".........", data.sourceId);

   

    // Use parameterized queries to prevent SQL injection
    const [chats] = await con.query(
      'SELECT * FROM messages WHERE (user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?) ORDER BY timestamp ASC',
      [data.sourceId, data.targetId, data.targetId, data.sourceId]
    );

    // Update read status for all retrieved messages
    const [readAllResult] = await con.query('UPDATE messages SET readStatus = ? WHERE user_from = ? AND user_to = ?', ['true', data.targetId, data.sourceId]);

    if (readAllResult) {
      console.log("readAll updated");
    }

    // Format timestamps in the retrieved messages
    const chatHistory = chats.map(row => {
      row.id = row.id.toString(); // Convert id to string
      const timestamp = row.timestamp;
      const date = new Date(timestamp);
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      row.timestamp = time;
      return { ...row };
    });

    socket.emit('chatHistory', chatHistory);
  } catch (error) {
    console.error('Error in chatHistory:', error);
  } finally {
    if (con) {
      con.release();
    }
  }
});




//-------------------- Chat List  start ------------------- 


socket.on('chatList', async (userID) => {
  try {
    console.log("---...userID ", userID);

    const con = await connection();

    const [chatsFrom] = await con.query('SELECT * FROM messages WHERE user_from = ? ORDER BY timestamp ASC', [userID]);
    const [chatsTo] = await con.query('SELECT * FROM messages WHERE user_to = ? ORDER BY timestamp ASC', [userID]);

    const chatList = [...chatsFrom, ...chatsTo].sort((a, b) => a.timestamp - b.timestamp);

    const receivers = [];
    const uniqueReceivers = new Set();

    const receiverIDs = Array.from(new Set(chatList.map(row => row.user_to)));

    const [users] = await con.query('SELECT * from tbl_users where user_id IN (?)', [receiverIDs]);

    await Promise.all(receiverIDs.map(async (receiverID) => {
      if (!uniqueReceivers.has(receiverID)) {
        const [unreadResult] = await con.query('SELECT * FROM messages WHERE user_from = ? AND user_to = ? AND readStaus = ?', [receiverID, userID, 'false']);

        const receiver = users.find(user => user.user_id === receiverID);
        const user = chatList.find(message => message.user_from === receiverID);
        let lastSeen;

        if (user) {
          const currentTime = new Date().getTime();
          if (receiver.userStatus !== 'online') {
            const timeDifference = Math.floor((currentTime - parseInt(receiver.userStatus, 10)) / 1000);

            if (timeDifference < 60) {
              lastSeen = `active ${timeDifference} second${timeDifference !== 1 ? 's' : ''} ago`;
            } else if (timeDifference < 3600) {
              const minutes = Math.floor(timeDifference / 60);
              lastSeen = `active ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            } else if (timeDifference < 86400) {
              const hours = Math.floor(timeDifference / 3600);
              lastSeen = `active ${hours} hour${hours !== 1 ? 's' : ''} ago`;
            } else {
              const days = Math.floor(timeDifference / 86400);
              lastSeen = `active ${days} day${days !== 1 ? 's' : ''} ago`;
            }
          } else {
            lastSeen = 'online';
          }
        } else {
          lastSeen = "Never Logged in";
        }

        const panewala = {
          "id": receiver.user_id,
          "name": receiver.firstname,
          "image": receiver.imagePath,
          "LastSeen": lastSeen,
          "unreadCount": unreadResult.length
        };

        receivers.push(panewala);
        uniqueReceivers.add(receiverID);
      }
    }));

    socket.emit('chatList', receivers);
  } catch (error) {
    console.error('Error in chatList:', error);
  } finally {
    if (con) {
      con.release();
    }
  }
});



    //------------------------ Disconnect user ------------------------

    socket.on('disconnect', async () => {
      const con = await connection();
      try {        
        const disconnectedUserId = Object.keys(clients).find(key => clients[key] === socket);
        console.log("disconnectedUserId", disconnectedUserId);
        const newStatus = Date.now();
        await con.beginTransaction();
        const [result] = await con.query('UPDATE messages SET userStatus = ? WHERE user_from = ?', [newStatus, disconnectedUserId]);
        console.log(result);
        console.log('A user disconnected.');
        onlineUsers.delete(socket.id);

        if (disconnectedUserId) {
          updateOnlineStatus(disconnectedUserId, false); // Update user's online status
          delete clients[disconnectedUserId];
        }
        await con.commit();
      } catch (error) {       
          await con.rollback();      
        console.error('Error in disconnect:', error);
      } finally {       
          con.release();       
      }
    });
  });

  //-------------------------------  Main Section End ----------------------------------
}

