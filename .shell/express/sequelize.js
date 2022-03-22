var {Model, DataTypes} = require('sequelize')

class caseName extends Model{}

caseName.init({
	updated: DataTypes.DATE,
	created: DataTypes.DATE,
}, {sequelize: db, modelName: 'models', timestamps: false})

module.exports = caseName