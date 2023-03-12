const express = require("express");
const http = require("http");
const dotenv = require('dotenv')
dotenv.config()
const colors = require("colors");
const cors = require("cors");
const serverSocket = require("./socket");

// routes
const usersRouter = require("./routes/userRoutes");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// start the socket
serverSocket(server);

// router endpoints
app.use('/api/users', usersRouter);

server.listen(PORT, () => console.log(`👉 Server has started on port ${PORT}`.blue.bold));
