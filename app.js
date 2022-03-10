require('dotenv').config();

const Express = require('express');
const dbConnection = require('./db');
const middleware = require('./middleware');

const app = Express();


app.use(middleware.CORS);
app.use(Express.json());

let user = require("./controller/usercontroller")
const controllers = require('./controller')
//Comment
app.use('/user', user);
app.use(middleware.validateSession);
app.use('/room', controllers.roomcontroller);
app.use('/chore', controllers.chorecontroller);

dbConnection.authenticate()
.then( async () => await dbConnection.sync())
.then(() => {
  app.listen(process.env.PORT, () => console.log(`[Server]: App is listening on ${process.env.PORT}`));
})
.catch((err) => {
  console.log(`[Server]: has crashed`);
  console.log(err);
});