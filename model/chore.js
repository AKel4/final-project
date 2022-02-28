const { DataTypes } = require("sequelize");
const db = require("../db");

const Chores = db.define("comments", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  chore: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.NUMBER,
    allowNull: false,
  }
});

module.exports = Chores;