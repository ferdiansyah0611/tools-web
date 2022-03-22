var {Model, DataTypes} = require('sequelize')

class Token extends Model{}

Token.init({
    user_id: DataTypes.BIGINT(20),
    token: DataTypes.STRING,
    expiredAt: DataTypes.DATE,
}, {sequelize: db, modelName: 'tokens', timestamps: false})

module.exports = Token