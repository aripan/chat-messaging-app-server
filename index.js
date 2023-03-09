const express = require("express");
const http = require("http");
const dotenv = require('dotenv')
dotenv.config()
const colors = require("colors");
const router = require("./router");
const cors = require("cors");
const serverSocket = require("./socket");
const connectToDatabase = require("./dbConnect");

connectToDatabase(process.env.DB_NAME, process.env.USERS_COLLECTION_NAME);

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// start the socket
serverSocket(server);

app.use(router);

server.listen(PORT, () => console.log(`👉 Server has started on port ${PORT}`.blue.bold));
