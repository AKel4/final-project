require('dotenv').config();

const Express = require('express');
const dbConnection = require('./db');
const middleware = require('./middleware');

const app = Express();


app.use(middleware.CORS);
app.use(Express.json());

const controllers = require('./controller/index')

app.use('/user', controllers.usercontroller);
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