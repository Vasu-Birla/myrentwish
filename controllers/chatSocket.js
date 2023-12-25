import { Server as SocketIO } from 'socket.io';
import { sendPushNotification } from '../middleware/helper.js'

import fs from 'fs/promises';

import connection from '../config.js';

const con = await connection();

import path from 'path';



export default function initializeChatService(server) { 
  
        //---------------------- Main Section start -----------------------------------
        const chatPort =3006;
        const clients = {}; 
     
        const onlineUsers = new Map();
       // const unreadMessageCounts = {};

        const io = new SocketIO(server);

        // for frontend 
        // const socket = io.connect('http://localhost:3008', { forceNew: true, reconnectionAttempts: 3, timeout: 2000 });


    io.on('connection', (socket) => {  
        console.log("Chat Socket connected...");

        socket.on('userConnected', async (userId) => {
          const con = await connection();
         console.log("User Connected -> ",userId)
          onlineUsers.set(socket.id, { userId, unreadMsgCount: 0 });
          var newStatus = 'online'
         const [result] = await con.query('UPDATE messages SET userStatus = ? WHERE user_from = ?', [newStatus, userId]);
          
         if(result){
          console.log(userId, "..is Online.")
         }
           
         updateOnlineStatus(userId, true);         

        });

        //----  KilLogin Start --------
        socket.on("signIn",async (id)  => {
            console.log("logged in ",id);
            clients[id] = socket;        
          
       
            // const initialUnreadCount = unreadMessageCounts[id] || 0;

            // console.log("Unread Msg for "+id+" is -> ",initialUnreadCount)
            // socket.emit('unreadMsgCount', initialUnreadCount);
           
        })
        //--------- Kil End ------ 

        //------------------ UnRead Msg -------------------- 
        // socket.on('unreadMsgs', async (userId) => { 
        //   const con = await connection();

         
        //   var unreadCount;
      
        //   const [results] = await con.query('SELECT COUNT(*) as unreadMsgCount FROM messages WHERE user_to = ? AND readStaus = false', [userId] );
        //   //const [results1] = await con.query('SELECT COUNT(*) as unreadMsgCount FROM messages WHERE user_from  = ? AND user_to = ? AND readStaus = false', [userId] );
      
        //   if (results.length > 0) {
        //     // Extract the unread message count from the query results
        //      unreadCount  = results[0].unreadMsgCount;
           
           
        // } else {
        //     // No unread messages found for the user
        //     unreadCount= 0;
        // }
      
        // console.log("Unread Messages",unreadCount)
        // socket.emit('unreadmsgs', unreadCount); 
        // //unreadMessageCounts[userId] = unreadCount;

        

        // })

           //------------------ UnRead Msg End  -------------------- 


           //-------------------  read all ------------ 

          

    
        //------------------  Send and Receive Real-Time msg -------------------------------

        socket.on("message", async(msg)=> {    

          
            var data = msg;  

            console.log("time from user -> ",data.timestamp); 

            //console.log(data); 
           // console.log(data)
            
              //var data = msg;
                  let targetId = msg.targetId;
                console.log("to User -> ",targetId)                

              if(data.filename == '' || data.filePath == '' || data.mimetype== ''){        
                      data.filename =""
                      data.filePath =""
                      data.thumbnail =''
                      data.mimetype = "txt"
                  }

                  var kil = data.filePath;
                  if(data.mimetype== 'video'){                     
                    
                    kil  = data.thumbnail
                    console.log("thumbnail..........",kil)     
                    data.thumbnail =data.filePath
                
                }

                console.log("data.mimetype--->>",data.mimetype  )

              
                 

                  // console.log(data); 
                  // console.log(data.mimetype) ;
    

          var timestamp = Date.now()
          
          var date = new Date(timestamp);

          var formattedDate = date.toLocaleDateString();
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var seconds = date.getSeconds();

          // Determine if it's AM or PM
          var amPm = hours >= 12 ? 'PM' : 'AM';

          // Convert to 12-hour format
          hours = hours % 12;
          hours = hours ? hours : 12; // Handle midnight (0 hours)

          // Format the time as a string (add leading zeros if needed)
          var formattedTime = hours.toString().padStart(2, '0') + ':' +
                            minutes.toString().padStart(2, '0') + ' ' +
                            amPm;

          var formattedDateTime = formattedDate + ' ' + formattedTime;
          var userStatus = '';
          var readStaus = 'false';

          if(clients[targetId]){ 
             readStaus = 'true';
           }
    const con = await connection();
            
  var main = "INSERT INTO `messages` (`user_from`, `user_to`, `message`, `filename`, `filePath`, `mimetype`, `thumbnail`, `timestamp`,`userStatus`, `readStaus`) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)"
            //con.query("INSERT INTO `messages` (`user_from`,`user_to`,`message`,`image`,`base64`,`timestamp`) VALUES ('"+data.sourceId+"','"+data.targetId+"','"+data.message+"','"+data.image+"','"+data.base64+"','"+formattedDateTime+"')");
            
        const [insertedResult] =  await  con.query(main,[data.sourceId, data.targetId, data.message, data.filename, kil , data.mimetype, data.thumbnail , data.timestamp ,userStatus, readStaus])
                 

        if(insertedResult){

          const [result] = await con.query('UPDATE messages SET userStatus = ? WHERE user_from = ?', ['online', data.sourceId]);

        

                    const insertedRowId = insertedResult.insertId;

                    var [latestMsg] = await con.query("SELECT * FROM messages WHERE id = ?", [insertedRowId]);
                    latestMsg = latestMsg.map(row => {
                 // row.message = row.message.toString();
                  // row.timestamp = formattedTime;

                  var timestamp = row.timestamp;
                  // Convert the timestamp to a Date object
                  const date = new Date(timestamp);
                  // Extract the time part
                  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
                  row.timestamp = time

                  console.log("lattest msg time --> ", row.timestamp)
                return row;
        });

                  
               console.log("latest Msg --> ",latestMsg)
                  if(clients[targetId]){                
                    console.log("Online TargetID ",targetId); 
                   // sendPushNotification(targetId,latestMsg[0].message)                
                    clients[targetId].emit("message", latestMsg);                

                  } else{
                   
                   console.log("Off-line TargetID", targetId);
                  // sendPushNotification(targetId,latestMsg[0].message,data.sourceId) 
                  // socket.emit("message", latestMsg);  
                       
                   //clients[targetId].emit("message", latestMsg); 
                   }


        }
                  else{
                    console.log("nhi hua insert")
                  }


             

            });  // messesage socket End  




        //-------------------------  End msg ----------------------------------

  


//---------------------- Delete Chat start  --------------------------------



    socket.on('delete',async(messageIds, targetId) => {

      console.log(messageIds)   

        

      const con = await connection();
      // clients[targetId] = socket;

            if (!Array.isArray(messageIds)) {
            console.error('Invalid messageIds. Expected an array.');
            return;
            } 
            
          //   for (const row of messageIds) {  
          //     const [[msg]] = await con.query('SELECT * from messages where id = ? ',[row]);
                        
          //     if( msg && msg.mimetype != 'txt'){
          //       var filepath = path.join('public', 'chatUploads', msg.filename);  
          //     await fs.unlink(filepath);               
          //     }             
              
          // }


          const filePathsToDelete = messageIds.map( async (messageId) => {
                        
            const [[msg]] = await con.query('SELECT * from messages where id = ? ',[messageId]);  
     
            if(msg && msg.mimetype != 'txt'){
              var filepath = path.join('public', 'chatUploads', msg.filename);  
            await fs.unlink(filepath);               
            } else{
              return;
            }
          });
            // ----Delete the messages with the given messageIds from the "messages" table
            const deleteQuery = 'DELETE FROM messages WHERE id IN (?)';

            const [result] = await con.query(deleteQuery, [messageIds]);

            if(result){

              if(clients[targetId]){                
                clients[targetId].emit("messagesDeleted", messageIds);        

              }else{
                socket.emit('messagesDeleted', messageIds);
            }
             
               //------- Broadcast the "delete" event to all connected clients (excluding the sender)
               // socket.broadcast.emit('messagesDeleted', messageIds);                    
         
            } else {
                console.error('Error deleting messages:', err);
                return;
            }
          
        
             
   });     


                             
                      

 
//----------  Delete Chat End ----------------------------------

  // .................On Typing...............
  socket.on('is_typing', (data) =>{
    if(data.status === true) {
       socket.emit("typing", data);
       socket.broadcast.emit('typing', data);
     } else {
       socket.emit("typing", data);
       socket.broadcast.emit('typing', data);
     }
  });
  //------------------- on Typing End...............


  // ---------------------- Chat History  ------------------------- 
  socket.on('chatHistory', async (data) =>{  console.log(".........",data.sourceId)

  const con = await connection();
  const [chats] = await con.query("SELECT * FROM messages WHERE (user_from = '" + data.sourceId+ "' AND  user_to = '" + data.targetId + "' ) OR (user_from = '" + data.targetId + "' AND  user_to = '" + data.sourceId+ "')  ORDER BY timeorder ASC")
  
//   const [chats] = await con.query(`
//   SELECT *
//   FROM messages
//   WHERE (user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?)
//   ORDER BY timeorder DESC, id ASC;   
// `, [data.sourceId, data.targetId, data.targetId, data.sourceId]);

// SELECT *
// FROM messages
// WHERE (user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?)
// ORDER BY timeorder DESC, id ASC;





  //--- here userFrom value will be userTO actually
  const [readALL] = await con.query('UPDATE messages SET readStaus = ? WHERE user_from =? AND user_to = ?', ['true',data.targetId, data.sourceId]);
  
  if(readALL){

    console.log("readALL updated");
  }



  for (let row of chats ){

    var timestamp = row.timestamp;
    // Convert the timestamp to a Date object
    const date = new Date(timestamp);
    // Extract the time part
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.timestamp = time

  }


 
 
  var chatHistory = chats.map(row => { 
    row.id =  ""+ row.id +""      
    return { ...row };    

  })  
  
    //console.log(chatHistory);
    
  socket.emit('chatHistory', chatHistory);              
    
  
});

//--------------------------- Chat History End ---------------------


//----------------- chatList start -------------- 



socket.on('chatList', async (userID) =>{

  console.log("---...userID ",  userID)

  const con = await connection();

  //var userID = req.body.user_id;
  const [chats] = await con.query('SELECT * FROM messages WHERE user_from = ? ORDER BY timestamp ASC', [userID ]);  
  const [chats1] = await con.query('SELECT * FROM messages WHERE user_to = ? ORDER BY timestamp ASC', [userID ]);  
 



 for (let row of chats1){

  row.user_to = row.user_from;
 }

  // Merge the two arrays into a single chat list
const chatList = chats.concat(chats1);

// Sort the merged chat list by timestamp in ascending order
chatList.sort((a, b) => a.timestamp - b.timestamp);


  var receivers = [];

  const uniqueReceivers = new Set();


  for (const row of chatList) {
     const receiverID = row.user_to;  
     if (!uniqueReceivers.has(receiverID)) {

        
        // var [[receiver]] = await con.query('SELECT * from tbl_users where user_id = ? ',[receiverID]); 
        // const [[user]] = await con.query('SELECT * FROM messages WHERE user_from = ? ORDER BY timestamp ASC', [receiverID ]);  
        // const [unreadResult] = await con.query('SELECT * FROM messages WHERE user_from = ? AND user_to = ? AND readStaus = ? ', [receiverID,userID,'false'] );
            

  
                 
        var [[receiver]] = await con.query('SELECT * from tbl_users where user_id = ? ',[receiverID]); 
        const [[user]] = await con.query('SELECT * FROM messages WHERE user_from = ? ORDER BY timestamp ASC', [receiverID ]);  
        const [unreadResult] = await con.query('SELECT * FROM messages WHERE user_from = ? AND user_to = ? AND readStaus = ? ', [receiverID,userID,'false'] );
           
        //console.log(receiver)

        console.log("isse chat hui he ->>> ",receiver.user_id)
    
       
        console.log(unreadResult.length," unread msgs from ",receiverID," for ",userID)
           
  
        if(user != undefined){
           const currentTime = new Date().getTime();
           // const timestamp = parseInt(user.userStatus, 10)
           // const date = new Date(timestamp);
           // var lastSeen = date.toLocaleString();  

           if(user.userStatus != 'online'){
              var lastSeen = parseInt(user.userStatus, 10);

              const timeDifference = Math.floor((currentTime - lastSeen) / 1000);
             // lastSeen = `active ${timeDifference} min${timeDifference > 1 ? 's' : ''} ago`;

              if (timeDifference < 60) {
                 // Less than a minute ago
                 lastSeen = `active ${timeDifference} second${timeDifference !== 1 ? 's' : ''} ago`;
               } else if (timeDifference < 3600) {
                 // Less than an hour ago
                 const minutes = Math.floor(timeDifference / 60);
                 lastSeen = `active ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
               } else if (timeDifference < 86400) {
                 // Less than a day ago
                 const hours = Math.floor(timeDifference / 3600);
                 lastSeen = `active ${hours} hour${hours !== 1 ? 's' : ''} ago`;
               } else {
                 // More than a day ago
                 const days = Math.floor(timeDifference / 86400);
                 lastSeen = `active ${days} day${days !== 1 ? 's' : ''} ago`;
               }


              
           }
           else{
              lastSeen = 'online'
           }

  
     
        }else {
           lastSeen = "Never Logged in"
        }

      

       var panewala = {"id":receiver.user_id, "name":receiver.firstname,"image":receiver.imagePath,"LastSeen": lastSeen,"unreadCount":unreadResult.length} 
       receivers.push(panewala)
        uniqueReceivers.add(receiverID);
     }
  
 } 

 socket.emit('chatList', receivers);   

});






//------------------ chatList End --------------------




              socket.on('disconnect', async () => {  
                const con = await connection();
                
                const disconnectedUserId = Object.keys(clients).find(key => clients[key] === socket);

                console.log("disconnectedUserId",disconnectedUserId)
                var newStatus = Date.now()
             const[result] =   await con.query('UPDATE messages SET userStatus = ? WHERE user_from = ?', [newStatus, disconnectedUserId]);
               
                  console.log(result)
             console.log('A user disconnected.');
                onlineUsers.delete(socket.id);

                if (disconnectedUserId) {
                    updateOnlineStatus(disconnectedUserId, false); // Update user's online status
                    delete clients[disconnectedUserId];
                }
              
              
            })
//------------------ online / offline status check ... 
            socket.on('checkUserStatus', (targetUserId) => {
              const isOnline = clients.hasOwnProperty(targetUserId);
              socket.emit("userStatus", { userId: targetUserId, online: isOnline });
          });
            function updateOnlineStatus(userId, online) {
              io.emit("userStatus", { userId, online });
          }
        
    });


 
      


    //-------------------------------  Main Section End ----------------------------------

    // server.listen(chatPort, () => {
    //     console.log(`KilChat Server is running on port ${chatPort}`);
    // });
}






















/*
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
              
                  const formattedDateTime = formatTimestamp(data.timestamp);

                  console.log("Converted formattedDateTime -->>>>>>",formattedDateTime)
              
                  let userStatus = '';
                  let readStaus = 'false';
              
                  if (clients[targetId]) {
                    readStaus = 'true';
                  }
              
                  const mainQuery = `
                    INSERT INTO messages
                      (user_from, user_to, message, filename, filePath, mimetype, thumbnail, timestamp, userStatus, readStaus)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              
                  const [insertedResult] = await con.query(mainQuery, [
                    data.sourceId, data.targetId, data.message, data.filename, kil,
                    data.mimetype, data.thumbnail, data.timestamp, userStatus, readStaus
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
                         
                var date = new Date(timestamp*1000);
                var formattedDate = date.toLocaleDateString();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
      
                // Determine if it's AM or PM
                var amPm = hours >= 12 ? 'PM' : 'AM';
      
                // Convert to 12-hour format
                hours = hours % 12;
                hours = hours ? hours : 12; // Handle midnight (0 hours)
      
                // Format the time as a string (add leading zeros if needed)
                var formattedTime = hours.toString().padStart(2, '0') + ':' +
                                  minutes.toString().padStart(2, '0') + ' ' +
                                  amPm;
      
                var formattedDateTime = formattedDate + ' ' + formattedTime;

                return formattedDateTime;
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
    const [readAllResult] = await con.query('UPDATE messages SET readStaus = ? WHERE user_from = ? AND user_to = ?', ['true', data.targetId, data.sourceId]);

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

    const [chatList] = await con.query(`
      SELECT
        m.*,
        u.firstname,
        u.imagePath,
        (CASE
          WHEN m.user_from = ? THEN m.user_to
          ELSE m.user_from
        END) AS receiverID,
        (SELECT COUNT(*) FROM messages WHERE user_from = u.user_id AND user_to = ? AND readStaus = 'false') AS unreadCount
      FROM
        messages m
      JOIN
        tbl_users u ON (CASE
                          WHEN m.user_from = ? THEN m.user_to
                          ELSE m.user_from
                        END) = u.user_id
      WHERE
        m.user_from = ? OR m.user_to = ?
      ORDER BY
        m.timestamp ASC
    `, [userID, userID, userID, userID, userID]);

    const receivers = [];
    const uniqueReceivers = new Set();

    for (const row of chatList) {
      const receiverID = row.receiverID;

      if (!uniqueReceivers.has(receiverID)) {
        const currentTime = new Date().getTime();
        let lastSeen;

        if (row.userStatus !== 'online') {
          const timeDifference = Math.floor((currentTime - parseInt(row.userStatus, 10)) / 1000);

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

        const panewala = {
          "id": receiverID,
          "name": row.firstname,
          "image": row.imagePath,
          "LastSeen": lastSeen,
          "unreadCount": row.unreadCount
        };

        receivers.push(panewala);
        uniqueReceivers.add(receiverID);
      }
    }

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


        //------------------ online / offline status check ... 
        socket.on('checkUserStatus', (targetUserId) => {
          const isOnline = clients.hasOwnProperty(targetUserId);
          socket.emit("userStatus", { userId: targetUserId, online: isOnline });
        });
        function updateOnlineStatus(userId, online) {
          io.emit("userStatus", { userId, online });
        }



  });








  //-------------------------------  Main Section End ----------------------------------
}


*/