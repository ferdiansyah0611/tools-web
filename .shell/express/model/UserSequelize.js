const {
    Model,
    DataTypes
} = require('sequelize')
const db = require('../db')

class User extends Model {}

User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
}, {
    sequelize: db,
    modelName: 'users',
    timestamps: false
})

module.exports = User