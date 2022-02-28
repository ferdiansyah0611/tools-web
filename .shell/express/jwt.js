var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const { v4 } = require('uuid')
var User = require('../model/User')
var saltRounds = 10

var exported = {}

exported.generateToken = (user, expiresIn = "4h") => jwt.sign({user}, process.env.JWT_KEY, {
	expiresIn: expiresIn,
})
exported.generateAccessToken = async (user, tokenOld = null) => {
	const token = exported.generateToken(user)
	var now = new Date()
	var hasChangeTime = new Date().setHours(now.getHours() + 2)
	var expiredAt = new Date(hasChangeTime).getTime()
	// token refresh
	var random = v4()
	if(tokenOld){
		await Token.deleteOne({token: tokenOld})
	}
	var data = await Token.create({
		user_id: user._id,
		token: random,
		expiredAt: expiredAt
	})
	return{
		token: token,
		refresh: random,
		expiredAt: expiredAt
	}
}
exported.verify = (token) => jwt.verify(token, process.env.JWT_KEY);

exported.signin = async (body) => {
	var response = {}
	var data = await User.findOne({email: body.email}).exec()
	if(data){
		var result = await bcrypt.compare(String(body.password), data.password)
		if(result){
			const user = {
				_id: data._id,
				name: data.name,
				email: data.email,
				createdAt: data.createdAt,
			}
			const create = await exported.generateAccessToken(user)
			response = {
				message: 'Successfuly signin',
				token: create.token,
				refresh: create.refresh,
				expiredAt: create.expiredAt,
				user: {
					_id: user._id,
					name: user.name,
					email: user.email,
					createdAt: user.createdAt,
				}
			}
		}else{
			response = {
				message: 'Password is wrong',
				error: true
			}
		}
	}
	else{
		response = {
			message: 'User not found',
			error: true
		}
	}
	return response
}
exported.signup = async (body) => {
	var response = {}
	var data = await User.findOne({email: body.email}).exec()
	// console.log(data)
	if(!data){
		var hash = await bcrypt.hash(String(body.password), saltRounds)
		if(hash){
			const {name, email} = body
			await User.create({name, email, password: hash})
			response = {
				message: 'Successfuly signup',
				data: {name, email}
			}
		}else{
			response = {
				message: err.message,
				error: true
			}
		}
	}
	else{
		response = {
			message: 'User has registered',
			error: true
		}
	}
	return response
}
exported.validate = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["x-access-token"]
	try {
  		// check token
  		if(!token){
  			throw Error('Token Required')
  		}
		const decoded = exported.verify(token);
		req.user = decoded;
  	}catch (err) {
		return res.status(401).json({message: "Token Expired"});
  	}
  	return next();
}

module.exports = exported