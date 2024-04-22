import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const port = process.env.PORT || 3000;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { });

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

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port 3000`);
});
