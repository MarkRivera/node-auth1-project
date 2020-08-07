const server = require("./api/server");
const PORT = process.env.PORT || 5000;

server.listen(5000, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
