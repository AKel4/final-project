const { DataTypes } = require("sequelize");
const db = require("../db");

const Rooms = db.define("posts", {
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

module.exports = Rooms;