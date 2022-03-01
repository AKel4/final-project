const { DataTypes } = require("sequelize");
const db = require('../db');

const UserModel = db.define("users", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  houseCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = UserModel;