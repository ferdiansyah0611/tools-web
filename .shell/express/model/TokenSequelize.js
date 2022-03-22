const {
    Model,
    DataTypes
} = require('sequelize')
const db = require('../db')

class Token extends Model {}

Token.init({
    user_id: DataTypes.BIGINT(20),
    token: DataTypes.STRING,
    expiredAt: DataTypes.DATE,
}, {
    sequelize: db,
    modelName: 'tokens',
    timestamps: false
})

module.exports = Token