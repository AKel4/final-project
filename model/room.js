const { DataTypes } = require("sequelize");
const db = require("../db");

const RoomModel = db.define("room", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});

module.exports = RoomModel;