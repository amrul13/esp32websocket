import express from "express";

const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(port, "0.0.0.0", () => console.log("Server ready on port 3000."));

