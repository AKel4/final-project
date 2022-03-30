const { DataTypes } = require("sequelize");
const db = require("../db");

const ChoreModel = db.define("chore", {
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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  houseCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = ChoreModel;
