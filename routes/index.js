const UserController = require('../app/Controllers/UserController');
const UserValidator = require('../app/Validator/UserValidator');

const getPostData = async (request) => {
  return new Promise((resolve, reject) => {
      let totalChunked = ""
      request.on("error", err => {
          console.error(err);
          reject();
      })
      .on("data", chunk => {
          totalChunked += chunk;
      })
      .on("end", () => {
          request.body = JSON.parse(totalChunked);
          resolve();
      })
  })
}

module.exports = async (req, res) => {
  if(req.url == "/users" && req.method === "GET"){
    const userController = new UserController(req, res);
    const users = await userController.get();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(users));
    res.end();
}
else if(req.url.match(/^\/users\/(\d+)/) && req.method === "GET"){
    const id = req.url.match(/^\/users\/(\d+)/)[1];
    const userController = new UserController(req, res);
    const user = await userController.get(id);
    if(user){
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(user));
    }
    else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({error: "This user doesn't exist"}));
    }
    res.end();
}
else if(req.url == "/users" && req.method === "POST"){
    await getPostData(req);
    const validator = new UserValidator();
    if(!validator.validate(req.body)){
        res.writeHead(422, { "Content-Type": "application/json" });
        res.write(JSON.stringify({error: "Data isn't valid"}));
    }
    else{
        const userController = new UserController(req, res);
        const user = await userController.create(req.body);
        res.writeHead(201, { "Content-Type": "application/json" });
        // console.log(user);
        res.write(JSON.stringify(user));
    }
    res.end();
}
else if(req.url.match(/^\/users\/(\d+)/) && req.method === "DELETE"){
    const id = req.url.match(/^\/users\/(\d+)/)[1];
    console.log(id);
    const userController = new UserController(req, res);
    const result = await userController.delete(id);
    if(result){
        res.writeHead(204, { "Content-Type": "application/json" });
    }
    else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({error: "This user doesn't exist"}));
    }
    res.end();
}
else if(req.url.match(/^\/users\/(\d+)/) && req.method === "PUT"){
    await getPostData(req);
    const id = req.url.match(/^\/users\/(\d+)/)[1];
    const validator = new UserValidator();
    if(!validator.validate(req.body)){
        res.writeHead(422, { "Content-Type": "application/json" });
        res.write(JSON.stringify({error: "Data isn't valid"}));
    }
    else{
        const userController = new UserController(req, res);
        const user = await userController.edit(id, req.body);
        if(user){
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(user));
        }
        else{
            res.writeHead(404, { "Content-Type": "application/json" });
            res.write(JSON.stringify({error: "This user doesn't exist"}));
        }
    }
    res.end();
}
else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
}
}