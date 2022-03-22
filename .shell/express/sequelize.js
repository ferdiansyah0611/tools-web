var {Model, DataTypes} = require('sequelize')

class caseName extends Model{}

caseName.init({
	updatedAt: DataTypes.DATE,
	createdAt: DataTypes.DATE,
}, {sequelize: db, modelName: 'models', timestamps: false})

module.exports = caseName