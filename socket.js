const { Server } = require("socket.io");

module.exports = (server) => {
  let allUsers = []; // allUsers = [{email: 'anpch@example.com', uid: '12345678}, {email: 'example@email.com', uid: ''}]
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // this is site you want to put in white list
      // methods: ["GET", "POST"], // methods you want to allow
    },
  });

  const startListeners = (socket) => {
    console.log("��� starting listeners");

    socket.on("connect-to-server", ({ email, uid, users }) => {
      console.log("��� connect-to-server", email, uid, users);
      const reconnect = allUsers.some((user) => user.email === email);

      if (reconnect) {
        console.log("��� This user has reconnected");
      }

      // add new user
      addNewUser(email, socket.id);

      // send new user to all connected users
      sendMessages(
        "user-connected",
        allUsers.filter((user) => user.uid !== socket.id),
        allUsers
      );
    });

    socket.on("disconnect", () => {
      console.log("��� user disconnected", socket.id);

      const uid = allUsers.find((user) => user.uid === socket.id)

      if(uid) {
        deleteUser(uid)
        sendMessages(
            "user-disconnected",
            allUsers,
            allUsers
          );
      }
    });
  };

  io.on("connection", startListeners);
  console.info("Socket.io server started");

  const addNewUser = (email, socketId) => {
    !allUsers.some((user) => user.email === email) &&
      allUsers.push({ email, uid: socketId });
  };

  const sendMessages = (eventName, users, payloadInfo) => {
    console.log(`🥍 Emitting event: ${eventName} to ${users}`);
    users.forEach((user) => {
      payloadInfo
        ? io.to(user.uid).emit(eventName, payloadInfo)
        : io.to(user.uid).emit(eventName);
    });
  };

  const deleteUser = (id) => {
    allUsers = allUsers.filter((user) => user.uid !== id)
  }

  return io;
};
