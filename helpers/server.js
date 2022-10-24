const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");

// SERVER CONFIG
const PORT = process.env.PORT || 5000; //I think i would need to define a .env PORT variable, possibly if using a cloud hosting provider.
const app = express(); //An instance of the express object?
const server = http
  .createServer(app)
  .listen(PORT, () => console.log(`Listening on ${PORT}\n`));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ credentials: true, origin: "*" }));
