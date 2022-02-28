require('dotenv').config();

const Express = require('express');
const app = Express();
const dbConnection = require('./db');

app.use(require('./middleware/headers'))
app.use(Express.json());

const controllers = require('./controller')

app.use('/user', controllers.userController);
app.use('/room', controllers.roomController);
app.use('/chore', controllers.choreController);

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
  app.listen(process.env.PORT, () => console.log(`[Server]: App is listening on %{process.env.PORT}`));
})
.catch((err) => {
  console.log(`[Server] has crashed: ${err}`);
});