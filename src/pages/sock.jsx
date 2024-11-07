import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Replace with your server URL

const SocketIOTestComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Create a socket connection
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      auth: {
            token: localStorage.getItem('jwtToken'), // Ensure the token is present and valid
        },
      reconnection: true,
    });

    // Listen for events from the server
    // socket.on('new_notification', (data) => {
    //   console.log('New notification received:', data);
    //   setNotifications((prevNotifications) => [
    //     ...prevNotifications,
    //     data.message,
    //   ]);
    // });

      // Listen for events from the server
      socket.on('new_notification', (data) => {
        console.log('New notification received:', data);
        // setMessage(data.message);
        setNotifications((prevNotifications) => [
                ...prevNotifications,
                data.message,
              ]);
      });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Socket.IO Test</h1>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      ) : (
        <p>No notifications yet.</p>
      )}
    </div>
  );
};

export default SocketIOTestComponent;
