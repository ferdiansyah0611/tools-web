const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define(
  "users",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = User;
