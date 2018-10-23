
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {

  let parsedURL = url.parse(req.url, true);

  let path = parsedURL.pathname;

  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  const queryStringObject = parsedURL.query;

  const method = req.method.toLowerCase();

  const headers = req.headers;

  let decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (err, data) => {
    if (err){
      console.log(err);
    } else {
      buffer += decoder.write(data);
    }
  });

  req.on("end", () => {
    buffer += decoder.end();

    let chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers
    }

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == "number" ? statusCode : 200;

      payload = typeof(payload) == "object" ? payload: {};

      const payloadString = JSON.stringify(payload);

      res.writeHead(statusCode);
      res.end(payloadString);
    })
  });
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

const handlers = {}

handlers.sample = (data, cb) => {
  cb(406, {name: "sample handler"})
}

handlers.notFound = (data, cb) => {
  cb(404, {err: "Path not found"})
}
// Router

const router = {
  "sample":handlers.sample
}