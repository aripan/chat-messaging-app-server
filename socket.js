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

    socket.on("connect-to-server", ({ email, uid}) => {
      console.log("��� connect-to-server", email, uid,);

      const reconnect = allUsers.some((user) => {

        return user.email === email
      })
      if (reconnect) {
        console.log("��� This user has reconnected");
        updateUser(email, socket.id)
      }

      // add new user
      addNewUser(email, socket.id);

      // send new user to all connected users
      sendMessages(
        "user-connected",
        allUsers,
        allUsers
      );
    });

    socket.on("disconnect", () => {
      console.log("��� user disconnected", socket.id);

      const disconnectedUser = allUsers.find((user) => user.uid === socket.id)

      if(disconnectedUser) {
        deleteUser(disconnectedUser.uid)
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

  const updateUser = (email, socketId) => {
    allUsers.map((user) => {
      if (user.email === email) {
        user.uid = socketId
      }
    })
  }

  const deleteUser = (id) => {
    allUsers = allUsers.filter((user) => user.uid !== id)
  }

  const sendMessages = (eventName, users, payloadInfo) => {
    console.log(`🥍 Emitting event: ${eventName} to ${users}`);
    users.forEach((user) => {
      payloadInfo
        ? io.to(user.uid).emit(eventName, payloadInfo)
        : io.to(user.uid).emit(eventName);
    });
  };



  return io;
};
