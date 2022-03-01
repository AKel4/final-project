const db = require('../db');

const UserModel = require('./user');
const RoomModel = require('./room');
const ChoreModel = require('./chore');

//* associations below
UserModel.hasMany(RoomModel);
UserModel.hasMany(ChoreModel);
RoomModel.hasMany(ChoreModel);

RoomModel.belongsTo(UserModel);
ChoreModel.belongsTo(RoomModel);


module.exports = {
  dbConnection: db, 
  models: {
    UserModel,
    RoomModel, 
    ChoreModel
  }
};