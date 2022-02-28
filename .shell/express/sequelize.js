var {Model, DataTypes} = require('sequelize')

class caseName extends Model{}

caseName.init({
	name: DataTypes.STRING,
	updated: DataTypes.DATE,
	created: DataTypes.DATE,
}, {sequelize: db, modelName: 'modelName', timestamps: false})

module.exports = caseName