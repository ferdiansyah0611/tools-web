const router = require('express').Router()
const {
    body,
    validationResult
} = require('express-validator')
const {
    signin,
    signup,
    verify,
    generateAccessToken,
    validate
} = require('@service/auth')
const Token = require('@model/Token')
const User = require('@model/User')

const valid = {
    email: body('email').isEmail().withMessage('email must be valid email').normalizeEmail(),
    password: body('password').isLength({
        min: 8,
        max: 25
    }).withMessage('password must be at least 8-25 chars long'),
    name: body('name').isLength({
        min: 5,
        max: 25
    }).withMessage('name must be at least 8-25 chars long')
}

router.post('/refresh-token', async(req, res) => {
    const refresh = req.body.refresh || req.query.refresh
    try {
        var check = await Token.findOne({
            where: {
                token: refresh
            }
        })
        if (check) {
            var user = await User.findOne({
                where: {
                    check.user_id
                }
            })
            var create = await generateAccessToken({
                user
            }, refresh)
            if (user) {
                res.json({
                    token: create.token,
                    refresh: create.refresh,
                    expiredAt: create.expiredAt,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt,
                    }
                })
            } else {
                throw Error('user is not found')
            }
        } else {
            throw Error('token refresh is invalid')
        }
    } catch (e) {
        res.status(401).json({
            message: e.message
        })
    }
})
router.post('/signin', valid.email, valid.password, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()
        });
    }
    var services = await signin(req.body)
    res.status(services.error ? 400 : 200).json(services)
})
router.post('/logout', validate, async(req, res) => {
    await Token.destroy({
        where: {
            user_id: req.user.user._id
        }
    })
    res.json({
        message: 'Successfuly logout'
    })
})
router.post('/signup', valid.email, valid.password, valid.name, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()
        });
    }
    var services = await signup(req.body)
    res.status(services.error ? 400 : 200).json(services)
})

module.exports = router;