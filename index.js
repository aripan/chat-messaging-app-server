const express = require("express");
const http = require("http");
const router = require("./router");
const cors = require("cors");
const serverSocket = require("./socket");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());

const server = http.createServer(app);

// start the socket
serverSocket(server);

app.use(router);

server.listen(PORT, () => console.log(`👉 Server has started on port ${PORT}`));
