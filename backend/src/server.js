const http = require("http");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 6000;


// Create and start the server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
