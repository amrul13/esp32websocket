import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const PORT = 3000;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.static(__dirname +"/src/ui"));

app.get("/", (req, res) => {
  res.send("Hello, this is the root route!");
});

app.get("/esp32", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/ui/index.html"));
  
});


let buttonState = false;

io.on("connection", (socket) => {
  console.log("New Connection");

  io.to(socket.id).emit("buttonState", buttonState);

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  socket.on("buttonState", (value) => {
    console.log("buttonState:", value);
    buttonState = value;
    socket.broadcast.emit("buttonState", value);
  });
});

httpServer.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
