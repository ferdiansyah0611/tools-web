var router = require('express').Router()
var Model = require('yourmodel')
var { body, validationResult } = require('express-validator')
var {validate} = require('../../service/auth')

const limit = 20
const valid = {
	user_id: body('user_id').not().isEmpty().trim().escape().withMessage('user_id is required'),
}

router.get('/', async(req, res) => {
	var page = Number(req.query.page) || 1
	var value = await Model.find().populate('user_id', '-email -password').limit(limit * 1).skip((page - 1) * limit).exec()
	res.json({
		data: value,
		currentPage: page
	})
})
router.get('/:id', async(req, res) => {
	var value = await Model.findOne({_id: req.params.id}).populate('user_id', '-email -password -v').exec()
	res.json({
		data: value,
	})
})
router.post('/', validate, valid.user_id, async(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(400).json({ error: errors.array() });
	}
	var data = await Model.create(req.body)
	res.json({
		message: 'Successfuly added',
		input: data
	})
})
router.patch('/:id', validate, valid.user_id, async(req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(400).json({ error: errors.array() });
	}
	await Model.updateOne({ _id: req.params.id }, req.body)
	res.json({
		message: 'Successfuly updated'
	})
})
router.delete('/:id', validate, async(req, res) => {
	await Model.deleteOne({ _id: req.params.id })
	res.json({
		message: 'Successfuly deleted'
	})
})

module.exports = router;