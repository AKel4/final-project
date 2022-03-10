require('dotenv').config();

const Express = require('express');
const dbConnection = require('./db');
const middleware = require('./middleware');

const app = Express();


app.use(middleware.CORS);
app.use(Express.json());

let user = require("./controller/usercontroller")
let room = require("./controller/roomcontroller")
let chore = require("./controller/chorecontroller")
// const controllers = require('./controller')
//Comment
app.use("/user", user);
app.use(middleware.validateSession);
app.use("/room", room);
app.use("/chore", chore);

dbConnection.authenticate()
.then( async () => await dbConnection.sync())
.then(() => {
  app.listen(process.env.PORT, () => console.log(`[Server]: App is listening on ${process.env.PORT}`));
})
.catch((err) => {
  console.log(`[Server]: has crashed`);
  console.log(err);
});