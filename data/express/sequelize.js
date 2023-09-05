const { Model, DataTypes } = require("sequelize");
const db = require("../db");

class $name extends Model {}

$name.init({
  updatedAt: DataTypes.DATE,
  createdAt: DataTypes.DATE,
}, {
  sequelize: db,
  modelName: "$models",
  timestamps: false,
});

module.exports = $name;
